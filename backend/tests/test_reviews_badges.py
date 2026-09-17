import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus, BookingType
from app.models.review import Review, WorkerBadge, ReviewerRole, BadgeCategory, BadgeCode
from app.services.badge_service import calculate_and_sync_worker_badges


@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c


def get_token(client, phone_or_email: str, password: str = "password123") -> str:
    resp = client.post(
        "/api/v1/auth/login",
        json={"credential": phone_or_email, "password": password},
    )
    assert resp.status_code == 200, f"Login failed: {resp.json()}"
    return resp.json()["data"]["access_token"]


def test_customer_multi_dimensional_rating_success(client):
    """Test citizen submitting 5-dimension rating for a completed booking."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    booking = Booking(
        booking_reference=f"BK-REV-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        service_id="srv-elec-01",
        service_title="Master Electrician",
        service_category="Electrician",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="10:00 AM - 12:00 PM",
        address_line="12 Janpath, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=500.0,
        status=BookingStatus.COMPLETED,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    b_id = booking.id
    db.close()

    res = client.post(
        "/api/v1/reviews/customer-rate",
        json={
            "booking_id": b_id,
            "overall_rating": 5,
            "service_quality": 5,
            "professionalism": 5,
            "punctuality": 4,
            "communication": 5,
            "comment": "Exceptional electrical repair! Arrived on time and resolved short circuit safely.",
        },
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["booking_id"] == b_id
    assert data["overall_rating"] == 5
    assert data["service_quality"] == 5
    assert data["punctuality"] == 4
    assert data["reviewer_role"] == "CUSTOMER"


def test_prevent_duplicate_rating_same_booking(client):
    """Test that duplicate ratings for the same booking are strictly blocked."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    booking = Booking(
        booking_reference=f"BK-DUP-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        service_id="srv-elec-01",
        service_title="Master Electrician",
        service_category="Electrician",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="10:00 AM - 12:00 PM",
        address_line="12 Janpath, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=500.0,
        status=BookingStatus.COMPLETED,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    b_id = booking.id
    db.close()

    # 1. First submission succeeds
    res1 = client.post(
        "/api/v1/reviews/customer-rate",
        json={"booking_id": b_id, "overall_rating": 4, "comment": "Good job."},
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert res1.status_code == 201

    # 2. Second submission on same booking is rejected with 400
    res2 = client.post(
        "/api/v1/reviews/customer-rate",
        json={"booking_id": b_id, "overall_rating": 5, "comment": "Trying to duplicate."},
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert res2.status_code == 400
    assert "duplicate rating prohibited" in res2.json()["message"].lower()


def test_reject_rating_on_non_completed_booking(client):
    """Test that rating is rejected if booking is not COMPLETED."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    booking = Booking(
        booking_reference=f"BK-ACTIVE-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        service_id="srv-elec-01",
        service_title="Master Electrician",
        service_category="Electrician",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="10:00 AM - 12:00 PM",
        address_line="12 Janpath, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=500.0,
        status=BookingStatus.STARTED,  # In progress, not completed
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    b_id = booking.id
    db.close()

    res = client.post(
        "/api/v1/reviews/customer-rate",
        json={"booking_id": b_id, "overall_rating": 5},
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert res.status_code == 400
    assert "only permitted after service completion" in res.json()["message"].lower()


def test_worker_rates_customer_bidirectional(client):
    """Test worker submitting review for customer on completed booking."""
    worker_token = get_token(client, "worker@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.email == "worker@shramsetu.gov.in").first()

    booking = Booking(
        booking_reference=f"BK-WRKREV-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        service_id="srv-plumb-01",
        service_title="Senior Plumber",
        service_category="Plumber",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="10:00 AM - 12:00 PM",
        address_line="Forest Park, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=600.0,
        status=BookingStatus.COMPLETED,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    b_id = booking.id
    db.close()

    res = client.post(
        "/api/v1/reviews/worker-rate",
        json={
            "booking_id": b_id,
            "overall_rating": 5,
            "politeness": 5,
            "payment_promptness": 5,
            "clear_instructions": 5,
            "comment": "Polite client, clear description of the plumbing fault and immediate OTP release.",
        },
        headers={"Authorization": f"Bearer {worker_token}"},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["reviewer_role"] == "WORKER"
    assert data["politeness"] == 5
    assert data["payment_promptness"] == 5


def test_automated_badge_recalculation_and_explainable_criteria(client):
    """Test that badge_service awards segregated verification & performance badges with explainability."""
    db = SessionLocal()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()
    w_id = worker.id

    badges = calculate_and_sync_worker_badges(w_id, db)

    assert len(badges) >= 4  # At least 4 verification badges + 1 performance badge
    badge_codes = [b.badge_code.value for b in badges]
    assert "IDENTITY_VERIFIED" in badge_codes
    assert "LICENCE_VERIFIED" in badge_codes
    assert "SKILL_CERTIFIED" in badge_codes
    assert "TRAINING_COMPLETED" in badge_codes

    # Check criteria explanations
    for b in badges:
        assert b.criteria_met is not None
        assert len(b.criteria_met) > 0
        assert b.criteria_met[0].startswith("✓")

    db.close()


def test_get_worker_rating_summary_endpoint(client):
    """Test public worker rating summary API endpoint."""
    db = SessionLocal()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()
    w_id = worker.id
    db.close()

    res = client.get(f"/api/v1/reviews/worker/{w_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["worker_id"] == w_id
    assert data["avg_overall_rating"] >= 1.0
    assert len(data["badges"]) > 0

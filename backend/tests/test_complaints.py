import random
import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus, BookingType
from app.models.complaint import Complaint, ComplaintCategory, ComplaintStatus
from app.utils.security import get_password_hash


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


def get_or_create_coop_admin(client) -> str:
    db = SessionLocal()
    admin = db.query(User).filter(User.role == UserRole.COOPERATIVE_ADMIN).first()
    if not admin:
        rand_id = random.randint(100000, 999999)
        admin = User(
            name=f"Coop Admin {rand_id}",
            phone=f"98{rand_id:08d}"[:10],
            email=f"coop_{rand_id}@shramsetu.gov.in",
            password_hash=get_password_hash("password123"),
            role=UserRole.COOPERATIVE_ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
    email = admin.email
    db.close()
    return get_token(client, email)


def test_file_complaint_linked_to_booking_success(client):
    """Test citizen lodging a complaint linked to a booking with evidence."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    booking = Booking(
        booking_reference=f"BK-CMP-{uuid.uuid4().hex[:8]}",
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
        "/api/v1/complaints",
        json={
            "booking_id": b_id,
            "category": "DAMAGE",
            "title": "Switchboard casing cracked during installation",
            "description": "The technician cracked the outer PVC switch plate during screw tightening.",
            "evidence": ["https://storage.shramsetu.gov.in/evidence/crack_01.jpg"],
        },
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["complaint_reference"].startswith("CMP-")
    assert data["category"] == "DAMAGE"
    assert data["status"] == "OPEN"
    assert data["cooperative_code"] == "OD-KHR-COOP-041"
    assert len(data["actions"]) == 1
    assert data["actions"][0]["action"] == "FILED"


def test_role_based_isolation_complaints_listing(client):
    """Test data isolation: Cooperative admin sees theirs, customer sees only own."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    coop_token = get_or_create_coop_admin(client)
    admin_token = get_token(client, "admin@shramsetu.gov.in")

    # 1. Customer listing
    res_c = client.get("/api/v1/complaints", headers={"Authorization": f"Bearer {cust_token}"})
    assert res_c.status_code == 200
    cust_list = res_c.json()
    assert len(cust_list) >= 1

    # 2. Cooperative Admin listing
    res_coop = client.get("/api/v1/complaints", headers={"Authorization": f"Bearer {coop_token}"})
    assert res_coop.status_code == 200
    coop_list = res_coop.json()
    assert len(coop_list) >= 1
    for c in coop_list:
        assert c["cooperative_code"] == "OD-KHR-COOP-041"

    # 3. System Admin listing
    res_adm = client.get("/api/v1/complaints", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_adm.status_code == 200
    assert len(res_adm.json()) >= len(cust_list)


def test_update_complaint_status_to_under_review(client):
    """Test cooperative admin reviewing grievance and assigning conciliation officer."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    coop_token = get_or_create_coop_admin(client)

    # File complaint
    res_create = client.post(
        "/api/v1/complaints",
        json={
            "category": "INCORRECT_CHARGE",
            "title": "Extra material charge dispute",
            "description": "Technician requested extra payment for copper wire.",
            "evidence": [],
        },
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    cmp_id = res_create.json()["id"]

    # Cooperative moves to UNDER_REVIEW
    res_review = client.post(
        f"/api/v1/complaints/{cmp_id}/status",
        json={"status": "UNDER_REVIEW", "notes": "Assigned conciliation officer to contact technician."},
        headers={"Authorization": f"Bearer {coop_token}"},
    )
    assert res_review.status_code == 200
    data = res_review.json()
    assert data["status"] == "UNDER_REVIEW"
    assert data["assigned_to_name"] is not None


def test_resolve_complaint_flow(client):
    """Test resolving a complaint with binding conciliation notes."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    coop_token = get_or_create_coop_admin(client)

    res_create = client.post(
        "/api/v1/complaints",
        json={
            "category": "SERVICE_QUALITY",
            "title": "Water leak after tap replacement",
            "description": "Minor leak around teflon tape joint.",
            "evidence": [],
        },
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    cmp_id = res_create.json()["id"]

    res_resolve = client.post(
        f"/api/v1/complaints/{cmp_id}/resolve",
        json={"resolution_notes": "Technician sent on free follow-up revisit to re-apply teflon tape. Issue fully resolved."},
        headers={"Authorization": f"Bearer {coop_token}"},
    )
    assert res_resolve.status_code == 200
    data = res_resolve.json()
    assert data["status"] == "RESOLVED"
    assert data["resolved_at"] is not None
    assert "re-apply teflon tape" in data["resolution_notes"]


def test_escalate_complaint_to_system_admin(client):
    """Test escalating an unresolved complaint to State DPI Admin."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")

    res_create = client.post(
        "/api/v1/complaints",
        json={
            "category": "SAFETY",
            "title": "High voltage spark near water meter",
            "description": "Safety hazard requiring urgent inspection.",
            "evidence": [],
        },
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    cmp_id = res_create.json()["id"]

    res_esc = client.post(
        f"/api/v1/complaints/{cmp_id}/escalate",
        json={"escalation_reason": "Cooperative conciliation SLA exceeded 48 hours without on-site visit."},
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert res_esc.status_code == 200
    data = res_esc.json()
    assert data["status"] == "ESCALATED"
    assert data["escalated_at"] is not None
    assert "SLA exceeded" in data["escalation_reason"]


def test_prevent_unauthorized_user_filing_complaint_on_foreign_booking(client):
    """Test that unauthorized user cannot lodge complaint on someone else's booking."""
    db = SessionLocal()
    # Create non-involved citizen
    rand_num = random.randint(100000, 999999)
    unauthorized_user = User(
        name=f"Stranger {rand_num}",
        phone=f"91{rand_num:08d}"[:10],
        email=f"stranger_{rand_num}@example.com",
        password_hash=get_password_hash("password123"),
        role=UserRole.CUSTOMER,
        is_active=True,
        is_verified=True,
    )
    db.add(unauthorized_user)

    target_cust = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    booking = Booking(
        booking_reference=f"BK-FOR-{uuid.uuid4().hex[:8]}",
        customer_id=target_cust.id,
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
    stranger_email = unauthorized_user.email
    db.close()

    stranger_token = get_token(client, stranger_email)

    res = client.post(
        "/api/v1/complaints",
        json={
            "booking_id": b_id,
            "category": "WORKER_BEHAVIOUR",
            "title": "Attempting illegal complaint",
            "description": "Unauthorized attempt to file complaint on unrelated booking.",
            "evidence": [],
        },
        headers={"Authorization": f"Bearer {stranger_token}"},
    )
    assert res.status_code == 403
    assert "not authorized to file a grievance" in res.json()["message"].lower()

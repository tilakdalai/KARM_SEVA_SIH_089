import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
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
    assert resp.status_code == 200, f"Login failed for {phone_or_email}: {resp.json()}"
    return resp.json()["data"]["access_token"]


@pytest.fixture(scope="module")
def auth_tokens(client):
    db = SessionLocal()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()
    customer = db.query(User).filter(User.role == UserRole.CUSTOMER).first()
    worker_id = worker.id
    customer_id = customer.id
    db.close()

    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    wrk_token = get_token(client, "worker@shramsetu.gov.in")

    return {
        "cust_token": cust_token,
        "wrk_token": wrk_token,
        "cust_id": customer_id,
        "wrk_id": worker_id,
    }


def test_propose_custom_slot_recurring_schedule(client, auth_tokens):
    """
    Test Step 1: Customer proposes a CUSTOM_SLOT recurring schedule.
    Anti-forcing rule: Status must be PENDING_WORKER_ACCEPTANCE and 0 instances generated.
    """
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    payload = {
        "service_id": "srv-electrician-01",
        "service_title": "Master Industrial Electrician Maintenance",
        "service_category": "Electrical & Power Systems",
        "cooperative_code": "OD-BHUB-ELECTRICAL-01",
        "cooperative_name": "Bhubaneswar Urban Electrical Labour Cooperative",
        "worker_id": auth_tokens["wrk_id"],
        "recurrence_type": "CUSTOM_SLOT",
        "custom_slots": [
            {"day_of_week": "Monday", "start_time": "09:00", "end_time": "12:00"},
            {"day_of_week": "Wednesday", "start_time": "14:00", "end_time": "17:00"},
        ],
        "start_date": tomorrow,
        "total_occurrences": 4,
        "rate_per_instance": 650.0,
        "address_line": "Plot 42, Saheed Nagar",
        "district": "Khordha",
        "pincode": "751007",
        "landmark": "Near Utkal Hospital",
        "notes": "Bi-weekly recurring diagnostic shift.",
    }

    res = client.post(
        "/api/v1/recurring",
        json=payload,
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["status"] == "PENDING_WORKER_ACCEPTANCE"
    assert data["recurrence_type"] == "CUSTOM_SLOT"
    assert data["total_occurrences"] == 4
    assert data["total_projected_amount"] == 2600.0  # 4 * 650
    # Crucial anti-forcing check: No instances materialized yet
    assert len(data["instances"]) == 0

    sched_id = data["id"]

    # Test Step 2: Worker reviews proposal and ACCEPTS
    accept_res = client.post(
        f"/api/v1/recurring/{sched_id}/accept",
        headers={"Authorization": f"Bearer {auth_tokens['wrk_token']}"},
    )
    assert accept_res.status_code == 200
    accept_data = accept_res.json()
    assert accept_data["status"] == "ACTIVE"
    # Materialized instances now exist!
    assert len(accept_data["instances"]) == 4
    for inst in accept_data["instances"]:
        assert inst["status"] == "SCHEDULED"
        assert inst["day_of_week"] in ["Monday", "Wednesday"]
        assert len(inst["otp_code"]) == 4


def test_pause_resume_recurring_schedule(client, auth_tokens):
    """
    Test pausing and resuming an active recurring schedule.
    """
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    payload = {
        "service_id": "srv-plumber-01",
        "service_title": "Bi-Weekly Facility Plumbing Check",
        "service_category": "Plumbing & Water Infrastructure",
        "cooperative_code": "OD-BHUB-PLUMBING-01",
        "cooperative_name": "Bhubaneswar Urban Plumbers Guild",
        "worker_id": auth_tokens["wrk_id"],
        "recurrence_type": "WEEKLY",
        "start_date": tomorrow,
        "total_occurrences": 3,
        "rate_per_instance": 400.0,
        "address_line": "House 10, Chandrasekharpur",
        "district": "Khordha",
        "pincode": "751016",
    }

    create_res = client.post(
        "/api/v1/recurring",
        json=payload,
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    sched_id = create_res.json()["id"]

    # Worker accepts
    client.post(
        f"/api/v1/recurring/{sched_id}/accept",
        headers={"Authorization": f"Bearer {auth_tokens['wrk_token']}"},
    )

    # Citizen pauses
    pause_res = client.post(
        f"/api/v1/recurring/{sched_id}/pause",
        json={"notes": "Travelling out of town for 2 weeks."},
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    assert pause_res.status_code == 200
    assert pause_res.json()["status"] == "PAUSED"
    for inst in pause_res.json()["instances"]:
        assert inst["status"] == "SKIPPED"

    # Citizen resumes
    resume_res = client.post(
        f"/api/v1/recurring/{sched_id}/resume",
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    assert resume_res.status_code == 200
    assert resume_res.json()["status"] == "ACTIVE"
    for inst in resume_res.json()["instances"]:
        assert inst["status"] == "SCHEDULED"


def test_cancel_single_instance_and_full_schedule(client, auth_tokens):
    """
    Test cancelling a single future instance date vs cancelling the entire recurring schedule.
    """
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    payload = {
        "service_id": "srv-clean-01",
        "service_title": "Daily Institutional Sanitization",
        "service_category": "Sanitation & Cleaning",
        "cooperative_code": "OD-BHUB-CLEAN-01",
        "cooperative_name": "Odisha Labour Cooperative Federation",
        "worker_id": auth_tokens["wrk_id"],
        "recurrence_type": "DAILY",
        "start_date": tomorrow,
        "total_occurrences": 3,
        "rate_per_instance": 350.0,
        "address_line": "Block C, Infocity",
        "district": "Khordha",
        "pincode": "751024",
    }

    create_res = client.post(
        "/api/v1/recurring",
        json=payload,
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    sched_id = create_res.json()["id"]

    # Accept
    acc = client.post(
        f"/api/v1/recurring/{sched_id}/accept",
        headers={"Authorization": f"Bearer {auth_tokens['wrk_token']}"},
    )
    instances = acc.json()["instances"]
    assert len(instances) == 3

    # Cancel only the 1st instance
    first_inst_id = instances[0]["id"]
    cancel_single = client.post(
        f"/api/v1/recurring/instances/{first_inst_id}/cancel",
        json={"reason": "Office closed on this holiday."},
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    assert cancel_single.status_code == 200
    assert cancel_single.json()["status"] == "CANCELLED"

    # The parent schedule should still be ACTIVE
    detail = client.get(
        f"/api/v1/recurring/{sched_id}",
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    assert detail.json()["status"] == "ACTIVE"
    inst_statuses = [i["status"] for i in detail.json()["instances"]]
    assert inst_statuses[0] == "CANCELLED"
    assert inst_statuses[1] == "SCHEDULED"
    assert inst_statuses[2] == "SCHEDULED"

    # Now cancel the full schedule
    cancel_full = client.post(
        f"/api/v1/recurring/{sched_id}/cancel",
        json={"reason": "Relocating office facility."},
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    assert cancel_full.status_code == 200
    assert cancel_full.json()["status"] == "CANCELLED"
    for inst in cancel_full.json()["instances"]:
        assert inst["status"] == "CANCELLED"


def test_worker_decline_recurring_proposal(client, auth_tokens):
    """
    Test worker declining a recurring proposal.
    """
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    payload = {
        "service_id": "srv-carpenter-01",
        "service_title": "Monthly Woodwork Polishing Shift",
        "service_category": "Carpentry & Joinery",
        "cooperative_code": "OD-BHUB-CARPENTRY-01",
        "cooperative_name": "Bhubaneswar Woodcrafts Guild",
        "worker_id": auth_tokens["wrk_id"],
        "recurrence_type": "MONTHLY",
        "start_date": tomorrow,
        "total_occurrences": 2,
        "rate_per_instance": 800.0,
        "address_line": "Flat 201, Royal Enclave",
        "district": "Khordha",
        "pincode": "751001",
    }

    create_res = client.post(
        "/api/v1/recurring",
        json=payload,
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    sched_id = create_res.json()["id"]

    decline_res = client.post(
        f"/api/v1/recurring/{sched_id}/decline",
        json={"reason": "Already committed to another contract during these hours."},
        headers={"Authorization": f"Bearer {auth_tokens['wrk_token']}"},
    )
    assert decline_res.status_code == 200
    assert decline_res.json()["status"] == "DECLINED"
    assert decline_res.json()["decline_reason"] == "Already committed to another contract during these hours."


def test_calendar_events_endpoint(client, auth_tokens):
    """
    Test GET /api/v1/recurring/calendar unified feed.
    """
    res = client.get(
        "/api/v1/recurring/calendar",
        headers={"Authorization": f"Bearer {auth_tokens['cust_token']}"},
    )
    assert res.status_code == 200
    events = res.json()
    assert isinstance(events, list)

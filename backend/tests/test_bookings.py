import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.services.auth_service import AuthService

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    db = SessionLocal()
    try:
        AuthService.seed_demo_accounts_if_empty(db)
    finally:
        db.close()


def get_token(phone_or_email: str, password: str = "password123") -> str:
    resp = client.post(
        "/api/v1/auth/login",
        json={"credential": phone_or_email, "password": password},
    )
    assert resp.status_code == 200, f"Login failed for {phone_or_email}: {resp.json()}"
    return resp.json()["data"]["access_token"]


def get_worker_user_id() -> str:
    db = SessionLocal()
    try:
        worker = db.query(User).filter(User.role == UserRole.WORKER).first()
        return worker.id
    finally:
        db.close()


def test_create_booking_one_time_and_detail():
    customer_token = get_token("citizen@shramsetu.gov.in")
    worker_id = get_worker_user_id()

    payload = {
        "service_id": "srv-elec-01",
        "service_title": "Master Electrician Inspection & Repair",
        "service_category": "Electrician",
        "cooperative_code": "OD-KHR-COOP-041",
        "cooperative_name": "Bhubaneswar Multi-Purpose Labour Cooperative",
        "scheduled_worker_id": worker_id,
        "booking_type": "ONE_TIME",
        "recurring_frequency": "NONE",
        "scheduled_date": "2024-09-05",
        "time_slot": "09:00 AM - 11:00 AM",
        "address_line": "Plot 42, Saheed Nagar",
        "district": "Bhubaneswar",
        "pincode": "751007",
        "landmark": "Near Rama Devi Women's University",
        "description": "Main circuit breaker tripping intermittently under AC load.",
        "media_urls": ["https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500"],
        "base_rate": 550.0,
        "extra_charges": 0.0,
        "total_amount": 550.0,
    }

    create_resp = client.post(
        "/api/v1/bookings",
        json=payload,
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert create_resp.status_code == 201
    booking_data = create_resp.json()["data"]["booking"]
    booking_id = booking_data["id"]
    assert booking_data["status"] == "REQUESTED"
    assert booking_data["booking_reference"].startswith("BK-")
    assert len(booking_data["status_history"]) >= 1
    assert booking_data["status_history"][0]["to_status"] == "REQUESTED"

    # Fetch detail
    detail_resp = client.get(
        f"/api/v1/bookings/{booking_id}",
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert detail_resp.status_code == 200
    detail = detail_resp.json()["data"]["booking"]
    assert detail["id"] == booking_id
    assert detail["customer_name"] is not None


def test_worker_shift_lifecycle_flow():
    customer_token = get_token("citizen@shramsetu.gov.in")
    worker_token = get_token("worker@shramsetu.gov.in")
    worker_id = get_worker_user_id()

    # 1. Customer creates booking
    create_resp = client.post(
        "/api/v1/bookings",
        json={
            "service_id": "srv-elec-01",
            "service_title": "Switchboard Earthing & Wiring",
            "service_category": "Electrician",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Bhubaneswar Multi-Purpose Labour Cooperative",
            "scheduled_worker_id": worker_id,
            "booking_type": "ONE_TIME",
            "recurring_frequency": "NONE",
            "scheduled_date": "2024-09-06",
            "time_slot": "02:00 PM - 04:00 PM",
            "address_line": "House 12, Unit 9",
            "district": "Bhubaneswar",
            "pincode": "751022",
            "base_rate": 550.0,
            "extra_charges": 0.0,
            "total_amount": 550.0,
        },
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert create_resp.status_code == 201
    booking = create_resp.json()["data"]["booking"]
    booking_id = booking["id"]
    otp_code = booking["otp_code"]

    # 2. Worker accepts
    resp_accept = client.post(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "ACCEPTED", "notes": "Worker confirmed shift."},
        headers={"Authorization": f"Bearer {worker_token}"},
    )
    assert resp_accept.status_code == 200
    assert resp_accept.json()["data"]["booking"]["status"] == "ACCEPTED"

    # 3. Worker on the way
    resp_otw = client.post(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "ON_THE_WAY", "notes": "Traveling by two-wheeler."},
        headers={"Authorization": f"Bearer {worker_token}"},
    )
    assert resp_otw.status_code == 200
    assert resp_otw.json()["data"]["booking"]["status"] == "ON_THE_WAY"

    # 4. Worker arrived
    resp_arr = client.post(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "ARRIVED", "notes": "Arrived at customer gate."},
        headers={"Authorization": f"Bearer {worker_token}"},
    )
    assert resp_arr.status_code == 200
    assert resp_arr.json()["data"]["booking"]["status"] == "ARRIVED"

    # 5. Worker starts service
    resp_start = client.post(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "STARTED", "notes": "Commenced diagnostic check."},
        headers={"Authorization": f"Bearer {worker_token}"},
    )
    assert resp_start.status_code == 200
    assert resp_start.json()["data"]["booking"]["status"] == "STARTED"

    # 6. Worker completes service with OTP
    resp_complete = client.post(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "COMPLETED", "otp_code": otp_code, "notes": "Rewiring verified."},
        headers={"Authorization": f"Bearer {worker_token}"},
    )
    assert resp_complete.status_code == 200
    completed_booking = resp_complete.json()["data"]["booking"]
    assert completed_booking["status"] == "COMPLETED"
    assert completed_booking["otp_verified"] is True
    assert len(completed_booking["status_history"]) == 6

    # 7. Customer rates completed booking
    resp_rate = client.post(
        f"/api/v1/bookings/{booking_id}/rate",
        json={"rating": 5.0, "review": "Excellent punctuality and clean wiring work!"},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp_rate.status_code == 200
    assert resp_rate.json()["data"]["booking"]["rating"] == 5.0


def test_worker_decline_and_coop_reassignment():
    customer_token = get_token("citizen@shramsetu.gov.in")
    worker_token = get_token("worker@shramsetu.gov.in")
    coop_token = get_token("coop@shramsetu.gov.in")
    worker_id = get_worker_user_id()

    # 1. Create booking
    create_resp = client.post(
        "/api/v1/bookings",
        json={
            "service_id": "srv-elec-01",
            "service_title": "Appliance Fuse Replacement",
            "service_category": "Electrician",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Bhubaneswar Multi-Purpose Labour Cooperative",
            "scheduled_worker_id": worker_id,
            "scheduled_date": "2024-09-07",
            "time_slot": "10:00 AM - 12:00 PM",
            "address_line": "Flat 301, Nayapalli",
            "district": "Bhubaneswar",
            "pincode": "751012",
            "base_rate": 550.0,
            "extra_charges": 0.0,
            "total_amount": 550.0,
        },
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert create_resp.status_code == 201
    booking_id = create_resp.json()["data"]["booking"]["id"]

    # 2. Worker declines
    resp_decline = client.post(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "DECLINED", "reason": "Engaged on institutional shift."},
        headers={"Authorization": f"Bearer {worker_token}"},
    )
    assert resp_decline.status_code == 200
    assert resp_decline.json()["data"]["booking"]["status"] == "DECLINED"

    # 3. Cooperative reassigns replacement worker
    resp_reassign = client.post(
        f"/api/v1/bookings/{booking_id}/reassign",
        json={"new_worker_id": worker_id, "reason": "Assigned standby certified electrician."},
        headers={"Authorization": f"Bearer {coop_token}"},
    )
    assert resp_reassign.status_code == 200
    assert resp_reassign.json()["data"]["booking"]["status"] == "ACCEPTED"


def test_customer_cancellation_and_dispute():
    customer_token = get_token("citizen@shramsetu.gov.in")
    worker_id = get_worker_user_id()

    # 1. Create and cancel
    create_resp = client.post(
        "/api/v1/bookings",
        json={
            "service_id": "srv-elec-01",
            "service_title": "Emergency Line Check",
            "service_category": "Electrician",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Bhubaneswar Multi-Purpose Labour Cooperative",
            "scheduled_worker_id": worker_id,
            "scheduled_date": "2024-09-08",
            "time_slot": "04:00 PM - 06:00 PM",
            "address_line": "Jayadev Vihar",
            "district": "Bhubaneswar",
            "pincode": "751013",
            "base_rate": 550.0,
            "extra_charges": 0.0,
            "total_amount": 550.0,
        },
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    booking_id = create_resp.json()["data"]["booking"]["id"]

    resp_cancel = client.post(
        f"/api/v1/bookings/{booking_id}/status",
        json={"status": "CANCELLED", "reason": "Issue resolved by building maintenance."},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert resp_cancel.status_code == 200
    assert resp_cancel.json()["data"]["booking"]["status"] == "CANCELLED"

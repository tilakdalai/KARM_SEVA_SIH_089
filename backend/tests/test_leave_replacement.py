import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus


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
def setup_users(client):
    db = SessionLocal()
    worker1 = db.query(User).filter(User.email == "worker@shramsetu.gov.in").first()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    coop_admin = db.query(User).filter(User.email == "coop@shramsetu.gov.in").first()

    # Create secondary peer worker for replacement tests
    peer_worker = db.query(User).filter(User.email == "peer_worker@shramsetu.gov.in").first()
    if not peer_worker:
        from app.utils.security import get_password_hash
        peer_worker = User(
            email="peer_worker@shramsetu.gov.in",
            phone="9876549999",
            name="Tapan Kumar Standby",
            password_hash=get_password_hash("password123"),
            role=UserRole.WORKER,
            trade="Electrician",
            is_active=True,
            is_verified=True,
            shram_id="SHRAM-OD-2024-9999",
        )
        db.add(peer_worker)
        db.commit()
        db.refresh(peer_worker)

    w1_id = worker1.id
    peer_id = peer_worker.id
    cust_id = customer.id
    coop_id = coop_admin.id
    db.close()

    w1_token = get_token(client, "worker@shramsetu.gov.in")
    peer_token = get_token(client, "peer_worker@shramsetu.gov.in")
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    coop_token = get_token(client, "coop@shramsetu.gov.in")

    return {
        "w1_id": w1_id,
        "peer_id": peer_id,
        "cust_id": cust_id,
        "coop_id": coop_id,
        "w1_token": w1_token,
        "peer_token": peer_token,
        "cust_token": cust_token,
        "coop_token": coop_token,
    }


def test_apply_planned_leave_and_detect_affected_jobs(client, setup_users):
    """
    Test planned leave application detects scheduled bookings and notifies cooperative.
    """
    shift_date = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")

    # 1. Create a booking for Worker 1 on shift_date
    bk_payload = {
        "service_id": "srv-elec-01",
        "service_title": "Emergency Switchboard Repair",
        "service_category": "Electrician",
        "cooperative_code": "OD-KHR-COOP-041",
        "cooperative_name": "Bhubaneswar Multi-Purpose Labour Cooperative",
        "scheduled_worker_id": setup_users["w1_id"],
        "booking_type": "ONE_TIME",
        "recurring_frequency": "NONE",
        "scheduled_date": shift_date,
        "time_slot": "09:00 AM - 11:00 AM",
        "address_line": "Plot 100, Saheed Nagar",
        "district": "Khordha",
        "pincode": "751007",
        "base_rate": 500.0,
        "extra_charges": 0.0,
        "total_amount": 500.0,
    }
    bk_res = client.post(
        "/api/v1/bookings",
        json=bk_payload,
        headers={"Authorization": f"Bearer {setup_users['cust_token']}"},
    )
    assert bk_res.status_code == 201
    created_bk_id = bk_res.json()["data"]["booking"]["id"]

    # 2. Worker 1 applies for PLANNED leave covering shift_date
    leave_payload = {
        "leave_type": "PLANNED",
        "start_date": shift_date,
        "end_date": shift_date,
        "reason": "Attending family function in Cuttack.",
        "suggested_replacement_worker_id": setup_users["peer_id"],
    }
    leave_res = client.post(
        "/api/v1/leave",
        json=leave_payload,
        headers={"Authorization": f"Bearer {setup_users['w1_token']}"},
    )
    assert leave_res.status_code == 201
    leave_data = leave_res.json()
    assert leave_data["status"] == "PENDING"
    assert leave_data["affected_job_count"] >= 1
    assert any(b["id"] == created_bk_id for b in leave_data["affected_bookings"])

    # 3. Cooperative approves leave
    app_res = client.post(
        f"/api/v1/leave/{leave_data['id']}/approve",
        headers={"Authorization": f"Bearer {setup_users['coop_token']}"},
    )
    assert app_res.status_code == 200
    assert app_res.json()["status"] == "APPROVED"


def test_emergency_leave_and_auto_active_status(client, setup_users):
    """
    Test medical / emergency leave sets status immediately to EMERGENCY_ACTIVE.
    """
    shift_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    leave_payload = {
        "leave_type": "EMERGENCY",
        "start_date": shift_date,
        "end_date": shift_date,
        "reason": "Sudden viral fever and hospital admission.",
    }
    res = client.post(
        "/api/v1/leave",
        json=leave_payload,
        headers={"Authorization": f"Bearer {setup_users['w1_token']}"},
    )
    assert res.status_code == 201
    assert res.json()["status"] == "EMERGENCY_ACTIVE"


def test_candidate_recommendation_ranking(client, setup_users):
    """
    Test recommendation engine ranks available peer workers based on skill, verification, rating.
    """
    shift_date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
    leave_payload = {
        "leave_type": "PLANNED",
        "start_date": shift_date,
        "end_date": shift_date,
        "reason": "Tool recalibration training workshop.",
    }
    leave_res = client.post(
        "/api/v1/leave",
        json=leave_payload,
        headers={"Authorization": f"Bearer {setup_users['w1_token']}"},
    )
    leave_id = leave_res.json()["id"]

    cand_res = client.get(
        f"/api/v1/leave/{leave_id}/candidates",
        headers={"Authorization": f"Bearer {setup_users['coop_token']}"},
    )
    assert cand_res.status_code == 200
    candidates = cand_res.json()
    assert isinstance(candidates, list)
    assert len(candidates) > 0
    # Verified top candidate match score
    assert candidates[0]["match_score"] > 0
    assert "distance_km" in candidates[0]


def test_replacement_assignment_and_dual_worker_tracking(client, setup_users):
    """
    Crucial Test:
    1. Propose replacement worker.
    2. Replacement worker accepts.
    3. Assert scheduled_worker_id == original, actual_worker_id == replacement, is_replacement == True.
    """
    shift_date = (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d")

    # 1. Create booking for Worker 1
    bk_payload = {
        "service_id": "srv-elec-02",
        "service_title": "Distribution Box Overhaul",
        "service_category": "Electrician",
        "cooperative_code": "OD-KHR-COOP-041",
        "cooperative_name": "Bhubaneswar Multi-Purpose Labour Cooperative",
        "scheduled_worker_id": setup_users["w1_id"],
        "booking_type": "ONE_TIME",
        "recurring_frequency": "NONE",
        "scheduled_date": shift_date,
        "time_slot": "02:00 PM - 04:00 PM",
        "address_line": "Flat 302, Royal Palms",
        "district": "Khordha",
        "pincode": "751012",
        "base_rate": 600.0,
        "extra_charges": 0.0,
        "total_amount": 600.0,
    }
    bk_res = client.post(
        "/api/v1/bookings",
        json=bk_payload,
        headers={"Authorization": f"Bearer {setup_users['cust_token']}"},
    )
    bk_id = bk_res.json()["data"]["booking"]["id"]

    # 2. Worker 1 applies for leave
    leave_res = client.post(
        "/api/v1/leave",
        json={
            "leave_type": "MEDICAL",
            "start_date": shift_date,
            "end_date": shift_date,
            "reason": "Eye doctor appointment.",
        },
        headers={"Authorization": f"Bearer {setup_users['w1_token']}"},
    )
    leave_id = leave_res.json()["id"]

    # 3. Cooperative proposes Peer Worker as replacement
    prop_res = client.post(
        "/api/v1/leave/replacement/propose",
        json={
            "leave_id": leave_id,
            "booking_id": bk_id,
            "replacement_worker_id": setup_users["peer_id"],
            "replacement_source": "SYSTEM_RECOMMENDED",
        },
        headers={"Authorization": f"Bearer {setup_users['coop_token']}"},
    )
    assert prop_res.status_code == 200
    assignment_id = prop_res.json()["id"]
    assert prop_res.json()["status"] == "PROPOSED"

    # 4. Replacement Worker ACCEPTS assignment
    acc_res = client.post(
        f"/api/v1/leave/replacement/{assignment_id}/accept",
        headers={"Authorization": f"Bearer {setup_users['peer_token']}"},
    )
    assert acc_res.status_code == 200
    assert acc_res.json()["status"] == "ACCEPTED"

    # 5. Inspect Booking record to verify Dual Worker Tracking & Transparency
    detail_res = client.get(
        f"/api/v1/bookings/{bk_id}",
        headers={"Authorization": f"Bearer {setup_users['cust_token']}"},
    )
    assert detail_res.status_code == 200
    detail = detail_res.json()["data"]["booking"]

    # Assert scheduled vs actual
    assert detail["scheduled_worker_id"] == setup_users["w1_id"]
    assert detail["actual_worker_id"] == setup_users["peer_id"]
    assert detail["is_replacement"] is True
    assert detail["replacement_for_worker_id"] == setup_users["w1_id"]
    assert "Eye doctor appointment" in (detail["replacement_reason"] or "")


def test_replacement_decline_workflow(client, setup_users):
    """
    Test replacement worker declining a proposed shift.
    """
    shift_date = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")
    leave_res = client.post(
        "/api/v1/leave",
        json={
            "leave_type": "PLANNED",
            "start_date": shift_date,
            "end_date": shift_date,
            "reason": "Personal errands.",
        },
        headers={"Authorization": f"Bearer {setup_users['w1_token']}"},
    )
    leave_id = leave_res.json()["id"]

    prop_res = client.post(
        "/api/v1/leave/replacement/propose",
        json={
            "leave_id": leave_id,
            "replacement_worker_id": setup_users["peer_id"],
            "replacement_source": "COOPERATIVE_ASSIGNED",
        },
        headers={"Authorization": f"Bearer {setup_users['coop_token']}"},
    )
    assignment_id = prop_res.json()["id"]

    dec_res = client.post(
        f"/api/v1/leave/replacement/{assignment_id}/decline",
        json={"reason": "Already booked for commercial inspection."},
        headers={"Authorization": f"Bearer {setup_users['peer_token']}"},
    )
    assert dec_res.status_code == 200
    assert dec_res.json()["status"] == "DECLINED"
    assert dec_res.json()["decline_reason"] == "Already booked for commercial inspection."

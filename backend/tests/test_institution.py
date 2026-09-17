import random
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import UserRole
from app.database import SessionLocal

client = TestClient(app)


def get_institution_token() -> tuple[str, str]:
    rand_id = random.randint(100000, 999999)
    phone = f"96{rand_id:08d}"[:10]
    email = f"hospital_procurement_{rand_id}@aiims.gov.in"
    password = "password123"

    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "phone": phone,
            "email": email,
            "name": f"Dr. Manoranjan Mohanty {rand_id}",
            "password": password,
            "role": "INSTITUTION",
            "organization_name": "AIIMS Bhubaneswar Facility Division",
            "institution_type": "Autonomous Government Hospital",
            "district": "Bhubaneswar",
            "pincode": "751019",
        }
    )
    assert reg_resp.status_code == 201

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"credential": phone, "password": password}
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["data"]["access_token"]
    return token, phone


def test_institution_metrics():
    token, _ = get_institution_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/institution/metrics", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]["metrics"]
    assert "active_contracts" in data
    assert "workers_assigned" in data
    assert "todays_attendance" in data
    assert "upcoming_service" in data
    assert "monthly_spend" in data
    assert "pending_invoice" in data


def test_multi_trade_workforce_request_workflow():
    token, _ = get_institution_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Requisition payload with multiple trades: 2 Electricians, 3 Cleaners, 1 Plumber
    payload = {
        "title": "Monthly Clinical Wing Facility & Power Staffing Requisition",
        "facility_location": "AIIMS Bhubaneswar, Sijua, Patrapada, Bhubaneswar",
        "duration_months": 1,
        "start_date": "2024-10-01",
        "end_date": "2024-10-31",
        "recurring_frequency": "DAILY",
        "shift_start_time": "09:00 AM",
        "shift_end_time": "05:00 PM",
        "additional_instructions": "Staff must carry hospital PPE and certified rubberized boots for electrical sub-station.",
        "items": [
            {"trade": "Electrician", "quantity": 2, "daily_floor_rate": 550.0},
            {"trade": "Cleaner", "quantity": 3, "daily_floor_rate": 450.0},
            {"trade": "Plumber", "quantity": 1, "daily_floor_rate": 500.0},
        ]
    }

    create_resp = client.post("/api/v1/institution/requests", json=payload, headers=headers)
    assert create_resp.status_code == 200
    req_data = create_resp.json()["data"]["request"]
    assert req_data["title"] == payload["title"]
    assert req_data["status"] == "SUBMITTED"
    assert len(req_data["items"]) == 3
    # 2*550 + 3*450 + 1*500 = 1100 + 1350 + 500 = 2950/day * 26 working days = 76,700
    assert req_data["estimated_monthly_cost"] == 76700.0
    request_id = req_data["id"]

    # Retrieve all requests
    list_resp = client.get("/api/v1/institution/requests", headers=headers)
    assert list_resp.status_code == 200
    requests = list_resp.json()["data"]["requests"]
    assert len(requests) >= 1

    # Retrieve single request
    single_resp = client.get(f"/api/v1/institution/requests/{request_id}", headers=headers)
    assert single_resp.status_code == 200
    assert single_resp.json()["data"]["request"]["id"] == request_id


def test_institution_workforce_and_attendance():
    token, _ = get_institution_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Workforce roster
    wf_resp = client.get("/api/v1/institution/workforce", headers=headers)
    assert wf_resp.status_code == 200
    workers = wf_resp.json()["data"]["workers"]
    assert len(workers) >= 1

    # Attendance logs
    att_resp = client.get("/api/v1/institution/attendance", headers=headers)
    assert att_resp.status_code == 200
    att_records = att_resp.json()["data"]["attendance"]
    assert len(att_records) >= 1


def test_institution_contracts_and_invoices():
    token, _ = get_institution_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Contracts
    cnt_resp = client.get("/api/v1/institution/contracts", headers=headers)
    assert cnt_resp.status_code == 200
    contracts = cnt_resp.json()["data"]["contracts"]
    assert len(contracts) >= 1

    # Invoices
    inv_resp = client.get("/api/v1/institution/invoices", headers=headers)
    assert inv_resp.status_code == 200
    invoices = inv_resp.json()["data"]["invoices"]
    assert len(invoices) >= 1


def test_institution_profile_update():
    token, _ = get_institution_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Get profile
    prof_resp = client.get("/api/v1/institution/profile", headers=headers)
    assert prof_resp.status_code == 200

    # Update profile
    update_resp = client.put(
        "/api/v1/institution/profile",
        json={
            "nodal_officer_name": "Dr. Manoranjan Mohanty (Updated)",
            "gstin": "21AAAGA1234B1Z9",
        },
        headers=headers
    )
    assert update_resp.status_code == 200

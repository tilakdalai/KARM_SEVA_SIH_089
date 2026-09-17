import random
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import UserRole
from app.models.worker import WorkerProfile, TradeVerificationGroup, WorkerOnboardingStatus
from app.models.audit import AuditLog, CooperativeTradeService
from app.database import SessionLocal

client = TestClient(app)


def get_coop_admin_token() -> str:
    rand_id = random.randint(100000, 999999)
    phone = f"98{rand_id:08d}"[:10]
    email = f"coop_admin_{rand_id}@shramsetu.gov.in"
    password = "password123"

    from app.models.user import User
    from app.utils.security import get_password_hash

    db = SessionLocal()
    admin = User(
        name=f"Cooperative Officer {rand_id}",
        phone=phone,
        email=email,
        password_hash=get_password_hash(password),
        role=UserRole.COOPERATIVE_ADMIN,
        is_active=True,
        is_verified=True,
    )
    db.add(admin)
    db.commit()
    db.close()

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"credential": phone, "password": password}
    )
    assert login_resp.status_code == 200
    return login_resp.json()["data"]["access_token"]


def test_cooperative_metrics():
    token = get_coop_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/v1/cooperative/metrics", headers=headers)
    assert resp.status_code == 200
    data = resp.json()["data"]["metrics"]
    assert "total_workers" in data
    assert "verified_workers" in data
    assert "workers_online" in data
    assert "jobs_today" in data
    assert "active_jobs" in data
    assert "completion_rate" in data
    assert "revenue_today" in data
    assert "worker_payouts" in data
    assert "pending_verification" in data
    assert "replacement_required" in data


def test_worker_verification_and_audit_log():
    admin_token = get_coop_admin_token()
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Onboard a worker
    rand_id = random.randint(100000, 999999)
    worker_phone = f"97{rand_id:08d}"[:10]
    worker_email = f"plumber_{rand_id}@shramsetu.gov.in"
    worker_password = "password123"

    client.post(
        "/api/v1/auth/register",
        json={
            "phone": worker_phone,
            "email": worker_email,
            "name": f"Sunita Behera {rand_id}",
            "password": worker_password,
            "role": "WORKER",
            "district": "Bhubaneswar",
        }
    )

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"credential": worker_phone, "password": worker_password}
    )
    worker_token = login_resp.json()["data"]["access_token"]
    worker_headers = {"Authorization": f"Bearer {worker_token}"}

    # Submit onboarding
    onboard_payload = {
        "name": f"Sunita Behera {rand_id}",
        "gender": "Female",
        "age": 30,
        "preferred_language": "English",
        "district": "Bhubaneswar",
        "cooperative_id": "coop-bbsr-01",
        "cooperative_name": "Khurda District Urban Workers Cooperative Union",
        "trade": "Master Plumber",
        "trade_group": "GROUP_B",
        "experience_years": 5.0,
        "skills": ["Pipe Leak Repair", "Overhead Tank"],
        "identity_document": {
            "document_type": "AADHAAR",
            "document_number": "987654321098",
        },
        "certifications": [],
        "preferences": {
            "preferred_radius_km": 5.0,
            "max_radius_km": 10.0,
            "allow_outside_suggestions": True,
            "preferred_shift": "FULL_DAY",
            "is_available_for_emergency": True,
        },
        "portfolio": [],
        "declaration_confirmed": True,
    }
    onboard_resp = client.post("/api/v1/workers/onboarding", json=onboard_payload, headers=worker_headers)
    assert onboard_resp.status_code == 200
    worker_profile_id = onboard_resp.json()["data"]["profile"]["id"]

    # 2. Check Verification Queue
    queue_resp = client.get("/api/v1/cooperative/verification-queue", headers=admin_headers)
    assert queue_resp.status_code == 200

    # 3. Approve the worker via Admin
    action_resp = client.post(
        f"/api/v1/cooperative/verification/{worker_profile_id}/action",
        json={
            "action": "APPROVE",
            "reason": "Valid experience and trade evidence verified.",
            "notes": "Cooperative officer reviewed credentials."
        },
        headers=admin_headers
    )
    assert action_resp.status_code == 200
    assert action_resp.json()["data"]["is_verified"] is True
    assert action_resp.json()["data"]["new_status"] == "VERIFIED"

    # 4. Check that Audit Log was created
    audit_resp = client.get("/api/v1/cooperative/audit-logs", headers=admin_headers)
    assert audit_resp.status_code == 200
    logs = audit_resp.json()["data"]["logs"]
    assert len(logs) >= 1
    assert logs[0]["action"] == "APPROVE_WORKER"
    assert logs[0]["target_id"] == worker_profile_id


def test_cooperative_services_management():
    token = get_coop_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Create a new trade service
    create_resp = client.post(
        "/api/v1/cooperative/services",
        json={
            "title": "Standard Fan & Inverter Wiring Check",
            "category": "Electrical",
            "trade": "Master Electrician",
            "base_price": 450.0,
            "duration_mins": 60,
            "description": "Standard diagnostic and repair package.",
            "is_enabled": True
        },
        headers=headers
    )
    assert create_resp.status_code == 200
    service_id = create_resp.json()["data"]["service"]["id"]

    # List services
    list_resp = client.get("/api/v1/cooperative/services", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()["data"]["services"]) >= 1

    # Update service price
    update_resp = client.patch(
        f"/api/v1/cooperative/services/{service_id}",
        json={"base_price": 500.0, "is_enabled": False},
        headers=headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["data"]["service"]["base_price"] == 500.0
    assert update_resp.json()["data"]["service"]["is_enabled"] is False

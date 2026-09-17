import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import UserRole
from app.models.audit import AuditLog
from app.database import SessionLocal

client = TestClient(app)


def get_system_admin_token() -> str:
    db = SessionLocal()
    try:
        from app.services.auth_service import AuthService
        AuthService.seed_demo_accounts_if_empty(db)
    finally:
        db.close()

    # Use pre-seeded system admin account
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"credential": "admin@shramsetu.gov.in", "password": "password123"}
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["data"]["access_token"]
    return token


def test_system_admin_kpi_metrics():
    token = get_system_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/admin/metrics", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]["metrics"]
    assert "registered_workers" in data
    assert "verified_workers" in data
    assert "active_cooperatives" in data
    assert "citizens_served" in data
    assert "institutions" in data
    assert "jobs_completed" in data
    assert "active_jobs" in data
    assert "total_transaction_value" in data
    assert "worker_earnings" in data
    assert "cooperative_revenue" in data
    assert "average_rating" in data
    assert "complaint_resolution_rate" in data


def test_cooperative_monitoring_and_action_audit():
    token = get_system_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # List cooperatives
    list_resp = client.get("/api/v1/admin/cooperatives", headers=headers)
    assert list_resp.status_code == 200
    coops = list_resp.json()["data"]["cooperatives"]
    assert len(coops) >= 1

    # Take action on a cooperative e.g. Put Under Review
    action_resp = client.post(
        "/api/v1/admin/cooperatives/OD-KHR-COOP-041/action",
        json={
            "action": "APPROVE",
            "reason": "Annual regulatory inspection completed successfully.",
            "admin_notes": "All trade verification documentation verified under State Gazette standards."
        },
        headers=headers
    )
    assert action_resp.status_code == 200
    assert action_resp.json()["data"]["cooperative"]["status"] == "ACTIVE"

    # Verify audit log was created in DB
    db = SessionLocal()
    try:
        log = db.query(AuditLog).filter(
            AuditLog.cooperative_code == "OD-KHR-COOP-041",
            AuditLog.action == "COOPERATIVE_APPROVE"
        ).first()
        assert log is not None
        assert "Annual regulatory inspection" in log.details
    finally:
        db.close()


def test_governance_analytics():
    token = get_system_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/admin/analytics", headers=headers)
    assert response.status_code == 200
    analytics = response.json()["data"]["analytics"]
    assert "service_demand" in analytics
    assert "worker_growth" in analytics
    assert "employment_generated" in analytics
    assert "jobs_completed" in analytics
    assert "geographic_demand" in analytics
    assert "revenue_distribution" in analytics
    assert "skill_demand" in analytics
    assert "complaint_trend" in analytics


def test_flagged_worker_resolution_and_audit():
    token = get_system_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # List workers
    workers_resp = client.get("/api/v1/admin/workers", headers=headers)
    assert workers_resp.status_code == 200

    # Resolve flag
    res_resp = client.post(
        "/api/v1/admin/workers/pw-03/flag-resolution",
        json={
            "resolution": "WARNING_ISSUED",
            "notes": "Worker given 7 days to submit renewed commercial driving license."
        },
        headers=headers
    )
    assert res_resp.status_code == 200


def test_system_settings_and_audit_logs():
    token = get_system_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Settings
    set_resp = client.get("/api/v1/admin/settings", headers=headers)
    assert set_resp.status_code == 200
    assert set_resp.json()["data"]["settings"]["platform_commission_percent"] == 0.0

    # Audit logs
    audit_resp = client.get("/api/v1/admin/audit-logs", headers=headers)
    assert audit_resp.status_code == 200
    assert "audit_logs" in audit_resp.json()["data"]

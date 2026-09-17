import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.services.auth_service import AuthService

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    db = SessionLocal()
    try:
        AuthService.seed_demo_accounts_if_empty(db)
    finally:
        db.close()


def get_token(phone: str) -> str:
    res = client.post(
        "/api/v1/auth/login",
        json={"credential": phone, "password": "password123"},
    )
    assert res.status_code == 200, f"Login failed: {res.json()}"
    return res.json()["data"]["access_token"]


def test_customer_analytics():
    token = get_token("9876543210")  # Customer
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/analytics/customer?time_range=30d", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_spent" in data
    assert "total_bookings" in data
    assert "completed_bookings" in data
    assert "favorite_services" in data
    assert isinstance(data["favorite_services"], list)


def test_worker_analytics_and_filters():
    token = get_token("9876543211")  # Worker
    headers = {"Authorization": f"Bearer {token}"}

    # 1. 30 days
    res = client.get("/api/v1/analytics/worker?time_range=30d", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "gross_earnings" in data
    assert "net_earnings" in data
    assert "average_rating" in data
    assert "earnings_trend" in data
    assert "trade_breakdown" in data
    assert len(data["earnings_trend"]) >= 1

    # 2. 7 days filter
    res_7d = client.get("/api/v1/analytics/worker?time_range=7d", headers=headers)
    assert res_7d.status_code == 200


def test_cooperative_analytics_and_dimensions():
    token = get_token("9876543212")  # Cooperative Admin
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/analytics/cooperative?time_range=30d", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_jobs" in data
    assert "total_revenue" in data
    assert "worker_share" in data
    assert "cooperative_share" in data
    assert "workforce_utilization_rate" in data
    assert "revenue_trend" in data
    assert "service_distribution" in data
    assert "top_workers" in data


def test_institution_analytics():
    token = get_token("9876543213")  # Institution
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/analytics/institution?time_range=30d", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_monthly_spend" in data
    assert "total_attendance_hours" in data
    assert "spend_trend" in data
    assert "service_usage" in data


def test_admin_impact_analytics():
    token = get_token("9876543214")  # System Admin
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/analytics/admin?time_range=30d", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "platform_gmv" in data
    assert "worker_disbursements" in data
    assert "cooperative_corpus" in data
    assert "total_active_workers" in data
    assert "district_distribution" in data
    assert "service_distribution" in data
    assert len(data["district_distribution"]) >= 1

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify that root endpoint responds with basic metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "KARM SEVA" in data["app_name"]
    assert "SIH PS26089" in data["problem_statement"]


def test_health_endpoint():
    """Verify that the /api/v1/health endpoint responds with standard format."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert "data" in payload
    assert payload["data"]["app_name"] == "KARM SEVA"
    assert payload["data"]["status"] in ["healthy", "degraded"]

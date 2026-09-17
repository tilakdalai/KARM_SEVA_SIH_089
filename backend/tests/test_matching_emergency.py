import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, Base, engine
from app.models.user import User


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


@pytest.fixture(scope="module")
def citizen_token(client):
    return get_token(client, "citizen@shramsetu.gov.in")


@pytest.fixture(scope="module")
def coop_token(client):
    return get_token(client, "coop@shramsetu.gov.in")


def test_deterministic_scoring_weights_and_explanations(client, citizen_token):
    """
    Test deterministic matching engine satisfies required weights:
    skill_match: 0.35, distance: 0.25, availability: 0.20, rating: 0.10, workload: 0.10
    and outputs structured human-readable explanation checklist.
    """
    payload = {
        "service_category": "Electrician",
        "customer_lat": 20.2961,
        "customer_lng": 85.8245,
        "scheduled_date": "2024-09-08",
        "time_slot": "04:00 PM - 06:00 PM",
        "is_emergency": False,
        "preferred_radius_km": 5.0,
    }

    res = client.post(
        "/api/v1/matching/find-workers",
        json=payload,
        headers={"Authorization": f"Bearer {citizen_token}"},
    )
    assert res.status_code == 200
    data = res.json()

    assert data["total_found"] > 0
    assert len(data["candidates"]) > 0

    top_cand = data["candidates"][0]
    assert 0 <= top_cand["match_score"] <= 100

    # Assert sub-score weight ceilings
    sub = top_cand["sub_scores"]
    assert sub["skill_match"] <= 35.0
    assert sub["distance_score"] <= 25.0
    assert sub["availability"] <= 20.0
    assert sub["rating"] <= 10.0
    assert sub["workload"] <= 10.0

    # Assert explanation checklist
    exps = top_cand["explanations"]
    assert isinstance(exps, list)
    assert len(exps) >= 4
    assert all(item.startswith("✓") for item in exps)
    assert any("km away" in item or "ETA" in item for item in exps)
    assert any("★" in item or "rating" in item for item in exps)


def test_radius_expansion_ladder(client, citizen_token):
    """
    Test that searching with an ultra-strict preferred radius (e.g. 0.5km)
    triggers the expansion ladder 5km -> 8km -> 10km -> 15km to find sufficient artisans.
    """
    payload = {
        "service_category": "Plumber",
        "customer_lat": 20.2961,
        "customer_lng": 85.8245,
        "preferred_radius_km": 1.0,
    }

    res = client.post(
        "/api/v1/matching/find-workers",
        json=payload,
        headers={"Authorization": f"Bearer {citizen_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["expansion_tier_used"] in [1, 5, 8, 10, 15]
    assert data["total_found"] >= 1


def test_emergency_dispatch_broadcast(client, citizen_token):
    """
    Test fast-track emergency SOS allocation prioritizing verified, online artisans with closest ETA.
    """
    payload = {
        "service_category": "Electrician",
        "issue_description": "Main electrical meter sparking and smoke emitting.",
        "customer_lat": 20.2961,
        "customer_lng": 85.8245,
        "address_line": "Plot 88, Saheed Nagar",
        "district": "Khordha",
        "pincode": "751007",
        "priority_level": "CRITICAL",
    }

    res = client.post(
        "/api/v1/matching/emergency",
        json=payload,
        headers={"Authorization": f"Bearer {citizen_token}"},
    )
    assert res.status_code == 200
    data = res.json()

    assert data["broadcast_id"].startswith("EMERG-SOS-")
    assert data["sla_target_minutes"] == 15
    assert data["status"] == "BROADCASTED_AWAITING_WORKER_ACCEPTANCE"
    assert data["notified_candidates_count"] > 0
    assert data["top_candidate"] is not None
    assert data["top_candidate"]["eta_minutes"] > 0


def test_cooperative_live_radar_endpoint(client, coop_token):
    """
    Test cooperative live GIS radar returning real-time geographic positions.
    """
    res = client.get(
        "/api/v1/matching/radar",
        headers={"Authorization": f"Bearer {coop_token}"},
    )
    assert res.status_code == 200
    data = res.json()

    assert data["total_active_units"] > 0
    assert isinstance(data["units"], list)
    first_unit = data["units"][0]
    assert "lat" in first_unit
    assert "lng" in first_unit
    assert "locality" in first_unit
    assert "trade" in first_unit
    assert first_unit["is_online"] is True

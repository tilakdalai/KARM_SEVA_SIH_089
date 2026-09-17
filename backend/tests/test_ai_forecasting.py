import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine


@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c


def test_ai_demand_forecast_endpoint(client):
    """Test AI multi-trade demand forecasting endpoint with scikit-learn metrics."""
    res = client.get("/api/v1/ai/demand-forecast?district=Khordha&days_ahead=7")
    assert res.status_code == 200
    data = res.json()

    assert data["forecast_horizon"] == "Next 7 Days"
    assert data["district"] == "Khordha"
    assert data["is_synthetic_baseline"] is True
    assert "synthetic demonstration" in data["synthetic_data_disclaimer"].lower()

    # Verify model metrics
    metrics = data["model_metrics"]
    assert "r2_score" in metrics
    assert "mae" in metrics
    assert "RandomForestRegressor" in metrics["algorithm"]

    # Verify qualitative summary
    summary = data["summary"]
    assert "Electrician" in summary
    assert summary["Electrician"] in ["High", "Critical Surge", "Medium"]
    assert "Plumber" in summary
    assert "Cleaner" in summary

    # Verify forecasts list
    forecasts = data["forecasts"]
    assert len(forecasts) == 6
    for f in forecasts:
        assert f["weekly_predicted_total"] > 0
        assert len(f["daily_forecast"]) == 7
        assert len(f["driving_factors"]) > 0
        assert f["peak_day"] != ""


def test_ai_demand_forecast_custom_horizon_and_district(client):
    """Test AI demand forecasting with custom district and 14-day horizon."""
    res = client.get("/api/v1/ai/demand-forecast?district=Cuttack&days_ahead=14")
    assert res.status_code == 200
    data = res.json()
    assert data["district"] == "Cuttack"
    assert data["forecast_horizon"] == "Next 14 Days"
    for f in data["forecasts"]:
        assert len(f["daily_forecast"]) == 14


def test_ai_workforce_recommendation_endpoint(client):
    """Test workforce capacity strain and recruitment quotas endpoint."""
    res = client.get("/api/v1/ai/workforce-recommendation?district=Khordha")
    assert res.status_code == 200
    data = res.json()

    assert data["district"] == "Khordha"
    assert data["is_synthetic_baseline"] is True
    assert len(data["recommendations"]) == 6

    for rec in data["recommendations"]:
        assert rec["active_workers_count"] > 0
        assert rec["required_workers_count"] > 0
        assert rec["capacity_status"] in ["DEFICIT", "BALANCED", "SURPLUS"]
        assert rec["urgency"] in ["CRITICAL", "MODERATE", "LOW"]
        assert "demand" in rec["explanation"].lower()
        assert rec["suggested_action"] != ""


def test_ai_skill_gap_analytics_endpoint(client):
    """Test statewide vocational skill-gap and training batch intervention proposals."""
    res = client.get("/api/v1/ai/skill-gap?state=Odisha")
    assert res.status_code == 200
    data = res.json()

    assert data["state"] == "Odisha"
    assert len(data["gaps"]) >= 4

    for gap in data["gaps"]:
        assert gap["demand_index"] > 0
        assert gap["supply_index"] > 0
        assert len(gap["top_missing_competencies"]) > 0
        batch = gap["proposed_training_batch"]
        assert batch["seats"] > 0
        assert "ITI" in batch["partner_institution"] or "Federation" in batch["partner_institution"]
        assert batch["duration_weeks"] > 0


def test_matching_formula_endpoint(client):
    """Test explainable worker matching weights API."""
    res = client.get("/api/v1/ai/match-workers")
    assert res.status_code == 200
    data = res.json()["data"]
    weights = data["weights"]
    total_weight = sum(weights.values())
    assert round(total_weight, 2) == 1.00

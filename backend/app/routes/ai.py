import logging
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import APIResponse
from app.schemas.ai import (
    DemandForecastResponse,
    WorkforceRecommendationResponse,
    SkillGapResponse,
)
from app.services.ai_forecasting_service import (
    generate_demand_forecast,
    generate_workforce_recommendations,
    generate_skill_gap_analytics,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Demand Forecasting & Workforce Recommendation"])


@router.get("/demand-forecast", response_model=DemandForecastResponse)
def get_demand_forecast(
    district: str = Query("Khordha", description="District for service demand projection"),
    days_ahead: int = Query(7, ge=1, le=30, description="Forecast horizon in days"),
    db: Session = Depends(get_db),
):
    """
    Scikit-Learn ML Powered Multi-Trade Demand Forecasting.
    Projects 7-day or 30-day service booking volume with upper/lower bounds and qualitative tiers.
    """
    return generate_demand_forecast(district=district, days_ahead=days_ahead, db=db)


@router.get("/workforce-recommendation", response_model=WorkforceRecommendationResponse)
def get_workforce_recommendations(
    district: str = Query("Khordha", description="District for capacity gap analysis"),
    db: Session = Depends(get_db),
):
    """
    Workforce Capacity Strain & Recruitment Recommendation Engine.
    Identifies trade deficits (e.g. Khordha electrician demand exceeds capacity by 18%)
    and outputs actionable onboarding quotas.
    """
    return generate_workforce_recommendations(district=district, db=db)


@router.get("/skill-gap", response_model=SkillGapResponse)
def get_skill_gap_analytics(
    state: str = Query("Odisha", description="State for skill-gap analysis"),
    db: Session = Depends(get_db),
):
    """
    Statewide Vocational Skill-Gap Analytics & Training Batch Interventions.
    Identifies high-deficit trade competencies and proposes concrete ITI training batches.
    """
    return generate_skill_gap_analytics(state=state, db=db)


@router.get("/match-workers")
def get_matching_formula():
    """
    Explainable Multi-Factor Worker Matching weights documentation.
    """
    return APIResponse(
        success=True,
        message="Explainable matching algorithm ready",
        data={
            "formula": "0.35*skill_match + 0.25*distance_score + 0.20*availability + 0.10*rating + 0.10*workload",
            "weights": {
                "skill_match": 0.35,
                "distance_score": 0.25,
                "availability": 0.20,
                "rating": 0.10,
                "workload": 0.10,
            },
        },
    )

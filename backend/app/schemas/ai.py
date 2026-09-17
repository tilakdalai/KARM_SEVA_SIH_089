from datetime import datetime
from enum import Enum
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field, ConfigDict


class DemandTier(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL_SURGE = "Critical Surge"


class DailyForecastPoint(BaseModel):
    date: str
    day_name: str
    predicted_bookings: float
    lower_bound: float
    upper_bound: float


class ServiceDemandForecast(BaseModel):
    service_category: str
    service_title: str
    district: str
    demand_tier: DemandTier
    weekly_predicted_total: int
    growth_vs_previous_week_pct: float
    peak_day: str
    confidence_score: float
    driving_factors: List[str]
    daily_forecast: List[DailyForecastPoint]


class DemandForecastResponse(BaseModel):
    forecast_horizon: str
    district: str
    model_name: str
    is_synthetic_baseline: bool
    synthetic_data_disclaimer: str
    model_metrics: Dict[str, Any]
    summary: Dict[str, str]
    forecasts: List[ServiceDemandForecast]


class WorkforceRecommendationItem(BaseModel):
    service_category: str
    district: str
    active_workers_count: int
    required_workers_count: int
    capacity_status: str  # "DEFICIT", "BALANCED", "SURPLUS"
    gap_percentage: float
    recommended_onboarding_count: int
    urgency: str  # "CRITICAL", "MODERATE", "LOW"
    explanation: str
    suggested_action: str


class WorkforceRecommendationResponse(BaseModel):
    district: str
    analysis_timestamp: datetime
    is_synthetic_baseline: bool
    synthetic_data_disclaimer: str
    recommendations: List[WorkforceRecommendationItem]


class ProposedTrainingBatch(BaseModel):
    seats: int
    partner_institution: str
    duration_weeks: int
    curriculum: str


class SkillGapItem(BaseModel):
    trade: str
    district: str
    demand_index: float
    supply_index: float
    gap_severity: str  # "HIGH_DEFICIT", "MODERATE_DEFICIT", "STABLE", "SURPLUS"
    top_missing_competencies: List[str]
    proposed_training_batch: ProposedTrainingBatch


class SkillGapResponse(BaseModel):
    state: str
    analyzed_districts: List[str]
    is_synthetic_baseline: bool
    synthetic_data_disclaimer: str
    gaps: List[SkillGapItem]

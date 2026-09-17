from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from app.models.review import ReviewerRole, BadgeCategory, BadgeCode


class CustomerRatingRequest(BaseModel):
    booking_id: str
    overall_rating: int = Field(..., ge=1, le=5, description="Overall satisfaction (1 to 5)")
    service_quality: Optional[int] = Field(5, ge=1, le=5, description="Workmanship & craft quality")
    professionalism: Optional[int] = Field(5, ge=1, le=5, description="Conduct & cleanliness")
    punctuality: Optional[int] = Field(5, ge=1, le=5, description="Arrival & shift timing")
    communication: Optional[int] = Field(5, ge=1, le=5, description="Clarity & politeness")
    comment: Optional[str] = None


class WorkerRatingRequest(BaseModel):
    booking_id: str
    overall_rating: int = Field(..., ge=1, le=5, description="Overall citizen client rating")
    politeness: Optional[int] = Field(5, ge=1, le=5, description="Politeness & respect")
    payment_promptness: Optional[int] = Field(5, ge=1, le=5, description="Prompt OTP & payment release")
    clear_instructions: Optional[int] = Field(5, ge=1, le=5, description="Clear job problem scope")
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    booking_id: str
    reviewer_id: str
    reviewer_name: Optional[str] = None
    reviewee_id: str
    reviewee_name: Optional[str] = None
    reviewer_role: ReviewerRole
    overall_rating: int
    service_quality: Optional[int] = None
    professionalism: Optional[int] = None
    punctuality: Optional[int] = None
    communication: Optional[int] = None
    politeness: Optional[int] = None
    payment_promptness: Optional[int] = None
    clear_instructions: Optional[int] = None
    comment: Optional[str] = None
    created_at: datetime


class BadgeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    worker_id: str
    badge_code: BadgeCode
    badge_category: BadgeCategory
    title: str
    description: str
    icon: str
    criteria_met: List[str]
    is_active: bool
    awarded_at: datetime


class WorkerRatingSummaryResponse(BaseModel):
    worker_id: str
    worker_name: str
    shram_id: Optional[str] = None
    trade: Optional[str] = None
    cooperative_name: Optional[str] = None
    total_reviews: int
    avg_overall_rating: float
    avg_service_quality: float
    avg_professionalism: float
    avg_punctuality: float
    avg_communication: float
    total_completed_jobs: int
    completion_rate_pct: float
    badges: List[BadgeResponse] = []
    recent_reviews: List[ReviewResponse] = []

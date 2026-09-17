from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class MatchingRequest(BaseModel):
    service_id: Optional[str] = None
    service_category: str = "Electrician"
    customer_lat: float = 20.2961
    customer_lng: float = 85.8245
    scheduled_date: Optional[str] = None
    time_slot: Optional[str] = None
    is_emergency: bool = False
    preferred_radius_km: float = 5.0


class SubScoresBreakdown(BaseModel):
    skill_match: float       # weight: 0.35 (max 35)
    distance_score: float    # weight: 0.25 (max 25)
    availability: float      # weight: 0.20 (max 20)
    rating: float            # weight: 0.10 (max 10)
    workload: float          # weight: 0.10 (max 10)


class CandidateMatchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    worker_id: str
    worker_name: str
    shram_id: Optional[str] = None
    trade: str
    cooperative_code: Optional[str] = None
    cooperative_name: Optional[str] = None
    photo_url: Optional[str] = None
    rating: float
    total_jobs: int
    distance_km: float
    eta_minutes: int
    match_score: float  # Composite 0 - 100
    sub_scores: SubScoresBreakdown
    explanations: List[str]  # e.g. ["✓ Verified Electrician", "✓ 2.4 km away", ...]
    is_online: bool
    is_verified: bool
    radius_tier: int  # 5, 8, 10, or 15
    lat: float
    lng: float
    base_rate: float


class MatchingSearchResponse(BaseModel):
    search_radius_km: float
    expansion_tier_used: int  # 5, 8, 10, 15
    radius_expanded: bool
    total_found: int
    customer_masked_address: str  # Locality level for privacy
    customer_lat: float
    customer_lng: float
    weights_used: Dict[str, float] = {
        "skill_match": 0.35,
        "distance_score": 0.25,
        "availability": 0.20,
        "rating": 0.10,
        "workload": 0.10,
    }
    candidates: List[CandidateMatchResponse]


class EmergencyDispatchPayload(BaseModel):
    service_category: str
    issue_description: str
    customer_lat: float = 20.2961
    customer_lng: float = 85.8245
    address_line: str
    district: str = "Khordha"
    pincode: str = "751007"
    landmark: Optional[str] = None
    priority_level: str = "CRITICAL"  # "CRITICAL" | "HIGH"


class EmergencyDispatchResponse(BaseModel):
    broadcast_id: str
    service_category: str
    status: str = "BROADCASTED_AWAITING_WORKER_ACCEPTANCE"
    sla_target_minutes: int = 15
    broadcast_radius_km: float
    notified_candidates_count: int
    top_candidate: Optional[CandidateMatchResponse] = None
    created_at: datetime

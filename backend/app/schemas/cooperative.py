from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class VerificationActionEnum(str, Enum):
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    REQUEST_CORRECTION = "REQUEST_CORRECTION"
    SUSPEND = "SUSPEND"


class WorkerVerificationActionRequest(BaseModel):
    action: VerificationActionEnum
    reason: Optional[str] = Field(None, description="Official reason or rejection notes")
    notes: Optional[str] = Field(None, description="Internal administrator observation notes")


class CooperativeServiceCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., min_length=2, max_length=100)
    trade: str = Field(..., min_length=2, max_length=100)
    base_price: float = Field(..., gt=0)
    duration_mins: int = Field(60, gt=0)
    description: Optional[str] = None
    is_enabled: bool = True


class CooperativeServiceUpdateRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    trade: Optional[str] = None
    base_price: Optional[float] = None
    duration_mins: Optional[int] = None
    description: Optional[str] = None
    is_enabled: Optional[bool] = None


class AuditLogEntryResponse(BaseModel):
    id: str
    admin_name: Optional[str]
    action: str
    target_type: str
    target_id: str
    target_name: Optional[str]
    details: Optional[Dict[str, Any]]
    created_at: str

    model_config = ConfigDict(from_attributes=True)


class CooperativeMetricsResponse(BaseModel):
    total_workers: int
    verified_workers: int
    workers_online: int
    jobs_today: int
    active_jobs: int
    completion_rate: float
    revenue_today: float
    worker_payouts: float
    pending_verification: int
    replacement_required: int

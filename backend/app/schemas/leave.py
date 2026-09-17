from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models.leave import (
    LeaveType,
    LeaveStatus,
    ReplacementSource,
    ReplacementStatus,
    AttendanceStatus,
)


class LeaveApplyRequest(BaseModel):
    leave_type: LeaveType = LeaveType.PLANNED
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD
    reason: str
    suggested_replacement_worker_id: Optional[str] = None
    notes: Optional[str] = None


class AffectedBookingSummary(BaseModel):
    id: str
    booking_reference: str
    service_title: str
    scheduled_date: str
    time_slot: str
    customer_name: str
    customer_phone: Optional[str] = None
    address_line: str
    rate: float
    has_replacement: bool = False
    replacement_worker_name: Optional[str] = None


class ReplacementCandidateResponse(BaseModel):
    worker_id: str
    worker_name: str
    shram_id: Optional[str] = None
    trade: str
    cooperative_name: Optional[str] = None
    rating: float
    distance_km: float
    jobs_completed: int
    match_score: float  # e.g. 96.5%
    is_available: bool
    verification_status: str  # "VERIFIED" | "POLICE_CLEARED"


class ReplacementAssignRequest(BaseModel):
    leave_id: str
    booking_id: Optional[str] = None
    booking_instance_id: Optional[str] = None
    replacement_worker_id: str
    replacement_source: ReplacementSource = ReplacementSource.SYSTEM_RECOMMENDED


class ReplacementActionRequest(BaseModel):
    reason: Optional[str] = None
    notes: Optional[str] = None


class ReplacementAssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    assignment_reference: str
    leave_id: str
    booking_id: Optional[str] = None
    booking_instance_id: Optional[str] = None
    original_worker_id: str
    original_worker_name: Optional[str] = None
    replacement_worker_id: str
    replacement_worker_name: Optional[str] = None
    replacement_source: ReplacementSource
    status: ReplacementStatus
    match_score: float
    decline_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class LeaveResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    leave_reference: str
    worker_id: str
    cooperative_code: str
    leave_type: LeaveType
    start_date: str
    end_date: str
    reason: str
    status: LeaveStatus
    affected_job_count: int
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    worker_name: Optional[str] = None
    worker_trade: Optional[str] = None
    worker_shram_id: Optional[str] = None
    worker_phone: Optional[str] = None

    affected_bookings: List[AffectedBookingSummary] = []
    replacement_assignments: List[ReplacementAssignmentResponse] = []


class WorkAttendanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    booking_id: Optional[str] = None
    worker_id: str
    worker_name: Optional[str] = None
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    status: AttendanceStatus
    otp_verified: bool
    settlement_transferred_to_worker_id: Optional[str] = None
    settled_worker_name: Optional[str] = None
    created_at: datetime

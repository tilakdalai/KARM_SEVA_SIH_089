from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict
from app.models.complaint import ComplaintCategory, ComplaintStatus


class ComplaintCreateRequest(BaseModel):
    booking_id: Optional[str] = Field(None, description="Linked booking ID if applicable")
    category: ComplaintCategory
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    evidence: List[str] = Field(default_factory=list, description="List of image/document URLs")
    cooperative_code: Optional[str] = Field(None, description="Target cooperative code if not inferable from booking")


class ComplaintStatusUpdateRequest(BaseModel):
    status: ComplaintStatus
    notes: Optional[str] = None


class ComplaintResolveRequest(BaseModel):
    resolution_notes: str = Field(..., min_length=5, description="Official conciliation / tribunal resolution decision")


class ComplaintEscalateRequest(BaseModel):
    escalation_reason: str = Field(..., min_length=5, description="Reason for escalating dispute to State DPI Administrator")


class ComplaintHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    complaint_id: str
    actor_id: str
    actor_name: str
    actor_role: str
    from_status: Optional[ComplaintStatus] = None
    to_status: ComplaintStatus
    action: str
    notes: Optional[str] = None
    created_at: datetime


class ComplaintResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    complaint_reference: str
    booking_id: Optional[str] = None
    category: ComplaintCategory
    title: str
    description: str
    evidence: List[str] = []
    created_by_id: str
    created_by_name: Optional[str] = None
    created_by_role: str
    cooperative_code: str
    assigned_to_id: Optional[str] = None
    assigned_to_name: Optional[str] = None
    status: ComplaintStatus
    resolution_notes: Optional[str] = None
    resolved_by_id: Optional[str] = None
    resolved_by_name: Optional[str] = None
    resolved_at: Optional[datetime] = None
    escalated_at: Optional[datetime] = None
    escalation_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    actions: List[ComplaintHistoryResponse] = []

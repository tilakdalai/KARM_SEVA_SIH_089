from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models.booking import BookingStatus, BookingType, RecurringFrequency


class BookingCreateRequest(BaseModel):
    service_id: str
    service_title: str
    service_category: str
    cooperative_code: str
    cooperative_name: str
    scheduled_worker_id: str
    booking_type: BookingType = BookingType.ONE_TIME
    recurring_frequency: RecurringFrequency = RecurringFrequency.NONE
    scheduled_date: str
    time_slot: str
    address_line: str
    district: str
    pincode: str
    landmark: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    description: Optional[str] = None
    media_urls: Optional[List[str]] = None
    base_rate: float
    extra_charges: float = 0.0
    total_amount: float


class BookingStatusUpdateRequest(BaseModel):
    status: BookingStatus
    otp_code: Optional[str] = None
    reason: Optional[str] = None
    notes: Optional[str] = None


class BookingReassignRequest(BaseModel):
    new_worker_id: str
    reason: str


class BookingRatingRequest(BaseModel):
    rating: float
    review: Optional[str] = None


class BookingStatusHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    booking_id: str
    from_status: Optional[BookingStatus] = None
    to_status: BookingStatus
    changed_by_user_id: str
    changed_by_name: Optional[str] = None
    changed_by_role: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    booking_reference: str
    customer_id: str
    service_id: str
    service_title: str
    service_category: str
    cooperative_code: str
    cooperative_name: str
    scheduled_worker_id: str
    actual_worker_id: Optional[str] = None
    replacement_for_worker_id: Optional[str] = None
    is_replacement: bool = False
    replacement_reason: Optional[str] = None
    booking_type: BookingType
    recurring_frequency: RecurringFrequency
    scheduled_date: str
    time_slot: str
    address_line: str
    district: str
    pincode: str
    landmark: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    description: Optional[str] = None
    media_urls: Optional[List[str]] = None
    base_rate: float
    extra_charges: float
    total_amount: float
    status: BookingStatus
    otp_code: str
    otp_verified: bool
    decline_reason: Optional[str] = None
    cancellation_reason: Optional[str] = None
    dispute_reason: Optional[str] = None
    rating: Optional[float] = None
    review: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # Summary Info
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    worker_name: Optional[str] = None
    worker_phone: Optional[str] = None
    worker_trade: Optional[str] = None
    worker_shram_id: Optional[str] = None
    worker_rating: Optional[float] = None
    replacement_worker_name: Optional[str] = None

    status_history: List[BookingStatusHistoryResponse] = []

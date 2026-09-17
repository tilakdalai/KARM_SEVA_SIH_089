from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models.recurring import RecurrenceType, ScheduleStatus, InstanceStatus


class CustomSlotSchema(BaseModel):
    day_of_week: str  # "Monday", "Tuesday", etc.
    start_time: str   # "09:00"
    end_time: str     # "12:00"


class RecurringScheduleCreateRequest(BaseModel):
    service_id: str
    service_title: str
    service_category: str
    cooperative_code: str
    cooperative_name: str
    worker_id: str
    recurrence_type: RecurrenceType = RecurrenceType.WEEKLY
    custom_slots: Optional[List[CustomSlotSchema]] = None
    start_date: str  # YYYY-MM-DD
    end_date: Optional[str] = None
    total_occurrences: int = 4
    rate_per_instance: float
    address_line: str
    district: str
    pincode: str
    landmark: Optional[str] = None
    notes: Optional[str] = None


class ScheduleActionRequest(BaseModel):
    reason: Optional[str] = None
    notes: Optional[str] = None


class ScheduleModifyRequest(BaseModel):
    custom_slots: Optional[List[CustomSlotSchema]] = None
    end_date: Optional[str] = None
    rate_per_instance: Optional[float] = None
    notes: Optional[str] = None


class BookingInstanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    instance_reference: str
    recurring_schedule_id: str
    customer_id: str
    worker_id: str
    service_title: str
    instance_date: str
    day_of_week: Optional[str] = None
    start_time: str
    end_time: str
    time_slot: str
    rate: float
    status: InstanceStatus
    otp_code: str
    otp_verified: bool
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # Summary
    customer_name: Optional[str] = None
    worker_name: Optional[str] = None
    worker_shram_id: Optional[str] = None


class RecurringScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    schedule_reference: str
    customer_id: str
    worker_id: str
    service_id: str
    service_title: str
    service_category: str
    cooperative_code: str
    cooperative_name: str
    recurrence_type: RecurrenceType
    custom_slots: Optional[List[dict]] = None
    start_date: str
    end_date: Optional[str] = None
    total_occurrences: int
    rate_per_instance: float
    total_projected_amount: float
    address_line: str
    district: str
    pincode: str
    landmark: Optional[str] = None
    status: ScheduleStatus
    decline_reason: Optional[str] = None
    cancellation_reason: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    worker_name: Optional[str] = None
    worker_phone: Optional[str] = None
    worker_trade: Optional[str] = None
    worker_shram_id: Optional[str] = None

    instances: List[BookingInstanceResponse] = []


class CalendarEventResponse(BaseModel):
    id: str
    title: str
    date: str
    day_of_week: str
    start_time: str
    end_time: str
    time_slot: str
    event_type: str  # "RECURRING_INSTANCE" | "ONE_TIME_BOOKING"
    status: str
    worker_name: str
    customer_name: str
    rate: float
    schedule_reference: Optional[str] = None
    otp_code: Optional[str] = None

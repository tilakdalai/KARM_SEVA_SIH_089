from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.models.booking import BookingStatus

class WorkerLocationUpdateRequest(BaseModel):
    latitude: float = Field(..., description="Current worker latitude")
    longitude: float = Field(..., description="Current worker longitude")
    heading: Optional[float] = Field(None, description="Compass heading 0-360 degrees")
    speed: Optional[float] = Field(None, description="Current speed in km/h or m/s")
    accuracy: Optional[float] = Field(None, description="GPS accuracy in meters")

class WorkerTrackingSummary(BaseModel):
    id: str
    name: str
    phone: str
    photo: Optional[str] = None
    shram_id: Optional[str] = None
    trade: Optional[str] = None
    rating: float = 4.8
    is_verified: bool = True
    is_replacement: bool = False
    replacement_for_name: Optional[str] = None
    replacement_reason: Optional[str] = None

class CustomerLocationSummary(BaseModel):
    latitude: float
    longitude: float
    address_line: str
    district: str
    pincode: str
    landmark: Optional[str] = None

class WorkerLocationPoint(BaseModel):
    latitude: float
    longitude: float
    heading: Optional[float] = None
    speed: Optional[float] = None
    accuracy: Optional[float] = None
    recorded_at: datetime

class BookingTrackingResponse(BaseModel):
    booking_id: str
    booking_reference: str
    status: BookingStatus
    is_live: bool = True
    is_emergency: bool = False
    customer_location: CustomerLocationSummary
    worker: WorkerTrackingSummary
    worker_location: Optional[WorkerLocationPoint] = None
    distance_km: float
    eta_minutes: int
    is_road_distance: bool = True
    route_coordinates: List[List[float]] = []
    otp_code: Optional[str] = None
    last_updated: datetime

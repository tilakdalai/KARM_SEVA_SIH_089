from typing import List, Optional
from pydantic import BaseModel, Field


class WorkforceItemSchema(BaseModel):
    trade: str = Field(..., description="Trade e.g. Cleaner, Electrician, Plumber")
    quantity: int = Field(..., ge=1, le=50, description="Number of workers required")
    daily_floor_rate: Optional[float] = Field(450.0, description="Floor rate per worker per day")


class WorkforceRequestCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="Request summary title")
    facility_location: str = Field(..., min_length=3, description="Deployment address / facility campus")
    duration_months: int = Field(1, ge=1, le=24, description="Contract duration in months")
    start_date: str = Field(..., description="Service commencement date (YYYY-MM-DD)")
    end_date: str = Field(..., description="Service end date (YYYY-MM-DD)")
    recurring_frequency: str = Field("DAILY", description="DAILY, WEEKDAYS, CUSTOM")
    shift_start_time: str = Field("09:00 AM", description="Daily shift start")
    shift_end_time: str = Field("05:00 PM", description="Daily shift finish")
    additional_instructions: Optional[str] = Field(None, description="Special gear or protocol instructions")
    items: List[WorkforceItemSchema] = Field(..., min_length=1, description="List of trade requirements")


class InstitutionProfileUpdateRequest(BaseModel):
    organization_name: Optional[str] = None
    institution_type: Optional[str] = None
    gstin: Optional[str] = None
    pan_number: Optional[str] = None
    nodal_officer_name: Optional[str] = None
    nodal_officer_phone: Optional[str] = None
    nodal_officer_email: Optional[str] = None
    nodal_officer_designation: Optional[str] = None
    address: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None

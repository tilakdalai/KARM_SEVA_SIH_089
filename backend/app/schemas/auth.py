from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from app.models.user import UserRole


class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full Name")
    phone: str = Field(..., min_length=10, max_length=15, description="Mobile Number")
    email: Optional[EmailStr] = Field(None, description="Email Address")
    password: str = Field(..., min_length=6, max_length=100, description="Password")
    role: UserRole = Field(UserRole.CUSTOMER, description="Selected Role")
    preferred_language: str = Field("en", description="Preferred language (en/hi/or)")

    # Worker specific fields
    trade: Optional[str] = Field(None, description="Trade e.g. Electrician, Plumber")
    work_radius_km: Optional[float] = Field(4.0, description="Preferred work radius in km")
    cooperative_name: Optional[str] = Field(None, description="Cooperative name or choice")

    # Customer & Institution specific fields
    organization_name: Optional[str] = Field(None, description="Company / School / Hospital Name")
    institution_type: Optional[str] = Field(None, description="Organization Type e.g. School, Hospital")
    address: Optional[str] = Field(None, description="Locality / Address")
    district: Optional[str] = Field(None, description="District")
    pincode: Optional[str] = Field(None, description="PIN Code")

    @field_validator("role")
    @classmethod
    def validate_public_registration_role(cls, v: UserRole) -> UserRole:
        if v == UserRole.SYSTEM_ADMIN:
            raise ValueError("Public registration for SYSTEM_ADMIN is strictly prohibited.")
        if v == UserRole.COOPERATIVE_ADMIN:
            raise ValueError("Cooperative administrator accounts must be provisioned through official invitation.")
        return v


class UserLoginRequest(BaseModel):
    credential: str = Field(..., min_length=3, description="Mobile number or Email address")
    password: str = Field(..., min_length=4, description="Account password")


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: Optional[str] = None
    phone: str
    role: UserRole
    profile_photo: Optional[str] = None
    preferred_language: str = "en"
    is_active: bool = True
    is_verified: bool = False
    shram_id: Optional[str] = None
    trade: Optional[str] = None
    work_radius_km: Optional[float] = None
    cooperative_name: Optional[str] = None
    organization_name: Optional[str] = None
    institution_type: Optional[str] = None
    district: Optional[str] = None
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse

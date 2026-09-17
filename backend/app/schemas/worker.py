from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.models.worker import (
    TradeVerificationGroup,
    WorkerOnboardingStatus,
    IdentityDocType,
    VerificationDocStatus,
)


class IdentityDocumentSchema(BaseModel):
    document_type: IdentityDocType
    document_number: str = Field(..., min_length=4, description="Full or last 4 digits of document number")
    document_ref: Optional[str] = None


class CertificationSchema(BaseModel):
    certificate_name: str
    issuing_authority: str
    certificate_number: Optional[str] = None
    issue_year: Optional[int] = None
    document_url: Optional[str] = None


class SkillItemSchema(BaseModel):
    skill_name: str
    is_primary: bool = True


class WorkPreferenceSchema(BaseModel):
    preferred_radius_km: float = Field(default=5.0, ge=1.0, le=50.0)
    max_radius_km: float = Field(default=10.0, ge=1.0, le=100.0)
    allow_outside_suggestions: bool = True
    preferred_shift: str = "FULL_DAY"
    is_available_for_emergency: bool = True


class PortfolioItemSchema(BaseModel):
    title: str
    service_type: str
    description: Optional[str] = None
    image_url: str
    before_image_url: Optional[str] = None
    work_date: Optional[str] = None


class WorkerOnboardingRequest(BaseModel):
    # Step 1: Personal Details
    name: str = Field(..., min_length=2)
    alternate_phone: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = Field(None, ge=18, le=80)
    preferred_language: str = "English"
    district: str = "Bhubaneswar"
    address_line: Optional[str] = None
    profile_photo_url: Optional[str] = None

    # Step 2: Cooperative Selection
    cooperative_id: str
    cooperative_name: str

    # Step 3: Occupation & Trade Group
    trade: str
    trade_group: TradeVerificationGroup

    # Step 4: Experience & Skills
    experience_years: float = Field(0.0, ge=0.0)
    bio: Optional[str] = None
    skills: List[str] = Field(default_factory=list)

    # Step 5: Verification & Identity
    identity_document: IdentityDocumentSchema
    certifications: List[CertificationSchema] = Field(default_factory=list)
    is_police_cleared: bool = True

    # Step 6: Work Preferences
    preferences: WorkPreferenceSchema

    # Step 7: Portfolio
    portfolio: List[PortfolioItemSchema] = Field(default_factory=list)

    # Step 8: Digital Declaration
    declaration_confirmed: bool = True


class WorkerProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    shram_id: Optional[str]
    name: str
    phone: str
    trade: str
    trade_group: TradeVerificationGroup
    cooperative_name: Optional[str]
    experience_years: float
    bio: Optional[str]
    profile_photo_url: Optional[str]
    onboarding_status: WorkerOnboardingStatus
    current_step: int
    is_verified: bool
    preferred_radius_km: float
    max_radius_km: float
    allow_outside_suggestions: bool
    skills: List[str]
    masked_identity_doc: Optional[str]
    total_certificates: int
    total_portfolio_items: int


class TradePolicyInfo(BaseModel):
    trade: str
    slug: str
    group: TradeVerificationGroup
    group_label: str
    certificate_requirement: str  # Mandatory, Optional, Evidence, None
    description: str
    suggested_skills: List[str]


class CooperativeInfo(BaseModel):
    id: str
    name: str
    code: str
    district: str
    address: str
    officer_name: str
    contact_phone: str
    registered_workers_count: int

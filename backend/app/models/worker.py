import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Float,
    Text,
)
from sqlalchemy.orm import relationship
from app.database import Base


class TradeVerificationGroup(str, enum.Enum):
    GROUP_A = "GROUP_A"  # Patient Caregivers, Drivers, Electricians (Mandatory cert/licence + experience)
    GROUP_B = "GROUP_B"  # Plumbers, Elderly Caregivers, Child Caregivers (Experience primary; optional cert badge)
    GROUP_C = "GROUP_C"  # Carpenters, Painters, Gardeners, Technicians (Experience + skill evidence / test)
    GROUP_D = "GROUP_D"  # Cleaners, Domestic Helpers (Certificate-free, cooperative verification)


class WorkerOnboardingStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class IdentityDocType(str, enum.Enum):
    AADHAAR = "AADHAAR"
    PAN = "PAN"
    VOTER_ID = "VOTER_ID"
    BPL_CARD = "BPL_CARD"


class VerificationDocStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    shram_id = Column(String(64), unique=True, nullable=True, index=True)  # e.g., SHRAM-OD-2024-8841

    # Personal & Contact Extra
    alternate_phone = Column(String(15), nullable=True)
    gender = Column(String(20), nullable=True)
    age = Column(Integer, nullable=True)
    preferred_language = Column(String(30), default="English")
    address_line = Column(String(255), nullable=True)
    country = Column(String(50), default="India", nullable=False)
    state = Column(String(100), nullable=True)
    state_code = Column(String(10), nullable=True)
    district = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    profile_photo_url = Column(String(512), nullable=True)

    # Cooperative Affiliation
    cooperative_id = Column(String(64), nullable=True)
    cooperative_name = Column(String(128), nullable=True)

    # Trade & Group
    trade = Column(String(64), nullable=False, default="Electrician")
    trade_group = Column(Enum(TradeVerificationGroup), default=TradeVerificationGroup.GROUP_A, nullable=False)
    experience_years = Column(Float, default=0.0)
    bio = Column(Text, nullable=True)

    # Onboarding Lifecycle State
    onboarding_status = Column(Enum(WorkerOnboardingStatus), default=WorkerOnboardingStatus.DRAFT, nullable=False)
    current_step = Column(Integer, default=1)
    is_police_cleared = Column(Boolean, default=False)
    is_cooperative_verified = Column(Boolean, default=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", backref="worker_profile", lazy="joined")
    identity_documents = relationship("WorkerIdentityDocument", back_populates="worker", cascade="all, delete-orphan")
    certifications = relationship("WorkerCertification", back_populates="worker", cascade="all, delete-orphan")
    skills = relationship("WorkerSkill", back_populates="worker", cascade="all, delete-orphan")
    service_preferences = relationship("WorkerServicePreference", back_populates="worker", uselist=False, cascade="all, delete-orphan")
    portfolio_items = relationship("WorkerPortfolio", back_populates="worker", cascade="all, delete-orphan")
    assessments = relationship("WorkerAssessment", back_populates="worker", cascade="all, delete-orphan")


class WorkerIdentityDocument(Base):
    __tablename__ = "worker_identity_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(36), ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    document_type = Column(Enum(IdentityDocType), nullable=False)
    # Stored strictly masked for privacy (e.g. XXXX-XXXX-8841)
    masked_number = Column(String(64), nullable=False)
    document_ref = Column(String(512), nullable=True)  # Secure storage reference or URL
    verification_status = Column(Enum(VerificationDocStatus), default=VerificationDocStatus.PENDING, nullable=False)
    verified_by_officer = Column(String(128), nullable=True)
    verified_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    worker = relationship("WorkerProfile", back_populates="identity_documents")


class WorkerCertification(Base):
    __tablename__ = "worker_certifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(36), ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    certificate_name = Column(String(128), nullable=False)
    issuing_authority = Column(String(128), nullable=False)  # e.g., NCVT / Skill India / State Nursing Council
    certificate_number_masked = Column(String(64), nullable=True)
    issue_year = Column(Integer, nullable=True)
    document_url = Column(String(512), nullable=True)
    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    worker = relationship("WorkerProfile", back_populates="certifications")


class WorkerSkill(Base):
    __tablename__ = "worker_skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(36), ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(64), nullable=False)
    is_primary = Column(Boolean, default=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    worker = relationship("WorkerProfile", back_populates="skills")


class WorkerServicePreference(Base):
    __tablename__ = "worker_service_preferences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(36), ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    preferred_radius_km = Column(Float, default=5.0, nullable=False)
    max_radius_km = Column(Float, default=10.0, nullable=False)
    allow_outside_suggestions = Column(Boolean, default=True, nullable=False)
    preferred_shift = Column(String(32), default="FULL_DAY")  # MORNING, AFTERNOON, FULL_DAY, EMERGENCY_STANDBY
    is_available_for_emergency = Column(Boolean, default=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    worker = relationship("WorkerProfile", back_populates="service_preferences")


class WorkerPortfolio(Base):
    __tablename__ = "worker_portfolio"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(36), ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(128), nullable=False)
    service_type = Column(String(64), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(512), nullable=False)
    before_image_url = Column(String(512), nullable=True)
    work_date = Column(String(32), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    worker = relationship("WorkerProfile", back_populates="portfolio_items")


class WorkerAssessment(Base):
    __tablename__ = "worker_assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(36), ForeignKey("worker_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    trade_group = Column(Enum(TradeVerificationGroup), nullable=False)
    assessment_score = Column(Float, default=100.0)
    safety_quiz_passed = Column(Boolean, default=True)
    evaluated_by = Column(String(128), default="System Auto-Check")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    worker = relationship("WorkerProfile", back_populates="assessments")

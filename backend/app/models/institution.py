import uuid
from datetime import datetime, timezone
import enum
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Float,
    Integer,
    Text,
    ForeignKey,
    Enum as SQLEnum,
    JSON,
)
from sqlalchemy.orm import relationship
from app.database import Base


class RequestStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    ALLOCATING = "ALLOCATING"
    ACTIVE_DEPLOYED = "ACTIVE_DEPLOYED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class ContractStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    RENEWAL_DUE = "RENEWAL_DUE"
    TERMINATED = "TERMINATED"
    PENDING_SIGNATURE = "PENDING_SIGNATURE"


class InvoiceStatus(str, enum.Enum):
    PAID = "PAID"
    PENDING_CLEARANCE = "PENDING_CLEARANCE"
    OVERDUE = "OVERDUE"


class AttendanceStatus(str, enum.Enum):
    PRESENT = "PRESENT"
    SUBSTITUTE_DEPLOYED = "SUBSTITUTE_DEPLOYED"
    ABSENT = "ABSENT"
    LEAVE_AUTHORIZED = "LEAVE_AUTHORIZED"


class InstitutionProfile(Base):
    __tablename__ = "institution_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    organization_name = Column(String(200), nullable=False)
    institution_type = Column(String(100), nullable=False, default="Hospital")  # School, Hospital, Office, PSU, Housing
    gstin = Column(String(20), nullable=True)
    pan_number = Column(String(20), nullable=True)
    nodal_officer_name = Column(String(100), nullable=False)
    nodal_officer_phone = Column(String(20), nullable=False)
    nodal_officer_email = Column(String(150), nullable=True)
    nodal_officer_designation = Column(String(100), nullable=True)
    address = Column(String(255), nullable=False)
    district = Column(String(100), nullable=False, default="Bhubaneswar")
    pincode = Column(String(10), nullable=False, default="751001")
    is_verified = Column(Boolean, default=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", backref="institution_profile", lazy="joined")
    requests = relationship("WorkforceRequest", back_populates="institution", cascade="all, delete-orphan")
    contracts = relationship("InstitutionalContract", back_populates="institution", cascade="all, delete-orphan")
    invoices = relationship("InstitutionalInvoice", back_populates="institution", cascade="all, delete-orphan")


class WorkforceRequest(Base):
    __tablename__ = "workforce_requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    institution_id = Column(String(36), ForeignKey("institution_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    facility_location = Column(String(255), nullable=False)
    duration_months = Column(Integer, default=1, nullable=False)
    start_date = Column(String(20), nullable=False)
    end_date = Column(String(20), nullable=False)
    recurring_frequency = Column(String(50), default="DAILY", nullable=False)  # DAILY, WEEKDAYS, CUSTOM
    shift_start_time = Column(String(20), default="09:00 AM", nullable=False)
    shift_end_time = Column(String(20), default="05:00 PM", nullable=False)
    additional_instructions = Column(Text, nullable=True)
    estimated_monthly_cost = Column(Float, default=0.0, nullable=False)
    cooperative_id = Column(String(64), nullable=True, default="OD-KHR-COOP-041")
    cooperative_name = Column(String(150), nullable=True, default="Khurda District Urban Workers Cooperative Union")
    status = Column(SQLEnum(RequestStatus), default=RequestStatus.SUBMITTED, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    institution = relationship("InstitutionProfile", back_populates="requests")
    items = relationship("WorkforceRequestItem", back_populates="request", cascade="all, delete-orphan", lazy="joined")


class WorkforceRequestItem(Base):
    __tablename__ = "workforce_request_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(36), ForeignKey("workforce_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    trade = Column(String(100), nullable=False)  # e.g., Cleaner, Electrician, Plumber, Driver
    quantity_required = Column(Integer, nullable=False, default=1)
    allocated_workers_count = Column(Integer, nullable=False, default=0)
    daily_floor_rate = Column(Float, nullable=False, default=450.0)

    request = relationship("WorkforceRequest", back_populates="items")


class InstitutionalContract(Base):
    __tablename__ = "institutional_contracts"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))  # e.g. CNT-2024-AIIMS-01
    institution_id = Column(String(36), ForeignKey("institution_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    request_id = Column(String(36), nullable=True)
    contract_title = Column(String(200), nullable=False)
    cooperative_code = Column(String(64), default="OD-KHR-COOP-041")
    cooperative_name = Column(String(150), default="Khurda District Urban Workers Cooperative Union")
    total_workers_assigned = Column(Integer, default=6)
    monthly_billing_amount = Column(Float, nullable=False)
    start_date = Column(String(20), nullable=False)
    end_date = Column(String(20), nullable=False)
    sla_terms = Column(Text, nullable=True)
    status = Column(SQLEnum(ContractStatus), default=ContractStatus.ACTIVE, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    institution = relationship("InstitutionProfile", back_populates="contracts")


class InstitutionalAttendance(Base):
    __tablename__ = "institutional_attendance"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    institution_id = Column(String(36), ForeignKey("institution_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    contract_id = Column(String(64), nullable=True)
    worker_shram_id = Column(String(64), nullable=False)
    worker_name = Column(String(100), nullable=False)
    trade = Column(String(100), nullable=False)
    date = Column(String(20), nullable=False)
    punch_in_time = Column(String(20), nullable=True)
    punch_out_time = Column(String(20), nullable=True)
    geofence_verified = Column(Boolean, default=True)
    status = Column(SQLEnum(AttendanceStatus), default=AttendanceStatus.PRESENT, nullable=False)
    substitute_worker_name = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


class InstitutionalInvoice(Base):
    __tablename__ = "institutional_invoices"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))  # e.g., INV-2024-09-041
    institution_id = Column(String(36), ForeignKey("institution_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    contract_id = Column(String(64), nullable=True)
    billing_period = Column(String(50), nullable=False)
    gross_amount = Column(Float, nullable=False)
    gst_amount = Column(Float, default=0.0)  # 0% on direct labour / standard reverse charge
    net_payable = Column(Float, nullable=False)
    due_date = Column(String(20), nullable=False)
    paid_date = Column(String(20), nullable=True)
    status = Column(SQLEnum(InvoiceStatus), default=InvoiceStatus.PENDING_CLEARANCE, nullable=False)
    line_items = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    institution = relationship("InstitutionProfile", back_populates="invoices")

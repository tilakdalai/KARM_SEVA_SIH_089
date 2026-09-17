import uuid
from datetime import datetime, timezone
from enum import Enum
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
)
from sqlalchemy.orm import relationship
from app.database import Base


class LeaveType(str, Enum):
    PLANNED = "PLANNED"
    MEDICAL = "MEDICAL"
    EMERGENCY = "EMERGENCY"


class LeaveStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    EMERGENCY_ACTIVE = "EMERGENCY_ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class ReplacementSource(str, Enum):
    ORIGINAL_WORKER_SUGGESTED = "ORIGINAL_WORKER_SUGGESTED"
    COOPERATIVE_ASSIGNED = "COOPERATIVE_ASSIGNED"
    SYSTEM_RECOMMENDED = "SYSTEM_RECOMMENDED"


class ReplacementStatus(str, Enum):
    PROPOSED = "PROPOSED"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    REPLACED = "REPLACED"
    ABSENT = "ABSENT"


class WorkerLeave(Base):
    __tablename__ = "worker_leave"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    leave_reference = Column(String(30), unique=True, index=True, nullable=False)

    worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    cooperative_code = Column(String(50), index=True, nullable=False)

    leave_type = Column(SQLEnum(LeaveType), default=LeaveType.PLANNED, nullable=False)
    start_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    end_date = Column(String(20), nullable=False)    # YYYY-MM-DD
    reason = Column(Text, nullable=False)

    status = Column(SQLEnum(LeaveStatus), default=LeaveStatus.PENDING, index=True, nullable=False)
    affected_job_count = Column(Integer, default=0, nullable=False)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    worker = relationship("User", foreign_keys=[worker_id])
    replacement_assignments = relationship(
        "ReplacementAssignment",
        back_populates="leave",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<WorkerLeave {self.leave_reference} type={self.leave_type} status={self.status}>"


class ReplacementAssignment(Base):
    __tablename__ = "replacement_assignments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    assignment_reference = Column(String(30), unique=True, index=True, nullable=False)

    leave_id = Column(String(36), ForeignKey("worker_leave.id"), index=True, nullable=False)
    booking_id = Column(String(36), ForeignKey("bookings.id"), index=True, nullable=True)
    booking_instance_id = Column(String(36), ForeignKey("booking_instances.id"), index=True, nullable=True)

    original_worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    replacement_worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    replacement_source = Column(
        SQLEnum(ReplacementSource),
        default=ReplacementSource.SYSTEM_RECOMMENDED,
        nullable=False,
    )
    status = Column(
        SQLEnum(ReplacementStatus),
        default=ReplacementStatus.PROPOSED,
        index=True,
        nullable=False,
    )
    match_score = Column(Float, default=95.0, nullable=False)  # Matching score from recommendation engine
    decline_reason = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    leave = relationship("WorkerLeave", back_populates="replacement_assignments")
    original_worker = relationship("User", foreign_keys=[original_worker_id])
    replacement_worker = relationship("User", foreign_keys=[replacement_worker_id])
    booking = relationship("Booking", foreign_keys=[booking_id])
    booking_instance = relationship("BookingInstance", foreign_keys=[booking_instance_id])

    def __repr__(self):
        return f"<ReplacementAssignment {self.assignment_reference} from={self.original_worker_id} to={self.replacement_worker_id}>"


class WorkAttendance(Base):
    __tablename__ = "work_attendance"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    booking_id = Column(String(36), ForeignKey("bookings.id"), index=True, nullable=True)
    worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    check_in_time = Column(DateTime, nullable=True)
    check_out_time = Column(DateTime, nullable=True)
    status = Column(SQLEnum(AttendanceStatus), default=AttendanceStatus.PRESENT, nullable=False)
    otp_verified = Column(Boolean, default=False, nullable=False)
    settlement_transferred_to_worker_id = Column(String(36), ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    worker = relationship("User", foreign_keys=[worker_id])
    settled_worker = relationship("User", foreign_keys=[settlement_transferred_to_worker_id])

    def __repr__(self):
        return f"<WorkAttendance booking={self.booking_id} worker={self.worker_id} status={self.status}>"

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
    JSON,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from app.database import Base


class RecurrenceType(str, Enum):
    ONE_TIME = "ONE_TIME"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    CUSTOM_SLOT = "CUSTOM_SLOT"


class ScheduleStatus(str, Enum):
    PENDING_WORKER_ACCEPTANCE = "PENDING_WORKER_ACCEPTANCE"
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    CANCELLED = "CANCELLED"
    DECLINED = "DECLINED"
    COMPLETED = "COMPLETED"


class InstanceStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    SKIPPED = "SKIPPED"


class RecurringSchedule(Base):
    __tablename__ = "recurring_schedules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    schedule_reference = Column(String(30), unique=True, index=True, nullable=False)

    customer_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    service_id = Column(String(50), nullable=False)
    service_title = Column(String(150), nullable=False)
    service_category = Column(String(100), nullable=False)
    cooperative_code = Column(String(50), index=True, nullable=False)
    cooperative_name = Column(String(150), nullable=False)

    recurrence_type = Column(SQLEnum(RecurrenceType), default=RecurrenceType.WEEKLY, nullable=False)
    # custom_slots: list of objects e.g. [{"day": "Monday", "start_time": "09:00", "end_time": "12:00"}]
    custom_slots = Column(JSON, nullable=True)

    start_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    end_date = Column(String(20), nullable=True)      # YYYY-MM-DD
    total_occurrences = Column(Integer, default=4, nullable=False)
    rate_per_instance = Column(Float, default=0.0, nullable=False)
    total_projected_amount = Column(Float, default=0.0, nullable=False)

    address_line = Column(String(255), nullable=False)
    district = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    landmark = Column(String(150), nullable=True)

    status = Column(
        SQLEnum(ScheduleStatus),
        default=ScheduleStatus.PENDING_WORKER_ACCEPTANCE,
        index=True,
        nullable=False,
    )
    decline_reason = Column(String(255), nullable=True)
    cancellation_reason = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    customer = relationship("User", foreign_keys=[customer_id])
    worker = relationship("User", foreign_keys=[worker_id])
    instances = relationship(
        "BookingInstance",
        back_populates="schedule",
        cascade="all, delete-orphan",
        order_by="BookingInstance.instance_date.asc()",
    )

    def __repr__(self):
        return f"<RecurringSchedule ref='{self.schedule_reference}' type='{self.recurrence_type}' status='{self.status}'>"


class BookingInstance(Base):
    __tablename__ = "booking_instances"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    instance_reference = Column(String(30), unique=True, index=True, nullable=False)

    recurring_schedule_id = Column(String(36), ForeignKey("recurring_schedules.id"), index=True, nullable=False)
    customer_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    service_title = Column(String(150), nullable=False)
    instance_date = Column(String(20), nullable=False, index=True)  # YYYY-MM-DD
    day_of_week = Column(String(20), nullable=True)                 # e.g. "Monday"
    start_time = Column(String(20), nullable=False)                 # e.g. "09:00"
    end_time = Column(String(20), nullable=False)                   # e.g. "12:00"
    time_slot = Column(String(50), nullable=False)                  # e.g. "09:00 AM - 12:00 PM"

    rate = Column(Float, default=0.0, nullable=False)
    status = Column(SQLEnum(InstanceStatus), default=InstanceStatus.SCHEDULED, index=True, nullable=False)
    otp_code = Column(String(6), default="4819", nullable=False)
    otp_verified = Column(Boolean, default=False, nullable=False)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    schedule = relationship("RecurringSchedule", back_populates="instances")
    customer = relationship("User", foreign_keys=[customer_id])
    worker = relationship("User", foreign_keys=[worker_id])

    def __repr__(self):
        return f"<BookingInstance {self.instance_reference} date='{self.instance_date}' status='{self.status}'>"

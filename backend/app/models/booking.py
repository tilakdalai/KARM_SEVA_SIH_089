import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Float,
    Text,
    JSON,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from app.database import Base


class BookingStatus(str, Enum):
    REQUESTED = "REQUESTED"
    ACCEPTED = "ACCEPTED"
    ON_THE_WAY = "ON_THE_WAY"
    ARRIVED = "ARRIVED"
    STARTED = "STARTED"
    COMPLETED = "COMPLETED"
    DECLINED = "DECLINED"
    CANCELLED = "CANCELLED"
    DISPUTED = "DISPUTED"


class BookingType(str, Enum):
    ONE_TIME = "ONE_TIME"
    RECURRING = "RECURRING"


class RecurringFrequency(str, Enum):
    NONE = "NONE"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    BIWEEKLY = "BIWEEKLY"
    MONTHLY = "MONTHLY"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_reference = Column(String(30), unique=True, index=True, nullable=False)

    # Core Participants & Units
    customer_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    service_id = Column(String(50), nullable=False)
    service_title = Column(String(150), nullable=False)
    service_category = Column(String(100), nullable=False)
    cooperative_code = Column(String(50), index=True, nullable=False)
    cooperative_name = Column(String(150), nullable=False)

    scheduled_worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    actual_worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=True)
    replacement_for_worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=True)
    is_replacement = Column(Boolean, default=False, nullable=False)
    replacement_reason = Column(String(255), nullable=True)

    # Scheduling
    booking_type = Column(SQLEnum(BookingType), default=BookingType.ONE_TIME, nullable=False)
    recurring_frequency = Column(SQLEnum(RecurringFrequency), default=RecurringFrequency.NONE, nullable=False)
    scheduled_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    time_slot = Column(String(50), nullable=False)       # e.g. "09:00 AM - 11:00 AM"

    # Address & Location (Pan-India)
    address_line = Column(String(255), nullable=False)
    country = Column(String(50), default="India", nullable=False)
    state = Column(String(100), default="Odisha", nullable=True)
    state_code = Column(String(10), default="OD", nullable=True)
    district = Column(String(100), nullable=False)
    city = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=False)
    landmark = Column(String(150), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

    # Issue Details & Media
    description = Column(Text, nullable=True)
    media_urls = Column(JSON, nullable=True)  # List of photo URLs / file strings

    # Pricing (0% Platform Fee Guarantee)
    base_rate = Column(Float, default=0.0, nullable=False)
    extra_charges = Column(Float, default=0.0, nullable=False)
    total_amount = Column(Float, default=0.0, nullable=False)

    # Lifecycle Status & Verification
    status = Column(SQLEnum(BookingStatus), default=BookingStatus.REQUESTED, index=True, nullable=False)
    otp_code = Column(String(6), default="4819", nullable=False)
    otp_verified = Column(Boolean, default=False, nullable=False)

    # Exception Reasons
    decline_reason = Column(String(255), nullable=True)
    cancellation_reason = Column(String(255), nullable=True)
    dispute_reason = Column(String(255), nullable=True)

    # Feedback
    rating = Column(Float, nullable=True)
    review = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    customer = relationship("User", foreign_keys=[customer_id])
    scheduled_worker = relationship("User", foreign_keys=[scheduled_worker_id])
    actual_worker = relationship("User", foreign_keys=[actual_worker_id])
    status_history = relationship(
        "BookingStatusHistory",
        back_populates="booking",
        cascade="all, delete-orphan",
        order_by="BookingStatusHistory.created_at.asc()",
    )

    def __repr__(self):
        return f"<Booking ref='{self.booking_reference}' status='{self.status}' customer_id='{self.customer_id}'>"


class BookingStatusHistory(Base):
    __tablename__ = "booking_status_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String(36), ForeignKey("bookings.id"), index=True, nullable=False)

    from_status = Column(SQLEnum(BookingStatus), nullable=True)
    to_status = Column(SQLEnum(BookingStatus), nullable=False)

    changed_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    changed_by_name = Column(String(100), nullable=True)
    changed_by_role = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    booking = relationship("Booking", back_populates="status_history")

    def __repr__(self):
        return f"<BookingStatusHistory {self.from_status} -> {self.to_status} at {self.created_at}>"


class BookingWorkerLocation(Base):
    __tablename__ = "booking_worker_locations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String(36), ForeignKey("bookings.id", ondelete="CASCADE"), index=True, nullable=False)
    worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    heading = Column(Float, nullable=True)     # Degrees 0-360
    speed = Column(Float, nullable=True)       # Speed in km/h or m/s
    accuracy = Column(Float, nullable=True)    # GPS accuracy in meters

    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    booking = relationship("Booking", backref="worker_locations")
    worker = relationship("User", foreign_keys=[worker_id])

    def __repr__(self):
        return f"<BookingWorkerLocation booking='{self.booking_id}' worker='{self.worker_id}' lat={self.latitude} lng={self.longitude}>"


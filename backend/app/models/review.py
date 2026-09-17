import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Integer,
    Float,
    Text,
    ForeignKey,
    JSON,
    Enum as SQLEnum,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from app.database import Base


class ReviewerRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    WORKER = "WORKER"


class BadgeCategory(str, Enum):
    VERIFICATION = "VERIFICATION"
    PERFORMANCE = "PERFORMANCE"


class BadgeCode(str, Enum):
    # Verification Indicators
    IDENTITY_VERIFIED = "IDENTITY_VERIFIED"
    LICENCE_VERIFIED = "LICENCE_VERIFIED"
    SKILL_CERTIFIED = "SKILL_CERTIFIED"
    TRAINING_COMPLETED = "TRAINING_COMPLETED"

    # Performance Badges
    RISING_WORKER = "RISING_WORKER"
    TRUSTED_WORKER = "TRUSTED_WORKER"
    HIGHLY_RATED = "HIGHLY_RATED"
    SERVICE_CHAMPION = "SERVICE_CHAMPION"
    TOP_PROFESSIONAL = "TOP_PROFESSIONAL"


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String(36), ForeignKey("bookings.id"), index=True, nullable=False)
    reviewer_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    reviewee_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    reviewer_role = Column(SQLEnum(ReviewerRole), index=True, nullable=False)

    # Core Rating
    overall_rating = Column(Integer, nullable=False)  # 1 to 5

    # Customer -> Worker Rating Dimensions
    service_quality = Column(Integer, nullable=True)     # 1 to 5
    professionalism = Column(Integer, nullable=True)     # 1 to 5
    punctuality = Column(Integer, nullable=True)         # 1 to 5
    communication = Column(Integer, nullable=True)       # 1 to 5

    # Worker -> Customer Rating Dimensions
    politeness = Column(Integer, nullable=True)          # 1 to 5
    payment_promptness = Column(Integer, nullable=True)  # 1 to 5
    clear_instructions = Column(Integer, nullable=True)  # 1 to 5

    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Prevent duplicate rating for the same booking by the same reviewer
    __table_args__ = (
        UniqueConstraint("booking_id", "reviewer_id", name="uq_booking_reviewer"),
    )

    # Relationships
    booking = relationship("Booking", foreign_keys=[booking_id])
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    reviewee = relationship("User", foreign_keys=[reviewee_id])

    def __repr__(self):
        return f"<Review {self.id} booking={self.booking_id} role={self.reviewer_role} rating={self.overall_rating}>"


class WorkerBadge(Base):
    __tablename__ = "worker_badges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    badge_code = Column(SQLEnum(BadgeCode), index=True, nullable=False)
    badge_category = Column(SQLEnum(BadgeCategory), index=True, nullable=False)

    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=False)  # Lucide icon name, e.g. ShieldCheck, Star, Award
    criteria_met = Column(JSON, nullable=False)  # List of string bullet points explaining why earned

    is_active = Column(Boolean, default=True, nullable=False)
    awarded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    recalculated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("worker_id", "badge_code", name="uq_worker_badge"),
    )

    worker = relationship("User", foreign_keys=[worker_id])

    def __repr__(self):
        return f"<WorkerBadge {self.badge_code} worker={self.worker_id} active={self.is_active}>"

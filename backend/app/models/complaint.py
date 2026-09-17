import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
    JSON,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from app.database import Base


class ComplaintCategory(str, Enum):
    SERVICE_QUALITY = "SERVICE_QUALITY"
    WORKER_BEHAVIOUR = "WORKER_BEHAVIOUR"
    CUSTOMER_BEHAVIOUR = "CUSTOMER_BEHAVIOUR"
    PAYMENT = "PAYMENT"
    NO_SHOW = "NO_SHOW"
    DAMAGE = "DAMAGE"
    SAFETY = "SAFETY"
    INCORRECT_CHARGE = "INCORRECT_CHARGE"
    OTHER = "OTHER"


class ComplaintStatus(str, Enum):
    OPEN = "OPEN"
    UNDER_REVIEW = "UNDER_REVIEW"
    RESOLVED = "RESOLVED"
    ESCALATED = "ESCALATED"


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_reference = Column(String(50), unique=True, index=True, nullable=False)

    # Link to booking where applicable
    booking_id = Column(String(36), ForeignKey("bookings.id"), index=True, nullable=True)

    category = Column(SQLEnum(ComplaintCategory), index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(JSON, default=list, nullable=False)  # List of URLs or file descriptors

    # Complainant info
    created_by_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    created_by_role = Column(String(50), nullable=False)  # CUSTOMER, WORKER, INSTITUTION

    # Cooperative affiliation
    cooperative_code = Column(String(50), index=True, nullable=False)

    # Conciliation assignment & state
    assigned_to_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(SQLEnum(ComplaintStatus), default=ComplaintStatus.OPEN, index=True, nullable=False)

    # Resolution
    resolution_notes = Column(Text, nullable=True)
    resolved_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    # Escalation to State DPI Admin
    escalated_at = Column(DateTime, nullable=True)
    escalation_reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    booking = relationship("Booking", foreign_keys=[booking_id])
    created_by = relationship("User", foreign_keys=[created_by_id])
    assigned_to = relationship("User", foreign_keys=[assigned_to_id])
    resolved_by = relationship("User", foreign_keys=[resolved_by_id])
    actions = relationship("ComplaintActionHistory", back_populates="complaint", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Complaint {self.complaint_reference} status={self.status} category={self.category}>"


class ComplaintActionHistory(Base):
    __tablename__ = "complaint_action_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id"), index=True, nullable=False)
    actor_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    actor_name = Column(String(100), nullable=False)
    actor_role = Column(String(50), nullable=False)

    from_status = Column(SQLEnum(ComplaintStatus), nullable=True)
    to_status = Column(SQLEnum(ComplaintStatus), nullable=False)
    action = Column(String(100), nullable=False)  # FILED, UNDER_REVIEW, RESOLVED, ESCALATED, COMMENT_ADDED
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    complaint = relationship("Complaint", back_populates="actions")
    actor = relationship("User", foreign_keys=[actor_id])

    def __repr__(self):
        return f"<ComplaintActionHistory {self.action} on {self.complaint_id} by {self.actor_name}>"

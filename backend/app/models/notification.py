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
    Text,
)
from sqlalchemy.orm import relationship
from app.database import Base


class NotificationType(str, enum.Enum):
    JOB_REQUEST = "JOB_REQUEST"
    JOB_ACCEPTED = "JOB_ACCEPTED"
    WORKER_ON_THE_WAY = "WORKER_ON_THE_WAY"
    WORKER_ARRIVED = "WORKER_ARRIVED"
    JOB_COMPLETED = "JOB_COMPLETED"
    PAYMENT = "PAYMENT"
    REPLACEMENT = "REPLACEMENT"
    LEAVE = "LEAVE"
    COMPLAINT = "COMPLAINT"
    VERIFICATION = "VERIFICATION"
    SETTLEMENT = "SETTLEMENT"
    TRAINING = "TRAINING"
    SYSTEM = "SYSTEM"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(Enum(NotificationType), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    link_url = Column(String(512), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationships
    user = relationship("User", backref="notifications")


class UserDeviceToken(Base):
    """
    Stores FCM device push tokens securely on the server.
    """
    __tablename__ = "user_device_tokens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    fcm_token = Column(String(512), nullable=False, index=True)
    device_type = Column(String(32), default="web")  # "web", "android", "ios"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", backref="device_tokens")

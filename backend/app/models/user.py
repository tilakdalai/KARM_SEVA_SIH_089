import uuid
from datetime import datetime, timezone
from enum import Enum
from sqlalchemy import Column, String, Boolean, DateTime, Float, Enum as SQLEnum
from app.database import Base


class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    WORKER = "WORKER"
    COOPERATIVE_ADMIN = "COOPERATIVE_ADMIN"
    INSTITUTION = "INSTITUTION"
    SYSTEM_ADMIN = "SYSTEM_ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.CUSTOMER, index=True)

    profile_photo = Column(String(255), nullable=True)
    preferred_language = Column(String(10), default="en", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    # Worker-specific metadata
    shram_id = Column(String(50), unique=True, index=True, nullable=True)
    trade = Column(String(100), nullable=True)
    work_radius_km = Column(Float, default=4.0, nullable=True)
    cooperative_name = Column(String(150), nullable=True)

    # Customer & Institution metadata
    organization_name = Column(String(150), nullable=True)
    institution_type = Column(String(50), nullable=True)
    country = Column(String(50), default="India", nullable=False)
    state = Column(String(100), nullable=True)
    state_code = Column(String(10), nullable=True)
    district = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    pincode = Column(String(10), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<User id={self.id} name='{self.name}' phone='{self.phone}' role={self.role}>"

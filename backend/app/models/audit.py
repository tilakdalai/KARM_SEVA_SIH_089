import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, JSON, Boolean, Float, Integer, ForeignKey
from app.database import Base


class AuditLog(Base):
    """
    Audit log recording all sensitive administrative operations for accountability,
    compliance, and state labour board audits.
    """
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    admin_id = Column(String(36), nullable=True, index=True)
    admin_name = Column(String(100), nullable=True)
    cooperative_code = Column(String(50), nullable=True, index=True)
    action = Column(String(50), nullable=False, index=True)  # APPROVE_WORKER, REJECT_WORKER, REQUEST_CORRECTION, SUSPEND_WORKER, etc.
    target_type = Column(String(50), nullable=False)  # WORKER, SERVICE, SETTLEMENT, LEAVE
    target_id = Column(String(100), nullable=False, index=True)
    target_name = Column(String(150), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)


class CooperativeTradeService(Base):
    """
    Services and standardized baseline rates offered by the Labour Cooperative.
    """
    __tablename__ = "cooperative_trade_services"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cooperative_id = Column(String(50), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    trade = Column(String(100), nullable=False)
    base_price = Column(Float, nullable=False)
    duration_mins = Column(Integer, nullable=False, default=60)
    description = Column(Text, nullable=True)
    is_enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

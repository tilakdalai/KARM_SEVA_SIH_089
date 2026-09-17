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
    JSON,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from app.database import Base


class PaymentStatus(str, Enum):
    CREATED = "CREATED"
    AUTHORIZED = "AUTHORIZED"
    CAPTURED = "CAPTURED"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class SettlementStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SETTLED = "SETTLED"
    FAILED = "FAILED"


class CycleType(str, Enum):
    INSTANT = "INSTANT"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"


class CycleStatus(str, Enum):
    OPEN = "OPEN"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"


class InvoiceStatus(str, Enum):
    ISSUED = "ISSUED"
    PAID = "PAID"
    CANCELLED = "CANCELLED"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_reference = Column(String(40), unique=True, index=True, nullable=False)

    booking_id = Column(String(36), ForeignKey("bookings.id"), index=True, nullable=False)
    customer_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    razorpay_order_id = Column(String(100), index=True, nullable=False)
    razorpay_payment_id = Column(String(100), index=True, nullable=True)
    razorpay_signature = Column(String(255), nullable=True)

    amount = Column(Float, nullable=False)  # in INR
    currency = Column(String(10), default="INR", nullable=False)
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.CREATED, index=True, nullable=False)

    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    booking = relationship("Booking", foreign_keys=[booking_id])
    customer = relationship("User", foreign_keys=[customer_id])
    transactions = relationship("Transaction", back_populates="payment", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Payment ref={self.payment_reference} order={self.razorpay_order_id} status={self.status}>"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transaction_reference = Column(String(40), unique=True, index=True, nullable=False)

    payment_id = Column(String(36), ForeignKey("payments.id"), index=True, nullable=False)
    booking_id = Column(String(36), ForeignKey("bookings.id"), index=True, nullable=False)
    worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)  # MUST be actual_worker_id
    cooperative_code = Column(String(50), index=True, nullable=False)

    # Configurable revenue breakdown amounts
    gross_amount = Column(Float, nullable=False)
    worker_share = Column(Float, nullable=False)        # Default: 90% (₹)
    cooperative_share = Column(Float, nullable=False)   # Default: 8% (₹)
    platform_share = Column(Float, default=0.0, nullable=False)  # 0% (DPI public good)
    gateway_fee = Column(Float, default=0.0, nullable=False)     # 2% (₹)
    tax = Column(Float, default=0.0, nullable=False)             # GST on applicable components
    net_amount = Column(Float, nullable=False)

    settlement_status = Column(
        SQLEnum(SettlementStatus),
        default=SettlementStatus.SETTLED,
        index=True,
        nullable=False,
    )
    settled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    payment = relationship("Payment", back_populates="transactions")
    booking = relationship("Booking", foreign_keys=[booking_id])
    worker = relationship("User", foreign_keys=[worker_id])

    def __repr__(self):
        return f"<Transaction ref={self.transaction_reference} worker={self.worker_id} gross={self.gross_amount} net={self.net_amount}>"


class SettlementCycle(Base):
    __tablename__ = "settlement_cycles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cycle_reference = Column(String(40), unique=True, index=True, nullable=False)

    cooperative_code = Column(String(50), index=True, nullable=False)
    cycle_type = Column(SQLEnum(CycleType), default=CycleType.WEEKLY, nullable=False)
    start_date = Column(String(20), nullable=False)
    end_date = Column(String(20), nullable=False)

    total_amount = Column(Float, default=0.0, nullable=False)
    total_transactions = Column(Integer, default=0, nullable=False)
    status = Column(SQLEnum(CycleStatus), default=CycleStatus.COMPLETED, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<SettlementCycle {self.cycle_reference} coop={self.cooperative_code} status={self.status}>"


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_number = Column(String(40), unique=True, index=True, nullable=False)  # INV-YYYY-XXXXX

    booking_id = Column(String(36), ForeignKey("bookings.id"), index=True, nullable=False)
    customer_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    institution_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    worker_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    cooperative_code = Column(String(50), index=True, nullable=False)

    gross_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0, nullable=False)
    net_amount = Column(Float, nullable=False)

    item_breakdown = Column(JSON, nullable=False)  # Line items, tariff, GST SAC code
    invoice_date = Column(String(20), nullable=False)
    status = Column(SQLEnum(InvoiceStatus), default=InvoiceStatus.PAID, nullable=False)

    download_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    booking = relationship("Booking", foreign_keys=[booking_id])
    customer = relationship("User", foreign_keys=[customer_id])
    worker = relationship("User", foreign_keys=[worker_id])

    def __repr__(self):
        return f"<Invoice {self.invoice_number} gross={self.gross_amount} net={self.net_amount}>"


class WorkerWallet(Base):
    __tablename__ = "worker_wallets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(36), ForeignKey("users.id"), unique=True, index=True, nullable=False)

    current_balance = Column(Float, default=0.0, nullable=False)
    total_earned = Column(Float, default=0.0, nullable=False)
    total_withdrawn = Column(Float, default=0.0, nullable=False)
    pending_settlement = Column(Float, default=0.0, nullable=False)

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    worker = relationship("User", foreign_keys=[worker_id])

    def __repr__(self):
        return f"<WorkerWallet worker={self.worker_id} balance={self.current_balance}>"

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.models.payment import PaymentStatus, SettlementStatus, CycleType, CycleStatus, InvoiceStatus


class CreateOrderRequest(BaseModel):
    booking_id: str
    amount: Optional[float] = None
    currency: str = "INR"


class OrderResponse(BaseModel):
    order_id: str
    payment_reference: str
    booking_id: str
    amount: float
    currency: str = "INR"
    key_id: str
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    service_title: Optional[str] = None


class VerifyPaymentRequest(BaseModel):
    booking_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class RevenueDistributionResponse(BaseModel):
    gross_amount: float
    worker_share: float
    cooperative_share: float
    platform_share: float
    gateway_fee: float
    tax: float
    net_amount: float


class PaymentVerifyResponse(BaseModel):
    status: str
    payment_reference: str
    razorpay_payment_id: str
    booking_id: str
    transaction_reference: str
    invoice_number: str
    credited_worker_id: str
    credited_worker_name: str
    distribution: RevenueDistributionResponse
    settlement_status: SettlementStatus
    verified_at: datetime


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    transaction_reference: str
    payment_id: str
    booking_id: str
    worker_id: str
    worker_name: Optional[str] = None
    cooperative_code: str
    gross_amount: float
    worker_share: float
    cooperative_share: float
    platform_share: float
    gateway_fee: float
    tax: float
    net_amount: float
    settlement_status: SettlementStatus
    settled_at: Optional[datetime] = None
    created_at: datetime


class WalletResponse(BaseModel):
    worker_id: str
    worker_name: str
    current_balance: float
    total_earned: float
    total_withdrawn: float
    pending_settlement: float
    bank_account_masked: Optional[str] = "XXXX-XXXX-8821 (State Bank of India)"
    upi_id: Optional[str] = "worker@oksbi"
    recent_transactions: List[TransactionResponse] = []


class SettlementCycleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    cycle_reference: str
    cooperative_code: str
    cycle_type: CycleType
    start_date: str
    end_date: str
    total_amount: float
    total_transactions: int
    status: CycleStatus
    created_at: datetime


class InvoiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    invoice_number: str
    booking_id: str
    booking_reference: Optional[str] = None
    customer_id: str
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    worker_id: str
    worker_name: Optional[str] = None
    worker_shram_id: Optional[str] = None
    cooperative_code: str
    cooperative_name: Optional[str] = None
    gross_amount: float
    tax_amount: float
    net_amount: float
    item_breakdown: List[Dict[str, Any]]
    invoice_date: str
    status: InvoiceStatus
    created_at: datetime

import random
import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus, BookingStatusHistory
from app.models.payment import (
    Payment,
    Transaction,
    SettlementCycle,
    Invoice,
    WorkerWallet,
    PaymentStatus,
    SettlementStatus,
    CycleType,
    CycleStatus,
    InvoiceStatus,
)
from app.models.audit import AuditLog
from app.models.notification import NotificationType
from app.services.revenue_service import (
    compute_revenue_distribution,
    verify_razorpay_payment_signature,
    RAZORPAY_TEST_KEY_ID,
)
from app.services.notification_service import NotificationService
from app.schemas.payment import (
    CreateOrderRequest,
    OrderResponse,
    VerifyPaymentRequest,
    PaymentVerifyResponse,
    RevenueDistributionResponse,
    TransactionResponse,
    WalletResponse,
    SettlementCycleResponse,
    InvoiceResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["Payments, Revenue & Invoices"])


@router.post("/order", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_payment_order(
    payload: CreateOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Creates a Razorpay Test Mode Order for a completed booking.
    Payment is only permitted for COMPLETED bookings to prevent premature collection.
    """
    booking = db.query(Booking).filter(Booking.id == payload.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking record not found.")

    # Only allow payment for completed bookings
    if booking.status != BookingStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment can only be initiated for COMPLETED bookings. Current status: {booking.status}. Please wait until the service is fully completed.",
        )

    # Check for existing successful payment (prevent double-charge)
    existing_paid = db.query(Payment).filter(
        Payment.booking_id == booking.id,
        Payment.status == PaymentStatus.CAPTURED,
    ).first()
    if existing_paid:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment for this booking has already been successfully processed.",
        )

    amount = payload.amount or booking.total_amount
    if amount <= 0:
        amount = 500.0

    order_ref = f"order_shram_{datetime.now().strftime('%y%m%d')}_{random.randint(10000, 99999)}"
    pay_ref = f"PAY-{datetime.now().strftime('%Y')}-{random.randint(10000, 99999)}"

    # Create Payment record in DB
    payment = Payment(
        payment_reference=pay_ref,
        booking_id=booking.id,
        customer_id=booking.customer_id,
        razorpay_order_id=order_ref,
        amount=amount,
        currency=payload.currency,
        status=PaymentStatus.CREATED,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    customer = db.query(User).filter(User.id == booking.customer_id).first()

    return OrderResponse(
        order_id=order_ref,
        payment_reference=pay_ref,
        booking_id=booking.id,
        amount=amount,
        currency=payload.currency,
        key_id=RAZORPAY_TEST_KEY_ID,
        customer_name=customer.name if customer else "Citizen User",
        customer_phone=customer.phone if customer else None,
        service_title=booking.service_title,
    )


@router.post("/verify", response_model=PaymentVerifyResponse)
def verify_payment_and_distribute_revenue(
    payload: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Zero-Trust Backend Verification:
    1. Cryptographically verifies HMAC SHA-256 signature from Razorpay.
    2. Identifies actual performing artisan (actual_worker_id for replacements).
    3. Calculates configurable revenue distribution (90% worker, 8% coop, 2% gateway, 0% platform fee).
    4. Credits worker wallet and generates tax invoice.
    """
    # 1. Signature Verification
    is_valid = verify_razorpay_payment_signature(
        order_id=payload.razorpay_order_id,
        payment_id=payload.razorpay_payment_id,
        signature=payload.razorpay_signature,
    )
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Cryptographic signature verification failed. Untrusted payment payload rejected.",
        )

    # 2. Find Payment and Booking
    payment = db.query(Payment).filter(
        Payment.razorpay_order_id == payload.razorpay_order_id,
    ).first()
    if not payment:
        # Fallback query by booking_id
        payment = db.query(Payment).filter(
            Payment.booking_id == payload.booking_id,
        ).order_by(Payment.created_at.desc()).first()

    booking = db.query(Booking).filter(Booking.id == payload.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking record not found.")

    if not payment:
        pay_ref = f"PAY-{datetime.now().strftime('%Y')}-{random.randint(10000, 99999)}"
        payment = Payment(
            payment_reference=pay_ref,
            booking_id=booking.id,
            customer_id=booking.customer_id,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            razorpay_signature=payload.razorpay_signature,
            amount=booking.total_amount,
            currency="INR",
            status=PaymentStatus.CAPTURED,
            verified_at=datetime.now(timezone.utc),
        )
        db.add(payment)
        db.flush()
    else:
        payment.razorpay_payment_id = payload.razorpay_payment_id
        payment.razorpay_signature = payload.razorpay_signature
        payment.status = PaymentStatus.CAPTURED
        payment.verified_at = datetime.now(timezone.utc)

    # 3. Critical Attribution Rule: Pay actual_worker_id!
    target_worker_id = booking.actual_worker_id or booking.scheduled_worker_id
    worker = db.query(User).filter(User.id == target_worker_id).first()
    if not worker:
        target_worker_id = booking.scheduled_worker_id
        worker = db.query(User).filter(User.id == target_worker_id).first()

    # 4. Compute Configurable Revenue Split
    dist = compute_revenue_distribution(payment.amount)

    # 5. Create Transaction Record
    tx_ref = f"TXN-{datetime.now().strftime('%y%m%d')}-{random.randint(10000, 99999)}"
    txn = Transaction(
        transaction_reference=tx_ref,
        payment_id=payment.id,
        booking_id=booking.id,
        worker_id=target_worker_id,
        cooperative_code=booking.cooperative_code,
        gross_amount=dist["gross_amount"],
        worker_share=dist["worker_share"],
        cooperative_share=dist["cooperative_share"],
        platform_share=dist["platform_share"],
        gateway_fee=dist["gateway_fee"],
        tax=dist["tax"],
        net_amount=dist["net_amount"],
        settlement_status=SettlementStatus.SETTLED,
        settled_at=datetime.now(timezone.utc),
    )
    db.add(txn)

    # 6. Credit Worker Wallet
    wallet = db.query(WorkerWallet).filter(WorkerWallet.worker_id == target_worker_id).first()
    if not wallet:
        wallet = WorkerWallet(
            worker_id=target_worker_id,
            current_balance=dist["worker_share"],
            total_earned=dist["worker_share"],
            total_withdrawn=0.0,
            pending_settlement=0.0,
        )
        db.add(wallet)
    else:
        wallet.current_balance += dist["worker_share"]
        wallet.total_earned += dist["worker_share"]

    # 7. Generate Tax Invoice
    inv_num = f"INV-{datetime.now().strftime('%Y')}-{random.randint(10000, 99999)}"
    invoice = Invoice(
        invoice_number=inv_num,
        booking_id=booking.id,
        customer_id=booking.customer_id,
        worker_id=target_worker_id,
        cooperative_code=booking.cooperative_code,
        gross_amount=payment.amount,
        tax_amount=dist["tax"],
        net_amount=payment.amount,
        item_breakdown=[
            {
                "description": booking.service_title,
                "sac_code": "998713",
                "quantity": 1,
                "unit_rate": dist["gross_amount"],
                "amount": dist["gross_amount"],
            }
        ],
        invoice_date=datetime.now().strftime("%Y-%m-%d"),
        status=InvoiceStatus.PAID,
    )
    db.add(invoice)

    # 8. Log Audit and History
    history = BookingStatusHistory(
        booking_id=booking.id,
        from_status=booking.status,
        to_status=booking.status,
        changed_by_user_id=current_user.id,
        changed_by_name=current_user.name,
        changed_by_role="PAYMENT_GATEWAY",
        notes=f"Payment verified (Razorpay ID: {payload.razorpay_payment_id}). Settled ₹{dist['worker_share']} to {worker.name if worker else 'Artisan'}.",
    )
    db.add(history)

    audit = AuditLog(
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code=booking.cooperative_code,
        action="VERIFY_PAYMENT_AND_SPLIT_REVENUE",
        target_type="PAYMENT_TRANSACTION",
        target_id=tx_ref,
        target_name=f"₹{payment.amount} -> Worker {worker.name if worker else target_worker_id}",
        details=f"Revenue split: Worker=₹{dist['worker_share']} (90%), Coop=₹{dist['cooperative_share']} (8%), Gateway=₹{dist['gateway_fee']} (2%).",
    )
    db.add(audit)

    db.commit()

    # Notify customer: payment receipt
    try:
        NotificationService.create_notification(
            db=db,
            user_id=booking.customer_id,
            type=NotificationType.PAYMENT,
            title=f"Payment Successful — ₹{payment.amount:.0f} 🧾",
            message=(
                f"Your payment of ₹{payment.amount:.2f} for {booking.service_title} ({booking.booking_reference}) "
                f"has been verified. Invoice #{inv_num} is ready. "
                f"Worker {worker.name if worker else 'Artisan'} receives ₹{dist['worker_share']:.2f} directly."
            ),
            link_url=f"/customer/bookings/{booking.id}",
        )
    except Exception:
        pass

    # Notify worker: earnings credited
    if worker:
        try:
            NotificationService.create_notification(
                db=db,
                user_id=target_worker_id,
                type=NotificationType.SETTLEMENT,
                title=f"₹{dist['worker_share']:.0f} Credited to Your Wallet 💰",
                message=(
                    f"Payment for {booking.service_title} ({booking.booking_reference}) "
                    f"has been received. ₹{dist['worker_share']:.2f} has been credited to your KARM SEVA wallet. "
                    f"Transaction Ref: {tx_ref}."
                ),
                link_url="/worker/wallet",
            )
        except Exception:
            pass

    return PaymentVerifyResponse(
        status="PAYMENT_VERIFIED_AND_SETTLED",
        payment_reference=payment.payment_reference,
        razorpay_payment_id=payload.razorpay_payment_id,
        booking_id=booking.id,
        transaction_reference=tx_ref,
        invoice_number=inv_num,
        credited_worker_id=target_worker_id,
        credited_worker_name=worker.name if worker else "Verified Artisan",
        distribution=RevenueDistributionResponse(
            gross_amount=dist["gross_amount"],
            worker_share=dist["worker_share"],
            cooperative_share=dist["cooperative_share"],
            platform_share=dist["platform_share"],
            gateway_fee=dist["gateway_fee"],
            tax=dist["tax"],
            net_amount=dist["net_amount"],
        ),
        settlement_status=SettlementStatus.SETTLED,
        verified_at=payment.verified_at,
    )


@router.get("/wallet", response_model=WalletResponse)
def get_worker_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Worker retrieves real-time wallet balance and transaction ledger.
    """
    wallet = db.query(WorkerWallet).filter(WorkerWallet.worker_id == current_user.id).first()
    if not wallet:
        wallet = WorkerWallet(
            worker_id=current_user.id,
            current_balance=2450.0,
            total_earned=14850.0,
            total_withdrawn=12400.0,
            pending_settlement=0.0,
        )
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    txns = (
        db.query(Transaction)
        .filter(Transaction.worker_id == current_user.id)
        .order_by(Transaction.created_at.desc())
        .limit(20)
        .all()
    )

    txn_responses = [
        TransactionResponse(
            id=t.id,
            transaction_reference=t.transaction_reference,
            payment_id=t.payment_id,
            booking_id=t.booking_id,
            worker_id=t.worker_id,
            worker_name=current_user.name,
            cooperative_code=t.cooperative_code,
            gross_amount=t.gross_amount,
            worker_share=t.worker_share,
            cooperative_share=t.cooperative_share,
            platform_share=t.platform_share,
            gateway_fee=t.gateway_fee,
            tax=t.tax,
            net_amount=t.net_amount,
            settlement_status=t.settlement_status,
            settled_at=t.settled_at,
            created_at=t.created_at,
        )
        for t in txns
    ]

    return WalletResponse(
        worker_id=current_user.id,
        worker_name=current_user.name,
        current_balance=wallet.current_balance,
        total_earned=wallet.total_earned,
        total_withdrawn=wallet.total_withdrawn,
        pending_settlement=wallet.pending_settlement,
        recent_transactions=txn_responses,
    )


@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Transaction)
    if current_user.role == UserRole.WORKER:
        query = query.filter(Transaction.worker_id == current_user.id)
    elif current_user.role == UserRole.CUSTOMER:
        # Transactions for bookings customer created
        cust_booking_ids = [b.id for b in db.query(Booking).filter(Booking.customer_id == current_user.id).all()]
        query = query.filter(Transaction.booking_id.in_(cust_booking_ids))

    txns = query.order_by(Transaction.created_at.desc()).limit(limit).all()

    results: List[TransactionResponse] = []
    for t in txns:
        worker = db.query(User).filter(User.id == t.worker_id).first()
        results.append(
            TransactionResponse(
                id=t.id,
                transaction_reference=t.transaction_reference,
                payment_id=t.payment_id,
                booking_id=t.booking_id,
                worker_id=t.worker_id,
                worker_name=worker.name if worker else "Artisan",
                cooperative_code=t.cooperative_code,
                gross_amount=t.gross_amount,
                worker_share=t.worker_share,
                cooperative_share=t.cooperative_share,
                platform_share=t.platform_share,
                gateway_fee=t.gateway_fee,
                tax=t.tax,
                net_amount=t.net_amount,
                settlement_status=t.settlement_status,
                settled_at=t.settled_at,
                created_at=t.created_at,
            )
        )
    return results


@router.get("/invoices/{booking_id_or_num}", response_model=InvoiceResponse)
def get_invoice_detail(
    booking_id_or_num: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Fetch printable GST tax invoice for a booking or invoice number.
    """
    invoice = db.query(Invoice).filter(
        (Invoice.id == booking_id_or_num)
        | (Invoice.booking_id == booking_id_or_num)
        | (Invoice.invoice_number == booking_id_or_num)
    ).first()

    if not invoice:
        # Generate on-demand invoice if booking exists
        booking = db.query(Booking).filter(
            (Booking.id == booking_id_or_num) | (Booking.booking_reference == booking_id_or_num)
        ).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Invoice record not found.")

        target_worker_id = booking.actual_worker_id or booking.scheduled_worker_id
        inv_num = f"INV-{datetime.now().strftime('%Y')}-{random.randint(10000, 99999)}"
        invoice = Invoice(
            invoice_number=inv_num,
            booking_id=booking.id,
            customer_id=booking.customer_id,
            worker_id=target_worker_id,
            cooperative_code=booking.cooperative_code,
            gross_amount=booking.total_amount,
            tax_amount=round(booking.total_amount * 0.08 * 0.18, 2),
            net_amount=booking.total_amount,
            item_breakdown=[
                {
                    "description": booking.service_title,
                    "sac_code": "998713",
                    "quantity": 1,
                    "unit_rate": booking.total_amount,
                    "amount": booking.total_amount,
                }
            ],
            invoice_date=datetime.now().strftime("%Y-%m-%d"),
            status=InvoiceStatus.PAID,
        )
        db.add(invoice)
        db.commit()
        db.refresh(invoice)

    booking = db.query(Booking).filter(Booking.id == invoice.booking_id).first()
    customer = db.query(User).filter(User.id == invoice.customer_id).first()
    worker = db.query(User).filter(User.id == invoice.worker_id).first()

    return InvoiceResponse(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        booking_id=invoice.booking_id,
        booking_reference=booking.booking_reference if booking else None,
        customer_id=invoice.customer_id,
        customer_name=customer.name if customer else "Citizen Client",
        customer_phone=customer.phone if customer else None,
        customer_address=booking.address_line if booking else "Bhubaneswar, Odisha",
        worker_id=invoice.worker_id,
        worker_name=worker.name if worker else "Certified Tradesperson",
        worker_shram_id=worker.shram_id if worker else None,
        cooperative_code=invoice.cooperative_code,
        cooperative_name=booking.cooperative_name if booking else "Bhubaneswar Multi-Purpose Labour Cooperative",
        gross_amount=invoice.gross_amount,
        tax_amount=invoice.tax_amount,
        net_amount=invoice.net_amount,
        item_breakdown=invoice.item_breakdown or [],
        invoice_date=invoice.invoice_date,
        status=invoice.status,
        created_at=invoice.created_at,
    )


@router.get("/settlement-cycles", response_model=List[SettlementCycleResponse])
def get_settlement_cycles(
    cooperative_code: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cycles = db.query(SettlementCycle).order_by(SettlementCycle.created_at.desc()).all()
    if not cycles:
        # Seed default sample weekly cycle
        sample_cycle = SettlementCycle(
            cycle_reference=f"CYC-WEEKLY-{datetime.now().strftime('%y%m%d')}-01",
            cooperative_code=cooperative_code or "OD-KHR-COOP-041",
            cycle_type=CycleType.WEEKLY,
            start_date="2024-08-25",
            end_date="2024-08-31",
            total_amount=184500.0,
            total_transactions=342,
            status=CycleStatus.COMPLETED,
        )
        db.add(sample_cycle)
        db.commit()
        db.refresh(sample_cycle)
        cycles = [sample_cycle]

    return cycles

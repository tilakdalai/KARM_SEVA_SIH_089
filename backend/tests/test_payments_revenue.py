import uuid
import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus, BookingType
from app.models.payment import Payment, PaymentStatus, WorkerWallet, Transaction, Invoice
from app.services.revenue_service import (
    compute_revenue_distribution,
    generate_razorpay_test_signature,
    RevenueConfig,
)


@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c


def get_token(client, phone_or_email: str, password: str = "password123") -> str:
    resp = client.post(
        "/api/v1/auth/login",
        json={"credential": phone_or_email, "password": password},
    )
    assert resp.status_code == 200, f"Login failed: {resp.json()}"
    return resp.json()["data"]["access_token"]


def test_revenue_distribution_mathematics():
    """Verify configurable revenue distribution mathematical correctness."""
    # Standard ₹1000 booking with default 90/8/2/0 split
    dist = compute_revenue_distribution(1000.0)
    assert dist["gross_amount"] == 1000.0
    assert dist["gateway_fee"] == 20.0        # 2%
    assert dist["cooperative_share"] == 80.0  # 8%
    assert dist["platform_share"] == 0.0     # 0% DPI model
    assert dist["worker_share"] == 900.0      # 90% direct to artisan
    assert dist["tax"] == round(80.0 * 0.18, 2)  # 18% GST on non-worker fees

    # Custom configuration e.g. 92% worker, 6% coop, 2% gateway
    custom_cfg = RevenueConfig(
        worker_share_pct=92.0,
        cooperative_share_pct=6.0,
        platform_share_pct=0.0,
        gateway_fee_pct=2.0,
        gst_rate_pct=18.0,
    )
    custom_dist = compute_revenue_distribution(1500.0, custom_cfg)
    assert custom_dist["gross_amount"] == 1500.0
    assert custom_dist["gateway_fee"] == 30.0   # 2% of 1500
    assert custom_dist["cooperative_share"] == 90.0  # 6% of 1500
    assert custom_dist["worker_share"] == 1380.0  # 92% of 1500


def test_create_razorpay_order_flow(client):
    """Test Razorpay order creation on backend."""
    token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    booking = Booking(
        booking_reference=f"BK-PAY-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        service_id="srv-elec-01",
        service_title="Master Electrician",
        service_category="Electrician",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="10:00 AM - 12:00 PM",
        address_line="12 Janpath, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=600.0,
        status=BookingStatus.COMPLETED,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    b_id = booking.id
    db.close()

    res = client.post(
        "/api/v1/payments/order",
        json={"booking_id": b_id, "amount": 600.0, "currency": "INR"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["booking_id"] == b_id
    assert data["amount"] == 600.0
    assert "order_shram_" in data["order_id"]
    assert "PAY-" in data["payment_reference"]
    assert data["key_id"] is not None


def test_zero_trust_signature_verification_success(client):
    """Test authentic HMAC SHA-256 signature verification and revenue split crediting."""
    token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    booking = Booking(
        booking_reference=f"BK-PAY-VERIFY-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        service_id="srv-elec-01",
        service_title="Master Electrician",
        service_category="Electrician",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="10:00 AM - 12:00 PM",
        address_line="12 Janpath, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=500.0,
        status=BookingStatus.COMPLETED,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    b_id = booking.id
    w_id = worker.id
    db.close()

    # 1. Create order
    order_res = client.post(
        "/api/v1/payments/order",
        json={"booking_id": b_id, "amount": 500.0},
        headers={"Authorization": f"Bearer {token}"},
    )
    order_id = order_res.json()["order_id"]
    payment_id = f"pay_rzp_test_{uuid.uuid4().hex[:8]}"

    # 2. Generate valid test HMAC SHA-256 signature
    valid_sig = generate_razorpay_test_signature(order_id, payment_id)

    # 3. Verify on backend
    verify_res = client.post(
        "/api/v1/payments/verify",
        json={
            "booking_id": b_id,
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": valid_sig,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert verify_res.status_code == 200
    vdata = verify_res.json()
    assert vdata["status"] == "PAYMENT_VERIFIED_AND_SETTLED"
    assert vdata["credited_worker_id"] == w_id
    assert vdata["distribution"]["gross_amount"] == 500.0
    assert vdata["distribution"]["worker_share"] == 450.0  # 90%
    assert vdata["distribution"]["cooperative_share"] == 40.0  # 8%
    assert vdata["distribution"]["gateway_fee"] == 10.0  # 2%
    assert "INV-" in vdata["invoice_number"]

    # Verify worker wallet was credited
    db2 = SessionLocal()
    wallet = db2.query(WorkerWallet).filter(WorkerWallet.worker_id == w_id).first()
    assert wallet is not None
    assert wallet.current_balance >= 450.0
    db2.close()


def test_tampered_signature_rejected_by_zero_trust(client):
    """Test that forged or tampered signatures are strictly rejected with 400."""
    token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    booking = Booking(
        booking_reference=f"BK-TAMPER-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        service_id="srv-elec-01",
        service_title="Master Electrician",
        service_category="Electrician",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="10:00 AM - 12:00 PM",
        address_line="12 Janpath, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=500.0,
        status=BookingStatus.COMPLETED,
    )
    db.add(booking)
    db.commit()
    b_id = booking.id
    db.close()

    tampered_sig = "deadbeef_fake_signature_1234567890"

    verify_res = client.post(
        "/api/v1/payments/verify",
        json={
            "booking_id": b_id,
            "razorpay_order_id": "order_shram_fake_001",
            "razorpay_payment_id": "pay_fake_001",
            "razorpay_signature": tampered_sig,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert verify_res.status_code == 400
    assert "verification failed" in verify_res.json()["message"].lower()


def test_actual_replacement_worker_credited_instead_of_scheduled(client):
    """
    CRITICAL ATTRIBUTION TEST:
    Verify that when scheduled_worker is unavailable, payment is 100% credited
    to actual_worker_id (the substitute artisan who actually did the work).
    """
    token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()
    scheduled_worker = db.query(User).filter(User.role == UserRole.WORKER).first()

    from app.utils.security import get_password_hash
    repl_phone = f"9988{uuid.uuid4().hex[:6]}"
    repl_user = User(
        phone=repl_phone,
        email=f"substitute_{uuid.uuid4().hex[:6]}@shramsetu.gov.in",
        name="Manas Ranjan (Substitute Artisan)",
        role=UserRole.WORKER,
        shram_id=f"SHRAM-OD-2024-REPL{uuid.uuid4().hex[:4]}",
        password_hash=get_password_hash("password123"),
    )
    db.add(repl_user)
    db.commit()
    db.refresh(repl_user)

    booking = Booking(
        booking_reference=f"BK-REPLACE-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=scheduled_worker.id,
        actual_worker_id=repl_user.id,  # Substitute performed the job
        replacement_for_worker_id=scheduled_worker.id,
        is_replacement=True,
        service_id="srv-plumb-01",
        service_title="Senior Plumber",
        service_category="Plumber",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="02:00 PM - 04:00 PM",
        address_line="Forest Park, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=800.0,
        status=BookingStatus.COMPLETED,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    b_id = booking.id
    repl_id = repl_user.id
    db.close()

    order_id = f"order_shram_repl_{uuid.uuid4().hex[:6]}"
    payment_id = f"pay_rzp_repl_{uuid.uuid4().hex[:6]}"
    sig = generate_razorpay_test_signature(order_id, payment_id)

    verify_res = client.post(
        "/api/v1/payments/verify",
        json={
            "booking_id": b_id,
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": sig,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert verify_res.status_code == 200
    vdata = verify_res.json()
    # Payout attributed to replacement worker!
    assert vdata["credited_worker_id"] == repl_id
    assert vdata["distribution"]["gross_amount"] == 800.0
    assert vdata["distribution"]["worker_share"] == 720.0  # 90% of 800

    # Wallet check on replacement worker
    db2 = SessionLocal()
    wallet = db2.query(WorkerWallet).filter(WorkerWallet.worker_id == repl_id).first()
    assert wallet is not None
    assert wallet.current_balance == 720.0
    db2.close()


def test_invoice_and_settlement_cycles_endpoints(client):
    """Test invoice lookup and cooperative weekly settlement cycles report."""
    cust_token = get_token(client, "citizen@shramsetu.gov.in")
    db = SessionLocal()
    worker = db.query(User).filter(User.role == UserRole.WORKER).first()
    customer = db.query(User).filter(User.email == "citizen@shramsetu.gov.in").first()

    booking = Booking(
        booking_reference=f"BK-INV-{uuid.uuid4().hex[:8]}",
        customer_id=customer.id,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        service_id="srv-elec-01",
        service_title="Master Electrician",
        service_category="Electrician",
        cooperative_code="OD-KHR-COOP-041",
        cooperative_name="Bhubaneswar Multi-Purpose Labour Cooperative",
        booking_type=BookingType.ONE_TIME,
        scheduled_date="2024-09-05",
        time_slot="10:00 AM - 12:00 PM",
        address_line="12 Janpath, Bhubaneswar",
        district="Khordha",
        pincode="751001",
        total_amount=550.0,
        status=BookingStatus.COMPLETED,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    b_id = booking.id
    db.close()

    # Fetch invoice
    inv_res = client.get(
        f"/api/v1/payments/invoices/{b_id}",
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert inv_res.status_code == 200
    inv = inv_res.json()
    assert inv["gross_amount"] == 550.0
    assert "INV-" in inv["invoice_number"]
    assert len(inv["item_breakdown"]) > 0

    # Fetch settlement cycles
    coop_token = get_token(client, "coop@shramsetu.gov.in")
    cyc_res = client.get(
        "/api/v1/payments/settlement-cycles?cooperative_code=OD-KHR-COOP-041",
        headers={"Authorization": f"Bearer {coop_token}"},
    )
    assert cyc_res.status_code == 200
    cycles = cyc_res.json()
    assert len(cycles) > 0
    assert cycles[0]["cycle_type"] == "WEEKLY"

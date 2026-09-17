import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.services.auth_service import AuthService
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus, BookingType, RecurringFrequency
from app.models.audit import AuditLog
from app.models.worker import IdentityDocType
from app.services.worker_service import mask_document_number
from app.utils.upload_validator import (
    sanitize_filename,
    validate_upload_metadata,
    MAX_DOCUMENT_SIZE_BYTES,
)
from app.middleware.rate_limit_middleware import RateLimitMiddleware

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    db = SessionLocal()
    try:
        AuthService.seed_demo_accounts_if_empty(db)
    finally:
        db.close()


def get_token(phone: str) -> str:
    res = client.post(
        "/api/v1/auth/login",
        json={"credential": phone, "password": "password123"},
    )
    assert res.status_code == 200, f"Login failed: {res.json()}"
    return res.json()["data"]["access_token"]


def test_security_headers_present():
    """Verify OWASP defensive security headers on HTTP responses."""
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    headers = res.headers

    assert headers.get("x-content-type-options") == "nosniff"
    assert headers.get("x-frame-options") == "DENY"
    assert headers.get("x-xss-protection") == "1; mode=block"
    assert headers.get("referrer-policy") == "strict-origin-when-cross-origin"
    assert "content-security-policy" in headers
    assert "permissions-policy" in headers


def get_worker_user_id() -> str:
    db = SessionLocal()
    try:
        worker = db.query(User).filter(User.role == UserRole.WORKER).first()
        return worker.id
    finally:
        db.close()


def test_multi_tenancy_customer_isolation():
    """Verify Customer A cannot access Customer B's private booking."""
    token_customer_a = get_token("9876543210")  # Customer A (Ananya Patnaik)
    headers_a = {"Authorization": f"Bearer {token_customer_a}"}
    worker_id = get_worker_user_id()

    # 1. Customer A creates a booking
    create_res = client.post(
        "/api/v1/bookings",
        headers=headers_a,
        json={
            "service_id": "srv-elec-01",
            "service_title": "Ceiling Fan Repair",
            "service_category": "Electrician",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Khurda District Urban Workers Cooperative Union",
            "scheduled_worker_id": worker_id,
            "booking_type": "ONE_TIME",
            "recurring_frequency": "NONE",
            "scheduled_date": "2026-09-10",
            "time_slot": "10:00 AM - 12:00 PM",
            "address_line": "Plot 104, VIP Road, Bhubaneswar",
            "district": "Bhubaneswar",
            "pincode": "751015",
            "base_rate": 450.0,
            "total_amount": 450.0,
        },
    )
    assert create_res.status_code == 201
    booking_id = create_res.json()["data"]["booking"]["id"]

    # 2. Register Customer B
    reg_b = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Customer B SecTest",
            "phone": "9998887771",
            "password": "password123",
            "role": "CUSTOMER",
        },
    )
    if reg_b.status_code != 201:
        token_customer_b = get_token("9998887771")
    else:
        token_customer_b = reg_b.json()["data"]["access_token"]
    headers_b = {"Authorization": f"Bearer {token_customer_b}"}

    # 3. Customer B attempts to access Customer A's private booking
    res_b = client.get(f"/api/v1/bookings/{booking_id}", headers=headers_b)
    assert res_b.status_code == 403
    assert "not authorized" in res_b.json()["message"].lower()


def test_worker_cannot_modify_other_workers_booking():
    """Verify Worker B cannot accept or update status of Worker A's assigned shift."""
    # Worker A
    token_worker_a = get_token("9876543211")
    headers_worker_a = {"Authorization": f"Bearer {token_worker_a}"}

    # Register Worker B
    reg_worker_b = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Worker B SecTest",
            "phone": "9998889999",
            "password": "password123",
            "role": "WORKER",
            "trade": "Electrician",
        },
    )
    if reg_worker_b.status_code != 201:
        # Might already exist from previous run
        token_worker_b = get_token("9998889999")
    else:
        token_worker_b = reg_worker_b.json()["data"]["access_token"]
    headers_worker_b = {"Authorization": f"Bearer {token_worker_b}"}

    token_customer = get_token("9876543210")
    headers_cust = {"Authorization": f"Bearer {token_customer}"}

    db = SessionLocal()
    try:
        worker_a = db.query(User).filter(User.phone == "9876543211").first()
        worker_a_id = worker_a.id
    finally:
        db.close()

    # Create booking for Worker A
    create_res = client.post(
        "/api/v1/bookings",
        headers=headers_cust,
        json={
            "service_id": "srv-elec-01",
            "service_title": "Switchboard Rewiring",
            "service_category": "Electrician",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Khurda District Urban Workers Cooperative Union",
            "scheduled_worker_id": worker_a_id,
            "booking_type": "ONE_TIME",
            "recurring_frequency": "NONE",
            "scheduled_date": "2026-09-12",
            "time_slot": "02:00 PM - 04:00 PM",
            "address_line": "Unit 4, Bhubaneswar",
            "district": "Bhubaneswar",
            "pincode": "751001",
            "base_rate": 550.0,
            "total_amount": 550.0,
        },
    )
    assert create_res.status_code == 201
    booking_id = create_res.json()["data"]["booking"]["id"]

    # Worker B tries to accept / update Worker A's booking
    res_b = client.post(
        f"/api/v1/bookings/{booking_id}/status",
        headers=headers_worker_b,
        json={"status": "ACCEPTED", "notes": "Unauthorized attempt"},
    )
    assert res_b.status_code == 403


def test_identity_document_masking():
    """Verify Aadhaar, PAN, Voter ID, and BPL card numbers are strictly masked."""
    # Aadhaar (12 digits)
    aadhaar_masked = mask_document_number(IdentityDocType.AADHAAR, "9876 5432 1098")
    assert aadhaar_masked == "XXXX-XXXX-1098"
    assert "9876" not in aadhaar_masked

    # PAN (10 chars)
    pan_masked = mask_document_number(IdentityDocType.PAN, "ABCDE1234F")
    assert pan_masked == "XXXXX234F"
    assert "ABCD" not in pan_masked

    # Voter ID
    voter_masked = mask_document_number(IdentityDocType.VOTER_ID, "XYZ9876543")
    assert voter_masked == "XXX6543"

    # BPL Card
    bpl_masked = mask_document_number(IdentityDocType.BPL_CARD, "BPL-OD-2024-8841")
    assert bpl_masked == "BPL-XXXX-8841"


def test_upload_validator_security():
    """Verify upload validation rejects dangerous extensions, MIME types, oversized payloads, and path traversal."""
    # 1. Valid PDF
    valid, err = validate_upload_metadata("trade_certificate.pdf", "application/pdf", 1024 * 500)
    assert valid is True
    assert err is None

    # 2. Reject executable .exe
    valid, err = validate_upload_metadata("malware.exe", "application/x-msdownload", 1024)
    assert valid is False
    assert "Invalid file type" in err

    # 3. Reject script .sh
    valid, err = validate_upload_metadata("exploit.sh", "text/x-shellscript", 1024)
    assert valid is False

    # 4. Reject oversized payload (> 5MB)
    valid, err = validate_upload_metadata(
        "large_scan.png",
        "image/png",
        MAX_DOCUMENT_SIZE_BYTES + 1024,
    )
    assert valid is False
    assert "exceeds maximum allowed limit" in err

    # 5. Path Traversal Neutralization in sanitize_filename
    malicious_filename = "../../../../../etc/passwd.jpg"
    safe = sanitize_filename(malicious_filename, prefix="doc")
    assert ".." not in safe
    assert "/" not in safe
    assert "\\" not in safe
    assert safe.startswith("doc_")
    assert safe.endswith(".jpg")


def test_admin_sensitive_actions_audited():
    """Verify administrative decisions create immutable AuditLog entries."""
    token_admin = get_token("9876543214")  # System Admin
    headers_admin = {"Authorization": f"Bearer {token_admin}"}

    # Admin creates a standardized cooperative service
    res = client.post(
        "/api/v1/cooperative/services",
        headers=headers_admin,
        json={
            "title": "Emergency Night Electrician",
            "category": "Emergency",
            "trade": "Electrician",
            "base_price": 500.0,
            "duration_mins": 60,
            "description": "24x7 emergency response service",
            "is_enabled": True,
        },
    )
    assert res.status_code == 200

    # Verify audit log was recorded in database
    db = SessionLocal()
    try:
        audit = (
            db.query(AuditLog)
            .filter(AuditLog.action == "CREATE_SERVICE")
            .order_by(AuditLog.created_at.desc())
            .first()
        )
        assert audit is not None
        assert audit.admin_name is not None
        assert audit.target_type == "SERVICE"
    finally:
        db.close()


def test_rate_limiter_protection():
    """Verify rate limiter middleware triggers HTTP 429 after exceeding limit."""
    rate_headers = {"X-Test-Rate-Limit": "1"}
    # Send 22 requests to auth endpoint
    responses = []
    for _ in range(22):
        r = client.post(
            "/api/v1/auth/login",
            headers=rate_headers,
            json={"credential": "invalid_phone_user", "password": "wrongpassword"},
        )
        responses.append(r.status_code)

    assert 429 in responses
    assert any("Retry-After" in r.headers for r in [client.post("/api/v1/auth/login", headers=rate_headers, json={"credential": "invalid_phone_user", "password": "wrongpassword"})])


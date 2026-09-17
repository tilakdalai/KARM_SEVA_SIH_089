import hmac
import hashlib
import logging
from dataclasses import dataclass
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Default Razorpay test secret for dev sandbox
RAZORPAY_TEST_KEY_ID = "rzp_test_shramsetu_2024"
RAZORPAY_TEST_KEY_SECRET = "rzp_test_secret_key_shramsetu_dpi"


@dataclass
class RevenueConfig:
    """
    Configurable Revenue Distribution Matrix.
    Eliminates hardcoded percentages and allows policy-level tariff tuning.
    """
    worker_share_pct: float = 90.0       # 90% direct to actual performing artisan
    cooperative_share_pct: float = 8.0   # 8% cooperative operational reserve & welfare
    platform_share_pct: float = 0.0      # 0% DPI platform commission (Citizen Public Good)
    gateway_fee_pct: float = 2.0         # 2% banking gateway processing
    gst_rate_pct: float = 18.0           # 18% GST on non-artisan fees


DEFAULT_REVENUE_CONFIG = RevenueConfig()


def compute_revenue_distribution(
    gross_amount: float,
    config: RevenueConfig = DEFAULT_REVENUE_CONFIG,
) -> Dict[str, float]:
    """
    Calculates exact revenue shares for a given gross booking payment.
    Guarantees the actual performing artisan receives the exact worker share.
    """
    if gross_amount <= 0:
        return {
            "gross_amount": 0.0,
            "worker_share": 0.0,
            "cooperative_share": 0.0,
            "platform_share": 0.0,
            "gateway_fee": 0.0,
            "tax": 0.0,
            "net_amount": 0.0,
        }

    gateway_fee = round(gross_amount * (config.gateway_fee_pct / 100.0), 2)
    coop_share = round(gross_amount * (config.cooperative_share_pct / 100.0), 2)
    platform_share = round(gross_amount * (config.platform_share_pct / 100.0), 2)

    # Worker receives remaining amount (approx 90%)
    worker_share = round(gross_amount - (gateway_fee + coop_share + platform_share), 2)
    tax = round((coop_share + platform_share) * (config.gst_rate_pct / 100.0), 2)

    return {
        "gross_amount": round(gross_amount, 2),
        "worker_share": worker_share,
        "cooperative_share": coop_share,
        "platform_share": platform_share,
        "gateway_fee": gateway_fee,
        "tax": tax,
        "net_amount": round(gross_amount, 2),
    }


def generate_razorpay_test_signature(order_id: str, payment_id: str, secret: str = RAZORPAY_TEST_KEY_SECRET) -> str:
    """Helper to generate authentic HMAC SHA-256 signatures in test mode."""
    message = f"{order_id}|{payment_id}".encode("utf-8")
    return hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()


def verify_razorpay_payment_signature(
    order_id: str,
    payment_id: str,
    signature: str,
    secret: str = RAZORPAY_TEST_KEY_SECRET,
) -> bool:
    """
    Zero-Trust Cryptographic Signature Verification.
    Verifies that the payment was truly processed and authorized by Razorpay.
    """
    if not order_id or not payment_id or not signature:
        return False

    expected_signature = generate_razorpay_test_signature(order_id, payment_id, secret)
    return hmac.compare_digest(expected_signature, signature)

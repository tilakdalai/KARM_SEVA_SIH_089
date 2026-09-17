import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User, UserRole
from app.models.notification import Notification, NotificationType, UserDeviceToken
from app.services.auth_service import AuthService
from app.services.notification_service import NotificationService
from app.database import SessionLocal

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    db = SessionLocal()
    try:
        AuthService.seed_demo_accounts_if_empty(db)
    finally:
        db.close()


def get_auth_token(phone: str) -> str:
    response = client.post(
        "/api/v1/auth/login",
        json={"credential": phone, "password": "password123"},
    )
    assert response.status_code == 200, f"Login failed for {phone}: {response.json()}"
    return response.json()["data"]["access_token"]


def test_notification_creation_all_13_types():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == "9876543210").first()
        assert user is not None

        # Test creating all 13 statutory notification types
        types_to_test = [
            (NotificationType.JOB_REQUEST, "New Service Request", "Customer requested electrician service"),
            (NotificationType.JOB_ACCEPTED, "Booking Confirmed", "Worker Ramesh accepted booking #102"),
            (NotificationType.WORKER_ON_THE_WAY, "Worker Dispatched", "Worker is 1.5 km away"),
            (NotificationType.WORKER_ARRIVED, "Worker Arrived", "Artisan arrived at destination"),
            (NotificationType.JOB_COMPLETED, "Work Completed", "Job signed off by citizen"),
            (NotificationType.PAYMENT, "Escrow Released", "₹450 credited to worker wallet"),
            (NotificationType.REPLACEMENT, "Replacement Assigned", "Artisan Manoj assigned as replacement"),
            (NotificationType.LEAVE, "Leave Approved", "Medical leave granted for 2 days"),
            (NotificationType.COMPLAINT, "Grievance Logged", "Complaint CMP-101 is under cooperative review"),
            (NotificationType.VERIFICATION, "Skill Certified", "Trade certification verified by state assessor"),
            (NotificationType.SETTLEMENT, "Weekly Settlement Done", "₹3,400 transferred to bank"),
            (NotificationType.TRAINING, "Safety Module Available", "New electrical safety standard module"),
            (NotificationType.SYSTEM, "System Maintenance", "Platform upgrade scheduled at 2 AM"),
        ]

        for n_type, title, msg in types_to_test:
            n = NotificationService.create_notification(
                db=db,
                user_id=user.id,
                type=n_type,
                title=title,
                message=msg,
                link_url="/customer/bookings",
            )
            assert n.id is not None
            assert n.type == n_type
            assert n.is_read is False

    finally:
        db.close()


def test_get_notifications_and_unread_count():
    token = get_auth_token("9876543210")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Check unread count
    res_count = client.get("/api/v1/notifications/unread-count", headers=headers)
    assert res_count.status_code == 200
    unread_count = res_count.json()["unread_count"]
    assert unread_count >= 1

    # 2. Get notification list
    res_list = client.get("/api/v1/notifications", headers=headers)
    assert res_list.status_code == 200
    data = res_list.json()
    assert "notifications" in data
    assert len(data["notifications"]) >= 1
    assert data["unread_count"] == unread_count


def test_mark_single_notification_read():
    token = get_auth_token("9876543210")
    headers = {"Authorization": f"Bearer {token}"}

    res_list = client.get("/api/v1/notifications?unread_only=true", headers=headers)
    assert res_list.status_code == 200
    notifications = res_list.json()["notifications"]
    assert len(notifications) > 0

    target_id = notifications[0]["id"]

    # Mark as read
    res_read = client.post(f"/api/v1/notifications/{target_id}/read", headers=headers)
    assert res_read.status_code == 200
    data = res_read.json()
    assert data["id"] == target_id
    assert data["is_read"] is True
    assert data["read_at"] is not None


def test_mark_all_notifications_read():
    token = get_auth_token("9876543210")
    headers = {"Authorization": f"Bearer {token}"}

    res_mark_all = client.post("/api/v1/notifications/mark-all-read", headers=headers)
    assert res_mark_all.status_code == 200
    assert res_mark_all.json()["status"] == "success"

    # Verify unread count is now 0
    res_count = client.get("/api/v1/notifications/unread-count", headers=headers)
    assert res_count.status_code == 200
    assert res_count.json()["unread_count"] == 0


def test_register_device_push_token():
    token = get_auth_token("9876543210")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "fcm_token": "fcm_test_token_abc_123456789_xyz_browser_device",
        "device_type": "web",
    }
    res_reg = client.post("/api/v1/notifications/register-device", json=payload, headers=headers)
    assert res_reg.status_code == 200
    assert res_reg.json()["status"] == "registered"
    assert res_reg.json()["device_type"] == "web"
    assert res_reg.json()["is_active"] is True


def test_notification_user_isolation():
    # User 1 creates notification, User 2 cannot access or mark as read
    db = SessionLocal()
    try:
        user_worker = db.query(User).filter(User.phone == "9876543211").first()
        worker_notif = NotificationService.create_notification(
            db=db,
            user_id=user_worker.id,
            type=NotificationType.PAYMENT,
            title="Worker Private Payout",
            message="Private payout notification",
        )
        worker_notif_id = worker_notif.id
    finally:
        db.close()

    # Customer tries to mark worker's notification as read -> 404
    cust_token = get_auth_token("9876543210")
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    res_hack = client.post(f"/api/v1/notifications/{worker_notif_id}/read", headers=cust_headers)
    assert res_hack.status_code == 404

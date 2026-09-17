import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus
from app.services.auth_service import AuthService
from app.services.routing_service import (
    haversine_distance_km,
    calculate_eta_minutes,
    generate_realistic_road_corridor,
    get_route_details,
)

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    db = SessionLocal()
    try:
        AuthService.seed_demo_accounts_if_empty(db)
    finally:
        db.close()


def get_token(phone_or_email: str, password: str = "password123") -> str:
    resp = client.post(
        "/api/v1/auth/login",
        json={"credential": phone_or_email, "password": password},
    )
    assert resp.status_code == 200, f"Login failed for {phone_or_email}: {resp.json()}"
    return resp.json()["data"]["access_token"]


def test_routing_service_calculations():
    """Verify haversine distance, travel ETA, and road corridor waypoints."""
    dist_km = haversine_distance_km(20.2961, 85.8245, 20.4625, 85.8830)
    assert 18.0 <= dist_km <= 24.0

    eta_min = calculate_eta_minutes(dist_km, is_emergency=False)
    assert eta_min >= 40

    emergency_eta_min = calculate_eta_minutes(dist_km, is_emergency=True)
    assert emergency_eta_min < eta_min

    waypoints = generate_realistic_road_corridor(20.2961, 85.8245, 20.4625, 85.8830, steps=8)
    assert len(waypoints) == 9
    assert waypoints[0] == [20.2961, 85.8245]
    assert waypoints[-1] == [20.4625, 85.8830]

    route = get_route_details(20.2961, 85.8245, 20.4625, 85.8830)
    assert route["is_road_distance"] is True
    assert route["distance_km"] > dist_km
    assert len(route["route_coordinates"]) >= 2


def test_worker_location_ingestion_and_tracking_endpoint():
    """Test worker location heartbeat ingestion and customer live tracking retrieval."""
    db = SessionLocal()
    try:
        citizen = db.query(User).filter(User.role == UserRole.CUSTOMER).first()
        worker = db.query(User).filter(User.role == UserRole.WORKER).first()
        assert citizen is not None
        assert worker is not None

        # Create active booking en route
        ref_1 = f"BK-TRACK-{uuid.uuid4().hex[:8].upper()}"
        booking = Booking(
            booking_reference=ref_1,
            service_id="srv-elec-01",
            service_title="Electrical Wiring & Switchboard Repair",
            service_category="Electrician",
            cooperative_code="COOP-KHORDHA-01",
            cooperative_name="Bhubaneswar Urban Craftsmen Federation",
            customer_id=citizen.id,
            scheduled_worker_id=worker.id,
            scheduled_date="2026-09-05",
            time_slot="10:00 AM - 12:00 PM",
            base_rate=450.0,
            extra_charges=0.0,
            total_amount=450.0,
            address_line="Plot 104, Shaheed Nagar",
            country="India",
            state="Odisha",
            state_code="OD",
            district="Khordha",
            city="Bhubaneswar",
            pincode="751007",
            lat=20.2961,
            lng=85.8245,
            status=BookingStatus.ON_THE_WAY,
            otp_code="5821",
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        booking_id = booking.id

        worker_token = get_token(worker.phone)

        # Worker sends location telemetry
        loc_res = client.put(
            f"/api/v1/bookings/{booking_id}/worker-location",
            headers={"Authorization": f"Bearer {worker_token}"},
            json={
                "latitude": 20.3120,
                "longitude": 85.8150,
                "heading": 85.0,
                "speed": 22.5,
                "accuracy": 8.0,
            },
        )
        assert loc_res.status_code == 200
        loc_data = loc_res.json()
        assert loc_data["success"] is True
        assert loc_data["data"]["worker_id"] == worker.id

        citizen_token = get_token(citizen.phone)

        # Citizen retrieves live tracking
        track_res = client.get(
            f"/api/v1/bookings/{booking_id}/tracking",
            headers={"Authorization": f"Bearer {citizen_token}"},
        )
        assert track_res.status_code == 200
        track_data = track_res.json()

        assert track_data["booking_id"] == booking_id
        assert track_data["status"] == "ON_THE_WAY"
        assert track_data["is_live"] is True
        assert track_data["worker"]["id"] == worker.id
        assert track_data["worker"]["name"] == worker.name
        assert track_data["worker_location"]["latitude"] == 20.3120
        assert track_data["worker_location"]["longitude"] == 85.8150
        assert track_data["customer_location"]["district"] == "Khordha"
        assert track_data["distance_km"] > 0
        assert track_data["eta_minutes"] > 0
        assert len(track_data["route_coordinates"]) >= 2
        assert track_data["otp_code"] == "5821"

    finally:
        db.close()


def test_tracking_follows_replacement_worker():
    """Verify that live tracking follows actual_worker_id and includes replacement metadata."""
    db = SessionLocal()
    try:
        citizen = db.query(User).filter(User.role == UserRole.CUSTOMER).first()
        orig_worker = db.query(User).filter(User.role == UserRole.WORKER).first()
        replacement_worker = db.query(User).filter(User.phone == "9900112244").first()
        if not replacement_worker:
            replacement_worker = orig_worker

        ref_2 = f"BK-REPL-{uuid.uuid4().hex[:8].upper()}"
        booking = Booking(
            booking_reference=ref_2,
            service_id="srv-plumb-01",
            service_title="Plumbing Drainage Clearance",
            service_category="Plumber",
            cooperative_code="COOP-KHORDHA-01",
            cooperative_name="Bhubaneswar Urban Craftsmen Federation",
            customer_id=citizen.id,
            scheduled_worker_id=orig_worker.id,
            actual_worker_id=replacement_worker.id,
            is_replacement=True,
            replacement_for_worker_id=orig_worker.id,
            replacement_reason="Medical Leave Backup",
            scheduled_date="2026-09-05",
            time_slot="02:00 PM - 04:00 PM",
            base_rate=500.0,
            extra_charges=0.0,
            total_amount=500.0,
            address_line="Flat 3B, Niladri Vihar",
            country="India",
            state="Odisha",
            state_code="OD",
            district="Khordha",
            city="Bhubaneswar",
            pincode="751021",
            lat=20.3250,
            lng=85.8120,
            status=BookingStatus.ON_THE_WAY,
            otp_code="7742",
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        booking_id = booking.id

        citizen_token = get_token(citizen.phone)

        track_res = client.get(
            f"/api/v1/bookings/{booking_id}/tracking",
            headers={"Authorization": f"Bearer {citizen_token}"},
        )
        assert track_res.status_code == 200
        track_data = track_res.json()

        assert track_data["worker"]["id"] == replacement_worker.id
        assert track_data["worker"]["name"] == replacement_worker.name
        assert track_data["worker"]["is_replacement"] is True
        assert track_data["worker"]["replacement_reason"] == "Medical Leave Backup"

    finally:
        db.close()

import random
import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app


def test_customer_registration_and_login():
    """Test successful customer registration and subsequent login."""
    with TestClient(app) as client:
        rand_suffix = str(random.randint(10000000, 99999999))
        unique_phone = f"91{rand_suffix}"
        unique_email = f"citizen_{rand_suffix}@shramsetu.gov.in"

        reg_payload = {
            "name": "Smita Mohapatra",
            "phone": unique_phone,
            "email": unique_email,
            "password": "securepassword123",
            "role": "CUSTOMER",
            "district": "Cuttack",
            "pincode": "753001"
        }

        # 1. Register
        reg_res = client.post("/api/v1/auth/register", json=reg_payload)
        assert reg_res.status_code == 201
        reg_data = reg_res.json()
        assert reg_data["success"] is True
        assert "access_token" in reg_data["data"]
        assert reg_data["data"]["user"]["role"] == "CUSTOMER"

        token = reg_data["data"]["access_token"]

        # 2. Login
        login_payload = {
            "credential": unique_phone,
            "password": "securepassword123"
        }
        login_res = client.post("/api/v1/auth/login", json=login_payload)
        assert login_res.status_code == 200
        login_data = login_res.json()
        assert login_data["success"] is True
        assert login_data["data"]["user"]["name"] == "Smita Mohapatra"

        # 3. Get /me Profile
        me_res = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["success"] is True
        assert me_data["data"]["email"] == unique_email


def test_worker_registration_generates_shram_id():
    """Test that worker registration automatically generates a digital SHRAM ID."""
    with TestClient(app) as client:
        rand_suffix = str(random.randint(10000000, 99999999))
        unique_phone = f"92{rand_suffix}"
        unique_email = f"worker_{rand_suffix}@shramsetu.gov.in"

        reg_payload = {
            "name": "Bikash Jena",
            "phone": unique_phone,
            "email": unique_email,
            "password": "securepassword123",
            "role": "WORKER",
            "trade": "Plumber",
            "work_radius_km": 5.0,
            "cooperative_name": "Cuttack City Labour Cooperative Society"
        }

        reg_res = client.post("/api/v1/auth/register", json=reg_payload)
        assert reg_res.status_code == 201
        data = reg_res.json()["data"]
        assert data["user"]["role"] == "WORKER"
        assert data["user"]["shram_id"] is not None
        assert "KS-OD-2024-" in data["user"]["shram_id"]
        assert data["user"]["trade"] == "Plumber"


def test_prohibit_system_admin_public_registration():
    """Test that public registration strictly prohibits SYSTEM_ADMIN role."""
    with TestClient(app) as client:
        rand_suffix = str(random.randint(10000000, 99999999))
        reg_payload = {
            "name": "Intruder",
            "phone": f"93{rand_suffix}",
            "email": f"intruder_{rand_suffix}@gov.in",
            "password": "password123",
            "role": "SYSTEM_ADMIN"
        }

        reg_res = client.post("/api/v1/auth/register", json=reg_payload)
        # Validation error from field_validator
        assert reg_res.status_code == 422


def test_login_invalid_password():
    """Test that invalid credentials return 401 Unauthorized."""
    with TestClient(app) as client:
        login_payload = {
            "credential": "9876543210",
            "password": "wrong_password_xyz"
        }
        login_res = client.post("/api/v1/auth/login", json=login_payload)
        assert login_res.status_code == 401
        assert login_res.json()["success"] is False

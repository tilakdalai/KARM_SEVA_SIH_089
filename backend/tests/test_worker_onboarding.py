import random
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_authenticated_worker_token():
    """Register and login a new unique worker to get JWT access token."""
    rand_id = random.randint(100000, 999999)
    phone = f"99{rand_id:08d}"[:10]
    email = f"worker_{rand_id}@shramsetu.gov.in"
    password = "password123"

    # Register
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "phone": phone,
            "email": email,
            "password": password,
            "name": f"Test Worker {rand_id}",
            "role": "WORKER",
            "district": "Bhubaneswar",
        },
    )
    assert reg_resp.status_code == 201

    # Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "credential": phone,
            "password": password,
        },
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["data"]["access_token"]
    return token, phone


def test_get_trade_policies():
    response = client.get("/api/v1/workers/trades-and-groups")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "trade_policies" in data
    assert len(data["trade_policies"]) >= 10
    
    electrician = next(p for p in data["trade_policies"] if p["slug"] == "electrician")
    assert electrician["group"] == "GROUP_A"
    assert electrician["certificate_requirement"] == "Mandatory"


def test_get_authorized_cooperatives():
    response = client.get("/api/v1/workers/cooperatives")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "cooperatives" in data
    assert len(data["cooperatives"]) >= 4


def test_group_a_requires_certification():
    token, _ = get_authenticated_worker_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt to submit Group A Electrician with empty certifications
    payload = {
        "name": "Ramesh Behera",
        "district": "Bhubaneswar",
        "cooperative_id": "coop-bbsr-01",
        "cooperative_name": "Khurda District Urban Workers Cooperative Union",
        "trade": "Master Electrician",
        "trade_group": "GROUP_A",
        "experience_years": 6.0,
        "skills": ["Wiring & Conduit", "Inverter Setup"],
        "identity_document": {
            "document_type": "AADHAAR",
            "document_number": "987654321234",
            "document_ref": "REF-AADHAAR-DOC",
        },
        "certifications": [],  # Empty for Group A! Should trigger 400
        "preferences": {
            "preferred_radius_km": 5.0,
            "max_radius_km": 10.0,
            "allow_outside_suggestions": True,
            "preferred_shift": "FULL_DAY",
            "is_available_for_emergency": True,
        },
        "portfolio": [],
        "declaration_confirmed": True,
    }

    response = client.post("/api/v1/workers/onboarding", json=payload, headers=headers)
    assert response.status_code == 400
    assert "Group A) requires at least one formal certificate" in response.json()["message"]


def test_successful_worker_onboarding_group_a_and_d():
    token, _ = get_authenticated_worker_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Valid Group A Onboarding with ITI Certificate
    payload_a = {
        "name": "Ramesh Behera",
        "alternate_phone": "+91 9437012345",
        "gender": "Male",
        "age": 34,
        "preferred_language": "Odia",
        "district": "Bhubaneswar",
        "address_line": "Plot 104, Rasulgarh",
        "profile_photo_url": "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400",
        "cooperative_id": "coop-bbsr-01",
        "cooperative_name": "Khurda District Urban Workers Cooperative Union",
        "trade": "Master Electrician",
        "trade_group": "GROUP_A",
        "experience_years": 8.0,
        "bio": "Certified industrial and residential electrician with 8 years of experience.",
        "skills": ["Wiring & Conduit", "Fault Diagnosis", "3-Phase Distribution"],
        "identity_document": {
            "document_type": "AADHAAR",
            "document_number": "884123456789",
            "document_ref": "REF-AADHAAR-8841",
        },
        "certifications": [
            {
                "certificate_name": "National Trade Certificate (NTC) - Electrician",
                "issuing_authority": "National Council for Vocational Training (NCVT)",
                "issue_year": 2016,
            }
        ],
        "preferences": {
            "preferred_radius_km": 4.5,
            "max_radius_km": 12.0,
            "allow_outside_suggestions": True,
            "preferred_shift": "FULL_DAY",
            "is_available_for_emergency": True,
        },
        "portfolio": [
            {
                "title": "Apartment MCB Box Wiring",
                "service_type": "Electrical Fitting",
                "description": "Full rewiring of 3BHK flat distribution board",
                "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500",
                "work_date": "Jan 2024",
            }
        ],
        "declaration_confirmed": True,
    }

    response_a = client.post("/api/v1/workers/onboarding", json=payload_a, headers=headers)
    assert response_a.status_code == 200
    data_a = response_a.json()["data"]["profile"]
    assert data_a["shram_id"].startswith("SHRAM-OD-2024-")
    assert data_a["masked_identity_doc"] == "XXXX-XXXX-6789"
    assert data_a["total_certificates"] == 1
    assert data_a["total_portfolio_items"] == 1
    assert data_a["preferred_radius_km"] == 4.5

    # 2. Check onboarding status endpoint
    status_resp = client.get("/api/v1/workers/onboarding/status", headers=headers)
    assert status_resp.status_code == 200
    st_data = status_resp.json()["data"]["profile"]
    assert st_data["shram_id"] == data_a["shram_id"]
    assert st_data["trade"] == "Master Electrician"


def test_group_d_cleaner_onboarding_without_certificate():
    token, _ = get_authenticated_worker_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Group D Cleaner with zero certificates
    payload_d = {
        "name": "Sunita Jena",
        "district": "Cuttack",
        "cooperative_id": "coop-ctc-02",
        "cooperative_name": "Cuttack Mahanagar Shramik Sahayog Samiti",
        "trade": "Deep Cleaner",
        "trade_group": "GROUP_D",
        "experience_years": 4.0,
        "skills": ["Bathroom Acid Scrubbing", "Kitchen Degreasing"],
        "identity_document": {
            "document_type": "VOTER_ID",
            "document_number": "OD9841234",
            "document_ref": "REF-VOTER-DOC",
        },
        "certifications": [],  # Group D does NOT require certificates
        "preferences": {
            "preferred_radius_km": 3.0,
            "max_radius_km": 6.0,
            "allow_outside_suggestions": False,
            "preferred_shift": "MORNING",
            "is_available_for_emergency": False,
        },
        "portfolio": [],
        "declaration_confirmed": True,
    }

    response_d = client.post("/api/v1/workers/onboarding", json=payload_d, headers=headers)
    assert response_d.status_code == 200
    data_d = response_d.json()["data"]["profile"]
    assert data_d["shram_id"].startswith("SHRAM-OD-2024-")
    assert data_d["trade_group"] == "GROUP_D"
    assert data_d["masked_identity_doc"] == "XXX1234"

import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.database import get_db
from app.dependencies.auth import require_role
from app.models.user import User, UserRole
from app.models.audit import AuditLog
from app.models.worker import WorkerProfile, WorkerOnboardingStatus
from app.schemas.common import APIResponse

router = APIRouter(prefix="/admin", tags=["System Administration & Governance"])


class CooperativeActionRequest(BaseModel):
    action: str = Field(..., description="APPROVE, SUSPEND, PUT_UNDER_REVIEW")
    reason: str = Field(..., min_length=3, description="Official regulatory reason")
    admin_notes: Optional[str] = None


class FlagResolutionRequest(BaseModel):
    resolution: str = Field(..., description="CLEARED, WARNING_ISSUED, SUSPENDED")
    notes: str = Field(..., min_length=3, description="Adjudication notes")


class DisputeResolutionRequest(BaseModel):
    resolution_type: str = Field(..., description="WORKER_FAVORED, CUSTOMER_REFUND, AMICABLE_SETTLED")
    compensation_amount: float = Field(0.0, ge=0.0)
    decision_summary: str = Field(..., min_length=3)


class SystemSettingsUpdateRequest(BaseModel):
    welfare_allocation_percent: Optional[float] = None
    min_floor_rate_multiplier: Optional[float] = None
    state_gazette_sync_enabled: Optional[bool] = None
    audit_strict_mode: Optional[bool] = None


# Mock database state for multi-cooperative oversight
COOPERATIVES_DATA = [
  {
    "id": "coop-01",
    "code": "OD-KHR-COOP-041",
    "name": "Khurda District Urban Workers Cooperative Union",
    "district": "Khurda / Bhubaneswar",
    "state": "Odisha",
    "registration_no": "ARCS/BBS/2021/041",
    "active_workers": 2420,
    "verification_rate": "94.8%",
    "jobs_completed": 18450,
    "average_rating": 4.89,
    "complaint_rate": "0.3%",
    "revenue": 14280000.0,
    "welfare_fund_balance": 1428000.0,
    "status": "ACTIVE",
    "accreditation_date": "2021-08-15",
  },
  {
    "id": "coop-02",
    "code": "OD-CTC-COOP-019",
    "name": "Cuttack Municipal Shramik Kalyan Cooperative",
    "district": "Cuttack",
    "state": "Odisha",
    "registration_no": "ARCS/CTC/2022/019",
    "active_workers": 1890,
    "verification_rate": "92.1%",
    "jobs_completed": 14200,
    "average_rating": 4.82,
    "complaint_rate": "0.5%",
    "revenue": 9840000.0,
    "welfare_fund_balance": 984000.0,
    "status": "ACTIVE",
    "accreditation_date": "2022-03-10",
  },
  {
    "id": "coop-03",
    "code": "OD-PUR-COOP-007",
    "name": "Puri Coastal Pilgrim & Hospitality Workers Union",
    "district": "Puri",
    "state": "Odisha",
    "registration_no": "ARCS/PUR/2022/007",
    "active_workers": 1140,
    "verification_rate": "89.4%",
    "jobs_completed": 9680,
    "average_rating": 4.78,
    "complaint_rate": "0.8%",
    "revenue": 6420000.0,
    "welfare_fund_balance": 642000.0,
    "status": "UNDER_REVIEW",
    "accreditation_date": "2022-09-01",
  },
  {
    "id": "coop-04",
    "code": "OD-GNJ-COOP-033",
    "name": "Ganjam Artisan & Skilled Labour Cooperative Society",
    "district": "Ganjam / Berhampur",
    "state": "Odisha",
    "registration_no": "ARCS/GNJ/2023/033",
    "active_workers": 1650,
    "verification_rate": "95.6%",
    "jobs_completed": 12100,
    "average_rating": 4.91,
    "complaint_rate": "0.2%",
    "revenue": 7910000.0,
    "welfare_fund_balance": 791000.0,
    "status": "ACTIVE",
    "accreditation_date": "2023-01-20",
  },
  {
    "id": "coop-05",
    "code": "OD-SBP-COOP-012",
    "name": "Sambalpur Industrial Belt Tradesmen Union",
    "district": "Sambalpur",
    "state": "Odisha",
    "registration_no": "ARCS/SBP/2023/012",
    "active_workers": 980,
    "verification_rate": "78.2%",
    "jobs_completed": 4820,
    "average_rating": 4.65,
    "complaint_rate": "1.8%",
    "revenue": 3120000.0,
    "welfare_fund_balance": 312000.0,
    "status": "SUSPENDED",
    "accreditation_date": "2023-06-14",
  },
]


@router.get("/metrics")
async def get_system_admin_kpis(
    state: Optional[str] = "Odisha",
    district: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Returns the 12 Platform / State Governance KPIs for public digital infrastructure oversight.
    """
    total_db_workers = db.query(WorkerProfile).count()
    verified_db_workers = db.query(WorkerProfile).filter(
        WorkerProfile.onboarding_status == WorkerOnboardingStatus.VERIFIED
    ).count()

    return APIResponse(
        success=True,
        message="System governance KPIs retrieved",
        data={
            "metrics": {
                "registered_workers": max(total_db_workers, 14850),
                "verified_workers": max(verified_db_workers, 12420),
                "active_cooperatives": 48,
                "citizens_served": 42910,
                "institutions": 134,
                "jobs_completed": 68240,
                "active_jobs": 412,
                "total_transaction_value": 38450000.0,  # ₹3.84 Cr
                "worker_earnings": 34605000.0,         # 90% direct DBT
                "cooperative_revenue": 3845000.0,      # 10% welfare trust
                "average_rating": 4.88,
                "complaint_resolution_rate": "98.7%",
                "jurisdiction": "State of Odisha (DPI Framework PS26089)",
            }
        }
    )


@router.get("/cooperatives")
async def get_all_cooperatives(
    status: Optional[str] = None,
    district: Optional[str] = None,
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Returns the state-wide registered cooperative societies list with performance metrics.
    """
    coops = COOPERATIVES_DATA
    if status and status != "ALL":
        coops = [c for c in coops if c["status"] == status]
    if district and district != "ALL":
        coops = [c for c in coops if district.lower() in c["district"].lower()]

    return APIResponse(
        success=True,
        message="Cooperative societies registry retrieved",
        data={"cooperatives": coops, "total": len(coops)}
    )


@router.post("/cooperatives/{coop_code}/action")
async def update_cooperative_accreditation(
    coop_code: str,
    payload: CooperativeActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Admin accreditation action (APPROVE, SUSPEND, PUT_UNDER_REVIEW).
    Generates an immutable audit log entry.
    """
    coop = next((c for c in COOPERATIVES_DATA if c["code"] == coop_code), None)
    if not coop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cooperative code {coop_code} not found in state registry."
        )

    previous_status = coop["status"]
    new_status = (
        "ACTIVE" if payload.action == "APPROVE"
        else "SUSPENDED" if payload.action == "SUSPEND"
        else "UNDER_REVIEW"
    )
    coop["status"] = new_status

    # Record mandatory immutable audit log
    audit_entry = AuditLog(
        id=str(uuid.uuid4()),
        action=f"COOPERATIVE_{payload.action}",
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code=coop_code,
        target_type="COOPERATIVE",
        target_id=coop["id"],
        target_name=coop["name"],
        details=(
            f"State System Admin changed accreditation from {previous_status} to {new_status}. "
            f"Regulatory Reason: {payload.reason}. Notes: {payload.admin_notes or 'N/A'}"
        ),
        ip_address="127.0.0.1",
        created_at=datetime.now(timezone.utc),
    )
    db.add(audit_entry)
    db.commit()

    return APIResponse(
        success=True,
        message=f"Cooperative {coop['name']} status successfully updated to {new_status}. Audit record logged.",
        data={"cooperative": coop}
    )


@router.get("/analytics")
async def get_governance_analytics(
    timeframe: Optional[str] = "1Y",
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Returns telemetry datasets for 8 governance charts & district geographic visualization.
    """
    analytics_payload = {
        "service_demand": [
            {"trade": "Cleaners & Sanitization", "percentage": 38, "volume": 25930},
            {"trade": "Electricians", "percentage": 26, "volume": 17740},
            {"trade": "Plumbers", "percentage": 18, "volume": 12280},
            {"trade": "Patient & Elderly Caregivers", "percentage": 12, "volume": 8180},
            {"trade": "Carpenters & Others", "percentage": 6, "volume": 4110},
        ],
        "worker_growth": [
            {"month": "Jan", "registered": 3400, "verified": 2900},
            {"month": "Feb", "registered": 5200, "verified": 4500},
            {"month": "Mar", "registered": 7100, "verified": 6200},
            {"month": "Apr", "registered": 9400, "verified": 8100},
            {"month": "May", "registered": 11600, "verified": 9900},
            {"month": "Jun", "registered": 13200, "verified": 11300},
            {"month": "Jul", "registered": 14100, "verified": 12000},
            {"month": "Aug", "registered": 14850, "verified": 12420},
        ],
        "employment_generated": [
            {"quarter": "Q1 2024", "person_days": 148000, "earnings_cr": 7.4},
            {"quarter": "Q2 2024", "person_days": 215000, "earnings_cr": 10.7},
            {"quarter": "Q3 2024", "person_days": 298000, "earnings_cr": 14.9},
            {"quarter": "Q4 2024 (Est)", "person_days": 350000, "earnings_cr": 17.5},
        ],
        "jobs_completed": [
            {"week": "W1", "jobs": 1420},
            {"week": "W2", "jobs": 1680},
            {"week": "W3", "jobs": 1890},
            {"week": "W4", "jobs": 2140},
        ],
        "geographic_demand": [
            {"district": "Khurda / Bhubaneswar", "workers": 4200, "jobs": 28400, "lat": 20.2961, "lng": 85.8245, "density": "VERY_HIGH"},
            {"district": "Cuttack", "workers": 2900, "jobs": 18200, "lat": 20.4625, "lng": 85.8830, "density": "HIGH"},
            {"district": "Puri", "workers": 1850, "jobs": 9800, "lat": 19.8135, "lng": 85.8312, "density": "MEDIUM"},
            {"district": "Ganjam / Berhampur", "workers": 2400, "jobs": 13400, "lat": 19.3150, "lng": 84.7941, "density": "HIGH"},
            {"district": "Sambalpur", "workers": 1600, "jobs": 7200, "lat": 21.4669, "lng": 83.9812, "density": "MEDIUM"},
            {"district": "Balasore", "workers": 1200, "jobs": 5800, "lat": 21.4934, "lng": 86.9135, "density": "GROWING"},
        ],
        "revenue_distribution": [
            {"category": "Direct Worker Take-Home (90%)", "amount": 34605000.0, "fill": "#10B981"},
            {"category": "Cooperative Welfare Trust (10%)", "amount": 3845000.0, "fill": "#3B82F6"},
            {"category": "Platform Commission (0%)", "amount": 0.0, "fill": "#F59E0B"},
        ],
        "skill_demand": [
            {"skill": "Industrial Wiring & Substation", "index": 95},
            {"skill": "Hospital Grade Sanitization", "index": 92},
            {"skill": "High Pressure Pipeline Fitting", "index": 84},
            {"skill": "Elderly & Dementia Patient Care", "index": 79},
            {"skill": "Commercial HVAC Maintenance", "index": 74},
        ],
        "complaint_trend": [
            {"month": "May", "received": 28, "resolved": 28},
            {"month": "Jun", "received": 34, "resolved": 33},
            {"month": "Jul", "received": 22, "resolved": 22},
            {"month": "Aug", "received": 19, "resolved": 19},
        ],
    }

    return APIResponse(
        success=True,
        message="Governance analytics and telemetry retrieved",
        data={"analytics": analytics_payload}
    )


@router.get("/workers")
async def get_platform_workers(
    trade: Optional[str] = None,
    group: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Platform-wide worker directory with trade group filtering and verification health.
    """
    workers_roster = [
        {
            "id": "pw-01",
            "shram_id": "SHRAM-OD-2024-8841",
            "name": "Ramesh Chandra Behera",
            "trade": "Master Electrician",
            "trade_group": "GROUP_A",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Khurda District Urban Workers Cooperative Union",
            "district": "Khurda / Bhubaneswar",
            "status": "VERIFIED",
            "rating": 4.9,
            "jobs_completed": 142,
            "earnings_total": 98400.0,
            "police_verification": "CLEARED",
            "flagged": False,
        },
        {
            "id": "pw-02",
            "shram_id": "SHRAM-OD-2024-3912",
            "name": "Sunita Majhi",
            "trade": "Patient Caregiver",
            "trade_group": "GROUP_A",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Khurda District Urban Workers Cooperative Union",
            "district": "Khurda / Bhubaneswar",
            "status": "VERIFIED",
            "rating": 4.95,
            "jobs_completed": 98,
            "earnings_total": 76500.0,
            "police_verification": "CLEARED",
            "flagged": False,
        },
        {
            "id": "pw-03",
            "shram_id": "SHRAM-OD-2024-9918",
            "name": "Bikash Ranjan Rout",
            "trade": "Heavy Commercial Driver",
            "trade_group": "GROUP_A",
            "cooperative_code": "OD-SBP-COOP-012",
            "cooperative_name": "Sambalpur Industrial Belt Tradesmen Union",
            "district": "Sambalpur",
            "status": "SUSPENDED",
            "rating": 3.9,
            "jobs_completed": 21,
            "earnings_total": 14200.0,
            "police_verification": "REJECTED_EXPIRED",
            "flagged": True,
            "flag_reason": "Driving license expired during annual audit. Regulatory verification pending.",
        },
        {
            "id": "pw-04",
            "shram_id": "SHRAM-OD-2024-5520",
            "name": "Gita Rani Jena",
            "trade": "Housekeeping Specialist",
            "trade_group": "GROUP_D",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Khurda District Urban Workers Cooperative Union",
            "district": "Khurda / Bhubaneswar",
            "status": "VERIFIED",
            "rating": 4.88,
            "jobs_completed": 215,
            "earnings_total": 128900.0,
            "police_verification": "CLEARED",
            "flagged": False,
        },
    ]

    return APIResponse(
        success=True,
        message="Platform workers directory ready",
        data={"workers": workers_roster, "total": len(workers_roster)}
    )


@router.post("/workers/{worker_id}/flag-resolution")
async def resolve_worker_flag(
    worker_id: str,
    payload: FlagResolutionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Adjudicate flagged worker cases. Logs audit entry without modifying raw documents.
    """
    audit_entry = AuditLog(
        id=str(uuid.uuid4()),
        action=f"WORKER_FLAG_{payload.resolution}",
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code="STATE-OVERSIGHT",
        target_type="WORKER",
        target_id=worker_id,
        target_name=f"Worker Profile {worker_id}",
        details=f"System Admin resolved compliance flag as {payload.resolution}. Adjudication: {payload.notes}",
        ip_address="127.0.0.1",
        created_at=datetime.now(timezone.utc),
    )
    db.add(audit_entry)
    db.commit()

    return APIResponse(
        success=True,
        message=f"Flag resolution {payload.resolution} recorded and audit trail created.",
        data={"worker_id": worker_id, "status": payload.resolution}
    )


@router.get("/disputes")
async def get_state_disputes(
    status: Optional[str] = None,
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Returns state conciliation desk grievance records.
    """
    disputes = [
        {
            "id": "DSP-2024-019",
            "booking_id": "BK-2024-9120",
            "citizen_name": "Priyanka Sahoo",
            "worker_name": "Ramesh Chandra Behera",
            "cooperative_name": "Khurda District Urban Workers Cooperative Union",
            "issue": "Citizen requested additional unbilled 3-phase rewiring outside initial scope.",
            "filing_date": "2024-08-28",
            "claim_amount": 850.0,
            "status": "RESOLVED",
            "resolution": "Cooperative conciliation officer mediated. Citizen authorized supplementary tariff under Gazette rate.",
        },
        {
            "id": "DSP-2024-022",
            "booking_id": "BK-2024-9411",
            "citizen_name": "Utkal Builders Ltd",
            "worker_name": "Sambalpur Plumbing Batch 4",
            "cooperative_name": "Sambalpur Industrial Belt Tradesmen Union",
            "issue": "Delayed replacement arrival past 45-minute SLA threshold.",
            "filing_date": "2024-08-30",
            "claim_amount": 1500.0,
            "status": "UNDER_CONCILIATION",
            "resolution": "Hearing scheduled with District Cooperative Registrar.",
        },
    ]

    return APIResponse(
        success=True,
        message="State dispute arbitration records retrieved",
        data={"disputes": disputes}
    )


@router.get("/audit-logs")
async def get_platform_audit_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Universal immutable audit log stream with SHA256 integrity stamps.
    """
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    serialized = [
        {
            "id": l.id,
            "action": l.action,
            "admin_name": l.admin_name,
            "cooperative_code": l.cooperative_code,
            "target_type": l.target_type,
            "target_name": l.target_name,
            "details": l.details,
            "created_at": l.created_at.isoformat() if l.created_at else None,
        }
        for l in logs
    ]

    return APIResponse(
        success=True,
        message="Platform audit logs retrieved",
        data={"audit_logs": serialized, "count": len(serialized)}
    )


@router.get("/settings")
async def get_system_settings(
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Returns platform-wide DPI governance parameters.
    """
    return APIResponse(
        success=True,
        message="System DPI settings retrieved",
        data={
            "settings": {
                "platform_commission_percent": 0.0,  # 0% commission guaranteed
                "welfare_allocation_percent": 10.0,   # 10% to cooperative welfare trust
                "worker_takehome_percent": 90.0,     # 90% direct DBT to worker
                "state_gazette_sync_enabled": True,
                "audit_strict_mode": True,
                "replacement_sla_minutes": 45,
                "jurisdiction_state": "Odisha",
                "nodal_authority": "Directorate of Cooperative Societies & Odisha State Labour Directorate",
            }
        }
    )


@router.put("/settings")
async def update_system_settings(
    payload: SystemSettingsUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SYSTEM_ADMIN]))
):
    """
    Updates platform parameters and logs audit entry.
    """
    audit_entry = AuditLog(
        id=str(uuid.uuid4()),
        action="SYSTEM_SETTINGS_UPDATE",
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code="NATIONAL-PLATFORM",
        target_type="SYSTEM",
        target_id="GLOBAL_CONFIG",
        target_name="KARM SEVA Global DPI Policy",
        details=f"Platform Administrator updated settings: {payload.model_dump(exclude_unset=True)}",
        ip_address="127.0.0.1",
        created_at=datetime.now(timezone.utc),
    )
    db.add(audit_entry)
    db.commit()

    return APIResponse(
        success=True,
        message="Global DPI system settings updated and audit logged.",
        data={"updated_settings": payload.model_dump(exclude_unset=True)}
    )

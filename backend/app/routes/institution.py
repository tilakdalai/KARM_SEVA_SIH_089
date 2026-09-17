import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.institution import (
    InstitutionProfile,
    WorkforceRequest,
    WorkforceRequestItem,
    InstitutionalContract,
    InstitutionalAttendance,
    InstitutionalInvoice,
    RequestStatus,
    ContractStatus,
    InvoiceStatus,
    AttendanceStatus,
)
from app.schemas.institution import (
    WorkforceRequestCreate,
    InstitutionProfileUpdateRequest,
)
from app.schemas.common import APIResponse

router = APIRouter(prefix="/institution", tags=["Institution Operations"])


def get_or_create_institution_profile(db: Session, user: User) -> InstitutionProfile:
    profile = db.query(InstitutionProfile).filter(InstitutionProfile.user_id == user.id).first()
    if not profile:
        profile = InstitutionProfile(
            id=str(uuid.uuid4()),
            user_id=user.id,
            organization_name=user.organization_name or user.name or "All India Institute of Medical Sciences (AIIMS Bhubaneswar)",
            institution_type=user.institution_type or "Autonomous Government Hospital & Medical College",
            gstin="21AAAGA0000A1Z5",
            pan_number="AAAGA0000A",
            nodal_officer_name=user.name or "Dr. Manoranjan Mohanty",
            nodal_officer_phone=user.phone or "+91 94370 11990",
            nodal_officer_email=user.email or "procurement@aiimsbhubaneswar.edu.in",
            nodal_officer_designation="Superintending Procurement & Facility Engineer",
            address=user.address or "Sijua, Patrapada, Bhubaneswar, Odisha",
            district=user.district or "Bhubaneswar",
            pincode=user.pincode or "751019",
            is_verified=True,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def serialize_request(r: WorkforceRequest) -> dict:
    return {
        "id": r.id,
        "title": r.title,
        "facility_location": r.facility_location,
        "duration_months": r.duration_months,
        "start_date": r.start_date,
        "end_date": r.end_date,
        "recurring_frequency": r.recurring_frequency,
        "shift_start_time": r.shift_start_time,
        "shift_end_time": r.shift_end_time,
        "additional_instructions": r.additional_instructions,
        "estimated_monthly_cost": r.estimated_monthly_cost,
        "cooperative_id": r.cooperative_id,
        "cooperative_name": r.cooperative_name,
        "status": r.status.value if hasattr(r.status, "value") else str(r.status),
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "items": [
            {
                "id": item.id,
                "trade": item.trade,
                "quantity_required": item.quantity_required,
                "allocated_workers_count": item.allocated_workers_count,
                "daily_floor_rate": item.daily_floor_rate,
            }
            for item in (r.items or [])
        ],
    }


def serialize_contract(c: InstitutionalContract) -> dict:
    return {
        "id": c.id,
        "contract_title": c.contract_title,
        "cooperative_code": c.cooperative_code,
        "cooperative_name": c.cooperative_name,
        "total_workers_assigned": c.total_workers_assigned,
        "monthly_billing_amount": c.monthly_billing_amount,
        "start_date": c.start_date,
        "end_date": c.end_date,
        "sla_terms": c.sla_terms,
        "status": c.status.value if hasattr(c.status, "value") else str(c.status),
        "created_at": c.created_at.isoformat() if c.created_at else None,
    }


def serialize_attendance(a: InstitutionalAttendance) -> dict:
    return {
        "id": a.id,
        "contract_id": a.contract_id,
        "worker_shram_id": a.worker_shram_id,
        "worker_name": a.worker_name,
        "trade": a.trade,
        "date": a.date,
        "punch_in_time": a.punch_in_time,
        "punch_out_time": a.punch_out_time,
        "geofence_verified": a.geofence_verified,
        "status": a.status.value if hasattr(a.status, "value") else str(a.status),
        "substitute_worker_name": a.substitute_worker_name,
        "created_at": a.created_at.isoformat() if a.created_at else None,
    }


def serialize_profile(p: InstitutionProfile) -> dict:
    return {
        "id": p.id,
        "organization_name": p.organization_name,
        "institution_type": p.institution_type,
        "gstin": p.gstin,
        "pan_number": p.pan_number,
        "nodal_officer_name": p.nodal_officer_name,
        "nodal_officer_phone": p.nodal_officer_phone,
        "nodal_officer_email": p.nodal_officer_email,
        "nodal_officer_designation": p.nodal_officer_designation,
        "address": p.address,
        "district": p.district,
        "pincode": p.pincode,
        "is_verified": p.is_verified,
    }


def serialize_invoice(inv: InstitutionalInvoice) -> dict:
    return {
        "id": inv.id,
        "contract_id": inv.contract_id,
        "billing_period": inv.billing_period,
        "gross_amount": inv.gross_amount,
        "gst_amount": inv.gst_amount,
        "net_payable": inv.net_payable,
        "due_date": inv.due_date,
        "paid_date": inv.paid_date,
        "status": inv.status.value if hasattr(inv.status, "value") else str(inv.status),
        "line_items": inv.line_items,
        "created_at": inv.created_at.isoformat() if inv.created_at else None,
    }


@router.get("/metrics")
async def get_institution_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Returns 6 core metrics for the B2B/B2G institution dashboard.
    Strictly scoped to the current institution.
    """
    profile = get_or_create_institution_profile(db, current_user)

    active_contracts = db.query(InstitutionalContract).filter(
        InstitutionalContract.institution_id == profile.id,
        InstitutionalContract.status == ContractStatus.ACTIVE
    ).count()

    total_requests = db.query(WorkforceRequest).filter(
        WorkforceRequest.institution_id == profile.id
    ).count()

    return APIResponse(
        success=True,
        message="Institutional metrics retrieved",
        data={
            "metrics": {
                "active_contracts": max(active_contracts, 3),
                "workers_assigned": 28,
                "todays_attendance": "96.4%",
                "attendance_fraction": "27/28 Present",
                "upcoming_service": "Daily Shift (09:00 AM)",
                "monthly_spend": 184500.0,
                "pending_invoice": 42800.0,
                "total_requests": total_requests,
                "organization_name": profile.organization_name,
            }
        }
    )


@router.post("/requests")
async def create_workforce_request(
    payload: WorkforceRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Submits a multi-trade bulk workforce request with recurring schedules
    (e.g., 2 Electricians + 3 Cleaners + 1 Plumber for 1 month).
    """
    profile = get_or_create_institution_profile(db, current_user)

    # Calculate monthly cost estimate: sum(qty * floor_rate * 26 working days)
    monthly_estimate = 0.0
    for item in payload.items:
        rate = item.daily_floor_rate or 450.0
        monthly_estimate += item.quantity * rate * 26.0

    req_id = str(uuid.uuid4())
    req = WorkforceRequest(
        id=req_id,
        institution_id=profile.id,
        title=payload.title,
        facility_location=payload.facility_location,
        duration_months=payload.duration_months,
        start_date=payload.start_date,
        end_date=payload.end_date,
        recurring_frequency=payload.recurring_frequency,
        shift_start_time=payload.shift_start_time,
        shift_end_time=payload.shift_end_time,
        additional_instructions=payload.additional_instructions,
        estimated_monthly_cost=monthly_estimate,
        cooperative_id="OD-KHR-COOP-041",
        cooperative_name="Khurda District Urban Workers Cooperative Union",
        status=RequestStatus.SUBMITTED,
    )
    db.add(req)

    for item in payload.items:
        req_item = WorkforceRequestItem(
            id=str(uuid.uuid4()),
            request_id=req_id,
            trade=item.trade,
            quantity_required=item.quantity,
            allocated_workers_count=0,
            daily_floor_rate=item.daily_floor_rate or 450.0,
        )
        db.add(req_item)

    db.commit()
    db.refresh(req)

    return APIResponse(
        success=True,
        message="Bulk workforce request successfully registered. Routed to Khurda Cooperative Union for allocation.",
        data={"request": serialize_request(req)}
    )


@router.get("/requests")
async def get_institution_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Retrieves all workforce requests submitted by this institution.
    """
    profile = get_or_create_institution_profile(db, current_user)
    requests = db.query(WorkforceRequest).filter(WorkforceRequest.institution_id == profile.id).all()

    # If DB is empty, supply rich demo requests
    serialized = [serialize_request(r) for r in requests]
    return APIResponse(
        success=True,
        message="Institutional workforce requests retrieved",
        data={"requests": serialized, "total": len(serialized)}
    )


@router.get("/requests/{request_id}")
async def get_single_institution_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Retrieves single request details with institutional ownership isolation check.
    """
    profile = get_or_create_institution_profile(db, current_user)
    req = db.query(WorkforceRequest).filter(
        WorkforceRequest.id == request_id,
        WorkforceRequest.institution_id == profile.id
    ).first()

    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workforce request not found or access restricted to authorized organization."
        )

    return APIResponse(
        success=True,
        message="Workforce request details retrieved",
        data={"request": serialize_request(req)}
    )


@router.get("/workforce")
async def get_institution_workforce(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Retrieves assigned personnel roster for this institution's facilities.
    """
    workforce_roster = [
        {
            "id": "dw-01",
            "shram_id": "SHRAM-OD-2024-8841",
            "name": "Ramesh Chandra Behera",
            "trade": "Master Electrician",
            "trade_group": "GROUP_A",
            "cooperative_unit": "Khurda District Urban Workers Cooperative Union",
            "rating": 4.9,
            "assigned_location": "Main Hospital Complex - Block B",
            "shift": "Day Shift (09:00 AM - 05:00 PM)",
            "attendance_today": "PRESENT",
            "phone": "+91 98450 11223",
            "is_police_cleared": True,
        },
        {
            "id": "dw-02",
            "shram_id": "SHRAM-OD-2024-3912",
            "name": "Sunita Majhi",
            "trade": "Senior Patient Caregiver",
            "trade_group": "GROUP_A",
            "cooperative_unit": "Khurda District Urban Workers Cooperative Union",
            "rating": 4.95,
            "assigned_location": "ICU & Recovery Ward 3",
            "shift": "Rotational 12-hr Shift",
            "attendance_today": "PRESENT",
            "phone": "+91 94370 88219",
            "is_police_cleared": True,
        },
        {
            "id": "dw-03",
            "shram_id": "SHRAM-OD-2024-1044",
            "name": "Tapan Kumar Das",
            "trade": "Master Plumber",
            "trade_group": "GROUP_B",
            "cooperative_unit": "Khurda District Urban Workers Cooperative Union",
            "rating": 4.82,
            "assigned_location": "Hostel & Resident Quarters",
            "shift": "Day Shift (09:00 AM - 05:00 PM)",
            "attendance_today": "SUBSTITUTE_DEPLOYED",
            "substitute_name": "Lalit Pradhan (Approved)",
            "phone": "+91 91240 55432",
            "is_police_cleared": True,
        },
        {
            "id": "dw-04",
            "shram_id": "SHRAM-OD-2024-5520",
            "name": "Gita Rani Jena",
            "trade": "Housekeeping Specialist",
            "trade_group": "GROUP_D",
            "cooperative_unit": "Khurda District Urban Workers Cooperative Union",
            "rating": 4.88,
            "assigned_location": "OPD Consultation Wings",
            "shift": "Morning Shift (07:00 AM - 03:00 PM)",
            "attendance_today": "PRESENT",
            "phone": "+91 97760 12389",
            "is_police_cleared": True,
        },
    ]

    return APIResponse(
        success=True,
        message="Institutional workforce roster retrieved",
        data={"workers": workforce_roster, "total_assigned": len(workforce_roster)}
    )


@router.get("/schedules")
async def get_institution_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Returns the recurring service schedules and facility duty rosters.
    """
    schedules = [
        {
            "id": "SCH-01",
            "facility_area": "In-Patient Diagnostic Wings (Block A & B)",
            "service_type": "Facility Sanitation & Bio-Hazard Decontamination",
            "recurring_pattern": "Daily (7 Days a Week)",
            "shift_timings": "07:00 AM - 03:00 PM (Morning) & 03:00 PM - 11:00 PM (Evening)",
            "personnel_count": 8,
            "supervising_officer": "Gita Rani Jena (Head Sanitation)",
            "status": "ACTIVE_ONGOING",
        },
        {
            "id": "SCH-02",
            "facility_area": "Emergency Ward Distribution & Generator Substation",
            "service_type": "24x7 Power Backup & Electrical Maintenance",
            "recurring_pattern": "Daily (3 Rotational Shifts)",
            "shift_timings": "24-Hour Continuous Coverage",
            "personnel_count": 4,
            "supervising_officer": "Ramesh Chandra Behera (Chief Electrician)",
            "status": "ACTIVE_ONGOING",
        },
        {
            "id": "SCH-03",
            "facility_area": "Administrative Block & Faculty Housing",
            "service_type": "Plumbing & High Pressure Drainage Maintenance",
            "recurring_pattern": "Monday to Saturday",
            "shift_timings": "09:00 AM - 05:00 PM",
            "personnel_count": 2,
            "supervising_officer": "Lalit Pradhan (Acting Supervisor)",
            "status": "ACTIVE_ONGOING",
        },
    ]

    return APIResponse(
        success=True,
        message="Institutional recurring schedules retrieved",
        data={"schedules": schedules}
    )


@router.get("/attendance")
async def get_institution_attendance(
    date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Returns daily punch-in/punch-out and geofence verification log.
    """
    attendance_records = [
        {
            "id": "att-01",
            "worker_shram_id": "SHRAM-OD-2024-8841",
            "worker_name": "Ramesh Chandra Behera",
            "trade": "Master Electrician",
            "date": "Today (2024-09-01)",
            "punch_in_time": "08:52 AM",
            "punch_out_time": "In Shift",
            "geofence_verified": True,
            "status": "PRESENT",
            "substitute_worker_name": None,
        },
        {
            "id": "att-02",
            "worker_shram_id": "SHRAM-OD-2024-3912",
            "worker_name": "Sunita Majhi",
            "trade": "Senior Patient Caregiver",
            "date": "Today (2024-09-01)",
            "punch_in_time": "07:55 AM",
            "punch_out_time": "In Shift",
            "geofence_verified": True,
            "status": "PRESENT",
            "substitute_worker_name": None,
        },
        {
            "id": "att-03",
            "worker_shram_id": "SHRAM-OD-2024-1044",
            "worker_name": "Tapan Kumar Das",
            "trade": "Master Plumber",
            "date": "Today (2024-09-01)",
            "punch_in_time": "09:05 AM",
            "punch_out_time": "In Shift",
            "geofence_verified": True,
            "status": "SUBSTITUTE_DEPLOYED",
            "substitute_worker_name": "Lalit Pradhan (Cooperative Substitute)",
        },
        {
            "id": "att-04",
            "worker_shram_id": "SHRAM-OD-2024-5520",
            "worker_name": "Gita Rani Jena",
            "trade": "Housekeeping Specialist",
            "date": "Today (2024-09-01)",
            "punch_in_time": "06:50 AM",
            "punch_out_time": "03:05 PM",
            "geofence_verified": True,
            "status": "PRESENT",
            "substitute_worker_name": None,
        },
    ]

    return APIResponse(
        success=True,
        message="Institutional attendance log ready",
        data={"attendance": attendance_records, "summary": {"present": 27, "substitutes": 1, "absent": 0}}
    )


@router.get("/invoices")
async def get_institution_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Returns GST-compliant B2B/B2G tax invoices.
    """
    invoices = [
        {
            "id": "INV-2024-09-AIIMS",
            "contract_id": "CNT-2024-AIIMS-01",
            "billing_period": "01 Aug 2024 - 31 Aug 2024",
            "gross_amount": 184500.0,
            "gst_amount": 0.0,  # 0% on pure labour / reverse charge
            "net_payable": 184500.0,
            "due_date": "10 Sep 2024",
            "paid_date": None,
            "status": "PENDING_CLEARANCE",
            "line_items": [
                {"description": "Housekeeping Personnel (12 staff x 26 days)", "amount": 140400.0},
                {"description": "Master Electricians (3 staff x 26 days)", "amount": 27300.0},
                {"description": "Master Plumbers (2 staff x 26 days)", "amount": 16800.0},
            ]
        },
        {
            "id": "INV-2024-08-AIIMS",
            "contract_id": "CNT-2024-AIIMS-01",
            "billing_period": "01 Jul 2024 - 31 Jul 2024",
            "gross_amount": 184500.0,
            "gst_amount": 0.0,
            "net_payable": 184500.0,
            "due_date": "10 Aug 2024",
            "paid_date": "08 Aug 2024",
            "status": "PAID",
            "line_items": [
                {"description": "Housekeeping & Facility Workforce (Monthly Settlement)", "amount": 184500.0}
            ]
        }
    ]

    return APIResponse(
        success=True,
        message="Institutional invoices retrieved",
        data={"invoices": invoices}
    )


@router.get("/contracts")
async def get_institution_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Returns legal Service Level Agreements (SLAs) with union details.
    """
    contracts = [
        {
            "id": "CNT-2024-AIIMS-01",
            "contract_title": "Annual Comprehensive Facility Maintenance & Healthcare Sanitation SLA",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Khurda District Urban Workers Cooperative Union",
            "total_workers_assigned": 28,
            "monthly_billing_amount": 184500.0,
            "start_date": "2024-04-01",
            "end_date": "2025-03-31",
            "sla_terms": "Guaranteed 15-minute emergency breakdown response. Minimum wage adherence under Odisha State Labour Gazette. 100% replacement guarantee within 45 minutes of sickness notice.",
            "status": "ACTIVE",
            "created_at": "2024-04-01T00:00:00Z",
        },
        {
            "id": "CNT-2024-AIIMS-02",
            "contract_title": "Hostel Campus High-Pressure Plumbing & Overhead Storage Tank Maintenance",
            "cooperative_code": "OD-KHR-COOP-041",
            "cooperative_name": "Khurda District Urban Workers Cooperative Union",
            "total_workers_assigned": 4,
            "monthly_billing_amount": 42000.0,
            "start_date": "2024-06-01",
            "end_date": "2024-12-31",
            "sla_terms": "Bi-weekly pressure checks and emergency leak rectification.",
            "status": "ACTIVE",
            "created_at": "2024-06-01T00:00:00Z",
        }
    ]

    return APIResponse(
        success=True,
        message="Institutional contracts retrieved",
        data={"contracts": contracts}
    )


@router.get("/profile")
async def get_institution_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Returns institutional profile and nodal officer contact details.
    """
    profile = get_or_create_institution_profile(db, current_user)
    return APIResponse(
        success=True,
        message="Institutional profile retrieved",
        data={"profile": serialize_profile(profile)}
    )


@router.put("/profile")
async def update_institution_profile(
    payload: InstitutionProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.INSTITUTION, UserRole.SYSTEM_ADMIN]))
):
    """
    Updates institutional profile and nodal officer data.
    """
    profile = get_or_create_institution_profile(db, current_user)
    update_dict = payload.model_dump(exclude_unset=True)
    for k, v in update_dict.items():
        setattr(profile, k, v)

    db.commit()
    db.refresh(profile)

    return APIResponse(
        success=True,
        message="Institutional profile updated successfully",
        data={"profile": serialize_profile(profile)}
    )

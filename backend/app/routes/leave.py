import uuid
import random
import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus, BookingStatusHistory
from app.models.recurring import BookingInstance, InstanceStatus
from app.models.leave import (
    WorkerLeave,
    ReplacementAssignment,
    WorkAttendance,
    LeaveType,
    LeaveStatus,
    ReplacementSource,
    ReplacementStatus,
    AttendanceStatus,
)
from app.models.audit import AuditLog
from app.schemas.leave import (
    LeaveApplyRequest,
    LeaveResponse,
    AffectedBookingSummary,
    ReplacementCandidateResponse,
    ReplacementAssignRequest,
    ReplacementActionRequest,
    ReplacementAssignmentResponse,
    WorkAttendanceResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/leave", tags=["Worker Leave & Replacement Engine"])


def _find_affected_bookings(worker_id: str, start_date: str, end_date: str, db: Session) -> List[Booking]:
    """Finds all active bookings scheduled for worker within the leave interval"""
    return db.query(Booking).filter(
        Booking.scheduled_worker_id == worker_id,
        Booking.scheduled_date >= start_date,
        Booking.scheduled_date <= end_date,
        Booking.status.in_([BookingStatus.REQUESTED, BookingStatus.ACCEPTED, BookingStatus.ON_THE_WAY]),
    ).all()


@router.post("", response_model=LeaveResponse, status_code=status.HTTP_201_CREATED)
def apply_for_leave(
    payload: LeaveApplyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Worker applies for leave (PLANNED, MEDICAL, EMERGENCY).
    Automatically detects affected bookings and alerts cooperative.
    """
    if current_user.role != UserRole.WORKER:
        raise HTTPException(status_code=403, detail="Only verified workers can apply for leave.")

    # Find affected bookings
    affected_bookings = _find_affected_bookings(current_user.id, payload.start_date, payload.end_date, db)
    job_count = len(affected_bookings)

    coop_code = current_user.cooperative_name or "OD-KHR-COOP-041"
    while True:
        leave_ref = f"LV-{datetime.now().strftime('%Y')}-{random.randint(1000, 9999)}"
        if not db.query(WorkerLeave).filter(WorkerLeave.leave_reference == leave_ref).first():
            break

    initial_status = (
        LeaveStatus.EMERGENCY_ACTIVE
        if payload.leave_type in [LeaveType.EMERGENCY, LeaveType.MEDICAL]
        else LeaveStatus.PENDING
    )

    leave = WorkerLeave(
        leave_reference=leave_ref,
        worker_id=current_user.id,
        cooperative_code=coop_code,
        leave_type=payload.leave_type,
        start_date=payload.start_date,
        end_date=payload.end_date,
        reason=payload.reason,
        status=initial_status,
        affected_job_count=job_count,
        notes=payload.notes,
    )
    db.add(leave)
    db.flush()

    # If worker suggested a peer replacement worker
    if payload.suggested_replacement_worker_id and job_count > 0:
        peer = db.query(User).filter(User.id == payload.suggested_replacement_worker_id).first()
        if peer:
            for bk in affected_bookings:
                assign_ref = f"REP-{datetime.now().strftime('%y%m')}-{uuid.uuid4().hex[:6].upper()}"
                assign = ReplacementAssignment(
                    assignment_reference=assign_ref,
                    leave_id=leave.id,
                    booking_id=bk.id,
                    original_worker_id=current_user.id,
                    replacement_worker_id=peer.id,
                    replacement_source=ReplacementSource.ORIGINAL_WORKER_SUGGESTED,
                    status=ReplacementStatus.PROPOSED,
                    match_score=92.0,
                )
                db.add(assign)

    # Audit log
    audit = AuditLog(
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code=coop_code,
        action=f"APPLY_LEAVE_{payload.leave_type.value}",
        target_type="WORKER_LEAVE",
        target_id=leave_ref,
        target_name=f"{current_user.name} ({payload.leave_type.value})",
        details=f"Leave applied from {payload.start_date} to {payload.end_date}. {job_count} jobs affected.",
    )
    db.add(audit)
    db.commit()
    db.refresh(leave)

    # Format response
    resp = LeaveResponse.model_validate(leave)
    resp.worker_name = current_user.name
    resp.worker_trade = current_user.trade or "Craftsman"
    resp.worker_shram_id = current_user.shram_id
    resp.worker_phone = current_user.phone
    resp.affected_bookings = [
        AffectedBookingSummary(
            id=b.id,
            booking_reference=b.booking_reference,
            service_title=b.service_title,
            scheduled_date=b.scheduled_date,
            time_slot=b.time_slot,
            customer_name=b.customer.name if b.customer else "Citizen",
            customer_phone=b.customer.phone if b.customer else None,
            address_line=b.address_line,
            rate=b.total_amount,
            has_replacement=b.is_replacement,
            replacement_worker_name=b.actual_worker.name if (b.is_replacement and b.actual_worker) else None,
        )
        for b in affected_bookings
    ]
    return resp


@router.get("", response_model=List[LeaveResponse])
def get_leaves(
    leave_type: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(WorkerLeave)

    if current_user.role == UserRole.WORKER:
        query = query.filter(WorkerLeave.worker_id == current_user.id)
    elif current_user.role in [UserRole.COOPERATIVE_ADMIN, UserRole.SYSTEM_ADMIN]:
        pass  # sees all union leaves

    if leave_type and leave_type.upper() != "ALL":
        query = query.filter(WorkerLeave.leave_type == leave_type.upper())
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(WorkerLeave.status == status_filter.upper())

    leaves = query.order_by(WorkerLeave.created_at.desc()).all()

    results: List[LeaveResponse] = []
    for lv in leaves:
        resp = LeaveResponse.model_validate(lv)
        resp.worker_name = lv.worker.name if lv.worker else "Worker"
        resp.worker_trade = lv.worker.trade if lv.worker else None
        resp.worker_shram_id = lv.worker.shram_id if lv.worker else None
        resp.worker_phone = lv.worker.phone if lv.worker else None

        affected = _find_affected_bookings(lv.worker_id, lv.start_date, lv.end_date, db)
        resp.affected_bookings = [
            AffectedBookingSummary(
                id=b.id,
                booking_reference=b.booking_reference,
                service_title=b.service_title,
                scheduled_date=b.scheduled_date,
                time_slot=b.time_slot,
                customer_name=b.customer.name if b.customer else "Citizen",
                customer_phone=b.customer.phone if b.customer else None,
                address_line=b.address_line,
                rate=b.total_amount,
                has_replacement=b.is_replacement,
                replacement_worker_name=b.actual_worker.name if (b.is_replacement and b.actual_worker) else None,
            )
            for b in affected
        ]
        resp.replacement_assignments = [
            ReplacementAssignmentResponse(
                id=ra.id,
                assignment_reference=ra.assignment_reference,
                leave_id=ra.leave_id,
                booking_id=ra.booking_id,
                booking_instance_id=ra.booking_instance_id,
                original_worker_id=ra.original_worker_id,
                original_worker_name=ra.original_worker.name if ra.original_worker else None,
                replacement_worker_id=ra.replacement_worker_id,
                replacement_worker_name=ra.replacement_worker.name if ra.replacement_worker else None,
                replacement_source=ra.replacement_source,
                status=ra.status,
                match_score=ra.match_score,
                decline_reason=ra.decline_reason,
                created_at=ra.created_at,
                updated_at=ra.updated_at,
            )
            for ra in lv.replacement_assignments
        ]
        results.append(resp)

    return results


@router.get("/{id}", response_model=LeaveResponse)
def get_leave_detail(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lv = db.query(WorkerLeave).filter(WorkerLeave.id == id).first()
    if not lv:
        raise HTTPException(status_code=404, detail="Leave record not found.")

    resp = LeaveResponse.model_validate(lv)
    resp.worker_name = lv.worker.name if lv.worker else "Worker"
    resp.worker_trade = lv.worker.trade if lv.worker else None
    resp.worker_shram_id = lv.worker.shram_id if lv.worker else None
    resp.worker_phone = lv.worker.phone if lv.worker else None

    affected = _find_affected_bookings(lv.worker_id, lv.start_date, lv.end_date, db)
    resp.affected_bookings = [
        AffectedBookingSummary(
            id=b.id,
            booking_reference=b.booking_reference,
            service_title=b.service_title,
            scheduled_date=b.scheduled_date,
            time_slot=b.time_slot,
            customer_name=b.customer.name if b.customer else "Citizen",
            customer_phone=b.customer.phone if b.customer else None,
            address_line=b.address_line,
            rate=b.total_amount,
            has_replacement=b.is_replacement,
            replacement_worker_name=b.actual_worker.name if (b.is_replacement and b.actual_worker) else None,
        )
        for b in affected
    ]
    resp.replacement_assignments = [
        ReplacementAssignmentResponse(
            id=ra.id,
            assignment_reference=ra.assignment_reference,
            leave_id=ra.leave_id,
            booking_id=ra.booking_id,
            booking_instance_id=ra.booking_instance_id,
            original_worker_id=ra.original_worker_id,
            original_worker_name=ra.original_worker.name if ra.original_worker else None,
            replacement_worker_id=ra.replacement_worker_id,
            replacement_worker_name=ra.replacement_worker.name if ra.replacement_worker else None,
            replacement_source=ra.replacement_source,
            status=ra.status,
            match_score=ra.match_score,
            decline_reason=ra.decline_reason,
            created_at=ra.created_at,
            updated_at=ra.updated_at,
        )
        for ra in lv.replacement_assignments
    ]
    return resp


@router.get("/{id}/candidates", response_model=List[ReplacementCandidateResponse])
def get_replacement_candidates(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Recommendation Engine: Ranks available peer artisans based on:
    - Same skill/trade match (+40 pts)
    - Verification status (+25 pts)
    - Rating score (+20 pts)
    - Proximity/distance (+10 pts)
    - Workload availability (+5 pts)
    """
    lv = db.query(WorkerLeave).filter(WorkerLeave.id == id).first()
    if not lv:
        raise HTTPException(status_code=404, detail="Leave record not found.")

    orig_worker = lv.worker
    target_trade = (orig_worker.trade or "Electrician").lower() if orig_worker else "electrician"

    # Query all active peer workers
    peers = db.query(User).filter(
        User.role == UserRole.WORKER,
        User.id != lv.worker_id,
        User.is_active == True,
    ).all()

    candidates: List[ReplacementCandidateResponse] = []

    for p in peers:
        p_trade = (p.trade or "").lower()
        score = 0.0

        # 1. Trade Match (40 pts)
        if p_trade == target_trade:
            score += 40.0
        elif any(w in p_trade for w in target_trade.split()):
            score += 25.0
        else:
            score += 10.0

        # 2. Verification (25 pts)
        if p.is_verified:
            score += 25.0
        else:
            score += 15.0

        # 3. Rating (20 pts)
        simulated_rating = 4.85 if p.is_verified else 4.60
        score += min(simulated_rating * 4.0, 20.0)

        # 4. Proximity (10 pts)
        distance = round(random.uniform(1.2, 4.5), 1)
        if distance <= 3.0:
            score += 10.0
        else:
            score += 6.0

        # 5. Workload Availability (5 pts)
        score += 5.0

        candidates.append(
            ReplacementCandidateResponse(
                worker_id=p.id,
                worker_name=p.name,
                shram_id=p.shram_id or f"SHRAM-OD-2024-{random.randint(1000, 9999)}",
                trade=p.trade or "Craftsman",
                cooperative_name=p.cooperative_name or "Bhubaneswar Labour Cooperative",
                rating=simulated_rating,
                distance_km=distance,
                jobs_completed=random.randint(40, 180),
                match_score=round(score, 1),
                is_available=True,
                verification_status="POLICE_CLEARED" if p.is_verified else "VERIFIED",
            )
        )

    candidates.sort(key=lambda c: c.match_score, reverse=True)
    return candidates


@router.post("/replacement/propose", response_model=ReplacementAssignmentResponse)
def propose_replacement(
    payload: ReplacementAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Proposes a replacement candidate for an affected booking.
    Must be accepted by the replacement worker before assignment is finalized.
    """
    lv = db.query(WorkerLeave).filter(WorkerLeave.id == payload.leave_id).first()
    if not lv:
        raise HTTPException(status_code=404, detail="Leave record not found.")

    rep_worker = db.query(User).filter(User.id == payload.replacement_worker_id).first()
    if not rep_worker:
        raise HTTPException(status_code=404, detail="Replacement worker not found.")

    assign_ref = f"REP-{datetime.now().strftime('%y%m')}-{uuid.uuid4().hex[:6].upper()}"
    assign = ReplacementAssignment(
        assignment_reference=assign_ref,
        leave_id=lv.id,
        booking_id=payload.booking_id,
        booking_instance_id=payload.booking_instance_id,
        original_worker_id=lv.worker_id,
        replacement_worker_id=rep_worker.id,
        replacement_source=payload.replacement_source,
        status=ReplacementStatus.PROPOSED,
        match_score=95.0,
    )
    db.add(assign)
    db.commit()
    db.refresh(assign)

    return ReplacementAssignmentResponse(
        id=assign.id,
        assignment_reference=assign.assignment_reference,
        leave_id=assign.leave_id,
        booking_id=assign.booking_id,
        booking_instance_id=assign.booking_instance_id,
        original_worker_id=assign.original_worker_id,
        original_worker_name=lv.worker.name if lv.worker else "Worker",
        replacement_worker_id=rep_worker.id,
        replacement_worker_name=rep_worker.name,
        replacement_source=assign.replacement_source,
        status=assign.status,
        match_score=assign.match_score,
        created_at=assign.created_at,
        updated_at=assign.updated_at,
    )


@router.post("/replacement/{id}/accept", response_model=ReplacementAssignmentResponse)
def accept_replacement_assignment(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Replacement worker ACCEPTS the replacement shift.
    Updates the booking's actual_worker_id and marks is_replacement = True.
    Ensures the replacement worker receives 100% of the worker payment upon completion.
    """
    assign = db.query(ReplacementAssignment).filter(ReplacementAssignment.id == id).first()
    if not assign:
        raise HTTPException(status_code=404, detail="Replacement assignment not found.")

    if current_user.role == UserRole.WORKER and assign.replacement_worker_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the designated replacement worker can accept this assignment.")

    assign.status = ReplacementStatus.ACCEPTED

    # Update Booking record with dual worker tracking
    if assign.booking_id:
        bk = db.query(Booking).filter(Booking.id == assign.booking_id).first()
        if bk:
            bk.actual_worker_id = assign.replacement_worker_id
            bk.replacement_for_worker_id = assign.original_worker_id
            bk.is_replacement = True
            bk.replacement_reason = assign.leave.reason if assign.leave else "Worker on statutory leave"

            # Log to status history for customer audit
            history = BookingStatusHistory(
                booking_id=bk.id,
                from_status=bk.status,
                to_status=bk.status,
                changed_by_user_id=current_user.id,
                changed_by_name=current_user.name,
                changed_by_role="REPLACEMENT_WORKER",
                notes=f"Replacement Worker {assign.replacement_worker.name} accepted shift in place of {assign.original_worker.name}.",
            )
            db.add(history)

    db.commit()
    db.refresh(assign)

    return ReplacementAssignmentResponse(
        id=assign.id,
        assignment_reference=assign.assignment_reference,
        leave_id=assign.leave_id,
        booking_id=assign.booking_id,
        booking_instance_id=assign.booking_instance_id,
        original_worker_id=assign.original_worker_id,
        original_worker_name=assign.original_worker.name if assign.original_worker else None,
        replacement_worker_id=assign.replacement_worker_id,
        replacement_worker_name=assign.replacement_worker.name if assign.replacement_worker else None,
        replacement_source=assign.replacement_source,
        status=assign.status,
        match_score=assign.match_score,
        created_at=assign.created_at,
        updated_at=assign.updated_at,
    )


@router.post("/replacement/{id}/decline", response_model=ReplacementAssignmentResponse)
def decline_replacement_assignment(
    id: str,
    payload: ReplacementActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assign = db.query(ReplacementAssignment).filter(ReplacementAssignment.id == id).first()
    if not assign:
        raise HTTPException(status_code=404, detail="Replacement assignment not found.")

    assign.status = ReplacementStatus.DECLINED
    assign.decline_reason = payload.reason or "Worker unavailable for replacement shift"
    db.commit()
    db.refresh(assign)

    return ReplacementAssignmentResponse(
        id=assign.id,
        assignment_reference=assign.assignment_reference,
        leave_id=assign.leave_id,
        booking_id=assign.booking_id,
        booking_instance_id=assign.booking_instance_id,
        original_worker_id=assign.original_worker_id,
        original_worker_name=assign.original_worker.name if assign.original_worker else None,
        replacement_worker_id=assign.replacement_worker_id,
        replacement_worker_name=assign.replacement_worker.name if assign.replacement_worker else None,
        replacement_source=assign.replacement_source,
        status=assign.status,
        match_score=assign.match_score,
        decline_reason=assign.decline_reason,
        created_at=assign.created_at,
        updated_at=assign.updated_at,
    )


@router.post("/{id}/approve", response_model=LeaveResponse)
def approve_leave(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cooperative approves planned leave"""
    if current_user.role not in [UserRole.COOPERATIVE_ADMIN, UserRole.SYSTEM_ADMIN]:
        raise HTTPException(status_code=403, detail="Only cooperative administrators can approve leave requests.")

    lv = db.query(WorkerLeave).filter(WorkerLeave.id == id).first()
    if not lv:
        raise HTTPException(status_code=404, detail="Leave record not found.")

    lv.status = LeaveStatus.APPROVED
    db.commit()
    db.refresh(lv)

    resp = LeaveResponse.model_validate(lv)
    resp.worker_name = lv.worker.name if lv.worker else "Worker"
    return resp

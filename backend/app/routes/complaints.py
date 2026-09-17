import uuid
import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus, BookingStatusHistory
from app.models.complaint import (
    Complaint,
    ComplaintActionHistory,
    ComplaintCategory,
    ComplaintStatus,
)
from app.models.audit import AuditLog
from app.schemas.complaint import (
    ComplaintCreateRequest,
    ComplaintStatusUpdateRequest,
    ComplaintResolveRequest,
    ComplaintEscalateRequest,
    ComplaintHistoryResponse,
    ComplaintResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/complaints", tags=["Complaints & Trust System"])


def _map_complaint_response(c: Complaint, db: Session) -> ComplaintResponse:
    creator = db.query(User).filter(User.id == c.created_by_id).first()
    assigned = db.query(User).filter(User.id == c.assigned_to_id).first() if c.assigned_to_id else None
    resolved = db.query(User).filter(User.id == c.resolved_by_id).first() if c.resolved_by_id else None

    actions = (
        db.query(ComplaintActionHistory)
        .filter(ComplaintActionHistory.complaint_id == c.id)
        .order_by(ComplaintActionHistory.created_at.asc())
        .all()
    )

    return ComplaintResponse(
        id=c.id,
        complaint_reference=c.complaint_reference,
        booking_id=c.booking_id,
        category=c.category,
        title=c.title,
        description=c.description,
        evidence=c.evidence or [],
        created_by_id=c.created_by_id,
        created_by_name=creator.name if creator else "User",
        created_by_role=c.created_by_role,
        cooperative_code=c.cooperative_code,
        assigned_to_id=c.assigned_to_id,
        assigned_to_name=assigned.name if assigned else None,
        status=c.status,
        resolution_notes=c.resolution_notes,
        resolved_by_id=c.resolved_by_id,
        resolved_by_name=resolved.name if resolved else None,
        resolved_at=c.resolved_at,
        escalated_at=c.escalated_at,
        escalation_reason=c.escalation_reason,
        created_at=c.created_at,
        updated_at=c.updated_at,
        actions=[
            ComplaintHistoryResponse(
                id=a.id,
                complaint_id=a.complaint_id,
                actor_id=a.actor_id,
                actor_name=a.actor_name,
                actor_role=a.actor_role,
                from_status=a.from_status,
                to_status=a.to_status,
                action=a.action,
                notes=a.notes,
                created_at=a.created_at,
            )
            for a in actions
        ],
    )


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def file_complaint(
    payload: ComplaintCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    File a formal grievance / complaint with booking link and evidence.
    """
    coop_code = payload.cooperative_code or "OD-KHR-COOP-041"

    if payload.booking_id:
        booking = db.query(Booking).filter(Booking.id == payload.booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Referenced booking not found.")

        # Ensure user was involved in the booking or is admin
        is_involved = (
            current_user.id in [booking.customer_id, booking.scheduled_worker_id, booking.actual_worker_id]
            or current_user.role == UserRole.SYSTEM_ADMIN
        )
        if not is_involved:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to file a grievance on a booking you did not participate in.",
            )

        coop_code = booking.cooperative_code or coop_code

        # Mark booking as DISPUTED if it's active
        if booking.status not in [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.DISPUTED]:
            booking.status = BookingStatus.DISPUTED
            history = BookingStatusHistory(
                booking_id=booking.id,
                from_status=booking.status,
                to_status=BookingStatus.DISPUTED,
                changed_by_user_id=current_user.id,
                changed_by_name=current_user.name,
                changed_by_role=current_user.role.value,
                notes=f"Complaint filed: {payload.title}",
            )
            db.add(history)

    ref = f"CMP-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"

    complaint = Complaint(
        complaint_reference=ref,
        booking_id=payload.booking_id,
        category=payload.category,
        title=payload.title,
        description=payload.description,
        evidence=payload.evidence,
        created_by_id=current_user.id,
        created_by_role=current_user.role.value,
        cooperative_code=coop_code,
        status=ComplaintStatus.OPEN,
    )
    db.add(complaint)
    db.flush()

    action = ComplaintActionHistory(
        complaint_id=complaint.id,
        actor_id=current_user.id,
        actor_name=current_user.name,
        actor_role=current_user.role.value,
        from_status=None,
        to_status=ComplaintStatus.OPEN,
        action="FILED",
        notes=f"Grievance lodged under category {payload.category.value}.",
    )
    db.add(action)

    audit = AuditLog(
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code=coop_code,
        action="COMPLAINT_FILED",
        target_type="COMPLAINT",
        target_id=complaint.id,
        target_name=complaint.complaint_reference,
        details=f"Category: {payload.category.value}, Title: {payload.title}",
    )
    db.add(audit)

    db.commit()
    db.refresh(complaint)

    return _map_complaint_response(complaint, db)


@router.get("", response_model=List[ComplaintResponse])
def list_complaints(
    category: Optional[ComplaintCategory] = None,
    status_filter: Optional[ComplaintStatus] = Query(None, alias="status"),
    cooperative_code: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List complaints with strict role-based data isolation.
    - System Admin: sees all / escalated complaints across platform
    - Cooperative Admin: sees complaints belonging to their cooperative
    - Citizen / Worker: sees only complaints filed by themselves or linked to their bookings
    """
    query = db.query(Complaint)

    if current_user.role == UserRole.SYSTEM_ADMIN:
        if cooperative_code:
            query = query.filter(Complaint.cooperative_code == cooperative_code)
    elif current_user.role == UserRole.COOPERATIVE_ADMIN:
        user_coop = "OD-KHR-COOP-041"
        query = query.filter(Complaint.cooperative_code == user_coop)
    else:
        # Customer, Worker, Institution: view only their own filed complaints
        query = query.filter(Complaint.created_by_id == current_user.id)

    if category:
        query = query.filter(Complaint.category == category)
    if status_filter:
        query = query.filter(Complaint.status == status_filter)

    complaints = query.order_by(Complaint.created_at.desc()).all()
    return [_map_complaint_response(c, db) for c in complaints]


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint_detail(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint record not found.")

    # Privacy & Access Control Check
    if current_user.role == UserRole.SYSTEM_ADMIN:
        pass
    elif current_user.role == UserRole.COOPERATIVE_ADMIN:
        if complaint.cooperative_code != "OD-KHR-COOP-041":
            raise HTTPException(status_code=403, detail="Access denied to other cooperative's grievance files.")
    else:
        if complaint.created_by_id != current_user.id:
            # Check if user is linked booking participant
            if complaint.booking_id:
                booking = db.query(Booking).filter(Booking.id == complaint.booking_id).first()
                if not booking or current_user.id not in [booking.customer_id, booking.scheduled_worker_id, booking.actual_worker_id]:
                    raise HTTPException(status_code=403, detail="Access restricted to dispute participants.")
            else:
                raise HTTPException(status_code=403, detail="Access restricted.")

    return _map_complaint_response(complaint, db)


@router.post("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: str,
    payload: ComplaintStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Cooperative Conciliator or Admin moves complaint state (e.g. OPEN -> UNDER_REVIEW).
    """
    if current_user.role not in [UserRole.COOPERATIVE_ADMIN, UserRole.SYSTEM_ADMIN]:
        raise HTTPException(
            status_code=403,
            detail="Only Cooperative conciliation officers or System Admins can update complaint review status.",
        )

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    old_status = complaint.status
    complaint.status = payload.status
    complaint.assigned_to_id = current_user.id

    action = ComplaintActionHistory(
        complaint_id=complaint.id,
        actor_id=current_user.id,
        actor_name=current_user.name,
        actor_role=current_user.role.value,
        from_status=old_status,
        to_status=payload.status,
        action="STATUS_UPDATED",
        notes=payload.notes or f"Moved from {old_status.value} to {payload.status.value}",
    )
    db.add(action)

    audit = AuditLog(
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code=complaint.cooperative_code,
        action="COMPLAINT_STATUS_CHANGED",
        target_type="COMPLAINT",
        target_id=complaint.id,
        target_name=complaint.complaint_reference,
        details=f"Status: {old_status.value} -> {payload.status.value}. Notes: {payload.notes or 'None'}",
    )
    db.add(audit)

    db.commit()
    db.refresh(complaint)

    return _map_complaint_response(complaint, db)


@router.post("/{complaint_id}/resolve", response_model=ComplaintResponse)
def resolve_complaint(
    complaint_id: str,
    payload: ComplaintResolveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Officially resolve grievance with conciliation binding order notes.
    """
    if current_user.role not in [UserRole.COOPERATIVE_ADMIN, UserRole.SYSTEM_ADMIN]:
        raise HTTPException(
            status_code=403,
            detail="Only Cooperative conciliation officers or System Admins can record dispute resolutions.",
        )

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    old_status = complaint.status
    complaint.status = ComplaintStatus.RESOLVED
    complaint.resolution_notes = payload.resolution_notes
    complaint.resolved_by_id = current_user.id
    complaint.resolved_at = datetime.now(timezone.utc)

    action = ComplaintActionHistory(
        complaint_id=complaint.id,
        actor_id=current_user.id,
        actor_name=current_user.name,
        actor_role=current_user.role.value,
        from_status=old_status,
        to_status=ComplaintStatus.RESOLVED,
        action="RESOLVED",
        notes=payload.resolution_notes,
    )
    db.add(action)

    audit = AuditLog(
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code=complaint.cooperative_code,
        action="COMPLAINT_RESOLVED",
        target_type="COMPLAINT",
        target_id=complaint.id,
        target_name=complaint.complaint_reference,
        details=f"Resolution Decision: {payload.resolution_notes}",
    )
    db.add(audit)

    db.commit()
    db.refresh(complaint)

    return _map_complaint_response(complaint, db)


@router.post("/{complaint_id}/escalate", response_model=ComplaintResponse)
def escalate_complaint(
    complaint_id: str,
    payload: ComplaintEscalateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Escalate dispute to State DPI System Administrator for appellate arbitration.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found.")

    # Authorized: Cooperative Admin, System Admin, or the Complainant
    if current_user.role not in [UserRole.COOPERATIVE_ADMIN, UserRole.SYSTEM_ADMIN] and current_user.id != complaint.created_by_id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to escalate this grievance.",
        )

    old_status = complaint.status
    complaint.status = ComplaintStatus.ESCALATED
    complaint.escalated_at = datetime.now(timezone.utc)
    complaint.escalation_reason = payload.escalation_reason

    action = ComplaintActionHistory(
        complaint_id=complaint.id,
        actor_id=current_user.id,
        actor_name=current_user.name,
        actor_role=current_user.role.value,
        from_status=old_status,
        to_status=ComplaintStatus.ESCALATED,
        action="ESCALATED",
        notes=payload.escalation_reason,
    )
    db.add(action)

    audit = AuditLog(
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code=complaint.cooperative_code,
        action="COMPLAINT_ESCALATED",
        target_type="COMPLAINT",
        target_id=complaint.id,
        target_name=complaint.complaint_reference,
        details=f"Escalated to State DPI Admin. Reason: {payload.escalation_reason}",
    )
    db.add(audit)

    db.commit()
    db.refresh(complaint)

    return _map_complaint_response(complaint, db)

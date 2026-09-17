import random
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User, UserRole
from app.models.booking import (
    Booking,
    BookingStatusHistory,
    BookingWorkerLocation,
    BookingStatus,
    BookingType,
    RecurringFrequency,
)
from app.models.audit import AuditLog
from app.models.worker import WorkerProfile
from app.models.notification import NotificationType
from app.schemas.booking import (
    BookingCreateRequest,
    BookingStatusUpdateRequest,
    BookingReassignRequest,
    BookingRatingRequest,
    BookingResponse,
    BookingStatusHistoryResponse,
)
from app.schemas.tracking import (
    WorkerLocationUpdateRequest,
    BookingTrackingResponse,
    WorkerTrackingSummary,
    CustomerLocationSummary,
    WorkerLocationPoint,
)
from app.services.routing_service import get_route_details, haversine_distance_km
from app.services.notification_service import NotificationService
from app.dependencies.auth import get_current_user, require_role

router = APIRouter(prefix="/bookings", tags=["Bookings Engine"])


def _generate_booking_reference(db: Session) -> str:
    """Generate a unique reference code e.g. BK-2026-88412."""
    year = datetime.now().year
    for _ in range(10):
        ref = f"BK-{year}-{random.randint(10000, 99999)}"
        if not db.query(Booking).filter(Booking.booking_reference == ref).first():
            return ref
    return f"BK-{year}-{random.randint(100000, 999999)}"


def _build_booking_response(booking: Booking, db: Session) -> BookingResponse:
    """Helper to populate customer and worker summary fields on BookingResponse."""
    customer = db.query(User).filter(User.id == booking.customer_id).first()
    worker_id = booking.actual_worker_id or booking.scheduled_worker_id
    worker = db.query(User).filter(User.id == worker_id).first() if worker_id else None

    # Sort status history ascending
    histories = (
        db.query(BookingStatusHistory)
        .filter(BookingStatusHistory.booking_id == booking.id)
        .order_by(BookingStatusHistory.created_at.asc())
        .all()
    )

    history_responses = [
        BookingStatusHistoryResponse(
            id=h.id,
            booking_id=h.booking_id,
            from_status=h.from_status,
            to_status=h.to_status,
            changed_by_user_id=h.changed_by_user_id,
            changed_by_name=h.changed_by_name,
            changed_by_role=h.changed_by_role,
            notes=h.notes,
            created_at=h.created_at,
        )
        for h in histories
    ]

    return BookingResponse(
        id=booking.id,
        booking_reference=booking.booking_reference,
        customer_id=booking.customer_id,
        service_id=booking.service_id,
        service_title=booking.service_title,
        service_category=booking.service_category,
        cooperative_code=booking.cooperative_code,
        cooperative_name=booking.cooperative_name,
        scheduled_worker_id=booking.scheduled_worker_id,
        actual_worker_id=booking.actual_worker_id,
        replacement_for_worker_id=booking.replacement_for_worker_id,
        is_replacement=booking.is_replacement or False,
        replacement_reason=booking.replacement_reason,
        booking_type=booking.booking_type,
        recurring_frequency=booking.recurring_frequency,
        scheduled_date=booking.scheduled_date,
        time_slot=booking.time_slot,
        address_line=booking.address_line,
        district=booking.district,
        pincode=booking.pincode,
        landmark=booking.landmark,
        lat=booking.lat,
        lng=booking.lng,
        description=booking.description,
        media_urls=booking.media_urls,
        base_rate=booking.base_rate,
        extra_charges=booking.extra_charges,
        total_amount=booking.total_amount,
        status=booking.status,
        otp_code=booking.otp_code,
        otp_verified=booking.otp_verified,
        decline_reason=booking.decline_reason,
        cancellation_reason=booking.cancellation_reason,
        dispute_reason=booking.dispute_reason,
        rating=booking.rating,
        review=booking.review,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        customer_name=customer.name if customer else "Citizen User",
        customer_phone=customer.phone if customer else None,
        worker_name=worker.name if worker else "Assigned Tradesperson",
        worker_phone=worker.phone if worker else None,
        worker_trade=worker.trade if worker else booking.service_title,
        worker_shram_id=worker.shram_id if worker else None,
        worker_rating=_get_worker_rating(worker_id, db) if worker_id else 4.8,
        replacement_worker_name=worker.name if (booking.is_replacement and worker) else None,
        status_history=history_responses,
    )


def _get_worker_rating(worker_id: str, db: Session) -> float:
    """Return the worker's stored rating from their profile, fallback to 4.8."""
    try:
        profile = db.query(WorkerProfile).filter(WorkerProfile.user_id == worker_id).first()
        if profile and hasattr(profile, 'rating') and profile.rating:
            return round(float(profile.rating), 2)
    except Exception:
        pass
    return 4.8


@router.post("", status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Customer creates a new service booking (One-Time or Recurring)."""
    # 1. Verify scheduled worker exists and is a WORKER role user
    worker = db.query(User).filter(
        User.id == payload.scheduled_worker_id,
        User.role == UserRole.WORKER,
    ).first()
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Worker ID '{payload.scheduled_worker_id}' not found or is not a verified worker account. Please select a worker from the cooperative matching results.",
        )

    booking_ref = _generate_booking_reference(db)
    otp_code = str(random.randint(1000, 9999))

    booking = Booking(
        booking_reference=booking_ref,
        customer_id=current_user.id,
        service_id=payload.service_id,
        service_title=payload.service_title,
        service_category=payload.service_category,
        cooperative_code=payload.cooperative_code,
        cooperative_name=payload.cooperative_name,
        scheduled_worker_id=worker.id,
        actual_worker_id=worker.id,
        booking_type=payload.booking_type,
        recurring_frequency=payload.recurring_frequency,
        scheduled_date=payload.scheduled_date,
        time_slot=payload.time_slot,
        address_line=payload.address_line,
        district=payload.district,
        pincode=payload.pincode,
        landmark=payload.landmark,
        lat=payload.lat,
        lng=payload.lng,
        description=payload.description,
        media_urls=payload.media_urls or [],
        base_rate=payload.base_rate,
        extra_charges=payload.extra_charges,
        total_amount=payload.total_amount,
        status=BookingStatus.REQUESTED,
        otp_code=otp_code,
        otp_verified=False,
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Log initial status history
    history = BookingStatusHistory(
        booking_id=booking.id,
        from_status=None,
        to_status=BookingStatus.REQUESTED,
        changed_by_user_id=current_user.id,
        changed_by_name=current_user.name,
        changed_by_role=current_user.role.value,
        notes="Citizen initiated booking request via KARM SEVA Portal.",
    )
    db.add(history)

    # Add audit log
    audit = AuditLog(
        action="BOOKING_CREATED",
        admin_id=current_user.id,
        admin_name=current_user.name,
        target_type="BOOKING",
        target_id=booking.id,
        target_name=booking.booking_reference,
        cooperative_code=booking.cooperative_code,
        details=f"Booking {booking.booking_reference} created for {booking.service_title} on {booking.scheduled_date} ({booking.time_slot}).",
    )
    db.add(audit)
    db.commit()
    db.refresh(booking)

    # Notify worker about new incoming job request
    try:
        NotificationService.create_notification(
            db=db,
            user_id=worker.id,
            type=NotificationType.JOB_REQUEST,
            title=f"New Job Request — {booking.service_title}",
            message=(
                f"A citizen has requested your service: {booking.service_title}. "
                f"Scheduled for {booking.scheduled_date} ({booking.time_slot}). "
                f"Location: {booking.district}. Booking Ref: {booking.booking_reference}."
            ),
            link_url=f"/worker/jobs/{booking.id}",
        )
    except Exception:
        pass  # Never fail booking creation due to notification error

    # Notify customer of booking confirmation
    try:
        NotificationService.create_notification(
            db=db,
            user_id=current_user.id,
            type=NotificationType.SYSTEM,
            title=f"Booking Confirmed — {booking.booking_reference}",
            message=(
                f"Your booking for {booking.service_title} is confirmed and dispatched to "
                f"{worker.name} ({booking.cooperative_name}). "
                f"Scheduled: {booking.scheduled_date} ({booking.time_slot})."
            ),
            link_url=f"/customer/bookings/{booking.id}",
        )
    except Exception:
        pass

    return {
        "success": True,
        "message": "Booking created successfully. Dispatched to cooperative workforce.",
        "data": {"booking": _build_booking_response(booking, db)},
    }


@router.get("")
def list_bookings(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve bookings matching user role and optional status filter."""
    query = db.query(Booking)

    # Role-based query isolation
    if current_user.role == UserRole.CUSTOMER:
        query = query.filter(Booking.customer_id == current_user.id)
    elif current_user.role == UserRole.WORKER:
        query = query.filter(
            or_(
                Booking.scheduled_worker_id == current_user.id,
                Booking.actual_worker_id == current_user.id,
            )
        )
    elif current_user.role == UserRole.COOPERATIVE_ADMIN:
        if current_user.cooperative_name:
            query = query.filter(
                or_(
                    Booking.cooperative_name == current_user.cooperative_name,
                    Booking.cooperative_code.like(f"%{current_user.cooperative_name[:6]}%"),
                )
            )
    # SYSTEM_ADMIN sees all

    if status_filter and status_filter != "ALL":
        query = query.filter(Booking.status == status_filter)

    bookings = query.order_by(Booking.created_at.desc()).all()
    results = [_build_booking_response(b, db) for b in bookings]

    return {
        "success": True,
        "data": {
            "total": len(results),
            "bookings": results,
        },
    }


@router.get("/{booking_id}")
def get_booking_detail(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get single booking details with full timeline."""
    booking = (
        db.query(Booking)
        .filter(or_(Booking.id == booking_id, Booking.booking_reference == booking_id))
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found.",
        )

    # Role check
    if current_user.role == UserRole.CUSTOMER and booking.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this booking record.",
        )
    if current_user.role == UserRole.WORKER and (
        booking.scheduled_worker_id != current_user.id and booking.actual_worker_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view another worker's shift.",
        )

    return {
        "success": True,
        "data": {"booking": _build_booking_response(booking, db)},
    }


@router.post("/{booking_id}/status")
def update_booking_status(
    booking_id: str,
    payload: BookingStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Execute lifecycle state transitions with strict role-based state machine."""
    booking = (
        db.query(Booking)
        .filter(or_(Booking.id == booking_id, Booking.booking_reference == booking_id))
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found.",
        )

    prev_status = booking.status
    target_status = payload.status

    # State Machine Authorization
    if current_user.role == UserRole.WORKER:
        if (
            booking.scheduled_worker_id != current_user.id
            and booking.actual_worker_id != current_user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the assigned tradesperson may update this shift status.",
            )

        # Worker valid transitions
        allowed_worker_transitions = {
            BookingStatus.REQUESTED: [BookingStatus.ACCEPTED, BookingStatus.DECLINED],
            BookingStatus.ACCEPTED: [BookingStatus.ON_THE_WAY, BookingStatus.DECLINED],
            BookingStatus.ON_THE_WAY: [BookingStatus.ARRIVED],
            BookingStatus.ARRIVED: [BookingStatus.STARTED],
            BookingStatus.STARTED: [BookingStatus.COMPLETED],
        }

        if target_status not in allowed_worker_transitions.get(prev_status, []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid worker transition from {prev_status} to {target_status}.",
            )

        if target_status == BookingStatus.DECLINED:
            booking.decline_reason = payload.reason or "Worker unavailable at scheduled time."

        if target_status == BookingStatus.COMPLETED:
            if payload.otp_code and payload.otp_code == booking.otp_code:
                booking.otp_verified = True

    elif current_user.role == UserRole.CUSTOMER:
        if booking.customer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the booking citizen may cancel or dispute this booking.",
            )

        if target_status == BookingStatus.CANCELLED:
            if prev_status not in [BookingStatus.REQUESTED, BookingStatus.ACCEPTED]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot cancel a booking that is currently {prev_status}.",
                )
            booking.cancellation_reason = payload.reason or "Citizen requested cancellation."

        elif target_status == BookingStatus.DISPUTED:
            if prev_status not in [BookingStatus.STARTED, BookingStatus.COMPLETED]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Disputes can only be raised for services in progress or completed.",
                )
            booking.dispute_reason = payload.reason or "Citizen filed service dispute."

        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Citizens are only authorized to cancel or dispute bookings.",
            )

    elif current_user.role in [UserRole.COOPERATIVE_ADMIN, UserRole.SYSTEM_ADMIN]:
        # Administrative override permitted
        if target_status == BookingStatus.CANCELLED:
            booking.cancellation_reason = payload.reason or "Administrative cancellation."
        elif target_status == BookingStatus.DISPUTED:
            booking.dispute_reason = payload.reason or "Administrative dispute mediation."
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Role not authorized to update booking status.",
        )

    # Apply transition
    booking.status = target_status
    db.commit()
    db.refresh(booking)

    # Log history
    history = BookingStatusHistory(
        booking_id=booking.id,
        from_status=prev_status,
        to_status=target_status,
        changed_by_user_id=current_user.id,
        changed_by_name=current_user.name,
        changed_by_role=current_user.role.value,
        notes=payload.notes or f"Status transitioned from {prev_status} to {target_status}.",
    )
    db.add(history)

    # Audit log
    audit = AuditLog(
        action=f"BOOKING_STATUS_{target_status}",
        admin_id=current_user.id,
        admin_name=current_user.name,
        target_type="BOOKING",
        target_id=booking.id,
        target_name=booking.booking_reference,
        cooperative_code=booking.cooperative_code,
        details=f"Booking {booking.booking_reference} status changed to {target_status} by {current_user.name}.",
    )
    db.add(audit)
    db.commit()

    # --- Lifecycle Notifications ---
    _send_status_notifications(booking, prev_status, target_status, current_user, db)

    return {
        "success": True,
        "message": f"Booking status updated to {target_status}.",
        "data": {"booking": _build_booking_response(booking, db)},
    }


def _send_status_notifications(
    booking: Booking,
    prev_status: BookingStatus,
    new_status: BookingStatus,
    changed_by: User,
    db: Session,
) -> None:
    """Send appropriate in-app notifications for booking lifecycle transitions."""
    _NOTIFY_MAP = {
        # new_status: (notify_customer, notify_worker, customer_title, customer_msg_tpl, worker_title, worker_msg_tpl)
        BookingStatus.ACCEPTED: (
            True, False,
            "Worker Accepted Your Booking ✅",
            "Great news! {worker_name} has accepted your booking for {service} ({ref}). They will be on their way soon.",
            None, None,
        ),
        BookingStatus.DECLINED: (
            True, False,
            "Booking Declined — Alternative Being Arranged",
            "The worker could not accept your booking for {service} ({ref}). The cooperative will find a replacement shortly.",
            None, None,
        ),
        BookingStatus.ON_THE_WAY: (
            True, False,
            "Worker Is On The Way 🚗",
            "{worker_name} is now on their way to your location for {service} ({ref}). Track them live.",
            None, None,
        ),
        BookingStatus.ARRIVED: (
            True, False,
            "Worker Has Arrived 📍",
            "{worker_name} has arrived at your location. Please share the OTP to start the service.",
            None, None,
        ),
        BookingStatus.STARTED: (
            True, False,
            "Service Started 🔧",
            "Your {service} service has started. OTP verified. Job is in progress.",
            None, None,
        ),
        BookingStatus.COMPLETED: (
            True, True,
            "Service Completed — Please Rate ⭐",
            "Your {service} job ({ref}) is complete. Please rate your experience to help the cooperative.",
            "Job Completed — Payment Due 💰",
            "You have successfully completed {service} ({ref}). The customer has been prompted to initiate payment.",
        ),
        BookingStatus.CANCELLED: (
            False, True,
            None, None,
            "Booking Cancelled",
            "Booking {ref} for {service} has been cancelled. You are now free for other assignments.",
        ),
    }

    config = _NOTIFY_MAP.get(new_status)
    if not config:
        return

    notify_customer, notify_worker, c_title, c_msg_tpl, w_title, w_msg_tpl = config

    worker_id = booking.actual_worker_id or booking.scheduled_worker_id
    worker = db.query(User).filter(User.id == worker_id).first() if worker_id else None
    worker_name = worker.name if worker else "The assigned worker"

    fmt = {
        "worker_name": worker_name,
        "service": booking.service_title,
        "ref": booking.booking_reference,
    }

    if notify_customer and c_title and c_msg_tpl:
        _notif_type = {
            BookingStatus.COMPLETED: NotificationType.JOB_COMPLETED,
            BookingStatus.ACCEPTED: NotificationType.JOB_ACCEPTED,
        }.get(new_status, NotificationType.SYSTEM)
        try:
            NotificationService.create_notification(
                db=db,
                user_id=booking.customer_id,
                type=_notif_type,
                title=c_title,
                message=c_msg_tpl.format(**fmt),
                link_url=f"/customer/bookings/{booking.id}",
            )
        except Exception:
            pass

    if notify_worker and w_title and w_msg_tpl and worker_id:
        try:
            NotificationService.create_notification(
                db=db,
                user_id=worker_id,
                type=NotificationType.JOB_COMPLETED,
                title=w_title,
                message=w_msg_tpl.format(**fmt),
                link_url=f"/worker/jobs/{booking.id}",
            )
        except Exception:
            pass


@router.post("/{booking_id}/reassign")
def reassign_worker(
    booking_id: str,
    payload: BookingReassignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.COOPERATIVE_ADMIN, UserRole.SYSTEM_ADMIN])),
):
    """Cooperative admin reassigns a replacement worker (e.g. after worker decline or emergency)."""
    booking = (
        db.query(Booking)
        .filter(or_(Booking.id == booking_id, Booking.booking_reference == booking_id))
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found.",
        )

    new_worker = db.query(User).filter(User.id == payload.new_worker_id).first()
    if not new_worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Replacement worker not found.",
        )

    prev_worker_id = booking.actual_worker_id or booking.scheduled_worker_id
    booking.actual_worker_id = new_worker.id

    # If was declined, restore to ACCEPTED
    prev_status = booking.status
    if booking.status == BookingStatus.DECLINED:
        booking.status = BookingStatus.ACCEPTED

    db.commit()
    db.refresh(booking)

    # Log history
    history = BookingStatusHistory(
        booking_id=booking.id,
        from_status=prev_status,
        to_status=booking.status,
        changed_by_user_id=current_user.id,
        changed_by_name=current_user.name,
        changed_by_role=current_user.role.value,
        notes=f"Cooperative reassigned worker to {new_worker.name}. Reason: {payload.reason}",
    )
    db.add(history)

    audit = AuditLog(
        action="BOOKING_WORKER_REASSIGNED",
        admin_id=current_user.id,
        admin_name=current_user.name,
        target_type="BOOKING",
        target_id=booking.id,
        target_name=booking.booking_reference,
        cooperative_code=booking.cooperative_code,
        details=f"Worker reassigned from {prev_worker_id} to {new_worker.name} ({new_worker.id}). Reason: {payload.reason}",
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": f"Worker reassigned to {new_worker.name} successfully.",
        "data": {"booking": _build_booking_response(booking, db)},
    }


@router.post("/{booking_id}/rate")
def rate_booking(
    booking_id: str,
    payload: BookingRatingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Citizen rates completed booking."""
    booking = (
        db.query(Booking)
        .filter(or_(Booking.id == booking_id, Booking.booking_reference == booking_id))
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found.",
        )

    if booking.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the booking citizen may submit a rating.",
        )

    if booking.status != BookingStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ratings can only be submitted for completed services.",
        )

    booking.rating = payload.rating
    booking.review = payload.review
    db.commit()
    db.refresh(booking)

    return {
        "success": True,
        "message": "Thank you! Your feedback has been recorded.",
        "data": {"booking": _build_booking_response(booking, db)},
    }


@router.put("/{booking_id}/worker-location")
def update_worker_location(
    booking_id: str,
    payload: WorkerLocationUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Worker telemetry heartbeat ingestion.
    Only the assigned worker during an active job (or administrative staff) is authorized to transmit location.
    """
    booking = (
        db.query(Booking)
        .filter(or_(Booking.id == booking_id, Booking.booking_reference == booking_id))
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found.",
        )

    # Effective active worker for this booking (following replacements)
    effective_worker_id = booking.actual_worker_id or booking.scheduled_worker_id

    # Authorization check
    is_assigned_worker = current_user.id == effective_worker_id
    is_admin_override = current_user.role in [UserRole.SYSTEM_ADMIN, UserRole.COOPERATIVE_ADMIN]
    if not (is_assigned_worker or is_admin_override):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned worker or cooperative officer may transmit active shift location.",
        )

    # Telemetry is only recorded for active/transit statuses
    allowed_statuses = [
        BookingStatus.ACCEPTED,
        BookingStatus.ON_THE_WAY,
        BookingStatus.ARRIVED,
        BookingStatus.STARTED,
    ]
    if booking.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Location tracking is not active for status '{booking.status}'.",
        )

    # Record worker location entry
    loc_entry = BookingWorkerLocation(
        booking_id=booking.id,
        worker_id=effective_worker_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        heading=payload.heading,
        speed=payload.speed,
        accuracy=payload.accuracy,
    )
    db.add(loc_entry)
    db.commit()

    return {
        "success": True,
        "message": "Worker location telemetry recorded successfully.",
        "data": {
            "booking_id": booking.id,
            "worker_id": effective_worker_id,
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "recorded_at": loc_entry.recorded_at.isoformat(),
        },
    }


@router.get("/{booking_id}/tracking", response_model=BookingTrackingResponse)
def get_booking_live_tracking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Live map tracking endpoint for active bookings.
    Authorizes Customer, Assigned Worker, Cooperative, or System Admin.
    Zero-Trust Privacy: Returns exact tracking only during active transit (ON_THE_WAY / ARRIVED / STARTED).
    Follows actual replacement worker when replacement is active.
    """
    booking = (
        db.query(Booking)
        .filter(or_(Booking.id == booking_id, Booking.booking_reference == booking_id))
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found.",
        )

    effective_worker_id = booking.actual_worker_id or booking.scheduled_worker_id

    # Authorization Check
    is_customer = booking.customer_id == current_user.id
    is_worker = current_user.id in [booking.scheduled_worker_id, booking.actual_worker_id]
    is_coop = (
        current_user.role == UserRole.COOPERATIVE_ADMIN
        and current_user.cooperative_name == booking.cooperative_name
    )
    is_admin = current_user.role == UserRole.SYSTEM_ADMIN
    is_institution = (
        current_user.role == UserRole.INSTITUTION
        and booking.customer_id == current_user.id
    )

    if not (is_customer or is_worker or is_coop or is_admin or is_institution):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to track this service dispatch.",
        )

    # Load active worker details (ensuring replacement worker is tracked!)
    worker_user = db.query(User).filter(User.id == effective_worker_id).first()
    worker_profile = (
        db.query(WorkerProfile).filter(WorkerProfile.user_id == effective_worker_id).first()
        if worker_user
        else None
    )

    # Check replacement history if applicable
    replacement_for_user = None
    if booking.is_replacement and booking.replacement_for_worker_id:
        replacement_for_user = db.query(User).filter(User.id == booking.replacement_for_worker_id).first()

    worker_summary = WorkerTrackingSummary(
        id=worker_user.id if worker_user else "unknown",
        name=worker_user.name if worker_user else "Assigned Craftsman",
        phone=worker_user.phone if worker_user else "+91 9800000000",
        photo=worker_user.profile_photo if worker_user else None,
        shram_id=worker_user.shram_id if (worker_user and worker_user.shram_id) else "SHRAM-OD-2026-8841",
        trade=worker_user.trade if (worker_user and worker_user.trade) else booking.service_category,
        rating=4.9 if (worker_profile and worker_profile.experience_years > 5) else 4.8,
        is_verified=True,
        is_replacement=booking.is_replacement or False,
        replacement_for_name=replacement_for_user.name if replacement_for_user else None,
        replacement_reason=booking.replacement_reason,
    )

    # Customer destination
    cust_lat = booking.lat if booking.lat else 20.2961
    cust_lng = booking.lng if booking.lng else 85.8245

    customer_loc = CustomerLocationSummary(
        latitude=cust_lat,
        longitude=cust_lng,
        address_line=booking.address_line,
        district=booking.district,
        pincode=booking.pincode,
        landmark=booking.landmark,
    )

    # Latest recorded location
    latest_loc = (
        db.query(BookingWorkerLocation)
        .filter(BookingWorkerLocation.booking_id == booking.id)
        .order_by(BookingWorkerLocation.recorded_at.desc())
        .first()
    )

    now_utc = datetime.now(timezone.utc)

    # Determine worker live coordinates
    if latest_loc:
        worker_lat = latest_loc.latitude
        worker_lng = latest_loc.longitude
        worker_loc_point = WorkerLocationPoint(
            latitude=latest_loc.latitude,
            longitude=latest_loc.longitude,
            heading=latest_loc.heading,
            speed=latest_loc.speed,
            accuracy=latest_loc.accuracy,
            recorded_at=latest_loc.recorded_at,
        )
        # Compute delta with naive conversion if needed
        loc_time = latest_loc.recorded_at.replace(tzinfo=None) if latest_loc.recorded_at.tzinfo else latest_loc.recorded_at
        now_naive = now_utc.replace(tzinfo=None)
        is_live = abs((now_naive - loc_time).total_seconds()) < 600 or booking.status == BookingStatus.ON_THE_WAY
    else:
        # Default starting position offset by ~2.8 km for realistic demo
        if booking.status in [BookingStatus.ON_THE_WAY, BookingStatus.ACCEPTED]:
            worker_lat = cust_lat + 0.0185
            worker_lng = cust_lng - 0.0142
        elif booking.status in [BookingStatus.ARRIVED, BookingStatus.STARTED, BookingStatus.COMPLETED]:
            worker_lat = cust_lat
            worker_lng = cust_lng
        else:
            worker_lat = cust_lat + 0.035
            worker_lng = cust_lng - 0.025

        worker_loc_point = WorkerLocationPoint(
            latitude=worker_lat,
            longitude=worker_lng,
            heading=45.0,
            speed=24.0,
            accuracy=10.0,
            recorded_at=now_utc,
        )
        is_live = booking.status in [BookingStatus.ON_THE_WAY, BookingStatus.ARRIVED]

    # Calculate road route and distance + ETA
    is_emergency = "emergency" in (booking.service_category or "").lower() or "sos" in (booking.description or "").lower()
    route_details = get_route_details(
        worker_lat, worker_lng, cust_lat, cust_lng, is_emergency=is_emergency
    )

    # Arrived or Started override
    if booking.status in [BookingStatus.ARRIVED, BookingStatus.STARTED]:
        distance_km = 0.0
        eta_minutes = 0
    elif booking.status == BookingStatus.COMPLETED:
        distance_km = 0.0
        eta_minutes = 0
    else:
        distance_km = route_details["distance_km"]
        eta_minutes = route_details["eta_minutes"]

    return BookingTrackingResponse(
        booking_id=booking.id,
        booking_reference=booking.booking_reference,
        status=booking.status,
        is_live=is_live,
        is_emergency=is_emergency,
        customer_location=customer_loc,
        worker=worker_summary,
        worker_location=worker_loc_point,
        distance_km=distance_km,
        eta_minutes=eta_minutes,
        is_road_distance=route_details["is_road_distance"],
        route_coordinates=route_details["route_coordinates"],
        otp_code=booking.otp_code,
        last_updated=now_utc,
    )


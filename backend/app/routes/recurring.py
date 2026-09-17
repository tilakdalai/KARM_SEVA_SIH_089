import random
import logging
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User, UserRole
from app.models.recurring import (
    RecurringSchedule,
    BookingInstance,
    RecurrenceType,
    ScheduleStatus,
    InstanceStatus,
)
from app.models.booking import Booking
from app.models.audit import AuditLog
from app.schemas.recurring import (
    RecurringScheduleCreateRequest,
    ScheduleActionRequest,
    ScheduleModifyRequest,
    RecurringScheduleResponse,
    BookingInstanceResponse,
    CalendarEventResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/recurring", tags=["Recurring Booking Engine"])

DAY_MAP = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}
DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _format_time_slot(start: str, end: str) -> str:
    """Format 24h string into human-readable slot, e.g. 09:00 -> 09:00 AM"""
    def _conv(t: str) -> str:
        parts = t.split(":")
        h = int(parts[0])
        m = parts[1] if len(parts) > 1 else "00"
        ampm = "AM" if h < 12 else "PM"
        h12 = h if h <= 12 else h - 12
        if h12 == 0:
            h12 = 12
        return f"{h12:02d}:{m} {ampm}"
    return f"{_conv(start)} - {_conv(end)}"


def _generate_instances(schedule: RecurringSchedule, db: Session) -> List[BookingInstance]:
    """
    Generates materialized booking instances ONLY after worker accepts the recurring proposal.
    """
    instances: List[BookingInstance] = []
    start_dt = datetime.strptime(schedule.start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(schedule.end_date, "%Y-%m-%d") if schedule.end_date else None
    
    count = 0
    max_count = schedule.total_occurrences or 4
    current_dt = start_dt

    if schedule.recurrence_type == RecurrenceType.ONE_TIME:
        day_name = DAY_NAMES[current_dt.weekday()]
        inst = BookingInstance(
            instance_reference=f"INST-{datetime.now().strftime('%y%m')}-{random.randint(10000, 99999)}",
            recurring_schedule_id=schedule.id,
            customer_id=schedule.customer_id,
            worker_id=schedule.worker_id,
            service_title=schedule.service_title,
            instance_date=current_dt.strftime("%Y-%m-%d"),
            day_of_week=day_name,
            start_time="09:00",
            end_time="12:00",
            time_slot=_format_time_slot("09:00", "12:00"),
            rate=schedule.rate_per_instance,
            status=InstanceStatus.SCHEDULED,
            otp_code=str(random.randint(1000, 9999)),
        )
        instances.append(inst)
        db.add(inst)

    elif schedule.recurrence_type == RecurrenceType.DAILY:
        while count < max_count:
            if end_dt and current_dt > end_dt:
                break
            day_name = DAY_NAMES[current_dt.weekday()]
            inst = BookingInstance(
                instance_reference=f"INST-{datetime.now().strftime('%y%m')}-{random.randint(10000, 99999)}",
                recurring_schedule_id=schedule.id,
                customer_id=schedule.customer_id,
                worker_id=schedule.worker_id,
                service_title=schedule.service_title,
                instance_date=current_dt.strftime("%Y-%m-%d"),
                day_of_week=day_name,
                start_time="09:00",
                end_time="12:00",
                time_slot=_format_time_slot("09:00", "12:00"),
                rate=schedule.rate_per_instance,
                status=InstanceStatus.SCHEDULED,
                otp_code=str(random.randint(1000, 9999)),
            )
            instances.append(inst)
            db.add(inst)
            count += 1
            current_dt += timedelta(days=1)

    elif schedule.recurrence_type == RecurrenceType.WEEKLY:
        while count < max_count:
            if end_dt and current_dt > end_dt:
                break
            day_name = DAY_NAMES[current_dt.weekday()]
            inst = BookingInstance(
                instance_reference=f"INST-{datetime.now().strftime('%y%m')}-{random.randint(10000, 99999)}",
                recurring_schedule_id=schedule.id,
                customer_id=schedule.customer_id,
                worker_id=schedule.worker_id,
                service_title=schedule.service_title,
                instance_date=current_dt.strftime("%Y-%m-%d"),
                day_of_week=day_name,
                start_time="09:00",
                end_time="12:00",
                time_slot=_format_time_slot("09:00", "12:00"),
                rate=schedule.rate_per_instance,
                status=InstanceStatus.SCHEDULED,
                otp_code=str(random.randint(1000, 9999)),
            )
            instances.append(inst)
            db.add(inst)
            count += 1
            current_dt += timedelta(days=7)

    elif schedule.recurrence_type == RecurrenceType.MONTHLY:
        while count < max_count:
            if end_dt and current_dt > end_dt:
                break
            day_name = DAY_NAMES[current_dt.weekday()]
            inst = BookingInstance(
                instance_reference=f"INST-{datetime.now().strftime('%y%m')}-{random.randint(10000, 99999)}",
                recurring_schedule_id=schedule.id,
                customer_id=schedule.customer_id,
                worker_id=schedule.worker_id,
                service_title=schedule.service_title,
                instance_date=current_dt.strftime("%Y-%m-%d"),
                day_of_week=day_name,
                start_time="09:00",
                end_time="12:00",
                time_slot=_format_time_slot("09:00", "12:00"),
                rate=schedule.rate_per_instance,
                status=InstanceStatus.SCHEDULED,
                otp_code=str(random.randint(1000, 9999)),
            )
            instances.append(inst)
            db.add(inst)
            count += 1
            current_dt += timedelta(days=28)

    elif schedule.recurrence_type == RecurrenceType.CUSTOM_SLOT and schedule.custom_slots:
        # custom_slots: list of dicts with day_of_week, start_time, end_time
        # Iterate day by day up to 90 days or max_count
        days_ahead = 0
        while count < max_count and days_ahead < 90:
            check_date = start_dt + timedelta(days=days_ahead)
            if end_dt and check_date > end_dt:
                break
            day_str = DAY_NAMES[check_date.weekday()].lower()

            for slot in schedule.custom_slots:
                slot_day = slot.get("day_of_week", "").strip().lower()
                if slot_day == day_str:
                    st = slot.get("start_time", "09:00")
                    et = slot.get("end_time", "12:00")
                    inst = BookingInstance(
                        instance_reference=f"INST-{datetime.now().strftime('%y%m')}-{random.randint(10000, 99999)}",
                        recurring_schedule_id=schedule.id,
                        customer_id=schedule.customer_id,
                        worker_id=schedule.worker_id,
                        service_title=schedule.service_title,
                        instance_date=check_date.strftime("%Y-%m-%d"),
                        day_of_week=DAY_NAMES[check_date.weekday()],
                        start_time=st,
                        end_time=et,
                        time_slot=_format_time_slot(st, et),
                        rate=schedule.rate_per_instance,
                        status=InstanceStatus.SCHEDULED,
                        otp_code=str(random.randint(1000, 9999)),
                    )
                    instances.append(inst)
                    db.add(inst)
                    count += 1
                    if count >= max_count:
                        break
            days_ahead += 1

    db.commit()
    return instances


@router.post("", response_model=RecurringScheduleResponse, status_code=status.HTTP_201_CREATED)
def propose_recurring_schedule(
    payload: RecurringScheduleCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Step 1: Propose recurring arrangement.
    Does NOT automatically generate future booking instances until the assigned worker accepts!
    """
    # Check worker exists
    worker = db.query(User).filter(User.id == payload.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Assigned worker was not found in registry.")

    # Calculate projected total
    occurrences = payload.total_occurrences or 4
    total_proj = payload.rate_per_instance * occurrences

    # Generate unique schedule reference
    for _ in range(10):
        ref_number = f"REC-{datetime.now().strftime('%Y')}-{random.randint(10000, 99999)}"
        if not db.query(RecurringSchedule).filter(RecurringSchedule.schedule_reference == ref_number).first():
            break
    else:
        ref_number = f"REC-{datetime.now().strftime('%Y')}-{random.randint(100000, 999999)}"

    # Convert custom_slots if present
    custom_slots_data = None
    if payload.custom_slots:
        custom_slots_data = [s.model_dump() for s in payload.custom_slots]

    schedule = RecurringSchedule(
        schedule_reference=ref_number,
        customer_id=current_user.id,
        worker_id=worker.id,
        service_id=payload.service_id,
        service_title=payload.service_title,
        service_category=payload.service_category,
        cooperative_code=payload.cooperative_code,
        cooperative_name=payload.cooperative_name,
        recurrence_type=payload.recurrence_type,
        custom_slots=custom_slots_data,
        start_date=payload.start_date,
        end_date=payload.end_date,
        total_occurrences=occurrences,
        rate_per_instance=payload.rate_per_instance,
        total_projected_amount=total_proj,
        address_line=payload.address_line,
        district=payload.district,
        pincode=payload.pincode,
        landmark=payload.landmark,
        status=ScheduleStatus.PENDING_WORKER_ACCEPTANCE,
        notes=payload.notes,
    )
    db.add(schedule)

    # Log audit
    audit = AuditLog(
        admin_id=current_user.id,
        admin_name=current_user.name,
        cooperative_code=payload.cooperative_code,
        action="PROPOSE_RECURRING_SCHEDULE",
        target_type="RECURRING_SCHEDULE",
        target_id=ref_number,
        target_name=payload.service_title,
        details=f"Recurring proposal created for worker {worker.name}. Awaiting worker acceptance.",
    )
    db.add(audit)
    db.commit()
    db.refresh(schedule)

    resp = RecurringScheduleResponse.model_validate(schedule)
    resp.customer_name = current_user.name
    resp.customer_phone = current_user.phone
    resp.worker_name = worker.name
    resp.worker_phone = worker.phone
    resp.instances = []
    return resp


@router.get("", response_model=List[RecurringScheduleResponse])
def get_recurring_schedules(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns recurring schedules based on role isolation.
    """
    query = db.query(RecurringSchedule)

    if current_user.role == UserRole.CUSTOMER:
        query = query.filter(RecurringSchedule.customer_id == current_user.id)
    elif current_user.role == UserRole.WORKER:
        query = query.filter(RecurringSchedule.worker_id == current_user.id)
    elif current_user.role == UserRole.COOPERATIVE_ADMIN:
        pass  # sees union schedules
    elif current_user.role == UserRole.INSTITUTION:
        query = query.filter(RecurringSchedule.customer_id == current_user.id)

    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(RecurringSchedule.status == status_filter.upper())

    records = query.order_by(RecurringSchedule.created_at.desc()).all()

    results: List[RecurringScheduleResponse] = []
    for r in records:
        resp = RecurringScheduleResponse.model_validate(r)
        resp.customer_name = r.customer.name if r.customer else "Citizen User"
        resp.customer_phone = r.customer.phone if r.customer else None
        resp.worker_name = r.worker.name if r.worker else "Verified Craftsman"
        resp.worker_phone = r.worker.phone if r.worker else None
        resp.instances = [BookingInstanceResponse.model_validate(i) for i in r.instances]
        results.append(resp)

    return results


@router.get("/calendar", response_model=List[CalendarEventResponse])
def get_calendar_events(
    month: Optional[str] = Query(None, description="Month in YYYY-MM format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Unified calendar event feed for month/week rendering.
    Returns both recurring booking instances and one-time bookings.
    """
    events: List[CalendarEventResponse] = []

    # 1. Fetch recurring instances
    inst_query = db.query(BookingInstance)
    if current_user.role == UserRole.CUSTOMER or current_user.role == UserRole.INSTITUTION:
        inst_query = inst_query.filter(BookingInstance.customer_id == current_user.id)
    elif current_user.role == UserRole.WORKER:
        inst_query = inst_query.filter(BookingInstance.worker_id == current_user.id)

    if month:
        inst_query = inst_query.filter(BookingInstance.instance_date.startswith(month))

    instances = inst_query.all()
    for inst in instances:
        events.append(
            CalendarEventResponse(
                id=inst.id,
                title=f"{inst.service_title} ({inst.time_slot})",
                date=inst.instance_date,
                day_of_week=inst.day_of_week or "Shift",
                start_time=inst.start_time,
                end_time=inst.end_time,
                time_slot=inst.time_slot,
                event_type="RECURRING_INSTANCE",
                status=inst.status.value,
                worker_name=inst.worker.name if inst.worker else "Worker",
                customer_name=inst.customer.name if inst.customer else "Customer",
                rate=inst.rate,
                schedule_reference=inst.schedule.schedule_reference if inst.schedule else None,
                otp_code=inst.otp_code,
            )
        )

    # 2. Fetch standard bookings
    bk_query = db.query(Booking)
    if current_user.role == UserRole.CUSTOMER or current_user.role == UserRole.INSTITUTION:
        bk_query = bk_query.filter(Booking.customer_id == current_user.id)
    elif current_user.role == UserRole.WORKER:
        bk_query = bk_query.filter(
            or_(Booking.scheduled_worker_id == current_user.id, Booking.actual_worker_id == current_user.id)
        )

    if month:
        bk_query = bk_query.filter(Booking.scheduled_date.startswith(month))

    bookings = bk_query.all()
    for bk in bookings:
        events.append(
            CalendarEventResponse(
                id=bk.id,
                title=f"{bk.service_title} - {bk.booking_reference}",
                date=bk.scheduled_date,
                day_of_week="Shift",
                start_time="09:00",
                end_time="12:00",
                time_slot=bk.time_slot,
                event_type="ONE_TIME_BOOKING",
                status=bk.status.value,
                worker_name=bk.scheduled_worker.name if bk.scheduled_worker else "Assigned Artisan",
                customer_name=bk.customer.name if bk.customer else "Citizen",
                rate=bk.total_amount,
                schedule_reference=bk.booking_reference,
                otp_code=bk.otp_code,
            )
        )

    events.sort(key=lambda e: e.date)
    return events


@router.get("/{id}", response_model=RecurringScheduleResponse)
def get_recurring_schedule_detail(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = db.query(RecurringSchedule).filter(RecurringSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Recurring schedule not found.")

    resp = RecurringScheduleResponse.model_validate(schedule)
    resp.customer_name = schedule.customer.name if schedule.customer else "Citizen"
    resp.customer_phone = schedule.customer.phone if schedule.customer else None
    resp.worker_name = schedule.worker.name if schedule.worker else "Craftsman"
    resp.worker_phone = schedule.worker.phone if schedule.worker else None
    resp.instances = [BookingInstanceResponse.model_validate(i) for i in schedule.instances]
    return resp


@router.post("/{id}/accept", response_model=RecurringScheduleResponse)
def accept_recurring_proposal(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Step 2: Worker reviews and ACCEPTS the proposed recurring schedule.
    This triggers instance generation and activates future calendar bookings!
    """
    schedule = db.query(RecurringSchedule).filter(RecurringSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Recurring schedule not found.")

    if current_user.role == UserRole.WORKER and schedule.worker_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the assigned tradesperson can accept this proposal.")

    if schedule.status != ScheduleStatus.PENDING_WORKER_ACCEPTANCE:
        raise HTTPException(status_code=400, detail=f"Schedule is not pending acceptance (status: {schedule.status}).")

    schedule.status = ScheduleStatus.ACTIVE
    db.commit()

    # Generate materialized instances
    _generate_instances(schedule, db)
    db.refresh(schedule)

    resp = RecurringScheduleResponse.model_validate(schedule)
    resp.customer_name = schedule.customer.name if schedule.customer else "Citizen"
    resp.worker_name = schedule.worker.name if schedule.worker else "Worker"
    resp.instances = [BookingInstanceResponse.model_validate(i) for i in schedule.instances]
    return resp


@router.post("/{id}/decline", response_model=RecurringScheduleResponse)
def decline_recurring_proposal(
    id: str,
    payload: ScheduleActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = db.query(RecurringSchedule).filter(RecurringSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Recurring schedule not found.")

    if current_user.role == UserRole.WORKER and schedule.worker_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the assigned worker can decline this proposal.")

    schedule.status = ScheduleStatus.DECLINED
    schedule.decline_reason = payload.reason or "Worker schedule conflict."
    db.commit()
    db.refresh(schedule)

    resp = RecurringScheduleResponse.model_validate(schedule)
    resp.instances = []
    return resp


@router.post("/{id}/pause", response_model=RecurringScheduleResponse)
def pause_recurring_schedule(
    id: str,
    payload: ScheduleActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = db.query(RecurringSchedule).filter(RecurringSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Recurring schedule not found.")

    schedule.status = ScheduleStatus.PAUSED
    if payload.notes:
        schedule.notes = (schedule.notes or "") + f" | Paused: {payload.notes}"

    # Mark future SCHEDULED instances as SKIPPED while paused
    for inst in schedule.instances:
        if inst.status == InstanceStatus.SCHEDULED:
            inst.status = InstanceStatus.SKIPPED

    db.commit()
    db.refresh(schedule)

    resp = RecurringScheduleResponse.model_validate(schedule)
    resp.instances = [BookingInstanceResponse.model_validate(i) for i in schedule.instances]
    return resp


@router.post("/{id}/resume", response_model=RecurringScheduleResponse)
def resume_recurring_schedule(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = db.query(RecurringSchedule).filter(RecurringSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Recurring schedule not found.")

    schedule.status = ScheduleStatus.ACTIVE

    # Restore SKIPPED instances back to SCHEDULED
    for inst in schedule.instances:
        if inst.status == InstanceStatus.SKIPPED:
            inst.status = InstanceStatus.SCHEDULED

    db.commit()
    db.refresh(schedule)

    resp = RecurringScheduleResponse.model_validate(schedule)
    resp.instances = [BookingInstanceResponse.model_validate(i) for i in schedule.instances]
    return resp


@router.post("/{id}/cancel", response_model=RecurringScheduleResponse)
def cancel_recurring_schedule(
    id: str,
    payload: ScheduleActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = db.query(RecurringSchedule).filter(RecurringSchedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Recurring schedule not found.")

    schedule.status = ScheduleStatus.CANCELLED
    schedule.cancellation_reason = payload.reason or "Cancelled by user."

    # Cancel all future SCHEDULED or SKIPPED instances
    for inst in schedule.instances:
        if inst.status in [InstanceStatus.SCHEDULED, InstanceStatus.SKIPPED]:
            inst.status = InstanceStatus.CANCELLED

    db.commit()
    db.refresh(schedule)

    resp = RecurringScheduleResponse.model_validate(schedule)
    resp.instances = [BookingInstanceResponse.model_validate(i) for i in schedule.instances]
    return resp


@router.post("/instances/{instance_id}/cancel", response_model=BookingInstanceResponse)
def cancel_single_instance(
    instance_id: str,
    payload: ScheduleActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Cancels a single specific future shift date without cancelling the entire recurring arrangement.
    """
    instance = db.query(BookingInstance).filter(BookingInstance.id == instance_id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Booking instance not found.")

    instance.status = InstanceStatus.CANCELLED
    if payload.reason:
        instance.notes = (instance.notes or "") + f" | Cancelled: {payload.reason}"

    db.commit()
    db.refresh(instance)
    return BookingInstanceResponse.model_validate(instance)

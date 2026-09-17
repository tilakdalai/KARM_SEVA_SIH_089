from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.notification import (
    NotificationResponse,
    NotificationListResponse,
    UnreadCountResponse,
    DeviceTokenRegisterRequest,
)
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=NotificationListResponse)
def get_notifications(
    unread_only: bool = Query(False, description="Filter only unread notifications"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve paginated notifications for the authenticated user.
    """
    notifications, total, unread_count = NotificationService.get_user_notifications(
        db=db,
        user_id=current_user.id,
        unread_only=unread_only,
        limit=limit,
        offset=offset,
    )
    return NotificationListResponse(
        total=total,
        unread_count=unread_count,
        notifications=[NotificationResponse.model_validate(n) for n in notifications],
    )


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_notification_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns the real-time unread notification count for the badge counter.
    """
    unread_count = NotificationService.get_unread_count(db=db, user_id=current_user.id)
    return UnreadCountResponse(unread_count=unread_count)


@router.post("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Mark a specific notification as read.
    """
    notification = NotificationService.mark_as_read(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id,
    )
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found or access denied.",
        )
    return NotificationResponse.model_validate(notification)


@router.post("/mark-all-read")
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Mark all unread notifications for the user as read.
    """
    updated_count = NotificationService.mark_all_as_read(db=db, user_id=current_user.id)
    return {"marked_read": updated_count, "status": "success"}


@router.post("/register-device")
def register_device_token(
    payload: DeviceTokenRegisterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Registers an FCM device token for browser/app push notifications.
    Server credentials are never exposed to the client.
    """
    token_record = NotificationService.register_device_token(
        db=db,
        user_id=current_user.id,
        fcm_token=payload.fcm_token,
        device_type=payload.device_type or "web",
    )
    return {
        "status": "registered",
        "device_type": token_record.device_type,
        "is_active": token_record.is_active,
    }

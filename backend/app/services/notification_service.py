import logging
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.notification import Notification, NotificationType, UserDeviceToken

logger = logging.getLogger(__name__)


class NotificationService:
    @staticmethod
    def create_notification(
        db: Session,
        user_id: str,
        type: NotificationType,
        title: str,
        message: str,
        link_url: Optional[str] = None,
    ) -> Notification:
        """
        Creates a canonical database notification.
        Triggers optional server-side FCM push delivery.
        Guarantees: Database notification remains canonical even if push fails.
        """
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            link_url=link_url,
            is_read=False,
            created_at=datetime.now(timezone.utc),
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)

        # Optional FCM Push dispatch
        try:
            NotificationService._dispatch_fcm_push(db, user_id, notification)
        except Exception as exc:
            # Never fail the canonical DB record if push fails
            logger.warning(f"FCM push dispatch failed for user {user_id} (canonical DB saved): {exc}")

        return notification

    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: str,
        unread_only: bool = False,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Notification], int, int]:
        """
        Returns (notifications, total_count, unread_count) for the user.
        """
        query = db.query(Notification).filter(Notification.user_id == user_id)
        
        # Calculate total unread count
        unread_count = db.query(func.count(Notification.id)).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).scalar() or 0

        if unread_only:
            query = query.filter(Notification.is_read == False)

        total_count = query.count()
        notifications = query.order_by(Notification.created_at.desc()).offset(offset).limit(limit).all()

        return notifications, total_count, unread_count

    @staticmethod
    def get_unread_count(db: Session, user_id: str) -> int:
        count = db.query(func.count(Notification.id)).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).scalar()
        return count or 0

    @staticmethod
    def mark_as_read(db: Session, notification_id: str, user_id: str) -> Optional[Notification]:
        notification = db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id,
        ).first()

        if not notification:
            return None

        if not notification.is_read:
            notification.is_read = True
            notification.read_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(notification)

        return notification

    @staticmethod
    def mark_all_as_read(db: Session, user_id: str) -> int:
        now = datetime.now(timezone.utc)
        updated_count = db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        ).update(
            {
                Notification.is_read: True,
                Notification.read_at: now,
            },
            synchronize_session=False,
        )
        db.commit()
        return updated_count

    @staticmethod
    def register_device_token(
        db: Session,
        user_id: str,
        fcm_token: str,
        device_type: str = "web",
    ) -> UserDeviceToken:
        existing = db.query(UserDeviceToken).filter(
            UserDeviceToken.user_id == user_id,
            UserDeviceToken.fcm_token == fcm_token,
        ).first()

        if existing:
            existing.is_active = True
            existing.device_type = device_type
            existing.updated_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(existing)
            return existing

        token_record = UserDeviceToken(
            user_id=user_id,
            fcm_token=fcm_token,
            device_type=device_type,
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(token_record)
        db.commit()
        db.refresh(token_record)
        return token_record

    @staticmethod
    def _dispatch_fcm_push(db: Session, user_id: str, notification: Notification) -> None:
        """
        Dispatches server-side push notification to active registered devices for this user.
        Fails safely without breaking DB transaction.
        """
        active_tokens = db.query(UserDeviceToken).filter(
            UserDeviceToken.user_id == user_id,
            UserDeviceToken.is_active == True,
        ).all()

        if not active_tokens:
            logger.debug(f"No active FCM tokens for user {user_id}. Push skipped.")
            return

        for token in active_tokens:
            # Here we format standard FCM HTTP v1 payload:
            # {
            #   "message": {
            #       "token": token.fcm_token,
            #       "notification": { "title": notification.title, "body": notification.message },
            #       "data": { "type": notification.type.value, "link_url": notification.link_url or "" }
            #   }
            # }
            logger.info(
                f"[FCM Push Simulation] Sent push to token={token.fcm_token[:10]}... "
                f"title='{notification.title}' type={notification.type.value}"
            )

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.notification import NotificationType


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    type: NotificationType
    title: str
    message: str
    link_url: Optional[str] = None
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime


class NotificationListResponse(BaseModel):
    total: int
    unread_count: int
    notifications: List[NotificationResponse]


class UnreadCountResponse(BaseModel):
    unread_count: int


class DeviceTokenRegisterRequest(BaseModel):
    fcm_token: str = Field(..., min_length=10)
    device_type: Optional[str] = "web"

from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard API response contract across all KARM SEVA endpoints."""
    success: bool = True
    message: Optional[str] = None
    data: Optional[T] = None


class ErrorResponse(BaseModel):
    """Standard error response contract."""
    success: bool = False
    message: str
    errors: Optional[Any] = None


class HealthResponse(BaseModel):
    """Health check response payload."""
    status: str = "healthy"
    app_name: str
    environment: str
    version: str = "1.0.0"
    database_connected: bool

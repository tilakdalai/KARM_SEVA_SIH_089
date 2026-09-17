from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import get_db
from app.schemas.common import APIResponse, HealthResponse

router = APIRouter(prefix="/health", tags=["Health & System Status"])


@router.get("", response_model=APIResponse[HealthResponse])
async def check_health(db: Session = Depends(get_db)):
    """
    Health check endpoint verifying system configuration and database connectivity.
    """
    db_connected = False
    try:
        # Check database connectivity
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    payload = HealthResponse(
        status="healthy" if db_connected else "degraded",
        app_name=settings.APP_NAME,
        environment=settings.APP_ENV,
        version="1.0.0",
        database_connected=db_connected,
    )

    return APIResponse(
        success=True,
        message="KARM SEVA Core API Service is operational",
        data=payload,
    )

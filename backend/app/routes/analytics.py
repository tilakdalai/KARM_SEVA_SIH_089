from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.analytics import (
    CustomerAnalyticsResponse,
    WorkerAnalyticsResponse,
    CooperativeAnalyticsResponse,
    InstitutionAnalyticsResponse,
    AdminImpactAnalyticsResponse,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics & Impact"])


@router.get("/customer", response_model=CustomerAnalyticsResponse)
def get_customer_analytics(
    time_range: str = Query("30d", pattern="^(7d|30d|3m|6m|1y|custom)$"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Minimal analytics endpoint for customers / citizens.
    """
    return AnalyticsService.get_customer_analytics(
        db=db,
        user_id=current_user.id,
        time_range=time_range,
        start_date=start_date,
        end_date=end_date,
    )


@router.get("/worker", response_model=WorkerAnalyticsResponse)
def get_worker_analytics(
    time_range: str = Query("30d", pattern="^(7d|30d|3m|6m|1y|custom)$"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    service: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Comprehensive earnings, completion, and rating analytics for verified workers.
    """
    return AnalyticsService.get_worker_analytics(
        db=db,
        user_id=current_user.id,
        time_range=time_range,
        start_date=start_date,
        end_date=end_date,
        service=service,
    )


@router.get("/cooperative", response_model=CooperativeAnalyticsResponse)
def get_cooperative_analytics(
    time_range: str = Query("30d", pattern="^(7d|30d|3m|6m|1y|custom)$"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    service: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Cooperative-level analytics: jobs, 85/10/5 revenue distribution, utilization, replacement rate, complaints.
    """
    return AnalyticsService.get_cooperative_analytics(
        db=db,
        coop_id=None,
        time_range=time_range,
        start_date=start_date,
        end_date=end_date,
        service=service,
        district=district,
    )


@router.get("/institution", response_model=InstitutionAnalyticsResponse)
def get_institution_analytics(
    time_range: str = Query("30d", pattern="^(7d|30d|3m|6m|1y|custom)$"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    service: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Institutional analytics: monthly spend, attendance rate, headcount allocation.
    """
    return AnalyticsService.get_institution_analytics(
        db=db,
        user_id=current_user.id,
        time_range=time_range,
        start_date=start_date,
        end_date=end_date,
        service=service,
    )


@router.get("/admin", response_model=AdminImpactAnalyticsResponse)
def get_admin_impact_analytics(
    time_range: str = Query("30d", pattern="^(7d|30d|3m|6m|1y|custom)$"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    service: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    cooperative_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    State / National impact metrics: GMV, worker disbursements, district breakdowns.
    """
    return AnalyticsService.get_admin_impact_analytics(
        db=db,
        time_range=time_range,
        start_date=start_date,
        end_date=end_date,
        service=service,
        district=district,
        cooperative_id=cooperative_id,
    )

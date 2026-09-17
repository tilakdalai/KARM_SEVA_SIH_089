import enum
from typing import List, Optional
from pydantic import BaseModel, Field


class TimeRangeFilter(str, enum.Enum):
    DAYS_7 = "7d"
    DAYS_30 = "30d"
    MONTHS_3 = "3m"
    MONTHS_6 = "6m"
    YEAR_1 = "1y"
    CUSTOM = "custom"


class TimeseriesPoint(BaseModel):
    date: str
    value: float
    secondary_value: Optional[float] = None
    label: Optional[str] = None


class DistributionItem(BaseModel):
    name: str
    value: float
    percentage: float
    color: Optional[str] = None


class LeaderboardItem(BaseModel):
    worker_id: str
    worker_name: str
    trade: str
    rating: float
    completed_jobs: int
    completion_rate: float
    earnings: float


class CustomerAnalyticsResponse(BaseModel):
    total_spent: float
    total_bookings: int
    completed_bookings: int
    active_bookings: int
    favorite_services: List[DistributionItem]


class WorkerAnalyticsResponse(BaseModel):
    gross_earnings: float
    net_earnings: float
    completed_jobs: int
    average_rating: float
    completion_rate: float
    earnings_trend: List[TimeseriesPoint]
    jobs_trend: List[TimeseriesPoint]
    trade_breakdown: List[DistributionItem]


class CooperativeAnalyticsResponse(BaseModel):
    total_jobs: int
    completed_jobs: int
    active_jobs: int
    emergency_jobs: int
    total_revenue: float
    worker_share: float
    cooperative_share: float
    platform_share: float
    workforce_utilization_rate: float
    replacement_frequency_rate: float
    complaint_rate: float
    revenue_trend: List[TimeseriesPoint]
    service_distribution: List[DistributionItem]
    top_workers: List[LeaderboardItem]


class InstitutionAnalyticsResponse(BaseModel):
    total_monthly_spend: float
    total_attendance_hours: float
    average_attendance_rate: float
    active_headcount: int
    spend_trend: List[TimeseriesPoint]
    service_usage: List[DistributionItem]


class AdminImpactAnalyticsResponse(BaseModel):
    platform_gmv: float
    worker_disbursements: float
    cooperative_corpus: float
    platform_revenue: float
    total_active_workers: int
    total_citizens_served: int
    average_satisfaction_rating: float
    dispute_resolution_rate: float
    gmv_trend: List[TimeseriesPoint]
    district_distribution: List[DistributionItem]
    service_distribution: List[DistributionItem]

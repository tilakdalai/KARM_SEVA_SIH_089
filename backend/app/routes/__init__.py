"""
FastAPI Routes package.
"""
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.workers import router as workers_router
from app.routes.services import router as services_router
from app.routes.bookings import router as bookings_router
from app.routes.payments import router as payments_router
from app.routes.cooperative import router as cooperative_router
from app.routes.institution import router as institutions_router
from app.routes.admin import router as admin_router
from app.routes.ai import router as ai_router
from app.routes.recurring import router as recurring_router
from app.routes.leave import router as leave_router
from app.routes.matching import router as matching_router
from app.routes.reviews import router as reviews_router
from app.routes.complaints import router as complaints_router
from app.routes.notifications import router as notifications_router
from app.routes.analytics import router as analytics_router

__all__ = [
    "health_router",
    "auth_router",
    "workers_router",
    "services_router",
    "bookings_router",
    "payments_router",
    "cooperative_router",
    "institutions_router",
    "admin_router",
    "ai_router",
    "recurring_router",
    "leave_router",
    "matching_router",
    "reviews_router",
    "complaints_router",
    "notifications_router",
    "analytics_router",
]

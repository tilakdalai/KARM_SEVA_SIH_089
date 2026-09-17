import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.user import User  # Ensure models are imported for metadata creation
from app.services.auth_service import AuthService
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.security_middleware import SecurityHeadersMiddleware
from app.middleware.rate_limit_middleware import RateLimitMiddleware
from app.routes import (
    health_router,
    auth_router,
    workers_router,
    services_router,
    bookings_router,
    payments_router,
    cooperative_router,
    institutions_router,
    admin_router,
    ai_router,
    recurring_router,
    leave_router,
    matching_router,
    reviews_router,
    complaints_router,
    notifications_router,
    analytics_router,
)

logger = logging.getLogger(__name__)

# Ensure tables are created
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Modern lifespan event handler for database table creation and demo seeding.
    """
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            AuthService.seed_demo_accounts_if_empty(db)
        finally:
            db.close()
        logger.info("Database initialized and demo accounts verified.")
    except Exception as e:
        logger.error(f"Error initializing database on startup: {e}")
    yield


# Initialize FastAPI application with modern lifespan
app = FastAPI(
    title=f"{settings.APP_NAME} — Public Digital Infrastructure API",
    description=(
        "Backend API service for KARM SEVA (SIH PS26089). "
        "Connecting Skills. Creating Opportunities. Serving Communities. "
        "A trusted digital platform connecting citizens, skilled workers, "
        "cooperatives, and institutions with verified trust, transparent earnings, and explainable AI."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# 1. Custom Logging & Performance Middleware
app.add_middleware(LoggingMiddleware)

# 2. OWASP & Defensive Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# 3. Rate Limiting Middleware
app.add_middleware(RateLimitMiddleware)

# 4. Strict CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time", "Retry-After"],
)


# Global Exception Handlers ensuring standardized ErrorResponse contract
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail),
            "errors": None,
        },
    )


from fastapi.encoders import jsonable_encoder

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Request validation error",
            "errors": jsonable_encoder(exc.errors()),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred. Please contact KARM SEVA support.",
            "errors": str(exc) if settings.DEBUG else None,
        },
    )


# Root Endpoint
@app.get("/", tags=["Root"])
async def root():
    return {
        "success": True,
        "app_name": settings.APP_NAME,
        "tagline": "Connecting Skills. Creating Opportunities. Serving Communities.",
        "problem_statement": "SIH PS26089",
        "version": "1.0.0",
        "documentation": "/docs",
        "health_check": f"{settings.API_V1_STR}/health",
    }


# Mount API v1 Routers
api_v1 = settings.API_V1_STR

app.include_router(health_router, prefix=api_v1)
app.include_router(auth_router, prefix=api_v1)
app.include_router(workers_router, prefix=api_v1)
app.include_router(services_router, prefix=api_v1)
app.include_router(bookings_router, prefix=api_v1)
app.include_router(payments_router, prefix=api_v1)
app.include_router(cooperative_router, prefix=api_v1)
app.include_router(institutions_router, prefix=api_v1)
app.include_router(admin_router, prefix=api_v1)
app.include_router(ai_router, prefix=api_v1)
app.include_router(recurring_router, prefix=api_v1)
app.include_router(leave_router, prefix=api_v1)
app.include_router(matching_router, prefix=api_v1)
app.include_router(reviews_router, prefix=api_v1)
app.include_router(complaints_router, prefix=api_v1)
app.include_router(notifications_router, prefix=api_v1)
app.include_router(analytics_router, prefix=api_v1)


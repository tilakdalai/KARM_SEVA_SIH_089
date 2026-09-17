from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserProfileResponse,
)
from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])


@router.post(
    "/register",
    response_model=APIResponse[TokenResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register a new Citizen, Worker, or Institution",
)
async def register(
    data: UserRegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Public registration endpoint.
    Restricted to CUSTOMER, WORKER, and INSTITUTION roles only.
    """
    user, token = AuthService.register_user(db, data)
    
    payload = TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfileResponse.model_validate(user),
    )

    return APIResponse(
        success=True,
        message=f"Welcome to KARM SEVA! Account successfully created as {user.role.value}.",
        data=payload,
    )


@router.post(
    "/login",
    response_model=APIResponse[TokenResponse],
    summary="Authenticate User and Issue JWT Access Token",
)
async def login(
    data: UserLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login endpoint with mobile number/email and password.
    Returns signed JWT access token and user profile.
    """
    user, token = AuthService.authenticate_user(db, data)

    payload = TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserProfileResponse.model_validate(user),
    )

    return APIResponse(
        success=True,
        message="Login successful. Redirecting to your workspace.",
        data=payload,
    )


@router.get(
    "/me",
    response_model=APIResponse[UserProfileResponse],
    summary="Fetch Current Authenticated User Profile",
)
async def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Authoritative profile endpoint for the currently logged-in user.
    """
    return APIResponse(
        success=True,
        message="Profile loaded successfully",
        data=UserProfileResponse.model_validate(current_user),
    )


@router.post(
    "/logout",
    response_model=APIResponse[dict],
    summary="Logout User Session",
)
async def logout(
    current_user: User = Depends(get_current_user)
):
    """
    Logout endpoint. Client will discard the JWT bearer token.
    """
    return APIResponse(
        success=True,
        message="Logged out successfully from KARM SEVA.",
        data={"user_id": current_user.id}
    )

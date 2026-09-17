import random
import logging
from typing import Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from app.models.user import User, UserRole
from app.schemas.auth import UserRegisterRequest, UserLoginRequest
from app.utils.security import get_password_hash, verify_password, create_access_token

logger = logging.getLogger(__name__)


def generate_shram_id(db: Session) -> str:
    """Generate a unique digital KARM ID (public-safe identifier) for verified Seva Partners."""
    while True:
        rand_digits = random.randint(1000, 9999)
        karm_id = f"KS-OD-2024-{rand_digits}"
        exists = db.query(User).filter(User.shram_id == karm_id).first()
        if not exists:
            return karm_id


class AuthService:
    @staticmethod
    def register_user(db: Session, data: UserRegisterRequest) -> Tuple[User, str]:
        """Register a new user (Customer, Worker, or Institution)."""
        # 1. Check duplicate phone or email
        existing_phone = db.query(User).filter(User.phone == data.phone).first()
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"An account with mobile number {data.phone} already exists."
            )

        if data.email:
            existing_email = db.query(User).filter(User.email == data.email).first()
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"An account with email {data.email} already exists."
                )

        # 2. Hash password & prepare metadata
        password_hash = get_password_hash(data.password)
        shram_id = None
        if data.role == UserRole.WORKER:
            shram_id = generate_shram_id(db)

        # 3. Create user entity
        user = User(
            name=data.name,
            phone=data.phone,
            email=data.email,
            password_hash=password_hash,
            role=data.role,
            preferred_language=data.preferred_language,
            is_active=True,
            is_verified=data.role != UserRole.WORKER,  # Workers undergo cooperative doc verification
            shram_id=shram_id,
            trade=data.trade,
            work_radius_km=data.work_radius_km or 4.0,
            cooperative_name=data.cooperative_name or "Bhubaneswar Seva Cooperative Society",
            organization_name=data.organization_name,
            institution_type=data.institution_type,
            address=data.address,
            district=data.district,
            pincode=data.pincode,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        # 4. Issue JWT access token
        token = create_access_token({
            "sub": user.id,
            "role": user.role.value,
            "name": user.name,
            "phone": user.phone
        })

        return user, token

    @staticmethod
    def authenticate_user(db: Session, data: UserLoginRequest) -> Tuple[User, str]:
        """Authenticate user by phone or email and password."""
        # Find user by phone OR email
        user = db.query(User).filter(
            or_(User.phone == data.credential, User.email == data.credential)
        ).first()

        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid mobile number/email or password."
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deactivated. Please contact your cooperative administrator."
            )

        token = create_access_token({
            "sub": user.id,
            "role": user.role.value,
            "name": user.name,
            "phone": user.phone
        })

        return user, token

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def seed_demo_accounts_if_empty(db: Session):
        """Seed starter accounts for all 5 roles for seamless evaluator testing."""
        demo_accounts = [
            {
                "name": "Ananya Patnaik",
                "phone": "9876543210",
                "email": "citizen@karmseva.gov.in",
                "role": UserRole.CUSTOMER,
                "district": "Bhubaneswar",
                "pincode": "751012",
            },
            {
                "name": "Gopal Nayak",
                "phone": "9876543211",
                "email": "worker@karmseva.gov.in",
                "role": UserRole.WORKER,
                "shram_id": "KS-OD-2024-8841",
                "trade": "Master Electrician",
                "work_radius_km": 4.0,
                "cooperative_name": "Bhubaneswar Seva Cooperative Union",
                "is_verified": True,
            },
            {
                "name": "Suresh Chandra Mohanty",
                "phone": "9876543212",
                "email": "coop@karmseva.gov.in",
                "role": UserRole.COOPERATIVE_ADMIN,
                "cooperative_name": "Bhubaneswar Seva Cooperative Union",
                "is_verified": True,
            },
            {
                "name": "DAV Public School Admin",
                "phone": "9876543213",
                "email": "institution@karmseva.gov.in",
                "role": UserRole.INSTITUTION,
                "organization_name": "DAV Public School (Unit 8)",
                "institution_type": "Educational Institution",
                "district": "Bhubaneswar",
            },
            {
                "name": "Dr. Pradeep Kumar Jena (IAS)",
                "phone": "9876543214",
                "email": "admin@karmseva.gov.in",
                "role": UserRole.SYSTEM_ADMIN,
                "district": "State Secretariat",
                "is_verified": True,
            },
        ]

        for acc in demo_accounts:
            q = db.query(User).filter(
                (User.phone == acc["phone"]) |
                (User.email == acc.get("email"))
            )
            if acc.get("shram_id"):
                q = db.query(User).filter(
                    (User.phone == acc["phone"]) |
                    (User.email == acc.get("email")) |
                    (User.shram_id == acc.get("shram_id"))
                )
            existing = q.first()
            if not existing:
                demo_user = User(
                    name=acc["name"],
                    phone=acc["phone"],
                    email=acc.get("email"),
                    password_hash=get_password_hash("password123"),
                    role=acc["role"],
                    preferred_language="en",
                    is_active=True,
                    is_verified=acc.get("is_verified", True),
                    shram_id=acc.get("shram_id"),
                    trade=acc.get("trade"),
                    work_radius_km=acc.get("work_radius_km", 4.0),
                    cooperative_name=acc.get("cooperative_name"),
                    organization_name=acc.get("organization_name"),
                    institution_type=acc.get("institution_type"),
                    district=acc.get("district"),
                    pincode=acc.get("pincode"),
                )
                db.add(demo_user)
        db.commit()

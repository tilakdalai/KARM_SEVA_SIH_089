"""
FastAPI route dependencies package.
"""
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, require_role

__all__ = ["get_db", "get_current_user", "require_role"]

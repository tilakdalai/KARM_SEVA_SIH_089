"""
Database dependency re-export for clean dependency injection across routers.
"""
from app.database import get_db

__all__ = ["get_db"]

import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

def initialize_engine():
    """
    Initializes PostgreSQL engine if active, otherwise falls back gracefully
    to SQLite during local development and automated testing.
    """
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql"):
        try:
            pg_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                echo=False,
                connect_args={"connect_timeout": 2},
            )
            # Test connection immediately
            with pg_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Connected to primary PostgreSQL database.")
            _run_safe_migrations(pg_engine)
            return pg_engine
        except Exception as e:
            logger.info(f"PostgreSQL not accessible locally ({e}). Using local SQLite database.")
            sqlite_engine = create_engine(
                "sqlite:///./shramsetu_dev.db",
                connect_args={"check_same_thread": False},
                echo=False,
            )
            _run_safe_migrations(sqlite_engine)
            return sqlite_engine
    else:
        connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
        engine_inst = create_engine(db_url, connect_args=connect_args, echo=False)
        _run_safe_migrations(engine_inst)
        return engine_inst


def _run_safe_migrations(target_engine):
    try:
        with target_engine.connect() as conn:
            migrations = [
                # Bookings columns
                ("bookings", "replacement_for_worker_id", "VARCHAR(36)"),
                ("bookings", "is_replacement", "BOOLEAN DEFAULT 0"),
                ("bookings", "replacement_reason", "VARCHAR(255)"),
                ("bookings", "country", "VARCHAR(50) DEFAULT 'India'"),
                ("bookings", "state", "VARCHAR(100) DEFAULT 'Odisha'"),
                ("bookings", "state_code", "VARCHAR(10) DEFAULT 'OD'"),
                ("bookings", "district", "VARCHAR(100) DEFAULT 'Khordha'"),
                ("bookings", "city", "VARCHAR(100) DEFAULT 'Bhubaneswar'"),
                ("bookings", "lat", "FLOAT"),
                ("bookings", "lng", "FLOAT"),
                ("bookings", "landmark", "VARCHAR(255)"),
                # Users columns
                ("users", "country", "VARCHAR(50) DEFAULT 'India'"),
                ("users", "state", "VARCHAR(100) DEFAULT 'Odisha'"),
                ("users", "state_code", "VARCHAR(10) DEFAULT 'OD'"),
                ("users", "district", "VARCHAR(100) DEFAULT 'Khordha'"),
                ("users", "city", "VARCHAR(100) DEFAULT 'Bhubaneswar'"),
                ("users", "lat", "FLOAT"),
                ("users", "lng", "FLOAT"),
                # Worker profiles columns
                ("worker_profiles", "country", "VARCHAR(50) DEFAULT 'India'"),
                ("worker_profiles", "state", "VARCHAR(100) DEFAULT 'Odisha'"),
                ("worker_profiles", "state_code", "VARCHAR(10) DEFAULT 'OD'"),
                ("worker_profiles", "district", "VARCHAR(100) DEFAULT 'Khordha'"),
                ("worker_profiles", "city", "VARCHAR(100) DEFAULT 'Bhubaneswar'"),
                ("worker_profiles", "pincode", "VARCHAR(10)"),
                ("worker_profiles", "lat", "FLOAT"),
                ("worker_profiles", "lng", "FLOAT"),
                ("worker_profiles", "profile_photo_url", "VARCHAR(512)"),
                ("worker_profiles", "alternate_phone", "VARCHAR(15)"),
                ("worker_profiles", "preferred_language", "VARCHAR(30) DEFAULT 'English'"),
                ("worker_profiles", "address_line", "VARCHAR(255)"),
                ("worker_profiles", "service_radius_km", "FLOAT DEFAULT 15.0"),
                ("worker_profiles", "is_pan_india_available", "BOOLEAN DEFAULT 0"),
            ]
            for table, col, col_type in migrations:
                try:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}"))
                    conn.commit()
                except Exception:
                    pass
    except Exception:
        pass


engine = initialize_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    FastAPI dependency yielding a database session per request.
    Ensures clean session closure upon request completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

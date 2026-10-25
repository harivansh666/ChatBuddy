# src/server/db/session.py
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from server.core.config import settings

# ----------------------------------------------------------------------
# Async engine – uses the DATABASE_URL from .env (Neon + asyncpg)
# ----------------------------------------------------------------------
engine = create_async_engine(
    settings.DATABASE_URL,          # 👉  PostgreSQL‑Neon URL
    echo=settings.DEBUG,           # True → SQL logs (dev)
    future=True,                    # SQLAlchemy‑2.0 style
)

# ----------------------------------------------------------------------
# Async session factory – injected via FastAPI Depends
# ----------------------------------------------------------------------
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

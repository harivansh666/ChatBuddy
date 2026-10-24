from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from server.api.v1 import api_v1_router
from server.core.config import settings
from server.core.exceptions import register_exception_handlers
from server.core.logging import setup_logging
from server.db.session import engine

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Lifespan context manager for application startup and shutdown events."""
    setup_logging()
    logger.info("application_starting", app_name=settings.APP_NAME, env=settings.ENVIRONMENT)

    yield

    logger.info("application_shutting_down")
    await engine.dispose()
    logger.info("database_engine_disposed")


def create_app() -> FastAPI:
    """FastAPI application factory."""
    app = FastAPI(
        title=settings.APP_NAME,
        debug=settings.DEBUG,
        lifespan=lifespan,
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global domain exception handlers
    register_exception_handlers(app)

    # Health & Readiness checks
    @app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
    async def health_check() -> dict[str, str]:
        """Liveness probe: verifies that the HTTP server is running."""
        return {"status": "ok"}

    @app.get("/ready", status_code=status.HTTP_200_OK, tags=["Health"])
    async def readiness_check() -> dict[str, str]:
        """Readiness probe: verifies database connectivity."""
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            return {"status": "ready", "database": "connected"}
        except Exception as exc:
            logger.error("readiness_check_failed", error=str(exc))
            return {"status": "not_ready", "database": "disconnected"}

    # Mount API v1 router
    app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    return app


app = create_app()

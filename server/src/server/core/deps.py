from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from server.db.session import async_session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency yielding an async database session per request.
    Session is automatically closed at request completion.
    """
    async with async_session_factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise

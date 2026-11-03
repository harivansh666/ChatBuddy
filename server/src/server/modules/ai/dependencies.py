from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.deps import get_db
from server.modules.ai.repository import AiRepository
from server.modules.ai.service import AiService


def get_ai_repository(
    session: Annotated[AsyncSession, Depends(get_db)],
) -> AiRepository:
    """Provides an instance of AiRepository."""
    return AiRepository(session)


def get_ai_service(
    repository: Annotated[AiRepository, Depends(get_ai_repository)],
) -> AiService:
    """Provides an instance of AiService with its repository injected."""
    return AiService(repository)


AiServiceDep = Annotated[AiService, Depends(get_ai_service)]
# Annotated[type , data kaha se lene hai example Query(), Depends(), Path() ]

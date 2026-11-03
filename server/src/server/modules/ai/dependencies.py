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

# iss function ka kaam hai AiRepository ka object banana
# Depends = FastAPI, mere liye ye dependency arrange kar do.
def get_ai_service(
    repository: Annotated[AiRepository, Depends(get_ai_repository)],
) -> AiService:
    """Provides an instance of AiService with its repository injected."""
    return AiService(repository)

# Depends = FastAPI, mere liye ye dependency arrange kar do.

AiServiceDep = Annotated[AiService, Depends(get_ai_service)]

# Annotated = Type + Instructions
# Annotated[type , data kaha se lene hai example Query(), Depends(), Path() ]
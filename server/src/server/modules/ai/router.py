from typing import Annotated

from fastapi import APIRouter, Query

from server.modules.ai.dependencies import AiServiceDep
from server.modules.ai.schemas import AIHistoryResponse
from server.modules.auth.dependencies import CurrentUserDep

router = APIRouter(tags=["AI"])


@router.get("/ai-history", response_model=AIHistoryResponse)
async def get_ai_history(
    service: AiServiceDep,
    current_user: CurrentUserDep,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> AIHistoryResponse:
    """Get the authenticated user's saved AI chat history."""
    return await service.get_ai_history(current_user.id, limit, offset)


# Annotated = Type + Instructions
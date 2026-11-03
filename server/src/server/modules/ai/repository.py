from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.modules.ai.models import AIChatHistory


class AiRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_ai_history(
        self,
        user_id: int,
        limit: int,
        offset: int,
    ) -> list[AIChatHistory]:
        statement = (
            select(AIChatHistory)
            .where(AIChatHistory.user_id == user_id)
            .order_by(AIChatHistory.created_at, AIChatHistory.id)
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(statement)
        return list(result.scalars().all())

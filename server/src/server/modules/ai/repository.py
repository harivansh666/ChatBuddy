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

    async def save_chat(
        self,
        user_id: int,
        user_prompt: str,
        bot_response: str,
        personality: str,
    ) -> AIChatHistory:
        """Persist a user prompt + AI response pair to the database."""
        entry = AIChatHistory(
            user_id=user_id,
            user_prompt=user_prompt,
            bot_response=bot_response,
            personality=personality,
        )
        self.session.add(entry)
        await self.session.commit()
        await self.session.refresh(entry)
        return entry

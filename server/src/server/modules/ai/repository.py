from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.modules.ai.models import AIChatHistory

# Max recent exchanges sent to the LLM as memory context (each = 1 user + 1 AI msg)
HISTORY_CONTEXT_LIMIT = 10


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

    async def get_recent_history_for_context(
        self,
        user_id: int,
        personality: str,
    ) -> list[AIChatHistory]:
        """Fetch the last N exchanges for the given user+personality as LLM memory."""
        statement = (
            select(AIChatHistory)
            .where(
                AIChatHistory.user_id == user_id,
                AIChatHistory.personality == personality,
            )
            .order_by(AIChatHistory.created_at.desc(), AIChatHistory.id.desc())
            .limit(HISTORY_CONTEXT_LIMIT)
        )
        result = await self.session.execute(statement)
        # Reverse so oldest-first order for the prompt
        return list(reversed(result.scalars().all()))

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

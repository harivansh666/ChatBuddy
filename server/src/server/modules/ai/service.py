from server.modules.ai.repository import AiRepository
from server.modules.ai.schemas import AIHistoryMessage, AIHistoryResponse


class AiService:
    def __init__(self, repository: AiRepository) -> None:
        self.repository = repository

    async def get_ai_history(
        self,
        user_id: int,
        limit: int,
        offset: int,
    ) -> AIHistoryResponse:
        """Return the user's saved prompts and AI replies in chronological order."""
        history = await self.repository.get_ai_history(user_id, limit, offset)
        messages = [
            message
            for entry in history
            for message in (
                AIHistoryMessage(
                    id=f"{entry.id}:user",
                    content=entry.user_prompt,
                    is_ai=False,
                    personality=entry.personality,
                    created_at=entry.created_at,
                ),
                AIHistoryMessage(
                    id=f"{entry.id}:ai",
                    content=entry.bot_response,
                    is_ai=True,
                    personality=entry.personality,
                    created_at=entry.created_at,
                ),
            )
        ]
        return AIHistoryResponse(messages=messages)
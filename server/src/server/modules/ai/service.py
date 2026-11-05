from server.modules.ai.prompts.genResult import generate_result
from server.modules.ai.repository import AiRepository
from server.modules.ai.schemas import (
    AIChatRequest,
    AIChatResponse,
    AIHistoryMessage,
    AIHistoryResponse,
)


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

    async def ai_chat(
        self,
        user_id: int,
        payload: AIChatRequest,
    ) -> AIChatResponse:
        """Generate an AI reply, persist the exchange, and return the response."""
        ai_reply = await generate_result(
            question=payload.prompt,
            personality=payload.personality,
            room=payload.rooms,
        )

        await self.repository.save_chat(
            user_id=user_id,
            user_prompt=payload.prompt,
            bot_response=ai_reply,
            personality=payload.personality.value,
        )

        return AIChatResponse(ai_response=ai_reply)

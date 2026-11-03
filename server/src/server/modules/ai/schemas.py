from datetime import datetime

from pydantic import BaseModel, Field


class AIHistoryMessage(BaseModel):
    id: str
    content: str
    is_ai: bool = Field(serialization_alias="isAI")
    personality: str
    created_at: datetime = Field(serialization_alias="createdAt")


class AIHistoryResponse(BaseModel):
    messages: list[AIHistoryMessage]

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class Personality(StrEnum):
    COMFORT = "comfort"
    MENTOR = "mentor"
    SAVAGE = "savage"


class Rooms(StrEnum):
    DAILY = "Daily"
    CS_101_SURVIVORS = "CS 101 Survivors"
    DORM_FLOOR_3 = "Dorm_Floor_3"
    LATE_NIGHT_STUDY = "Late_Night_Study"
    VENT_ZONE = "Vent_Zone"


class AIHistoryMessage(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    content: str
    is_ai: bool = Field(serialization_alias="isAI")
    personality: str
    created_at: datetime = Field(serialization_alias="createdAt")


class AIHistoryResponse(BaseModel):
    messages: list[AIHistoryMessage]


class AIChatRequest(BaseModel):
    """Payload sent by the client to get an AI reply."""

    prompt: str = Field(..., min_length=1, max_length=2000)
    personality: Personality = Personality.COMFORT
    rooms: Rooms | None = None


class AIChatResponse(BaseModel):
    """Response returned to the client after AI generation."""

    ai_response: str = Field(serialization_alias="aiResponse")

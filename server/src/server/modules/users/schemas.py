from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    """Shared attributes across user schemas."""
    email: EmailStr
    nickname: str = Field(min_length=2, max_length=50)
    avatar: str | None = None


class UserCreate(UserBase):
    """Schema for internal user creation (includes password hash)."""
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user details."""
    nickname: str | None = Field(default=None, min_length=2, max_length=50)
    avatar: str | None = None
    is_active: bool | None = None


class UserRead(UserBase):
    """
    Public response schema for returning user information.
    NOTE: password is NEVER exposed here!
    """
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MoodLogCreate(BaseModel):
    """Schema for creating a mood log entry."""
    mood: int = Field(ge=1, le=5, description="Mood rating from 1 to 5")
    emoji: str | None = None
    note: str | None = None


class MoodLogRead(MoodLogCreate):
    """Schema for reading a mood log entry."""
    id: int
    user_id: int | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

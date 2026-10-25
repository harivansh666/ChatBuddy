from pydantic import BaseModel, EmailStr, Field

from server.modules.users.schemas import UserRead


class RegisterRequest(BaseModel):
    """Schema for user registration request body matching Drizzle users table."""

    email: EmailStr
    nickname: str = Field(min_length=2, max_length=50)
    password: str = Field(
        min_length=8, max_length=128, description="Plain text password (min 8 chars)"
    )
    avatar: str | None = None


class LoginRequest(BaseModel):
    """Schema for user login request body."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    """Schema for returning JWT access token."""

    access_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    """Schema returning both token and authenticated user profile."""

    token: TokenResponse
    user: UserRead

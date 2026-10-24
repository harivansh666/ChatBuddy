import jwt
from server.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from server.modules.auth.exceptions import (
    InactiveUserError,
    InvalidCredentialsError,
    InvalidTokenError,
    TokenExpiredError,
)
from server.modules.auth.schemas import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)
from server.modules.users.schemas import UserRead
from server.modules.users.service import UserService


class AuthService:
    """
    Business logic layer for Authentication.
    RULES:
    1. Cross-module calls go ONLY through UserService (Rule 3).
    2. Passwords are never logged or stored plain text (Rule 11).
    3. Issues short-lived JWT access tokens.
    4. Raises domain exceptions on authentication failures.
    """

    def __init__(self, user_service: UserService) -> None:
        self.user_service = user_service

    async def register(self, payload: RegisterRequest) -> AuthResponse:
        """
        Hashes password, calls UserService to persist new user,
        and generates an access token.
        """
        hashed_pwd = hash_password(payload.password)
        created_user = await self.user_service.create_user(
            email=payload.email,
            nickname=payload.nickname,
            password_hash=hashed_pwd,
            avatar=payload.avatar,
        )

        token_str = create_access_token(subject=created_user.id)
        user_read = UserRead.model_validate(created_user)

        return AuthResponse(
            token=TokenResponse(access_token=token_str, token_type="bearer"),
            user=user_read,
        )

    async def login(self, payload: LoginRequest) -> AuthResponse:
        """
        Validates credentials and generates an access token.
        Raises InvalidCredentialsError if email or password does not match.
        """
        user = await self.user_service.get_by_email(payload.email)
        if not user:
            raise InvalidCredentialsError()

        if not verify_password(payload.password, user.password):
            raise InvalidCredentialsError()

        if not user.is_active:
            raise InactiveUserError()

        token_str = create_access_token(subject=user.id)
        user_read = UserRead.model_validate(user)

        return AuthResponse(
            token=TokenResponse(access_token=token_str, token_type="bearer"),
            user=user_read,
        )

    def extract_user_id_from_token(self, token: str) -> int:
        """
        Decodes JWT token and returns user ID.
        Raises domain exceptions on invalid or expired token.
        """
        try:
            payload = decode_access_token(token)
            subject = payload.get("sub")
            if not subject:
                raise InvalidTokenError()
            return int(subject)
        except jwt.ExpiredSignatureError as exc:
            raise TokenExpiredError() from exc
        except (jwt.PyJWTError, ValueError) as exc:
            raise InvalidTokenError() from exc

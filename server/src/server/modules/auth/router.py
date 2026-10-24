from fastapi import APIRouter, status

from server.modules.auth.dependencies import AuthServiceDep, CurrentUserDep
from server.modules.auth.schemas import AuthResponse, LoginRequest, RegisterRequest
from server.modules.users.schemas import UserRead

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user",
)
async def register(
    payload: RegisterRequest,
    auth_service: AuthServiceDep,
) -> AuthResponse:
    """
    Registers a new user account.
    - Validates email and username uniqueness.
    - Hashes password with Argon2.
    - Returns JWT access token and public user profile.
    """
    return await auth_service.register(payload)


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Log in user",
)
async def login(
    payload: LoginRequest,
    auth_service: AuthServiceDep,
) -> AuthResponse:
    """
    Logs in with email and password.
    - Verifies credentials against Argon2 hash.
    - Returns JWT access token.
    """
    return await auth_service.login(payload)


@router.get(
    "/me",
    response_model=UserRead,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
)
async def get_me(
    current_user: CurrentUserDep,
) -> UserRead:
    """
    Protected route: Returns the profile of the currently authenticated user.
    Requires 'Authorization: Bearer <token>' header.
    """
    return current_user

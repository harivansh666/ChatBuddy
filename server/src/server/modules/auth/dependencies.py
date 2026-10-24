from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from server.modules.auth.exceptions import InvalidTokenError
from server.modules.auth.service import AuthService
from server.modules.users.dependencies import UserServiceDep
from server.modules.users.schemas import UserRead

bearer_scheme = HTTPBearer(auto_error=False)


def get_auth_service(user_service: UserServiceDep) -> AuthService:
    """Provides AuthService with UserService injected."""
    return AuthService(user_service)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    auth_service: AuthServiceDep,
    user_service: UserServiceDep,
) -> UserRead:
    """
    HTTP Auth Dependency: Extracts Bearer token, validates it,
    and returns the currently authenticated user profile.
    """
    if credentials is None:
        raise InvalidTokenError(message="Authorization Bearer token is missing.")

    user_id = auth_service.extract_user_id_from_token(credentials.credentials)
    return await user_service.get_read_by_id(user_id)


CurrentUserDep = Annotated[UserRead, Depends(get_current_user)]

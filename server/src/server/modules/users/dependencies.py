from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.deps import get_db
from server.modules.users.repository import UserRepository
from server.modules.users.service import UserService


def get_user_repository(
    session: Annotated[AsyncSession, Depends(get_db)],
) -> UserRepository:
    """Provides an instance of UserRepository bound to the request's DB session."""
    return UserRepository(session)

# iss function ka kaam hai UserRepository ka object banana
# Depends = FastAPI, mere liye ye dependency arrange kar do.
def get_user_service(
    repository: Annotated[UserRepository, Depends(get_user_repository)],
    session: Annotated[AsyncSession, Depends(get_db)],
) -> UserService:
    """Provides an instance of UserService with its repository dependency injected."""
    return UserService(repository, session)
# Depends = FastAPI, mere liye ye dependency arrange kar do.

UserServiceDep = Annotated[UserService, Depends(get_user_service)]
# Annotated[type , data kaha se lene hai example Query(), Depends(), Path() ]
# Annotated = Type + Instructions
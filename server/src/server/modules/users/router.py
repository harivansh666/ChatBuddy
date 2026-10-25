from fastapi import APIRouter

from server.modules.users.dependencies import UserServiceDep
from server.modules.users.schemas import GetSlideUsers, UserRead

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}", response_model=UserRead)
async def get_user_by_id(
    user_id: int,
    user_service: UserServiceDep,
) -> UserRead:
    """Fetch user profile by ID."""
    return await user_service.get_read_by_id(user_id)


@router.get("/", response_model=list[GetSlideUsers])
async def get_users_for_slideBar(user_service: UserServiceDep) -> list[GetSlideUsers]:
    """Get users for slidebar"""
    return await user_service.get_users_for_slidebar()

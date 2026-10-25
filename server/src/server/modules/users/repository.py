from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.modules.users.models import User
from server.modules.users.schemas import GetSlideUsers


class UserRepository:
    """
    Data access layer for User entity.
    RULES:
    1. Only pure DB queries using SQLAlchemy 2.0 syntax (select()).
    2. No business logic, no HTTP details.
    3. Does not call commit() directly; commits belong to the unit-of-work in service.
    """

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, user_id: int) -> User | None:
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email.lower())
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_nickname(self, nickname: str) -> User | None:
        stmt = select(User).where(User.nickname == nickname)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, user: User) -> User:
        self.session.add(user)
        await self.session.flush()
        return user

    async def get_users_for_slidebar(self) -> list[GetSlideUsers]:
        stmt = select(User.nickname, User.id, User.avatar)
        result = await self.session.execute(stmt)
        rows = result.fetchall()
        return [GetSlideUsers(nickname=row[0], id=row[1], avatar=row[2]) for row in rows]

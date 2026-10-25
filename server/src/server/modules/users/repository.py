from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from server.modules.users.models import User



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
    async def get_users_for_slidebar(self)->list[GetSlideUsers]:
        query= select(User.nickname, User.id, User.avatar).where(User.is_active==True)
        result = await self.session.execute(query)
        return result.scalars().all()




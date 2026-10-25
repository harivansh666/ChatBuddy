from sqlalchemy.ext.asyncio import AsyncSession

from server.modules.users.exceptions import UserAlreadyExistsException, UserNotFoundException
from server.modules.users.models import User
from server.modules.users.repository import UserRepository
from server.modules.users.schemas import GetSlideUsers, UserRead


class UserService:
    """
    Business logic layer for Users.
    RULES:
    1. Orchestrates domain logic, validation of business constraints.
    2. Calls UserRepository for database interactions.
    3. Handles transaction commit (Unit of Work).
    4. Raises domain exceptions on business violations.
    """

    def __init__(self, repository: UserRepository, session: AsyncSession) -> None:
        self.repository = repository
        self.session = session

    async def get_by_id(self, user_id: int) -> User:
        """Internal fetch returning ORM User or raising UserNotFoundException."""
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise UserNotFoundException(message=f"User with id {user_id} not found.")
        return user

    async def get_read_by_id(self, user_id: int) -> UserRead:
        """Public fetch returning Pydantic UserRead schema."""
        user = await self.get_by_id(user_id)
        return UserRead.model_validate(user)

    async def get_users_for_slidebar(self) -> list[GetSlideUsers]:
        """Get users for slidebar"""
        users = await self.repository.get_users_for_slidebar()
        if not users:
            raise UserNotFoundException(message="No user found.")
        return [GetSlideUsers.model_validate(user) for user in users]

    async def get_by_email(self, email: str) -> User | None:
        """Internal helper for auth service to look up credentials."""
        return await self.repository.get_by_email(email)

    async def create_user(
        self,
        email: str,
        nickname: str,
        password_hash: str,
        avatar: str | None = None,
    ) -> User:
        """
        Validates uniqueness and creates a new user in the database.
        Commits the transaction upon success.
        """
        existing_email = await self.repository.get_by_email(email)
        if existing_email:
            raise UserAlreadyExistsException(
                message="A user with this email address already exists."
            )

        user = User(
            email=email.lower().strip(),
            nickname=nickname.strip(),
            password=password_hash,
            avatar=avatar,
            is_active=True,
        )

        created_user = await self.repository.create(user)
        await self.session.commit()
        await self.session.refresh(created_user)
        return created_user

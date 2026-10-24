from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from server.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """
    SQLAlchemy 2.0 ORM Model for `users` table.
    Matches Drizzle schema:
    - id: serial primary key
    - nickname: text not null
    - email: text not null unique (users_email_idx)
    - password: text not null (stores hashed password)
    - avatar: text nullable
    - created_at: timestamp default now
    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    nickname: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    email: Mapped[str] = mapped_column(
        Text,
        unique=True,
        nullable=False,
    )
    password: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    avatar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        server_default="true",
        nullable=False,
    )

    __table_args__ = (
        Index("users_email_idx", "email", unique=True),
    )

    @property
    def password_hash(self) -> str:
        """Alias for password hash to remain compatible across services."""
        return self.password

    @property
    def username(self) -> str:
        """Alias for nickname for compatibility."""
        return self.nickname


class MoodLog(Base):
    """
    SQLAlchemy 2.0 ORM Model for `mood_logs` table.
    Matches Drizzle schema:
    - id: serial primary key
    - user_id: integer references users.id
    - mood: integer not null (1-5)
    - emoji: text nullable
    - note: text nullable
    - created_at: timestamp default now
    """
    __tablename__ = "mood_logs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
    )
    mood: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    emoji: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    note: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        Index("mood_logs_user_id_idx", "user_id"),
    )

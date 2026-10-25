from datetime import datetime

from sqlalchemy import DateTime, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from server.db.base import Base, TimestampMixin


class Room(Base, TimestampMixin):
    """
    SQLAlchemy 2.0 ORM Model for `rooms` table.
    Matches Drizzle schema:
    - id: serial primary key
    - name: text not null
    - emoji: text nullable
    - description: text nullable
    - created_at: timestamp default now
    """

    __tablename__ = "rooms"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    name: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    emoji: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

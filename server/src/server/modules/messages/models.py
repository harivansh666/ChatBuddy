from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from server.db.base import Base


class Message(Base):
    """
    SQLAlchemy 2.0 ORM Model for `messages` table.
    Matches Drizzle schema:
    - id: serial primary key
    - content: text not null
    - sender_id: integer references users.id
    - recipient_id: integer references users.id
    - user_id: integer references users.id
    - room_id: integer references rooms.id
    - is_ai: boolean default false
    - personality: text nullable ('comfort', 'mentor', 'savage')
    - created_at: timestamp default now
    """

    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    sender_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    recipient_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    room_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("rooms.id", ondelete="CASCADE"),
        nullable=True,
    )
    is_ai: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="false",
        nullable=False,
    )
    personality: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        Index("messages_room_id_idx", "room_id"),
        Index("messages_sender_id_idx", "sender_id"),
        Index("messages_recipient_id_idx", "recipient_id"),
        # Composite index for "get DMs between two users sorted by time"
        Index("messages_dm_idx", "sender_id", "recipient_id", "created_at"),
    )

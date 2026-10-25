from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from server.db.base import Base


class AIChatHistory(Base):
    """
    SQLAlchemy 2.0 ORM Model for `ai_chat_history` table.
    Matches Drizzle schema:
    - id: serial primary key
    - user_id: integer references users.id not null
    - user_prompt: text not null
    - bot_response: text not null
    - personality: text not null
    - mood_at_time: integer nullable
    - created_at: timestamp default now
    """

    __tablename__ = "ai_chat_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_prompt: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    bot_response: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    personality: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    mood_at_time: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        Index("ai_chat_history_user_id_idx", "user_id"),
        Index("ai_chat_history_user_personality_idx", "user_id", "personality"),
    )

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.modules.ai.models import AIChatHistory


@pytest.mark.asyncio
async def test_ai_history_returns_only_authenticated_users_messages(
    client: AsyncClient,
    db_session: AsyncSession,
) -> None:
    first_user_response = await client.post(
        "/api/auth/signup",
        json={
            "email": "first-ai-user@example.com",
            "nickname": "first-user",
            "password": "Password123!",
        },
    )
    second_user_response = await client.post(
        "/api/auth/signup",
        json={
            "email": "second-ai-user@example.com",
            "nickname": "second-user",
            "password": "Password123!",
        },
    )

    assert first_user_response.status_code == 201
    assert second_user_response.status_code == 201
    first_user = first_user_response.json()["user"]
    second_user = second_user_response.json()["user"]

    db_session.add_all(
        [
            AIChatHistory(
                user_id=first_user["id"],
                user_prompt="My prompt",
                bot_response="AI reply",
                personality="comfort",
            ),
            AIChatHistory(
                user_id=second_user["id"],
                user_prompt="Private prompt",
                bot_response="Private reply",
                personality="mentor",
            ),
        ]
    )
    await db_session.commit()

    response = await client.get(
        "/api/ai-history",
        headers={
            "Authorization": f"Bearer {first_user_response.json()['token']['access_token']}"
        },
    )

    assert response.status_code == 200
    messages = response.json()["messages"]
    assert [message["content"] for message in messages] == ["My prompt", "AI reply"]
    assert [message["isAI"] for message in messages] == [False, True]
    assert all(message["personality"] == "comfort" for message in messages)
    assert "createdAt" in messages[0]


@pytest.mark.asyncio
async def test_ai_history_requires_authentication(client: AsyncClient) -> None:
    response = await client.get("/api/ai-history")

    assert response.status_code == 401

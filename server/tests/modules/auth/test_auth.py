import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_register_user_success(client: AsyncClient) -> None:
    payload = {
        "email": "developer@example.com",
        "username": "superdev",
        "password": "Password123!",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "token" in data
    assert "access_token" in data["token"]
    assert data["token"]["token_type"] == "bearer"

    assert "user" in data
    assert data["user"]["email"] == "developer@example.com"
    assert data["user"]["username"] == "superdev"
    assert "id" in data["user"]
    # Ensure sensitive fields are never exposed
    assert "password_hash" not in data["user"]
    assert "password" not in data["user"]


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient) -> None:
    payload = {
        "email": "duplicate@example.com",
        "username": "userone",
        "password": "Password123!",
    }
    first_res = await client.post("/api/v1/auth/register", json=payload)
    assert first_res.status_code == 201

    duplicate_payload = {
        "email": "duplicate@example.com",
        "username": "usertwo",
        "password": "Password123!",
    }
    second_res = await client.post("/api/v1/auth/register", json=duplicate_payload)
    assert second_res.status_code == 409
    error_body = second_res.json()
    assert "error" in error_body
    assert error_body["error"]["code"] == "USER_ALREADY_EXISTS"


@pytest.mark.asyncio
async def test_register_validation_error(client: AsyncClient) -> None:
    payload = {
        "email": "not-an-email",
        "username": "u",  # Too short (< 3)
        "password": "123",  # Too short (< 8)
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422
    body = response.json()
    assert "error" in body
    assert body["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_login_success_and_get_me(client: AsyncClient) -> None:
    # 1. Register
    reg_payload = {
        "email": "loginuser@example.com",
        "username": "loginuser",
        "password": "CorrectPassword123!",
    }
    reg_res = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201

    # 2. Login
    login_payload = {
        "email": "loginuser@example.com",
        "password": "CorrectPassword123!",
    }
    login_res = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token = login_res.json()["token"]["access_token"]

    # 3. Access protected /me route
    me_res = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "loginuser@example.com"
    assert me_data["username"] == "loginuser"


@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient) -> None:
    reg_payload = {
        "email": "wrongpwd@example.com",
        "username": "wrongpwduser",
        "password": "CorrectPassword123!",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    login_res = await client.post(
        "/api/v1/auth/login",
        json={"email": "wrongpwd@example.com", "password": "WrongPassword999!"},
    )
    assert login_res.status_code == 401
    assert login_res.json()["error"]["code"] == "INVALID_CREDENTIALS"


@pytest.mark.asyncio
async def test_get_me_unauthorized_without_token(client: AsyncClient) -> None:
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "INVALID_TOKEN"

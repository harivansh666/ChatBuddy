# AGENTS.md — Vent AI (FastAPI)

Instructions for AI coding agents (Claude Code, Cursor, Copilot, etc.).
Read this fully before writing or changing any code. Follow it strictly.
If a request conflicts with this file, say so and ask before proceeding.

---

## 1. Project Overview

Vent AI is a real-time chat backend with AI-powered rooms ("flavours"/personas).
Users join rooms,and chat with AI replies are generated and streamed.

- Architecture: **Modular monolith** (one app, one database, feature-based modules)
- Language: **Python**

---

## 2. Tech Stack (do not swap without asking)

| Concern | Choice |
|---|---|
| Package manager | `uv` |
| Framework | FastAPI (async) |
| Validation / settings | Pydantic v2 + `pydantic-settings` |
| ORM | SQLAlchemy 2.0 (async, `Mapped` / `mapped_column` style) |
| DB driver | `asyncpg` |
| Migrations | Alembic |
| Database | PostgreSQL |
| Realtime | `python-socketio` (ASGI mounted) |
| Logging | `structlog` |
| Lint + format | `ruff` |
| Type check | `mypy` (strict on `src/`) |
| Tests | `pytest`, `pytest-asyncio`, `httpx` |
| Container | Docker + docker-compose (api, postgres) |
| CI | GitHub Actions |

Do **not** add new dependencies without a clear reason. Prefer the standard library and the stack above.

---

## 3. Folder Structure

```
vent-ai/
├── AGENTS.md
├── pyproject.toml              # uv, ruff, mypy, pytest config
├── uv.lock
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── alembic.ini
├── migrations/                 # Alembic
├── .github/workflows/ci.yml
│
├── tests/
│   ├── conftest.py             # test db, dependency_overrides
│   └── modules/
│       ├── auth/
│       ├── rooms/
│       ├── messages/
│       └── ai/
│
└── src/app/
    ├── main.py                 # create_app(), lifespan, mounts routers
    │
    ├── core/                   # shared infra ONLY (keep small)
    │   ├── config.py           # pydantic-settings
    │   ├── security.py         # JWT, password hashing
    │   ├── logging.py          # structlog setup
    │   ├── exceptions.py       # base errors + exception handlers
    │   ├── deps.py             # get_db, get_redis
    │   └── pagination.py
    │
    ├── db/
    │   ├── base.py             # DeclarativeBase, naming convention
    │   └── session.py          # async engine + sessionmaker
    │
    ├── middleware/
    │   ├── request_id.py
    │   └── rate_limit.py
    │
    ├── realtime/               # shared socket infra
    │   ├── server.py           # socketio setup
    │   ├── manager.py          # connections + Redis pub/sub
    │   └── auth.py             # socket token verification
    │
    ├── api/
    │   └── v1.py               # includes all module routers
    │
    └── modules/
        ├── auth/
        │   ├── router.py
        │   ├── service.py
        │   ├── schemas.py
        │   ├── dependencies.py     # get_current_user
        │   └── exceptions.py
        ├── users/
        │   ├── router.py
        │   ├── service.py
        │   ├── repository.py
        │   ├── models.py
        │   ├── schemas.py
        │   └── dependencies.py
        ├── rooms/
        │   ├── router.py
        │   ├── service.py
        │   ├── repository.py
        │   ├── models.py
        │   ├── schemas.py
        │   ├── dependencies.py
        │   └── socket_handlers.py
        ├── messages/
        │   ├── router.py
        │   ├── service.py
        │   ├── repository.py
        │   ├── models.py
        │   ├── schemas.py
        │   ├── dependencies.py
        │   └── socket_handlers.py
        └── ai/
            ├── client.py           # LLM provider wrapper
            ├── flavours.py         # AI room personas
            ├── prompts/            # prompt templates
            ├── service.py          # context building + streaming
            ├── dependencies.py
            └── schemas.py
```

---

## 4. File Responsibilities

| File | Responsibility | Must NOT contain |
|---|---|---|
| `router.py` | HTTP endpoints: parse input, call service, return output | DB queries, business logic |
| `service.py` | Business logic and orchestration | Raw SQL / direct `select()`, HTTP details |
| `repository.py` | DB queries only | Business rules, HTTP/socket code |
| `models.py` | SQLAlchemy tables | Logic |
| `schemas.py` | Pydantic request/response models | DB code |
| `dependencies.py` | `Depends()` wiring (service providers, auth) | Business logic |
| `socket_handlers.py` | Socket events for that module; thin, calls services | DB queries, business logic |

---

## 5. Architecture Rules (MUST follow)

1. **Flow is always:** `router / socket_handler` → `service` → `repository` → `db`. Never skip a layer.
2. **Modules own their code.** Everything for a feature lives in its module folder.
3. **Cross-module calls go through the other module's `service` only.** Never import another module's `repository` or `models` directly. Example: `messages` needs an AI reply → call `ai.service`.
4. **No circular imports between modules.** If two modules need each other, extract the shared piece into a third place or `core/`.
5. **`core/` is for shared infra only** (config, security, logging, errors, deps). Do not dump feature code there.
6. **Small modules may skip `repository.py`** (e.g. `auth`) if it would only wrap one trivial query. Do not over-engineer.
7. **One database, one deployable app.** No microservices, no message brokers, no extra abstraction layers unless asked.
8. **Don't create generic base classes, factories, or "manager of managers"** unless there are at least 3 real usages.

---

## 6. Coding Standards

### General
- Python 3.12+. Full type hints on every function signature and return.
- Everything I/O-related is **`async`**. Never use blocking calls (`requests`, `time.sleep`, sync DB drivers) inside async code. Use `httpx.AsyncClient`, `asyncio.sleep`.
- Use `pathlib`, f-strings, `dataclasses`/Pydantic where appropriate.
- No wildcard imports. No unused code. No commented-out code.
- Keep functions small and single-purpose.
- Prefer simple solutions. Do not add features or abstractions that were not requested.

### Naming
- Files/modules/functions/variables: `snake_case`
- Classes: `PascalCase` (`RoomService`, `RoomRepository`, `RoomCreate`)
- Constants: `UPPER_SNAKE_CASE`
- Schemas: `XCreate`, `XUpdate`, `XRead` (or `XResponse`)
- DB tables: plural `snake_case` (`users`, `rooms`, `messages`)

### Imports
- Absolute imports from `app...` (e.g. `from app.core.config import settings`).
- Order: stdlib, third-party, local (ruff handles this).

---

## 7. FastAPI Rules

- Use `APIRouter` per module with `prefix` and `tags`. Register all in `api/v1.py`. Mount under `/api/v1`.
- Always set `response_model` (or return type annotation) on endpoints. Never return ORM objects directly.
- Use proper HTTP status codes (`201` create, `204` delete, `404`, `409`, `422`).
- Use **`Annotated` + `Depends`** for dependency injection. No global service instances, no global DB session.
- Create reusable aliases, e.g. `RoomServiceDep = Annotated[RoomService, Depends(get_room_service)]`.
- Use `lifespan` for startup/shutdown (DB engine, Redis, socket server). Do not use deprecated `@app.on_event`.
- Add health endpoints: `GET /health` (liveness) and `GET /ready` (checks DB and Redis).
- Pagination on every list endpoint (limit/offset or cursor). Never return unbounded lists.

### Dependency Injection pattern

```python
# core/deps.py
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

# modules/rooms/dependencies.py
def get_room_service(db: Annotated[AsyncSession, Depends(get_db)]) -> RoomService:
    return RoomService(db)

RoomServiceDep = Annotated[RoomService, Depends(get_room_service)]

# modules/rooms/router.py
@router.get("/{room_id}", response_model=RoomRead)
async def get_room(room_id: int, service: RoomServiceDep) -> RoomRead:
    return await service.get_room(room_id)
```

---

## 8. Database Rules

- SQLAlchemy **2.0 style only**: `Mapped[...]`, `mapped_column(...)`, `select()`. No legacy `Query` API.
- **Primary keys: auto-increment integer** (`serial`/identity). **Do not use UUIDs** unless explicitly requested.
- Every table has `created_at` and `updated_at` (timezone-aware, server default).
- Add indexes on foreign keys and on columns used in filters/sorting (e.g. `messages.room_id`, `messages.created_at`).
- Define foreign keys with explicit `ondelete` behavior.
- Use the naming convention in `db/base.py` so Alembic constraint names are stable.
- **All schema changes go through Alembic migrations.** Never edit the DB by hand and never use `create_all()` in app code.
- Autogenerate migrations, then **review them manually** before committing.
- Alembic `env.py` must import every module's `models.py`.
- Avoid N+1 queries: use `selectinload` / `joinedload` deliberately.
- One session per request (via `Depends(get_db)`). Commit in the service (unit-of-work), not scattered across repositories.
- Never build SQL with string formatting. Always use bound parameters.

---

## 9. Pydantic / Schemas

- Pydantic v2 only (`model_config = ConfigDict(from_attributes=True)`, `model_validate`, `model_dump`).
- Separate schemas for create / update / read. Never reuse one schema for everything.
- Never expose sensitive fields (`password_hash`, tokens) in read schemas.
- Validate at the edge (router/socket payloads); services receive already-validated data.

---

## 10. Config & Secrets

- All config via `pydantic-settings` in `core/config.py`, loaded from environment variables.
- Never hardcode secrets, API keys, or URLs. Never commit `.env`. Keep `.env.example` updated when adding a variable.
- Access config through a single `settings` object, not `os.environ` scattered around.

---

## 11. Auth & Security

- Passwords: hash with `argon2` or `bcrypt`. Never store or log plain text.
- JWT: short-lived access token; verify signature, expiry, and required claims.
- Auth is done via `Depends(get_current_user)` for HTTP, and `realtime/auth.py` for sockets (verify token on connect).
- Authorize every action: check that the user is allowed to access the room/message (not just that they are logged in).
- Configure CORS explicitly with allowed origins. No `*` in production.
- Add rate limiting on auth endpoints and message sending.
- Validate and limit message size and payload shape on socket events.
- Never log tokens, passwords, or full message content at INFO level.

---

## 12. Realtime (Sockets) Rules

- Socket handlers live in each module's `socket_handlers.py`; shared infra lives in `realtime/`.
- Handlers are **thin**: validate payload, authorize, call a service, emit result. No business logic or DB queries in handlers.
- Authenticate on connect; reject unauthenticated connections.
- Use Redis pub/sub in `realtime/manager.py` so the app can run with multiple workers/instances.
- Define event names as constants (no magic strings scattered around). Validate every payload with a Pydantic schema.
- Clean up on disconnect (leave rooms, remove presence).
- Handle errors inside handlers and emit a structured error event instead of crashing the connection.

---

## 13. AI Module Rules

- All LLM calls go through `modules/ai/client.py`. No direct provider SDK calls elsewhere.
- Flavours (personas) are defined in `flavours.py`; prompts live in `prompts/` as templates, not inline strings in services.
- Stream responses to the client (token/chunk streaming) instead of waiting for the full reply.
- Always set **timeouts**, **max tokens**, and **retry with backoff** on provider calls.
- Limit conversation context (last N messages / token budget) when building prompts.
- Handle provider failures gracefully: user gets a clear error event, the app does not crash.
- Never put API keys in code. Never log full prompts that contain user content at INFO level.
- Treat user input as untrusted: do not let it override system prompts.

---

## 14. Error Handling

- Define domain exceptions (e.g. `RoomNotFound`, `NotRoomMember`) in module `exceptions.py` or `core/exceptions.py`.
- Services **raise domain exceptions**; global exception handlers in `core/exceptions.py` convert them to HTTP responses.
- Consistent error response shape: `{"error": {"code": "...", "message": "..."}}`.
- Never swallow exceptions silently. Never `except Exception: pass`.
- Do not leak stack traces or internal details to clients.

---

## 15. Logging & Observability

- Use `structlog` (JSON logs in production). No `print()`.
- Attach a request ID to every request (`middleware/request_id.py`) and include it in logs.
- Log meaningful events (room created, AI call failed) with context, at the right level.
- Never log secrets or sensitive user content.

---

## 16. Testing Rules

- Every new feature or bug fix comes with tests.
- Structure mirrors source: `tests/modules/<module>/`.
- Use `pytest` + `pytest-asyncio` + `httpx.AsyncClient`.
- Use a separate test database. Override dependencies with `app.dependency_overrides[get_db] = ...`.
- Mock external services (LLM provider, Redis if needed). Tests must never call real paid APIs.
- Test: happy path, validation errors, auth/permission failures, not-found cases.
- Services should be testable without HTTP. Routers tested via the test client.

---

## 17. Git & Workflow

- Small, focused commits. Commit message format: `type: short description` (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`).
- Do not commit: `.env`, secrets, `__pycache__`, `.venv`, local DB files.
- CI must pass: ruff, mypy, pytest.

---

## 18. Commands

```bash
uv sync                                   # install dependencies
uv run fastapi dev src/app/main.py        # run dev server
uv run ruff check . --fix                 # lint
uv run ruff format .                      # format
uv run mypy src                           # type check
uv run pytest                             # run tests
uv run alembic revision --autogenerate -m "message"   # create migration
uv run alembic upgrade head               # apply migrations
docker compose up -d                      # start postgres + redis (+ api)
```

Run lint, type check, and tests before saying a task is done.

---

## 19. Checklist: Adding a New Module / Feature

1. Create `modules/<name>/` with `router.py`, `service.py`, `schemas.py` (+ `repository.py`, `models.py`, `dependencies.py` if it touches the DB).
2. Define models, then generate and **review** an Alembic migration.
3. Write schemas (Create / Update / Read).
4. Write repository (queries only), then service (logic), then dependencies (DI wiring), then router.
5. Register the router in `api/v1.py`. Add socket handlers if realtime is involved.
6. Raise domain exceptions; make sure handlers map them.
7. Add tests under `tests/modules/<name>/`.
8. Run ruff, mypy, pytest.

---

## 20. Things the Agent Must NEVER Do

- Put business logic or DB queries in routers or socket handlers.
- Import another module's `repository` or `models` directly.
- Use blocking I/O inside async functions.
- Use UUID primary keys, or any over-engineered pattern (extra layers, generic base classes, DI containers) without being asked.
- Hardcode secrets or commit `.env`.
- Return ORM models directly from endpoints.
- Use SQLAlchemy 1.x legacy style or Pydantic v1 APIs.
- Change the database schema without an Alembic migration.
- Add new dependencies or change the stack without asking.
- Leave `print()`, dead code, or commented-out code.
- Skip tests or claim a task is done without running lint, types, and tests.
- Make large unrelated refactors while doing a small task. Stay within the scope of the request.

---

## 21. How the Agent Should Respond

- If requirements are unclear, ask one focused question instead of guessing.
- Show full corrected files rather than partial diffs.
- Keep explanations short and direct; focus on the working code.
- If a request would break a rule in this file, point it out and suggest the compliant alternative.

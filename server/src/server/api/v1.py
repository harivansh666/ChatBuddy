from fastapi import APIRouter

from server.modules.auth.router import router as auth_router
from server.modules.users.router import router as users_router

api_v1_router = APIRouter()

# Register module routers
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)

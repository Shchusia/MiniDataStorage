from fastapi import APIRouter

from app.core.config import BackConfig

from .endpoints import admin, auth, files, project, tokens

CONFIG = BackConfig()

api_router = APIRouter()
api_prefix = "v1"

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(project.router, prefix="/project", tags=["project"])
api_router.include_router(files.router, prefix=CONFIG.base_file_url, tags=["files"])
api_router.include_router(tokens.router, prefix="/token", tags=["tokens"])
api_router.include_router(
    admin.router, prefix="/admin", tags=["admin"], deprecated=True
)

"""
Init back application
"""

from fastapi import FastAPI, Request
from fastapi.openapi.utils import get_openapi
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

# from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from starlette_prometheus import PrometheusMiddleware, metrics

from app.api.api_v1.api import api_router
from app.api.api_v1.endpoints.utils import router
from app.core.config import AuthConfig, BackConfig
from app.core.exc import RequestException
from app.models.general_response import ErrorModel, get_response
from app.utils.logger_middleware import LoggingMiddleware

CONFIG = BackConfig()
CONFIG.base_folder_storage.mkdir(exist_ok=True)

APP = FastAPI(
    title=CONFIG.title_app,
    description=CONFIG.description_app,
    openapi_url=f"{CONFIG.base_url}"
    f"{CONFIG.global_url_prefix}/"
    f"{CONFIG.api_version}/openapi.json",
    debug=CONFIG.is_debug,
    docs_url=f"{CONFIG.base_url}/docs",
)
APP.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    # allow_methods=["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"],
    allow_methods=["*"],
    allow_headers=["*"],
    # allow_headers='date,server,content-length,content-type,access-control-allow-credentials,access-control-allow-origin,vary,Content-Type,Authorization,X-Requested-With,at,rt,AT,RT'.split(
    #     ','),
    expose_headers=["*"]
    # expose_headers='date, server, content-length, content-type, access-control-allow-credentials, access-control-allow-origin, vary'.split(
    #     ', ')
)


@AuthJWT.load_config
def get_config() -> AuthConfig:
    """
    init config for auth jwt lib
    :return: inited config
    :rtype: AuthConfig
    """
    return AuthConfig()


@APP.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException) -> JSONResponse:
    return get_response(
        data=ErrorModel(code=exc.status_code, title="Auth Error", detail=exc.message)
    )


@APP.exception_handler(RequestException)
def custom_exception_handler(request: Request, exc: RequestException) -> JSONResponse:
    return get_response(data=exc.error)


APP.middleware("http")(LoggingMiddleware())
APP.add_middleware(PrometheusMiddleware)

APP.include_router(api_router, prefix=f"{CONFIG.base_url}{CONFIG.global_url_prefix}")
APP.include_router(router, prefix=CONFIG.base_url, tags=["utils"])

APP.add_route(f"{CONFIG.base_url}/metrics", metrics)


def custom_openapi():
    if APP.openapi_schema:
        return APP.openapi_schema

    openapi_schema = get_openapi(
        title="Custom title",
        version="2.5.0",
        description="This is a very custom OpenAPI schema",
        routes=APP.routes,
    )

    # Custom documentation fastapi-jwt-auth
    headers = {
        "name": "Authorization",
        "in": "header",
        "required": True,
        "schema": {"title": "Authorization", "type": "string"},
    }

    # Get routes from index 4 because before that fastapi define router for /openapi.json, /redoc, /docs, etc
    # Get all router where operation_id is authorize
    router_authorize = [
        route
        for route in APP.routes[4:]
        if getattr(route, "operation_id", "null") == "authorize"
    ]

    for route in router_authorize:
        method = list(route.methods)[0].lower()
        try:
            # If the router has another parameter
            openapi_schema["paths"][route.path][method]["parameters"].append(headers)
        except Exception:
            # If the router doesn't have a parameter
            openapi_schema["paths"][route.path][method].update(
                {"parameters": [headers]}
            )

    APP.openapi_schema = openapi_schema
    return APP.openapi_schema


APP.openapi = custom_openapi

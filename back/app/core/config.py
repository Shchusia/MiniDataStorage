"""
Configs application
"""
import os
from datetime import timedelta
from pathlib import Path
from uuid import uuid4

from pydantic import BaseSettings, Field

BASE_DIR = Path(os.path.dirname(os.path.realpath(__file__))).parent.parent


class BackConfig(BaseSettings):
    # #######################
    # ### config main APP ###
    # #######################
    title_app: str = Field("Tiny Data Storage", description="Title application")
    description_app: str = Field(
        "Api for project handling storage models DS", description="Description this app"
    )
    is_debug: bool = Field(False, description="Run on debug mode")
    # ###################
    # ### urls config ###
    # ###################
    base_url: str = Field("/api", description="Base URL of all routes application")
    api_version: str = Field("0.0.1", description="Current API Version")
    global_url_prefix: str = Field(
        "/mdt",
        description="Global prefix for build url. "
        "Build url base_url + global_url_prefix "
        "+ api_version_prefix + api_prefix",
    )
    token_url: str = Field(
        "/token", description="Token Url for oauth. Build url base_url + token_url"
    )
    prometheus_metrics_url: str = Field(
        "/metrics", description="Url to prometheus metrics."
    )

    # #################
    # ### DB config ###
    # #################
    database_url: str = Field(None, description="connect to database")
    async_db_driver: str = Field("postgresql+asyncpg")
    sync_db_driver: str = Field("postgresql+psycopg2")

    # ###############
    # ### storage ###
    # ###############
    base_folder_storage: Path = Field(
        BASE_DIR / "storage", description="Base folder for store all files"
    )
    size_bytes_chunk: int = Field(1024 * 1024, description="Size of chunk read file")
    max_size_file: int = Field(None)

    # #########################
    # ### settings file url ###
    # #########################

    base_file_url: str = Field("/file")
    route_upload_files: str = Field("/upload")
    route_download_files: str = Field("/download")
    route_delete_files: str = Field("/remove")
    route_list_files: str = Field("/list")

    # ############
    # ### cors ###
    # ############

    origins = [
        "http://front",
        "https://front:3000",
        "http://localhost",
        "http://localhost:3000",
    ]


class AuthConfig(BaseSettings):
    """
    Config for auth
    """

    authjwt_secret_key: str = Field(
        str(uuid4()), description="secret_key for build tokens"
    )
    # Configure application to store and get JWT from cookies
    authjwt_token_location: set = Field({"cookies", "headers"}, description="")
    # authjwt_token_location: set = Field({"headers"}, description="")
    # Disable CSRF Protection for this example. default is True
    # authjwt_cookie_csrf_protect: bool = True
    # authjwt_cookie_samesite: str = 'none'
    authjwt_algorithm: str = Field(
        "HS256", description="Algorithm for security jwt token"
    )
    authjwt_access_token_expires: timedelta = Field(timedelta(days=1))
    authjwt_refresh_token_expires: timedelta = Field(timedelta(days=30))


if __name__ == "__main__":
    os.environ["DATABASE_URL"] = "test "

    conf = BackConfig()
    print(conf.database_url)

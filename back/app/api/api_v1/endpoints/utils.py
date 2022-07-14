from fastapi import APIRouter

from app.core.config import BackConfig
from app.models.general_response import RespModel, RoutesForLibrary, get_response

CONFIG = BackConfig()
router = APIRouter()


@router.get(
    "/",
    summary="UtilsUrl",
    description="Url for library.",
    response_model=RespModel[RoutesForLibrary],
)
def get_urls_work_with_files():
    base_url = f"{CONFIG.base_url}{CONFIG.global_url_prefix}{CONFIG.base_file_url}"
    return get_response(
        data=RoutesForLibrary(
            uploadRoute=base_url + CONFIG.route_upload_files,
            downloadRoute=base_url + CONFIG.route_download_files,
            deleteRoute=base_url + CONFIG.route_delete_files,
            listRoute=base_url + CONFIG.route_list_files,
        )
    )

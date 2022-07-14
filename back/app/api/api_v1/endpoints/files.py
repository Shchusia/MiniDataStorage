import datetime
import os
import re
import shutil
from typing import List, Tuple
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import FileResponse
from packaging import version
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import BackConfig
from app.core.exc import RequestException
from app.db import FileDB, ProjectAccessTokenDB, get_db
from app.db.crud.crud_files import (
    get_file,
    get_file_by_file_type_id,
    get_file_type,
    get_file_type_by_type_id_db,
    get_files_with_same_name,
    get_list_files,
    get_token_info,
    save_file,
)
from app.models.files import ListFiles, ModelFile
from app.models.general_response import ErrorModel, RespModel, get_response

CONFIG = BackConfig()

router = APIRouter()
raw_reg_version = "[0-9]+\.[0-9]+\.[0-9]+(?=\.[^.]*$)"  # noqa
reg_version = re.compile(raw_reg_version)


class TokenGetter:
    def __init__(self, is_write: bool = True):
        self.is_write = is_write

    def __call__(
        self,
        access_token: str = Query(
            ...,
            alias="accessToken",
        ),
        db: AsyncSession = Depends(get_db),
    ):
        token_db = get_token_info(db, access_token)
        message = ""
        if token_db is None:
            message = "Incorrect Access Token"
        elif not token_db.is_write and self.is_write:
            message = "Incorrect type token. Please use write token"
        elif token_db.is_deleted:
            message = "Current token is deleted. Please contact admin for get new token"
        elif (
            token_db.expired is not None and token_db.expired < datetime.datetime.now()
        ):
            message = "Token expired."
        if message:
            raise RequestException(
                ErrorModel(code=409, title="Invalid token", detail=message)
            )
        return token_db


read_token_getter = TokenGetter(is_write=False)
write_token_getter = TokenGetter(is_write=True)


def handle_version(filename: str) -> Tuple[str, str, bool]:
    """get_str_version_from_file"""
    version_file = reg_version.search(filename)
    is_extracted = False
    if version_file is None:
        str_version = "0.0.1"
    else:
        str_version = version_file.group()
        is_extracted = True
        filename = filename.replace(str_version, "").replace("..", ".")

    return filename, str_version, is_extracted


def handle_version_existed_files(
    files: List[FileDB], current_version, is_extracted
) -> str:
    version_existed_files = [version.parse(file.version) for file in files]
    if not version_existed_files:
        return current_version
    if version.parse(current_version) in version_existed_files:
        if is_extracted:
            return None
        else:
            # default version should found max version
            last_version = str(max(version_existed_files))
            parts = last_version.split(".")
            parts[-1] = str(int(parts[-1]) + 1)
            return ".".join(parts)
    else:
        return current_version


def combine_name(filename, version) -> str:
    parts = filename.split(".")
    parts.insert(-1, version)
    return ".".join(parts)


@router.post(
    CONFIG.route_upload_files,
    summary="Upload file",
    response_model=RespModel[ModelFile],
)
def load_file_route(
    file: UploadFile = File(),
    token_db: ProjectAccessTokenDB = Depends(write_token_getter),
    file_type: str = Query(None, alias="fileType", description=""),
    force: bool = Query(False, description="if need overwrite file"),
    db: AsyncSession = Depends(get_db),
):
    project_storage = CONFIG.base_folder_storage / str(token_db.project_id)
    project_storage.mkdir(exist_ok=True)
    file_type_id = None
    if file_type:
        file_type_db = get_file_type(
            db,
            file_type=file_type,
            project_id=token_db.project_id,
        )
        if not file_type_db:
            raise RequestException(
                ErrorModel(
                    code=409, title="Server error", detail="Can`t create file type"
                )
            )
        file_type_id = file_type_db.file_type_id
        project_storage /= str(file_type_id)
        project_storage.mkdir(exist_ok=True)
    file_name = f"{str(uuid4())}.ms"
    file_origin = file.filename
    filename_origin, str_version, is_extracted = handle_version(file_origin)
    list_files = get_files_with_same_name(db, token_db.project_id, filename_origin)
    new_version = handle_version_existed_files(list_files, str_version, is_extracted)
    if new_version is None:
        if not force:
            raise RequestException(
                ErrorModel(
                    code=409,
                    title="File Error",
                    detail="a file with the same version already exists"
                    "update version or use force",
                )
            )
        new_version = str_version

    try:
        with open(project_storage / file_name, "wb") as file_write:
            shutil.copyfileobj(file.file, file_write)
    finally:
        file.file.close()

    file_stats = os.stat(project_storage / file_name)

    file_db = save_file(
        db,
        project_id=token_db.project_id,
        file_name=file_name,
        origin_file_name=filename_origin,
        file_version=new_version,
        file_type_id=file_type_id,
        file_size=file_stats.st_size / (1024 * 1024),
    )
    return get_response(
        data=ModelFile(
            fileName=file_db.origin_file_name,
            version=file_db.version,
            created=file_db.created.isoformat(),
            fileType=file_type,
        )
    )


def depends_get_file_db(
    token_db: ProjectAccessTokenDB = Depends(read_token_getter),
    file_type: str = Query(None, alias="fileType", description=""),
    file_name: str = Query(
        None,
        alias="fileName",
    ),
    db: AsyncSession = Depends(get_db),
) -> FileDB:
    file_type_id = None

    if file_type:
        file_type_db = get_file_type(
            db, file_type, project_id=token_db.project_id, create_if_not_exist=False
        )
        if not file_type_db:
            raise RequestException(
                ErrorModel(
                    code=409,
                    title="Invalid argument",
                    detail="Incorrect file type. File type not exists",
                )
            )
        file_type_id = file_type_db.file_type_id
    if file_name:
        filename, str_version, is_extracted = handle_version(filename=file_name)
        if not is_extracted:
            str_version = None
        file_db = get_file(
            db,
            project_id=token_db.project_id,
            file_name=filename,
            str_version=str_version,
            file_type_id=file_type_id,
        )
    elif file_type:
        file_db = get_file_by_file_type_id(db, file_type_id=file_type_id)
    else:
        raise RequestException(
            ErrorModel(
                code=400, title="Invalid request", detail="Not exist required fields"
            )
        )

    if not file_db:
        raise RequestException(
            ErrorModel(code=404, title="File not found", detail="Not exist file.")
        )
    return file_db


@router.get(CONFIG.route_download_files, summary="Download file")
def download_file_route(
    file_db: FileDB = Depends(depends_get_file_db),
):
    project_storage = CONFIG.base_folder_storage / str(file_db.project_id)
    if file_db.file_type_id:
        project_storage /= str(file_db.file_type_id)

    return FileResponse(
        project_storage / file_db.file_name,
        media_type="application/octet-stream",
        filename=combine_name(file_db.origin_file_name, file_db.version),
    )


@router.delete(CONFIG.route_delete_files, response_model=RespModel[ModelFile])
def remove_file_route(
    file_db: FileDB = Depends(depends_get_file_db),
    db: AsyncSession = Depends(get_db),
):
    file_type_name = None
    if file_db.file_type_id:
        file_type = get_file_type_by_type_id_db(db, file_db.file_type_id)
        file_type_name = file_type.file_type
    file_db.is_view = False
    db.commit()
    return get_response(
        data=ModelFile(
            fileName=file_db.origin_file_name,
            version=file_db.version,
            created=file_db.created.isoformat() if file_db.created else "",
            fileType=file_type_name,
            fileSize=file_db.file_size,
        )
    )


@router.get(
    CONFIG.route_list_files,
    response_model=RespModel[ListFiles],
    summary="Get list existed files",
)
def get_list_files_route(
    token_db: ProjectAccessTokenDB = Depends(read_token_getter),
    file_type: str = Query(None, alias="fileType", description=""),
    db: AsyncSession = Depends(get_db),
):
    file_type_id = None

    if file_type:
        file_type_db = get_file_type(
            db, file_type, project_id=token_db.project_id, create_if_not_exist=False
        )
        if not file_type_db:
            raise RequestException(
                ErrorModel(
                    code=409,
                    title="Invalid argument",
                    detail="Incorrect file type. File type not exists",
                )
            )
        file_type_id = file_type_db.file_type_id
    list_files = get_list_files(
        db, project_id=token_db.project_id, file_type_id=file_type_id
    )

    return get_response(data=ListFiles(files=list_files))

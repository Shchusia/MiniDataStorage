from typing import Dict, List, Optional

from packaging import version
from sqlalchemy import and_, select, true
from sqlalchemy.orm import Session

from app.db import FileDB, FileTypeDB, ProjectAccessTokenDB
from app.models.files import ModelFile


def get_token_info(db: Session, token: str) -> Optional[ProjectAccessTokenDB]:
    return db.scalar(
        select(ProjectAccessTokenDB)
        .where(ProjectAccessTokenDB.access_token == token)
        .limit(1)
    )


def get_file_type(
    db: Session, file_type: str, project_id: int, create_if_not_exist: bool = True
) -> Optional[FileTypeDB]:
    db_file_type = db.scalar(
        select(FileTypeDB)
        .where(
            and_(
                FileTypeDB.file_type == file_type,
                FileTypeDB.project_id == project_id,
            )
        )
        .limit(1)
    )
    if db_file_type is None and create_if_not_exist:
        db_file_type = FileTypeDB(project_id=project_id, file_type=file_type)
        # db.add(db_file_type)
        # with db.begin():
        db.add(db_file_type)
        db.commit()
    return db_file_type


def get_file_type_by_type_id_db(db: Session, file_type_id: int) -> FileTypeDB:
    return db.scalar(
        select(FileTypeDB)
        .where(
            FileTypeDB.file_type_id == file_type_id,
        )
        .limit(1)
    )


def get_files_with_same_name(db: Session, project_id, file_name: str) -> List[FileDB]:
    return db.scalars(
        select(FileDB).where(
            FileDB.project_id == project_id, FileDB.origin_file_name == file_name
        )
    )


def save_file(
    db: Session,
    project_id: int,
    file_name: str,
    origin_file_name: str,
    file_version: str,
    file_type_id: Optional[int] = None,
    file_size: Optional[int] = -1,
) -> FileDB:
    file = FileDB(
        project_id=project_id,
        file_name=file_name,
        file_origin_name=origin_file_name,
        version=file_version,
        file_type_id=file_type_id,
        file_size=file_size,
    )
    db.add(file)
    db.commit()
    return file


def get_file(
    db: Session,
    project_id: int,
    file_name: str,
    str_version: Optional[str] = None,
    file_type_id: Optional[int] = None,
) -> Optional[FileDB]:
    conditions = [
        FileDB.project_id == project_id,
        FileDB.origin_file_name == file_name,
        FileDB.is_view == true(),
    ]
    if str_version:
        conditions.append(FileDB.version == str_version)
    if file_type_id:
        conditions.append(FileDB.file_type_id == file_type_id)
    return db.scalar(
        select(FileDB).where(*conditions).order_by(FileDB.file_id.desc()).limit(1)
    )


def get_file_by_file_type_id(
    db: Session, file_type_id: Optional[int] = None
) -> Optional[FileDB]:
    files_concrete_file_type = db.scalars(
        select(FileDB)
        .where(
            FileDB.file_type_id == file_type_id,
            FileDB.is_view == true(),
        )
        .order_by(FileDB.file_id.asc())
    )
    if not files_concrete_file_type:
        return None
    dict_files = {file.version: file for file in files_concrete_file_type}

    max_version = max([version.parse(ver) for ver in dict_files.keys()])
    return dict_files[str(max_version)]


def convert_db_file_to_model_files(
    db_files: List[FileDB], file_types: Dict[int, str]
) -> List[ModelFile]:
    return [
        ModelFile(
            fileName=db_file.origin_file_name,
            version=db_file.version,
            created=db_file.created.isoformat() if db_file.created else "",
            fileType=file_types.get(db_file.file_type_id, None),
            fileSize=db_file.file_size,
        )
        for db_file in db_files
    ]


def get_existed_file_types(db: Session, project_id: int) -> Dict[int, str]:
    file_types = db.scalars(
        select(FileTypeDB).where(FileTypeDB.project_id == project_id)
    )
    return {ft.file_type_id: ft.file_type for ft in file_types}


def get_list_files(
    db: Session,
    project_id: int,
    file_name: Optional[str] = None,
    file_type_id: Optional[int] = None,
) -> List[ModelFile]:
    conditions = [
        FileDB.project_id == project_id,
        FileDB.is_view == true(),
    ]
    if file_name:
        conditions.append(FileDB.origin_file_name == file_name)
    if file_type_id:
        conditions.append(FileDB.file_type_id == file_type_id)
    files = db.scalars(select(FileDB).where(*conditions))
    # for file in files:
    #     print(file)
    # print((files))
    file_types = get_existed_file_types(db, project_id=project_id)
    data = convert_db_file_to_model_files(files, file_types=file_types)
    # print(data)
    return data

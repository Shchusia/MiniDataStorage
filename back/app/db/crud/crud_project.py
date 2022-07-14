from typing import List, Optional

from sqlalchemy import false, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import ProjectAccessTokenDB, ProjectDB
from app.models.project import FullProject, Project, ProjectAccessToken, TinyProject


def get_list_projects_db(db: AsyncSession) -> List[TinyProject]:
    """
    Get existed projects
    :param db:
    :return:
    """
    full_projects = db.scalars(
        select(ProjectDB).order_by(ProjectDB.created.desc(), ProjectDB.is_deleted.asc())
    )

    result = [
        TinyProject(
            projectId=project.project_id,
            projectManager=project.project_manager,
            projectTitle=project.project_title,
            isDeleted=project.is_deleted,
        )
        for project in full_projects
    ]
    return result


def get_project_db_object_db(db: AsyncSession, project_id: int) -> Optional[ProjectDB]:
    return db.scalar(
        select(ProjectDB).where(ProjectDB.project_id == project_id).limit(1)
    )


def get_project_db_object_by_title_db(
    db: AsyncSession, project_title: str
) -> Optional[ProjectDB]:
    return db.scalar(
        select(ProjectDB).where(ProjectDB.project_title == project_title).limit(1)
    )


def convert_db_project(db_project: ProjectDB) -> FullProject:
    return FullProject(
        projectId=db_project.project_id,
        projectManager=db_project.project_manager,
        projectTitle=db_project.project_title,
        projectDescription=db_project.project_description,
        projectManagerEmail=db_project.project_manager_email,
        isDeleted=db_project.is_deleted,
        created=db_project.created,
    )


def get_project_db(db: AsyncSession, project_id: int) -> Optional[FullProject]:
    """

    :param db:
    :param project_id:
    :return:
    """
    db_project = get_project_db_object_db(db, project_id=project_id)
    # db_project = db.scalars(select(ProjectDB)
    # .where(ProjectDB.project_id == project_id).limit(1))
    if db_project:
        return convert_db_project(db_project)
    return None


def get_project_tokens_db(
    db: AsyncSession, project_id: int
) -> List[ProjectAccessToken]:
    tokens = db.scalars(
        select(ProjectAccessTokenDB).where(
            ProjectAccessTokenDB.project_id == project_id,
            ProjectAccessTokenDB.is_deleted == false(),
        )
    )
    result = [
        ProjectAccessToken(
            accessTokenId=token.access_token_id,
            isWrite=token.is_write,
            expired=token.expired,
            accessToken=token.access_token,
        )
        for token in tokens
    ]
    return result


def create_project_db(db: AsyncSession, project: Project) -> Optional[FullProject]:
    """

    :param db:
    :param project:
    :return:
    """
    pr = get_project_db_object_by_title_db(db, project.project_title)
    if pr is not None:
        return None

    db_project = ProjectDB(project)
    # with db.begin():
    db.add(db_project)
    db.commit()
    resp_project = FullProject(
        projectId=db_project.project_id,
        **project.dict(by_alias=True),
        isDeleted=False,
        created=db_project.created
    )
    return resp_project


def generate_token_db(
    db: AsyncSession, project_id: int, is_write, expired=None
) -> ProjectAccessToken:
    db_project_token = ProjectAccessTokenDB(
        project_id=project_id,
        is_write=is_write,
        expired=expired,
    )
    # with db.begin():
    db.add(db_project_token)
    db.commit()
    return ProjectAccessToken(
        accessToken=db_project_token.access_token,
        accessTokenId=db_project_token.access_token_id,
        isWrite=db_project_token.is_write,
        expired=db_project_token.expired,
    )


def update_project_db(
    db: AsyncSession, project_id: int, project: Project
) -> Optional[FullProject]:
    pr = get_project_db_object_by_title_db(db, project.project_title)
    if pr is not None and pr.project_id != project_id:
        return None
    db_project = get_project_db_object_db(db, project_id)
    db_project.project_description = project.project_description
    db_project.project_title = project.project_title
    db_project.project_manager = project.project_manager
    db_project.project_manager_email = project.project_manager_email
    db.commit()
    return convert_db_project(db_project)


def delete_restore_project_db(
    db: AsyncSession, project_id: int, is_delete: bool = True
) -> Optional[FullProject]:
    db_project = get_project_db_object_db(db, project_id)
    if project_id is None:
        return None
    db_project.is_deleted = is_delete
    db.commit()
    return convert_db_project(db_project)


def delete_token_db(db: AsyncSession, token_id: int) -> bool:
    token = db.scalar(
        select(ProjectAccessTokenDB).where(
            ProjectAccessTokenDB.access_token_id == token_id
        )
    )  # type: ProjectAccessTokenDB
    if not token:
        return False
    token.is_deleted = True
    db.commit()
    return True

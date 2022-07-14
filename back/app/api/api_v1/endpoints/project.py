from fastapi import APIRouter, Body, Depends
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exc import RequestException
from app.db import get_db
from app.db.crud.crud_project import (
    create_project_db,
    delete_restore_project_db,
    generate_token_db,
    get_list_projects_db,
    get_project_db,
    get_project_tokens_db,
    update_project_db,
)
from app.models.general_response import ErrorModel, RespModel, get_response
from app.models.project import Project, ProjectResponse, ResponseGetProjects

router = APIRouter()


@router.get(
    "/",
    summary="Get existed projects",
    response_description="List existed projects",
    response_model=RespModel[ResponseGetProjects],
)
def get_projects_route(
    db: AsyncSession = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    authorize.jwt_required()
    list_projects = get_list_projects_db(db)
    return get_response(data=ResponseGetProjects(projects=list_projects))


#
@router.post(
    "/",
    summary="Create a project",
    description="Create a new project",
    response_description="Information about new project",
    response_model=RespModel[ProjectResponse],
)
def create_project_route(
    project: Project = Body(),
    authorize: AuthJWT = Depends(),
    db: AsyncSession = Depends(get_db),
):
    authorize.jwt_required()
    new_project = create_project_db(db, project=project)
    if new_project is None:
        raise RequestException(
            ErrorModel(code=409, title="Bad Request", detail="Not unique project title")
        )
    token_write = generate_token_db(
        db, project_id=new_project.project_id, is_write=True
    )
    token_read = generate_token_db(
        db, project_id=new_project.project_id, is_write=False
    )
    return get_response(
        ProjectResponse(project=new_project, tokens=[token_write, token_read])
    )


@router.get(
    "/{project_id}",
    summary="Get Information about project",
    description="Get full information about project with existed tokens",
    response_description="Information about project",
    response_model=RespModel[ProjectResponse],
)
def get_project_info_route(
    project_id: int,
    authorize: AuthJWT = Depends(),
    db: AsyncSession = Depends(get_db),
):
    authorize.jwt_required()
    project = get_project_db(db, project_id)
    if not project:
        raise RequestException(
            ErrorModel(code=400, title="Bad Request", detail="Incorrect project id")
        )
    tokens = get_project_tokens_db(db, project_id)
    return get_response(ProjectResponse(project=project, tokens=tokens))


@router.put(
    "/{project_id}",
    summary="Edit Information project",
    description="Get full updated information about project with existed tokens",
    response_description="Information about project",
    response_model=RespModel[ProjectResponse],
)
def edit_project_route(
    project_id: int,
    project: Project = Body(),
    authorize: AuthJWT = Depends(),
    db: AsyncSession = Depends(get_db),
):
    authorize.jwt_required()
    project_info = update_project_db(db, project_id=project_id, project=project)
    if project_info is None:
        raise RequestException(
            ErrorModel(
                code=409,
                title="Bad Request",
                detail=f"Not unique project title or"
                f" not existed projects with id {project_id}",
            )
        )
    # project_info = get_project_db(db, project_id)
    tokens = get_project_tokens_db(db, project_id)
    return get_response(ProjectResponse(project=project_info, tokens=tokens))


@router.delete(
    "/{project_id}",
    summary="Delete project",
    description="Deactivate project, people can`t add new models",
    response_description="Information about project",
    response_model=RespModel[ProjectResponse],
)
def delete_project_route(
    project_id: int,
    authorize: AuthJWT = Depends(),
    db: AsyncSession = Depends(get_db),
):
    authorize.jwt_required()
    project_info = delete_restore_project_db(db, project_id, is_delete=True)
    if project_info is None:
        raise RequestException(
            ErrorModel(
                code=409,
                title="Bad Request",
                detail=f"Not existed project with id {project_id}",
            )
        )
    tokens = get_project_tokens_db(db, project_id)
    return get_response(ProjectResponse(project=project_info, tokens=tokens))


@router.get(
    "/restore/{project_id}",
    summary="Restore project if deleted",
    response_description="Information about project",
    response_model=RespModel[ProjectResponse],
)
def restore_project_route(
    project_id: int,
    authorize: AuthJWT = Depends(),
    db: AsyncSession = Depends(get_db),
):
    authorize.jwt_required()
    project_info = delete_restore_project_db(db, project_id, is_delete=False)
    if project_info is None:
        raise RequestException(
            ErrorModel(
                code=409,
                title="Bad Request",
                detail=f"Not found project with id {project_id}",
            )
        )
    tokens = get_project_tokens_db(db, project_id)
    return get_response(ProjectResponse(project=project_info, tokens=tokens))

from dateutil.parser import isoparser  # type: ignore
from fastapi import APIRouter, Body, Depends
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exc import RequestException
from app.db import get_db
from app.db.crud.crud_project import delete_token_db, generate_token_db
from app.models.general_response import (
    ErrorModel,
    RespModel,
    SuccessExecutionWithoutResponseData,
    get_response,
)
from app.models.project import NewAccessToken, ProjectAccessToken

router = APIRouter()


@router.delete("/{token_id}")
def delete_token_route(
    token_id: int,
    db: AsyncSession = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    authorize.jwt_required()
    is_deleted = delete_token_db(db, token_id)

    if not is_deleted:
        raise RequestException(
            ErrorModel(code=400, title="Bad Request", detail="Don`t return token")
        )
    response = get_response(
        data=SuccessExecutionWithoutResponseData(msg="Successfully delete token")
    )
    return response


@router.post(
    "/",
    summary="CreateNewToken",
    response_model=RespModel[ProjectAccessToken],
)
def create_token_route(
    access_token: NewAccessToken = Body(),
    db: AsyncSession = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    authorize.jwt_required()
    expired = access_token.expired
    if not expired:
        expired = None
    if isinstance(access_token.expired, str):
        try:
            if expired:
                expired = isoparser(expired)
        except Exception as exc:  # noqa
            pass
    token = generate_token_db(
        db=db,
        project_id=access_token.project_id,
        expired=expired,
        is_write=access_token.is_write,
    )
    return get_response(data=token)

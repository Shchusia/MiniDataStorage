from fastapi import APIRouter, Body, Depends
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session

from app.db import get_db
from app.db.crud.crud_admin import (
    convert_db_admin_to_model,
    get_admin_by_id,
    get_list_admins_db,
)
from app.models.admin import AdminCreateEdit, AdminModel, ListAdminsModel
from app.models.general_response import RespModel, get_response

router = APIRouter()


@router.get(
    "/",
    summary="GetExistedAdmins",
    description="Without current admin",
    response_model=RespModel[ListAdminsModel],
)
def get_admins_route(
    db: Session = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    authorize.jwt_required()
    admin_id = int(authorize.get_jwt_subject())
    admins = get_list_admins_db(db, admin_id_to_ignore=admin_id)
    return get_response(
        data=ListAdminsModel(admins=admins),
    )


@router.post(
    "/",
    summary="CreateNewAdmin",
    response_model=RespModel[AdminModel],
)
def new_admin_route(
    new_admin: AdminCreateEdit = Body(),
    db: Session = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    pass


@router.delete(
    "/{admin_id}",
    summary="DeleteChosenAdmin",
    response_model=RespModel[AdminModel],
)
def delete_admin_route(
    admin_id,
    db: Session = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    authorize.jwt_required()
    admin = get_admin_by_id(db, admin_id)
    admin.is_deleted = True
    db.commit()
    return get_response(data=convert_db_admin_to_model(admin))


@router.patch(
    "/{admin_id}",
    summary="RestoreChosenAdmin",
    response_model=RespModel[AdminModel],
)
def restore_admin_route(
    admin_id,
    db: Session = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    authorize.jwt_required()
    admin = get_admin_by_id(db, admin_id)
    admin.is_deleted = False
    db.commit()
    return get_response(data=convert_db_admin_to_model(admin))


@router.put(
    "/{admin_id}",
    summary="EditChosenAdmin",
    response_model=RespModel[AdminModel],
)
def edit_admin_route(
    admin_id,
    new_admin: AdminCreateEdit = Body(),
    db: Session = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    pass

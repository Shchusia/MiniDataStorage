from fastapi import APIRouter, Body, Depends
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session

from app.core.exc import RequestException
from app.core.security import get_password_hash
from app.core.validators import validate_user_email
from app.db import AdminDB, get_db
from app.db.crud.crud_admin import (
    convert_db_admin_to_model,
    create_admin_db,
    get_admin_by_email_db,
    get_admin_by_id_db,
    get_list_admins_db,
)
from app.models.admin import AdminCreateEdit, AdminModel, ListAdminsModel
from app.models.general_response import ErrorModel, RespModel, get_response

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
    authorize.jwt_required()
    email = validate_user_email(new_admin.email.lower())
    if not email:
        raise RequestException(
            ErrorModel(code=400, title="Bad Request", detail="Invalid email")
        )

    db_admin = get_admin_by_email_db(db=db, email=new_admin.email)
    if db_admin:
        raise RequestException(
            ErrorModel(code=409, title="Bad Request", detail="Email not unique")
        )
    admin_model = create_admin_db(db, new_admin)
    return get_response(data=admin_model)


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
    admin = get_admin_by_id_db(db, admin_id)
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
    admin = get_admin_by_id_db(db, admin_id)
    admin.is_deleted = False
    db.commit()
    return get_response(data=convert_db_admin_to_model(admin))


def edit_admin(admin_id: int,
               new_admin: AdminCreateEdit,
               db: Session) -> AdminModel:
    admin_db_to_update: AdminDB
    if new_admin.email:
        email = validate_user_email(new_admin.email.lower())
        if not email:
            raise RequestException(
                ErrorModel(code=400, title="Bad Request", detail="Invalid email")
            )

        db_admin = get_admin_by_email_db(db=db, email=new_admin.email)
        if db_admin and db_admin.admin_id != admin_id:
            raise RequestException(
                ErrorModel(code=409, title="Bad Request", detail="Email not unique")
            )
        admin_db_to_update = db_admin
    else:
        admin_db_to_update = get_admin_by_id_db(db, admin_id)

    admin_db_to_update.admin_name = new_admin.name
    if new_admin.password:
        admin_db_to_update.admin_password = get_password_hash(new_admin.password)
    db.commit()

    return convert_db_admin_to_model(admin_db_to_update)


@router.put(
    "/{admin_id}",
    summary="EditChosenAdmin",
    response_model=RespModel[AdminModel],
)
def edit_admin_route(
        admin_id: int,
        new_admin: AdminCreateEdit = Body(),
        db: Session = Depends(get_db),
        authorize: AuthJWT = Depends(),
):
    authorize.jwt_required()

    return get_response(data=edit_admin(admin_id, new_admin, db))


@router.put(
    "/",
    summary="EditSelfAdmin",
    response_model=RespModel[AdminModel],
)
def edit_self_admin_route(
        new_admin: AdminCreateEdit = Body(),
        db: Session = Depends(get_db),
        authorize: AuthJWT = Depends(),
):
    authorize.jwt_required()
    admin_id = authorize.get_jwt_subject()
    return get_response(data=edit_admin(admin_id, new_admin, db))

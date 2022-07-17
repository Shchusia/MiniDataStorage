from fastapi import APIRouter, Body, Depends
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import authenticate_admin
from app.core.exc import RequestException
from app.core.validators import validate_user_email
from app.db import get_db
from app.db.crud.crud_admin import convert_db_admin_to_model
from app.models import AdminAuth
from app.models.admin import AdminModel
from app.models.general_response import (
    ErrorModel,
    RespModel,
    SuccessExecutionWithoutResponseData,
    get_response,
)

router = APIRouter()


@router.post(
    "/login",
    summary="Login to account",
    description="method for user authorization ",
    response_description="does not return anything but puts an"
    " access token and a refresh token in the cookie",
    response_model=RespModel[AdminModel],
)
def login_route(
    user_data: AdminAuth = Body(),
    db: AsyncSession = Depends(get_db),
    authorize: AuthJWT = Depends(),
):
    email = validate_user_email(user_data.email.lower())
    if not email:
        raise RequestException(
            ErrorModel(code=400, title="Bad Request", detail="Invalid email")
        )

    user_db = authenticate_admin(
        db=db, user_email=user_data.email.lower(), user_password=user_data.password
    )
    if not user_db:
        raise RequestException(
            ErrorModel(
                code=403, title="Bad Request", detail="Incorrect email or password"
            )
        )
    if user_db.is_deleted:
        raise RequestException(
            ErrorModel(
                code=403,
                title="Access Denied",
                detail="Your account has been blocked. " "Contact the administrator",
            )
        )
    access_token = authorize.create_access_token(subject=user_db.admin_id)
    refresh_token = authorize.create_refresh_token(subject=user_db.admin_id)

    response = get_response(
        data=convert_db_admin_to_model(user_db),
        headers={"AT": access_token, "RT": refresh_token},
    )
    authorize.set_access_cookies(access_token, response=response)
    authorize.set_refresh_cookies(refresh_token, response=response)
    return response


@router.post(
    "/refresh",
    summary="Refresh pair tokens",
    description="updates a pair of tokens received from the user",
    response_description="does not return anything but puts an access"
    " token and a refresh token in the cookie",
    response_model=RespModel[SuccessExecutionWithoutResponseData],
)
def refresh_route(authorize: AuthJWT = Depends()):
    authorize.jwt_refresh_token_required()
    current_user = authorize.get_jwt_subject()
    access_token = authorize.create_access_token(subject=current_user)
    refresh_token = authorize.create_refresh_token(subject=current_user)
    response = get_response(
        data=SuccessExecutionWithoutResponseData(msg="The token has been refresh"),
        headers={"AT": access_token, "RT": refresh_token},
    )
    authorize.set_access_cookies(access_token, response=response)
    authorize.set_refresh_cookies(refresh_token, response=response)
    return response


@router.delete(
    "/logout",
    summary="Logout from account",
    description="removes a pair of user tokens",
    response_model=RespModel[SuccessExecutionWithoutResponseData],
)
def logout_route(authorize: AuthJWT = Depends()):
    authorize.jwt_required()
    response = get_response(
        data=SuccessExecutionWithoutResponseData(msg="Successfully logout")
    )
    authorize.unset_jwt_cookies(response)
    #
    return response

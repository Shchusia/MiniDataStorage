"""
Auth handler
"""
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_password
from app.db.crud.crud_admin import get_admin_by_email_db
from app.db.models import AdminDB


def authenticate_admin(
    db: AsyncSession, user_email: str, user_password: str
) -> Optional[AdminDB]:
    """

    :param db:
    :param user_email:
    :param user_password:
    :return:
    """

    admin = get_admin_by_email_db(db, user_email)  # type: AdminDB
    if not admin:
        return None
    if not verify_password(user_password, admin.admin_password):
        return None
    return admin

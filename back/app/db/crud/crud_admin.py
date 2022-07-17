"""
Crud functions for user table
"""
from typing import List

from sqlalchemy.orm import Session

from app.db.models import AdminDB
from app.models.admin import AdminCreateEdit, AdminModel

# https://docs.sqlalchemy.org/en/14/tutorial/data_select.html


def get_admin_by_email_db(db: Session, email: str) -> AdminDB:
    """

    :param db:
    :param user_email:
    :return:
    """
    return db.query(AdminDB).filter(AdminDB.admin_email == email).first()


def convert_db_admin_to_model(db_admin: AdminDB) -> AdminModel:
    return AdminModel(
        isDeleted=db_admin.is_deleted,
        adminId=db_admin.admin_id,
        adminEmail=db_admin.admin_email,
        adminName=db_admin.admin_name,
    )


def get_list_admins_db(db: Session, admin_id_to_ignore: int) -> List[AdminModel]:
    admins = (
        db.query(AdminDB)
        .filter(AdminDB.admin_id != admin_id_to_ignore)
        .order_by(AdminDB.is_deleted.asc(), AdminDB.admin_id.desc())
        .all()
    )  # type: List[AdminDB]
    return [convert_db_admin_to_model(admin) for admin in admins]


def get_admin_by_id_db(db: Session, admin_id: int) -> AdminDB:
    return db.query(AdminDB).filter(AdminDB.admin_id == admin_id).first()


def create_admin_db(
    db: Session,
    admin: AdminCreateEdit,
) -> AdminModel:
    admin = AdminDB(email=admin.email, password=admin.password, name=admin.name)
    db.add(admin)
    db.commit()
    return convert_db_admin_to_model(admin)

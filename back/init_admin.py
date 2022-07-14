import hashlib

from sqlalchemy import select

from app.db.models import AdminDB
from app.db.session import engine, sync_session


def get_password_hash_sha256(password: str) -> str:
    return str(hashlib.sha256(password.encode()).hexdigest())


def is_empty_db():
    with engine.connect() as connection:
        admin = connection.scalar(select(AdminDB).limit(1))
    return admin is None


def add_admin(email, password):
    ad = AdminDB(email=email, password=password)
    with sync_session() as session:
        session.add(ad)
        session.commit()


def main():
    if is_empty_db():
        add_admin("admin@admin.admin", get_password_hash_sha256("admin"))


if __name__ == "__main__":
    main()

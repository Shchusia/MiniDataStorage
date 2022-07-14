from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import VARCHAR, Boolean, Column, DateTime, ForeignKey, Integer

from app.core.validators import validate_user_email

from ..core.security import get_password_hash
from ..models.project import Project as ProjectModel
from .session import Base


class AdminDB(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    admin_name = Column(VARCHAR(100), nullable=False)
    admin_email = Column(VARCHAR(100), unique=True, nullable=False)
    admin_password = Column(VARCHAR(100))
    is_deleted = Column(Boolean, default=False)
    created = Column(DateTime, default=datetime.now)

    def __init__(
        self,
        email: str,
        password: str,
        name: str = "admin",
    ):
        email = validate_user_email(email)
        if not email:
            raise ValueError("Invalid email address")
        self.admin_email = email
        self.admin_password = get_password_hash(password)
        self.admin_name = name


class ProjectDB(Base):
    __tablename__ = "projects"
    project_id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    project_title = Column(VARCHAR(100), unique=True, nullable=False)
    project_manager = Column(VARCHAR(100), nullable=False)
    project_description = Column(VARCHAR(500), default="")
    project_manager_email = Column(VARCHAR(100), nullable=False)
    created = Column(DateTime, default=datetime.now)
    is_deleted = Column(
        Boolean,
        default=False,
    )

    def __init__(self, project: ProjectModel):
        self.project_title = project.project_title
        self.project_manager = project.project_manager
        self.project_description = project.project_description
        self.project_manager_email = project.project_manager_email


class ProjectAccessTokenDB(Base):
    __tablename__ = "project_access_tokens"

    access_token_id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    access_token = Column(VARCHAR(100), unique=True)
    is_write = Column(Boolean, default=False)
    created = Column(DateTime, default=datetime.now)
    expired = Column(DateTime, nullable=True)
    is_deleted = Column(Boolean, default=False)
    project_id = Column(Integer, ForeignKey(f"{ProjectDB.__tablename__}.project_id"))

    def __init__(
        self,
        project_id: int,
        is_write: bool,
        expired: datetime,
        access_token: str = None,
    ):
        self.project_id = project_id
        self.is_write = is_write
        self.expired = expired
        if access_token is None:
            self.access_token = str(uuid4())
        else:
            self.access_token = access_token


class FileTypeDB(Base):
    __tablename__ = "file_type"
    file_type_id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    file_type = Column(VARCHAR(100), nullable=False)
    created = Column(DateTime, default=datetime.now)
    project_id = Column(Integer, ForeignKey(f"{ProjectDB.__tablename__}.project_id"))

    def __init__(self, project_id: int, file_type: str):
        self.file_type = file_type
        self.project_id = project_id


class FileDB(Base):
    __tablename__ = "file"
    file_id = Column(Integer, autoincrement=True, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey(f"{ProjectDB.__tablename__}.project_id"))
    file_type_id = Column(
        Integer, ForeignKey(f"{FileTypeDB.__tablename__}.file_type_id"), nullable=True
    )
    is_view = Column(Boolean, default=True)
    file_name = Column(VARCHAR(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    origin_file_name = Column(VARCHAR(100), nullable=False)
    version = Column(VARCHAR(20), nullable=True)
    created = Column(DateTime, default=datetime.now)

    def __init__(
        self,
        project_id: int,
        file_name: str,
        file_origin_name: str,
        version: str,
        file_type_id: Optional[int] = None,
        file_size: Optional[int] = -1,
    ):
        self.project_id = project_id
        self.file_name = file_name
        self.origin_file_name = file_origin_name
        self.version = version
        self.file_type_id = file_type_id
        self.file_size = file_size

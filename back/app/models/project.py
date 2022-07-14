from datetime import datetime
from typing import List, Optional, Union

from pydantic import BaseModel, Field


class Project(BaseModel):
    project_manager: str = Field(
        ..., alias="projectManager", description="Manager of project"
    )
    project_manager_email: str = Field(
        ...,
        alias="projectManagerEmail",
        description="Email of project manager for contact him",
    )
    project_title: str = Field(
        ..., alias="projectTitle", description="Title of project"
    )
    project_description: str = Field(
        ..., alias="projectDescription", description="Description project"
    )


class FullProject(Project):
    project_id: int = Field(..., alias="projectId", description="id project")
    is_deleted: bool = Field(
        ..., alias="isDeleted", description="is deleted current project"
    )
    created: datetime = Field(..., description="Time create this project")


class ProjectAccessToken(BaseModel):
    access_token_id: int = Field(..., alias="accessTokenId")
    access_token: str = Field(
        ...,
        alias="accessToken",
    )
    is_write: bool = Field(..., alias="isWrite", description="Is written token")
    expired: Optional[datetime] = Field(None, description="Expired date")


class ProjectResponse(BaseModel):
    project: FullProject = Field(..., description="ProjectDB data")
    tokens: List[ProjectAccessToken] = Field(..., description="All existed tokens")


class TinyProject(BaseModel):
    project_id: int = Field(..., alias="projectId", description="id project")
    project_title: str = Field(
        ..., alias="projectTitle", description="Title of project"
    )
    project_manager: str = Field(
        ..., alias="projectManager", description="Manager of project"
    )
    is_deleted: bool = Field(
        ..., alias="isDeleted", description="is deleted current project"
    )


class ResponseGetProjects(BaseModel):
    projects: list[TinyProject] = Field(..., description="existed projects")


class NewAccessToken(BaseModel):
    project_id: int = Field(..., alias="projectId")
    is_write: bool = Field(..., alias="isWrite")
    expired: Optional[Union[datetime, str]] = Field(None)

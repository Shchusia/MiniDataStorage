from typing import List, Optional

from pydantic import BaseModel, Field


class AdminAuth(BaseModel):
    """
    Model user
    """

    email: str = Field(description="Email user")
    password: str = Field(description="Password user")


class AdminCreateEdit(BaseModel):
    """
    Model user
    """

    email: str = Field(description="Email user")
    password: Optional[str] = Field(description="Password user")
    name: str = Field()


class AdminModel(BaseModel):
    admin_id: int = Field(..., alias="adminId", description="")
    admin_name: str = Field(..., alias="adminName", description="")
    admin_email: str = Field(..., alias="adminEmail", description="")
    is_deleted: bool = Field(..., alias="isDeleted", description="")


class ListAdminsModel(BaseModel):
    admins: List[AdminModel] = Field(..., description="List existed admins")

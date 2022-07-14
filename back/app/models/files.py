from typing import List, Optional

from pydantic import BaseModel, Field


class ModelFile(BaseModel):
    file_name: str = Field(..., alias="fileName")
    version: str = Field(
        ...,
    )
    created: str = Field()
    file_type: Optional[str] = Field(None, alias="fileType")
    file_size: Optional[str] = Field(-1, alias="fileSize")


class ListFiles(BaseModel):
    files: List[ModelFile] = Field(..., description="Files in system")

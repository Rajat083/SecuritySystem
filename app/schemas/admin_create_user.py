from typing import Literal, Annotated
from pydantic import BaseModel, Field

Role = Literal["GUARD", "ADMIN"]


class AdminCreateUserRequest(BaseModel):
    username: Annotated[
        str,
        Field(min_length=3, max_length=30, example="guard2")
    ]

    password: Annotated[
        str,
        Field(min_length=6, example="securepass123")
    ]

    role: Role

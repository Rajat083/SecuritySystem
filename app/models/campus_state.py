from datetime import datetime
from typing import Annotated, Literal, Optional

from pydantic import BaseModel, Field


UserType = Literal["student", "visitor"]


class CampusState(BaseModel):
    """
    Represents the current presence state of a person in campus.

    This is a DERIVED state, not a source of truth.
    Source of truth = access logs.
    """

    user_type: UserType

    identifier: Annotated[
        str,
        Field(
            description="Roll number for student or visitor_id for visitor",
            example="21BCS123"
        )
    ]

    is_inside: Annotated[
        bool,
        Field(
            description="Whether the person is currently inside campus"
        )
    ]

    last_entry_time: Annotated[
        Optional[datetime],
        Field(
            description="Last successful entry timestamp"
        )
    ] = None

    last_exit_time: Annotated[
        Optional[datetime],
        Field(
            description="Last successful exit timestamp"
        )
    ] = None

    class Config:
        frozen = True

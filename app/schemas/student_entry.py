from typing import Annotated, Optional
from datetime import datetime

from pydantic import BaseModel, Field


RollNumber = Annotated[
    str,
    Field(
        min_length=8,
        max_length=8,
        pattern=r"^[1-9]{2}[A-Za-z]{3}[0-9]{2}[1-9]{1}$",
        example="21BCS123"
    )
]

GateNumber = Annotated[
    int,
    Field(
        ge=1,
        le=10,
        description="Gate number (1-10)",
        example=1
    )
]


class StudentEntryRequest(BaseModel):
    """
    Request body when a student enters the campus.
    """

    roll_number: RollNumber
    gate_number: GateNumber

    class Config:
        json_schema_extra = {
            "example": {
                "roll_number": "21BCS123",
                "gate_number": 1
            }
        }

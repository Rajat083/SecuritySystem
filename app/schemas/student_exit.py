from typing import Annotated, Literal
from datetime import datetime

from pydantic import BaseModel, Field, model_validator


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

Name = Annotated[
    str,
    Field(
        min_length=2,
        max_length=50,
        description="Student name",
        example="John Doe"
    )
]

PhoneNumber = Annotated[
    str,
    Field(
        pattern=r"^[6-9]\d{9}$",
        description="Phone number (10 digits, starting with 6-9)",
        example="9876543210"
    )
]

ExitPurpose = Literal["MARKET", "HOME"]


class StudentExitRequest(BaseModel):
    """
    Request body when a student exits the campus.
    """

    roll_number: RollNumber
    name: Name
    phone_number: PhoneNumber

    purpose: Annotated[
        ExitPurpose,
        Field(
            description="Purpose of exit: MARKET or HOME",
            example="MARKET"
        )
    ]

    return_by: Annotated[
        datetime,
        Field(
            description="Expected return datetime (required for both MARKET and HOME)",
            example="2025-12-17T20:30:00"
        )
    ]
    
    gate_number: GateNumber

    @model_validator(mode="after")
    def validate_return_time(self):
        """
        Basic structural validation.
        Business rules (12-hour limit etc.)
        are enforced in the domain policy.
        """
        if self.return_by <= datetime.utcnow():
            raise ValueError("return_by must be in the future")
        return self

    class Config:
        json_schema_extra = {
            "example": {
                "roll_number": "21BCS123",
                "name": "John Doe",
                "phone_number": "9876543210",
                "purpose": "MARKET",
                "return_by": "2025-12-17T20:30:00",
                "gate_number": 1
            }
        }

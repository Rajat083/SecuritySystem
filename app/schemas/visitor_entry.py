from typing import Annotated, Optional 
from pydantic import BaseModel, Field 

Name = Annotated[
    str,
    Field(
        min_length=2,
        max_length=50,
    )
]

PhoneNumber = Annotated[
    str,
    Field(
        pattern=r"^[6-9]\d{9}$"
    )
]

VisitorCount = Annotated[
    int,
    Field(ge=1, le=20, example=4)
]

VehicleNumber = Annotated[
    str,
    Field(
        pattern=r"^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$",
        example="HP12AB1234"
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

class VisitorEntryRequest(BaseModel):
    
    name: Name 
    phone_number: PhoneNumber 
    number_of_visitors: VisitorCount 
    vehicle_number: Optional[VehicleNumber] = None
    gate_number: GateNumber
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "phone_number": "9876543210",
                "number_of_visitors": 2,
                "vehicle_number": "HP12AB1234",
                "gate_number": 1
            }
        }
    
    
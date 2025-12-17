from typing import Annotated, Optional 
from pydantic import Field 

from app.domain.Users.user import User 


VisitorCount = Annotated[
    int,
    Field(
        ge=1,
        description="The number of visitors, must be at least 1"
    )
]

VehicleNumber = Annotated[
    Optional[str],
    Field(
        pattern=r"^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$",
        description="Vehicle number if visitor arrived by car",
    )
]

class Visitor(User):
    visitor_id: Annotated[
        str,
        Field(
            description="Unique identifier for the visitor"
        )
    ] 
    number_of_visitors: VisitorCount 
    vehicle_number: VehicleNumber = None 
    
    @property 
    def identifier(self) -> str:
        return self.visitor_id
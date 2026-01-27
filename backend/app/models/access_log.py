from pydantic import BaseModel, Field
from typing import Annotated, Optional, Literal 
from datetime import datetime 
from app.core.enums import Direction, StudentExitPurpose 

PersonType = Literal["student", "visitor"]

class Accessing(BaseModel):
    person_type: Annotated[PersonType, Field(..., description="Type of person accessing the facility")] 
    person_id: int 
    direction: Annotated[Direction, Field(..., description="Direction of access: IN or OUT")]
    purpose: Optional[Annotated[StudentExitPurpose, Field(..., description="Purpose of exit for students")]]
    timestamp: datetime = Field(default_factory=datetime.now, description="Timestamp of the access event")
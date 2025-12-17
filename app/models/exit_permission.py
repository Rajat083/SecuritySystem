from  pydantic  import BaseModel, Field
from datetime import datetime
from app.core.enums import  StudentExitPurpose 
from typing import Annotated

class ExitPermission(BaseModel):
    student_id: Annotated[str, Field(..., description="Roll number of the student")]
    purpose: StudentExitPurpose 
    valid_until: datetime = Field(..., description="The date and time until which the exit permission is valid")
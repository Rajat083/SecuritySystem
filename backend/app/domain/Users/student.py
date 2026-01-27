from typing import Annotated 
from pydantic import Field 

from app.domain.Users.user import User 

RollNumber = Annotated[
    str,
    Field(
        min_length=8,
        max_length=8,
        pattern=r"^[1-9]{2}[A-Za-z]{3}[0-9]{2}[1-9]{1}$",
        description="Roll number",
    )
]

class Student(User):
    
    roll_number: RollNumber 
    
    @property  
    def identifier(self) -> str:
        return self.roll_number
    
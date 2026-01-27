from abc import ABC, abstractmethod
from typing import Annotated 
from pydantic import BaseModel, Field 

Name = Annotated[
    str,
    Field(
        min_length=2,
        max_length=50,
        description="The name of the user"
    )
]

PhoneNumber = Annotated[
    str,
    Field(
        pattern=r"^[6-9]\d{9}$",
        description="The phone number of the user"
    )
]

class User(BaseModel, ABC):
    
    name: Name 
    phone_number: PhoneNumber 
    
    class Config:
        frozen = True
from typing import Literal 
from pydantic import BaseModel 

Role = Literal["GUARD", "ADMIN"]

class AuthUser(BaseModel):
    username: str
    role: Role
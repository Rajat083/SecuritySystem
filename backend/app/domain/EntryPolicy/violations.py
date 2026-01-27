from dataclasses import dataclass 
from datetime import datetime 
from typing import Literal 

@dataclass(frozen=True) 
class EntryViolation:
    
    code: Literal["LATE_ENTRY"] 
    allowed_until: datetime 
    entered_at: datetime
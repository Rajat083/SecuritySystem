from enum import Enum

class Role(str, Enum):
    STUDENT = "student"
    STAFF = "staff"
    VISITOR = "visitor"
    
class Direction(str, Enum):
    ENTRY = "entry"
    EXIT = "exit"
    
class StudentExitPurpose(str, Enum):
    MARKET = "market"
    HOME = "home"
from datetime import datetime 
from typing import Optional

from app.domain.Users.student import Student 
from app.domain.ExitPolicy.student_exit_policy import StudentExitPolicy 
from app.core.enums import Direction 
from app.core.database.collections import exit_permissions_collection, campus_state_collection
from app.services.campus_state_service import CampusStateService
from app.services.access_log_service import AccessLogService 


class StudentExitService:
    
    def __init__(self):
        self._policy = StudentExitPolicy() 
        self._state = CampusStateService() 
        self._log = AccessLogService() 
        
    async def execute(
        self,
        *,
        roll_number: str,
        purpose: str,
        return_by: datetime,
        gate_number: int
    ) -> None:
        
        student  = Student(
            name="UNKNOWN",
            phone_number="0000000000",
            roll_number=roll_number 
        )
        
        await self._policy.validate_exit(
            purpose=purpose,
            return_by=return_by
        )
        
        artifact = await self._policy.build_exit_artifact(
            purpose=purpose,
            return_by=return_by
        )
        
        await exit_permissions_collection.insert_one({
            "student_roll": student.identifier,
            **artifact
        })
        
        # Get student info from campus_state
        existing_state = await campus_state_collection.find_one({
            "user_type": "student",
            "identifier": student.identifier
        })
        
        name = existing_state.get("user_name", "UNKNOWN") if existing_state else "UNKNOWN"
        phone_number = existing_state.get("phone_number", "9999999999") if existing_state else "9999999999"
        
        await self._log.log(
            user_type="student",
            identifier=student.identifier,
            direction=Direction.EXIT,
            gate_number=gate_number,
            name=name,
            phone_number=phone_number,
            purpose=purpose
        )
        
        await  self._state.mark_outside(
            user_type="student",
            identifier=student.identifier
        )
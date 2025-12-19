from datetime import datetime 
from typing import Optional

from app.domain.Users.student import Student 
from app.domain.ExitPolicy.student_exit_policy import StudentExitPolicy 
from app.core.enums import Direction 
from app.core.database.collections import exit_permissions_collection, campus_state_collection, students_collection
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
        name: str,
        phone_number: str,
        purpose: str,
        return_by: datetime,
        gate_number: int
    ) -> None:
        
        # Create Student domain object with provided data
        student = Student(
            name=name,
            phone_number=phone_number,
            roll_number=roll_number
        )
        
        # Check if student is already outside (has already exited)
        existing_state = await self._state.get_state(
            user_type="student",
            identifier=student.identifier
        )
        
        if existing_state and existing_state.get("is_inside") is False:
            raise ValueError(f"Student {student.identifier} has already exited campus")
        
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
        
        # Mark student as outside before logging
        await self._state.mark_outside(
            user_type="student",
            identifier=student.identifier,
            user_name=name,
            phone_number=phone_number
        )
        
        await self._log.log(
            user_type="student",
            identifier=student.identifier,
            direction=Direction.EXIT,
            gate_number=gate_number,
            name=student.name,
            phone_number=student.phone_number,
            purpose=purpose
        )
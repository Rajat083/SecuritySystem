from datetime import datetime 
from typing import Optional 

from app.domain.Users.student import Student
from app.domain.EntryPolicy.student_entry import StudentEntryPolicy 
from app.domain.EntryPolicy.violations import EntryViolation 
from app.core.enums import Direction 
from app.core.database.collections import exit_permissions_collection, campus_state_collection, students_collection
from app.services.campus_state_service import CampusStateService 
from app.services.access_log_service import AccessLogService 


class StudentEntryService:
    
    def __init__(self):
        self._policy = StudentEntryPolicy()
        self._state = CampusStateService()
        self._log = AccessLogService() 
        
    async def execute(
        self,
        *,
        roll_number: str,
        name: str,
        phone_number: str,
        gate_number: int
    ) -> Optional[EntryViolation]:
        
        # Create Student domain object with provided data
        student = Student(
            name=name,
            phone_number=phone_number,
            roll_number=roll_number
        )
        
        # Check if student is already inside
        existing_state = await self._state.get_state(
            user_type="student",
            identifier=student.identifier
        )
        
        if existing_state and existing_state.get("is_inside") is True:
            raise ValueError(f"Student {student.identifier} is already inside campus")
        
        # Fetch the exit permission from database
        exit_permission = await exit_permissions_collection.find_one({
            "student_roll": student.identifier
        })
        
        allowed_until = None
        violation = None
        
        # Only validate timing if there's an exit permission (i.e., student had exited)
        if exit_permission:
            allowed_until = exit_permission.get("allowed_until")
            
            violation = await self._policy.validate_entry(
                allowed_until=allowed_until,
                current_time=datetime.utcnow()
            )
            
            # Delete the exit permission after entry
            await exit_permissions_collection.delete_one({
                "student_roll": student.identifier
            })
        
        # Update campus state with student info
        await self._state.mark_inside(
            user_type="student",
            identifier=student.identifier,
            user_name=student.name,
            phone_number=student.phone_number
        )
        
        # Log the entry
        await self._log.log(
            user_type="student",
            identifier=student.identifier,
            direction=Direction.ENTRY,
            gate_number=gate_number,
            name=student.name,
            phone_number=student.phone_number
        )
        
        return violation
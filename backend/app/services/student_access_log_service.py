from datetime import datetime
from typing import Optional

from app.core.enums import Direction
from app.core.database.collections import (
    access_logs_collection,
    student_logs_collection
)
from app.services.base_access_log_service import IAccessLogService


class StudentAccessLogService(IAccessLogService):
    """
    Concrete implementation for student access logging.
    Logs to both general access_logs and student-specific student_logs collection.
    """

    async def log(
        self,
        *,
        identifier: str,
        direction: Direction,
        gate_number: int,
        name: str = "UNKNOWN",
        phone_number: str = "9999999999",
        purpose: Optional[str] = None,
        **kwargs
    ) -> None:
        """
        Log a student access event.
        """
        log_entry = {
            "user_type": "student",
            "identifier": identifier,
            "name": name,
            "phone_number": phone_number,
            "direction": direction.value,
            "gate_number": gate_number,
            "purpose": purpose,
            "timestamp": datetime.utcnow()
        }

        # Log to general access_logs
        await access_logs_collection.insert_one(log_entry.copy())

        # Log to student-specific collection
        await student_logs_collection.insert_one(log_entry)

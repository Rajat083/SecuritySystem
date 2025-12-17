from datetime import datetime 
from typing import Optional 
from app.core.enums import Direction 
from app.core.database.collections import (
    access_logs_collection,
    student_logs_collection,
    visitor_logs_collection
)


class AccessLogService:
    
    async def log(
        self,
        *,
        user_type: str,
        identifier:  str,
        direction: Direction,
        gate_number: int,
        purpose: Optional[str] = None
    ) -> None:
        log_entry = {
            "user_type": user_type,
            "identifier": identifier,
            "direction": direction.value,
            "gate_number": gate_number,
            "purpose": purpose,
            "timestamp": datetime.now()
        }
        
        # Log to general access_logs
        await access_logs_collection.insert_one(log_entry.copy())
        
        # Log to specific collection based on user type
        if user_type == "student":
            await student_logs_collection.insert_one(log_entry)
        elif user_type == "visitor":
            await visitor_logs_collection.insert_one(log_entry)
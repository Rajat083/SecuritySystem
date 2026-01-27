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
        name: str = "UNKNOWN",
        phone_number: str = "9999999999",
        number_of_visitors: Optional[int] = None,
        purpose: Optional[str] = None
    ) -> None:
        log_entry = {
            "user_type": user_type,
            "identifier": identifier,
            "name": name,
            "phone_number": phone_number,
            "direction": direction.value,
            "gate_number": gate_number,
            "purpose": purpose,
            "timestamp": datetime.utcnow()
        }
        
        if user_type == "visitor" and number_of_visitors is not None:
            log_entry["number_of_visitors"] = number_of_visitors
        
        # Log to general access_logs
        await access_logs_collection.insert_one(log_entry.copy())
        
        # Log to specific collection based on user type
        if user_type == "student":
            await student_logs_collection.insert_one(log_entry)
        elif user_type == "visitor":
            await visitor_logs_collection.insert_one(log_entry)
from datetime import datetime
from typing import Optional

from app.core.enums import Direction
from app.core.database.collections import (
    access_logs_collection,
    visitor_logs_collection
)
from app.services.base_access_log_service import IAccessLogService


class VisitorAccessLogService(IAccessLogService):
    """
    Concrete implementation for visitor access logging.
    Logs to both general access_logs and visitor-specific visitor_logs collection.
    """

    async def log(
        self,
        *,
        identifier: str,
        direction: Direction,
        gate_number: int,
        name: str = "UNKNOWN",
        phone_number: str = "9999999999",
        number_of_visitors: Optional[int] = None,
        **kwargs
    ) -> None:
        """
        Log a visitor access event.
        """
        log_entry = {
            "user_type": "visitor",
            "identifier": identifier,
            "name": name,
            "phone_number": phone_number,
            "direction": direction.value,
            "gate_number": gate_number,
            "timestamp": datetime.utcnow()
        }

        if number_of_visitors is not None:
            log_entry["number_of_visitors"] = number_of_visitors

        # Log to general access_logs
        await access_logs_collection.insert_one(log_entry.copy())

        # Log to visitor-specific collection
        await visitor_logs_collection.insert_one(log_entry)

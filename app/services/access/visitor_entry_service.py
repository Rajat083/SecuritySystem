from datetime import datetime
from typing import Optional

from app.domain.Users.visitor import Visitor
from app.domain.EntryPolicy.visitor_entry import VisitorEntryPolicy
from app.core.enums import Direction
from app.core.database.collections import visitors_collection
from app.services.campus_state_service import CampusStateService
from app.services.access_log_service import AccessLogService


class VisitorEntryService:
    """
    Orchestrates visitor entry.
    """

    def __init__(self):
        self._policy = VisitorEntryPolicy()
        self._state = CampusStateService()
        self._log = AccessLogService()

    async def execute(
        self,
        *,
        name: str,
        phone_number: str,
        number_of_visitors: int,
        vehicle_number: Optional[str],
        gate_number: int
    ) -> str:

        result = await visitors_collection.insert_one({
            "name": name,
            "phone_number": phone_number,
            "number_of_visitors": number_of_visitors,
            "vehicle_number": vehicle_number,
            "entered_at": datetime.utcnow()
        })

        visitor_id = str(result.inserted_id)

        visitor = Visitor(
            visitor_id=visitor_id,
            name=name,
            phone_number=phone_number,
            number_of_visitors=number_of_visitors,
            vehicle_number=vehicle_number
        )

        await self._policy.validate_entry()

        await self._log.log(
            user_type="visitor",
            identifier=visitor.identifier,
            direction=Direction.ENTRY,
            gate_number=gate_number,
            name=name,
            phone_number=phone_number,
            number_of_visitors=number_of_visitors
        )

        await self._state.mark_inside(
            user_name=visitor.name,
            phone_number=visitor.phone_number,
            number_of_visitors=visitor.number_of_visitors,
            user_type="visitor",
            identifier=visitor.identifier
        )

        return visitor_id

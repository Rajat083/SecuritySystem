from app.domain.Users.visitor import Visitor
from app.domain.ExitPolicy.visitor_exit_policy import VisitorExitPolicy
from app.core.enums import Direction
from app.core.database.collections import visitors_collection
from app.services.campus_state_service import CampusStateService
from app.services.access_log_service import AccessLogService


class VisitorExitService:
    """
    Orchestrates visitor exit.
    """

    def __init__(self):
        self._policy = VisitorExitPolicy()
        self._state = CampusStateService()
        self._log = AccessLogService()

    async def execute(self, *, visitor_id: str, gate_number: int) -> None:
        
        # Get visitor info from visitors collection
        from bson import ObjectId
        from app.core.database.collections import campus_state_collection
        
        visitor_doc = await visitors_collection.find_one({"_id": ObjectId(visitor_id)})
        
        name = visitor_doc.get("name", "UNKNOWN") if visitor_doc else "UNKNOWN"
        phone_number = visitor_doc.get("phone_number", "9999999999") if visitor_doc else "9999999999"
        number_of_visitors = visitor_doc.get("number_of_visitors", 1) if visitor_doc else 1

        visitor = Visitor(
            visitor_id=visitor_id,
            name=name,
            phone_number=phone_number,
            number_of_visitors=number_of_visitors,
            vehicle_number=None
        )
        
        print(f"Exiting visitor with ID: {visitor_id}")
        print(f"Visitor identifier: {visitor.identifier}")

        await self._policy.validate_exit()

        # Remove from campus_state
        await self._state.mark_outside(
            user_type="visitor",
            identifier=visitor.identifier
        )
        
        # Delete from visitors collection
        try:
            await visitors_collection.delete_one({"_id": ObjectId(visitor_id)})
            print(f"Deleted visitor from visitors collection: {visitor_id}")
        except Exception as e:
            print(f"Error deleting visitor from visitors collection: {e}")

        await self._log.log(
            user_type="visitor",
            identifier=visitor.identifier,
            direction=Direction.EXIT,
            gate_number=gate_number,
            name=name,
            phone_number=phone_number,
            number_of_visitors=number_of_visitors
        )

from app.domain.Users.visitor import Visitor
from app.domain.ExitPolicy.visitor_exit_policy import VisitorExitPolicy
from app.core.enums import Direction
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

        visitor = Visitor(
            visitor_id=visitor_id,
            name="UNKNOWN",
            phone_number="9999999999",
            number_of_visitors=1,
            vehicle_number=None
        )

        await self._policy.validate_exit()

        await self._state.mark_outside(
            user_type="visitor",
            identifier=visitor.identifier
        )

        await self._log.log(
            user_type="visitor",
            identifier=visitor.identifier,
            direction=Direction.EXIT,
            gate_number=gate_number
        )

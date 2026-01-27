from datetime import datetime
from typing import Optional

from app.core.database.collections import campus_state_collection
from app.models.campus_state import CampusState
from app.services.base_campus_state_service import ICampusStateService


class VisitorCampusStateService(ICampusStateService):
    """
    Concrete implementation for visitor campus state management.
    
    For visitors:
    - Uses upsert to maintain the record
    - Deletes on exit (visitors are not persistent like students)
    """

    async def get_state(
        self,
        *,
        identifier: str
    ):
        """
        Get the current state of a visitor.
        """
        return await campus_state_collection.find_one({
            "user_type": "visitor",
            "identifier": identifier
        })

    async def mark_inside(
        self,
        *,
        identifier: str,
        user_name: str,
        phone_number: str,
        number_of_visitors: Optional[int] = None,
        **kwargs
    ) -> None:
        """
        Mark a visitor as currently inside campus.
        Uses upsert to update or create the record.
        """
        state = CampusState(
            user_name=user_name,
            phone_number=phone_number,
            number_of_visitors=number_of_visitors,
            user_type="visitor",
            identifier=identifier,
            is_inside=True,
            last_entry_time=datetime.utcnow(),
            last_exit_time=None
        )
        
        await campus_state_collection.update_one(
            {
                "user_type": "visitor",
                "identifier": identifier
            },
            {
                "$set": state.dict()
            },
            upsert=True
        )

    async def mark_outside(
        self,
        *,
        identifier: str,
        **kwargs
    ) -> None:
        """
        Mark a visitor as currently outside campus.
        For visitors, we delete the record completely on exit.
        """
        result = await campus_state_collection.delete_one({
            "user_type": "visitor",
            "identifier": identifier
        })
        print(f"Deleted visitor {identifier}, deleted_count: {result.deleted_count}")

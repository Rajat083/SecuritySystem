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
        Mark a visitor as currently inside campus using atomic operations.
        Uses $setOnInsert to set creation metadata only on document creation.
        Uses upsert for atomic update-or-create behavior.
        """
        set_data = {
            "user_name": user_name,
            "phone_number": phone_number,
            "user_type": "visitor",
            "identifier": identifier,
            "is_inside": True,
            "last_entry_time": datetime.utcnow(),
            "last_exit_time": None
        }
        
        if number_of_visitors is not None:
            set_data["number_of_visitors"] = number_of_visitors
        
        # Atomic upsert with $setOnInsert for creation metadata
        await campus_state_collection.update_one(
            {
                "user_type": "visitor",
                "identifier": identifier
            },
            {
                "$set": set_data,
                "$setOnInsert": {
                    "created_at": datetime.utcnow(),
                    "user_type": "visitor",
                    "identifier": identifier
                }
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
        Atomically deletes the visitor record on exit.
        """
        result = await campus_state_collection.delete_one({
            "user_type": "visitor",
            "identifier": identifier
        })

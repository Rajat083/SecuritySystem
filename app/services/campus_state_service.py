from datetime import datetime

from app.core.database.collections import campus_state_collection
from app.models.campus_state import CampusState


class CampusStateService:
    """
    Maintains the derived CampusState collection.

    Invariants:
    - ENTRY  -> is_inside = True
    - EXIT   -> is_inside = False
    """

    async def get_state(
        self,
        *,
        user_type: str,
        identifier: str
    ):
        """
        Get the current state of a person.
        """
        return await campus_state_collection.find_one({
            "user_type": user_type,
            "identifier": identifier
        })

    async def mark_inside(
        self,
        *,
        user_type: str,
        identifier: str
    ) -> None:
        """
        Mark a person as currently inside campus.
        """

        state = CampusState(
            user_type=user_type,
            identifier=identifier,
            is_inside=True,
            last_entry_time=datetime.utcnow(),
            last_exit_time=None
        )

        await campus_state_collection.update_one(
            {
                "user_type": user_type,
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
        user_type: str,
        identifier: str
    ) -> None:
        """
        Mark a person as currently outside campus.
        For visitors, we delete the record completely.
        For students, we update is_inside to False.
        """
        
        if user_type == "visitor":
            # Delete visitor record completely on exit
            await campus_state_collection.delete_one({
                "user_type": user_type,
                "identifier": identifier
            })
        else:
            # For students, just mark as outside
            await campus_state_collection.update_one(
                {
                    "user_type": user_type,
                    "identifier": identifier
                },
                {
                    "$set": {
                        "is_inside": False,
                        "last_exit_time": datetime.utcnow()
                    }
                },
                upsert=True
            )

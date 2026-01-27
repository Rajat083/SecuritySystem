from datetime import datetime
from typing import Optional

from pymongo.errors import DuplicateKeyError

from app.core.database.collections import campus_state_collection
from app.models.campus_state import CampusState
from app.services.base_campus_state_service import ICampusStateService


class StudentCampusStateService(ICampusStateService):
    """
    Concrete implementation for student campus state management.
    
    For students:
    - Updates the is_inside flag
    - Maintains persistent records
    """

    async def get_state(
        self,
        *,
        identifier: str
    ):
        """
        Get the current state of a student.
        """
        return await campus_state_collection.find_one({
            "user_type": "student",
            "identifier": identifier
        })

    async def mark_inside(
        self,
        *,
        identifier: str,
        user_name: str,
        phone_number: str,
        **kwargs
    ) -> None:
        """
        Mark a student as currently inside campus.
        """
        state = CampusState(
            user_name=user_name,
            phone_number=phone_number,
            user_type="student",
            identifier=identifier,
            is_inside=True,
            last_entry_time=datetime.utcnow(),
            last_exit_time=None
        )

        try:
            # Atomically set inside when not already inside; insert when missing
            result = await campus_state_collection.update_one(
                {
                    "user_type": "student",
                    "identifier": identifier,
                    "is_inside": {"$ne": True}
                },
                {
                    "$set": state.dict()
                },
                upsert=True
            )
        except DuplicateKeyError:
            # Unique index prevents duplicate docs; treat as already inside
            raise ValueError(f"Student {identifier} is already inside campus")

        if result.matched_count == 0 and result.upserted_id is None:
            # No document updated and no upsert happened ⇒ was already inside
            raise ValueError(f"Student {identifier} is already inside campus")

    async def mark_outside(
        self,
        *,
        identifier: str,
        user_name: str = None,
        phone_number: str = None,
        purpose: str = None,
        **kwargs
    ) -> None:
        """
        Mark a student as currently outside campus.
        For students, we update is_inside to False while maintaining the record.
        """
        update_data = {
            "is_inside": False,
            "last_exit_time": datetime.utcnow()
        }
        
        if user_name:
            update_data["user_name"] = user_name
        if phone_number:
            update_data["phone_number"] = phone_number
        if purpose:
            update_data["purpose"] = purpose
        
        await campus_state_collection.update_one(
            {
                "user_type": "student",
                "identifier": identifier
            },
            {
                "$set": update_data
            },
            upsert=True
        )

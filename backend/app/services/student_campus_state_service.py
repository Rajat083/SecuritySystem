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
        Mark a student as currently inside campus using atomic operations.
        Uses $setOnInsert to set initial values only on document creation.
        Prevents duplicate entries with conditional update.
        """
        update_operation = {
            "$set": {
                "user_type": "student",
                "identifier": identifier,
                "user_name": user_name,
                "phone_number": phone_number,
                "is_inside": True,
                "last_entry_time": datetime.utcnow(),
                "last_exit_time": None
            },
            "$setOnInsert": {
                "created_at": datetime.utcnow(),
                "user_type": "student",
                "identifier": identifier
            }
        }

        try:
            # Atomic update with condition: only update if not already inside
            result = await campus_state_collection.update_one(
                {
                    "user_type": "student",
                    "identifier": identifier,
                    "is_inside": {"$ne": True}
                },
                update_operation,
                upsert=True
            )
            
            # Check if document was actually matched (already exists and not inside)
            if result.matched_count == 0 and result.upserted_id is None:
                # No document matched and no new document was inserted
                raise ValueError(f"Student {identifier} is already inside campus")
                
        except DuplicateKeyError:
            # Unique index violation means document already exists and is inside
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
        Mark a student as currently outside campus using atomic operations.
        Uses atomic $set with $setOnInsert to ensure consistency.
        """
        set_data = {
            "is_inside": False,
            "last_exit_time": datetime.utcnow()
        }
        
        if user_name:
            set_data["user_name"] = user_name
        if phone_number:
            set_data["phone_number"] = phone_number
        if purpose:
            set_data["last_exit_purpose"] = purpose
        
        # Atomic update with setOnInsert for new documents
        await campus_state_collection.update_one(
            {
                "user_type": "student",
                "identifier": identifier
            },
            {
                "$set": set_data,
                "$setOnInsert": {
                    "created_at": datetime.utcnow(),
                    "user_type": "student",
                    "identifier": identifier
                }
            },
            upsert=True
        )

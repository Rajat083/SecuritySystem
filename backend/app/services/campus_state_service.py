from datetime import datetime

from app.core.database.collections import campus_state_collection
from app.models.campus_state import CampusState
from typing import Optional

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
        phone_number: str,
        number_of_visitors: Optional[int] = None,
        user_name: str,
        user_type: str,
        identifier: str
    ) -> None:
        """
        Mark a person as currently inside campus.
        Uses atomic $setOnInsert to set initial values only on document creation.
        """

        state_update = {
            "user_name": user_name,
            "phone_number": phone_number,
            "is_inside": True,
            "last_entry_time": datetime.utcnow(),
            "last_exit_time": None
        }
        
        if number_of_visitors is not None:
            state_update["number_of_visitors"] = number_of_visitors
        
        if user_type == "visitor":
            # Use atomic upsert with $setOnInsert for initial document creation
            await campus_state_collection.update_one(
                {
                    "user_type": user_type,
                    "identifier": identifier
                },
                {
                    "$set": state_update,
                    "$setOnInsert": {
                        "created_at": datetime.utcnow(),
                        "user_type": user_type,
                        "identifier": identifier
                    }
                },
                upsert=True
            )
        else:
            # For students, atomically delete previous state and update new one
            await campus_state_collection.delete_one({
                "user_type": user_type,
                "identifier": identifier
            })
            # Insert new state atomically
            await campus_state_collection.insert_one({
                **state_update,
                "user_type": user_type,
                "identifier": identifier,
                "created_at": datetime.utcnow()
            })

    async def mark_outside(
        self,
        *,
        user_type: str,
        identifier: str,
        user_name: str = None,
        phone_number: str = None,
        purpose: str = None
    ) -> None:
        """
        Mark a person as currently outside campus.
        Uses atomic operations to ensure consistent state.
        For visitors: atomically delete the record.
        For students: atomically update is_inside flag and timestamp.
        """
        
        if user_type == "visitor":
            # Atomically delete visitor record on exit
            result = await campus_state_collection.delete_one({
                "user_type": user_type,
                "identifier": identifier
            })
            
        else:
            # For students, atomically update with $set to mark as outside
            update_data = {
                "$set": {
                    "is_inside": False,
                    "last_exit_time": datetime.utcnow()
                }
            }
            
            if user_name:
                update_data["$set"]["user_name"] = user_name
            if phone_number:
                update_data["$set"]["phone_number"] = phone_number
            if purpose:
                update_data["$set"]["last_exit_purpose"] = purpose
            
            # Atomic update with additional timestamp field
            update_data["$setOnInsert"] = {
                "created_at": datetime.utcnow()
            }
            
            await campus_state_collection.update_one(
                {
                    "user_type": user_type,
                    "identifier": identifier
                },
                update_data,
                upsert=True
            )
            if phone_number:
                update_data["phone_number"] = phone_number
            if purpose:
                update_data["purpose"] = purpose
            
            await campus_state_collection.update_one(
                {
                    "user_type": user_type,
                    "identifier": identifier
                },
                {
                    "$set": update_data
                },
                upsert=True
            )

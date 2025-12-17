from typing import Any 

from app.domain.EntryPolicy.entry_policy import EntryPolicy 

class VisitorEntryPolicy(EntryPolicy):
    
    async def validate_entry(self, **context: Any) -> None:
        return 
    
    
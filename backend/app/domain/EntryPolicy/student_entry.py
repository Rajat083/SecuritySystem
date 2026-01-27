from datetime import datetime 
from typing import Any, Optional 

from app.domain.EntryPolicy.entry_policy import EntryPolicy 
from app.domain.EntryPolicy.violations import EntryViolation

class StudentEntryPolicy(EntryPolicy):
    
    async def validate_entry(self, **context: Any) -> Optional[EntryViolation]:
        allowed_until: Optional[datetime] = context.get("allowed_until")
        current_time: datetime = context.get("current_time", datetime.utcnow()) 
        
        if allowed_until is None:
            return None
        
        # Remove timezone info for comparison if present
        allowed_time = allowed_until.replace(tzinfo=None) if allowed_until.tzinfo else allowed_until
        current = current_time.replace(tzinfo=None) if current_time.tzinfo else current_time
         
        if current <= allowed_time:
            return None 
        
        return EntryViolation(
            code="LATE_ENTRY", 
            allowed_until=allowed_until, 
            entered_at=current_time
        )
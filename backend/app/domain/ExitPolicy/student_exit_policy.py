from datetime import datetime, timedelta
from typing import Any, Dict, Literal

from app.domain.ExitPolicy.exit_policy import ExitPolicy


class ExitArtifact(Dict):
    
    purpose: Literal["MARKET", "HOME"] 
    allowed_until: datetime 
    

class StudentExitPolicy(ExitPolicy):
    
    MAX_MARKET_DURATION = timedelta(hours=12)
    
    async def validate_exit(self, **context: Any) -> None:
        
        purpose = context.get("purpose")
        return_by = context.get("return_by") 
        now = datetime.utcnow()
        
        if purpose not in ["MARKET", "HOME"]:
            raise ValueError("Invalid exit purpose provided.") 
        
        if return_by is None:
            raise ValueError("Return by time must be provided") 
        
        # Remove timezone info for comparison if present
        return_time = return_by.replace(tzinfo=None) if return_by.tzinfo else return_by
        
        if purpose == "MARKET":
            if return_time <= now:
                raise ValueError("Return by time must be in the future for MARKET exits.")
            if return_time > now + self.MAX_MARKET_DURATION:
                raise ValueError("Return by time for MARKET exits cannot exceed 12 hours from now.")
        
    async def build_exit_artifact(self, **context: Any) -> ExitArtifact:
        
        purpose: Literal["MARKET", "HOME"] = context.get("purpose") 
        return_by: datetime = context.get("return_by")
        
        return {
            "purpose": purpose,
            "allowed_until": return_by
        }
from typing import Any, Optional 

from app.domain.ExitPolicy.exit_policy import ExitPolicy

class VisitorExitPolicy(ExitPolicy):
    
    async def validate_exit(self, **context: Any) -> None:
        return 
    
    async def build_exit_artifact(self, **context: Any) -> Optional[dict]:
        return None 
    
    
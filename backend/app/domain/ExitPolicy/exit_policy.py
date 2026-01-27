from abc import ABC, abstractmethod 
from typing import Any, Optional 


class ExitPolicy(ABC):
    
    @abstractmethod
    async def validate_exit(self, **kwargs: Any) -> None:
        raise NotImplementedError("Subclasses must implement this method") 
    
    @abstractmethod
    async def build_exit_artifact(self, **kwargs: Any) -> Optional[dict]:
        raise NotImplementedError("Subclasses must implement this method") 
    
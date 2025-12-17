from abc import ABC, abstractmethod 
from typing import Any, Optional

from app.domain.EntryPolicy.violations import EntryViolation

class EntryPolicy(ABC):
    
    @abstractmethod 
    async def validate_entry(self, **context: Any) -> Optional[EntryViolation]:
        raise NotImplementedError
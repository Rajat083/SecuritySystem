from abc import ABC, abstractmethod
from typing import Optional
from app.core.enums import Direction


class IAccessLogService(ABC):
    """
    Abstract interface for access logging.
    Follows Liskov Substitution Principle - implementations
    can be substituted without breaking the contract.
    """

    @abstractmethod
    async def log(
        self,
        *,
        identifier: str,
        direction: Direction,
        gate_number: int,
        name: str = "UNKNOWN",
        phone_number: str = "9999999999",
        **kwargs
    ) -> None:
        """
        Log an access event (entry/exit).
        """
        pass

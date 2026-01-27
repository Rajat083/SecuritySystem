from abc import ABC, abstractmethod
from typing import Optional


class ICampusStateService(ABC):
    """
    Abstract interface for campus state management.
    Follows Liskov Substitution Principle - implementations
    can be substituted without breaking the contract.
    """

    @abstractmethod
    async def get_state(
        self,
        *,
        identifier: str
    ):
        """
        Get the current state of a person.
        """
        pass

    @abstractmethod
    async def mark_inside(
        self,
        *,
        identifier: str,
        user_name: str,
        phone_number: str,
        **kwargs
    ) -> None:
        """
        Mark a person as currently inside campus.
        """
        pass

    @abstractmethod
    async def mark_outside(
        self,
        *,
        identifier: str,
        **kwargs
    ) -> None:
        """
        Mark a person as currently outside campus.
        """
        pass

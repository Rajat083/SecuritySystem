from fastapi import Depends, HTTPException, status 
from app.models.auth_user import AuthUser 
from app.api.dependencies import get_current_user 


def require_role(*allowed_roles: str):
    def checker(user: AuthUser = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted",
            )
        return user
    return checker
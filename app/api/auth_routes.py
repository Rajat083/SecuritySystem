from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.core.database.collections import auth_users_collection
from app.core.passwords import verify_password
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login",)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = await auth_users_collection.find_one(
        {"username": form_data.username, "is_active": True}
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(
        form_data.password,
        user["password_hash"],
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "username": user["username"],
        "role": user["role"],
    })

    return {
        "access_token": token,
        "token_type": "bearer",
    }

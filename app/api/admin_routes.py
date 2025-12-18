from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.admin_create_user import AdminCreateUserRequest
from app.core.database.collections import auth_users_collection
from app.core.passwords import hash_password
from app.api.permissions import require_role

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(require_role("ADMIN"))],
)


@router.post("/users", status_code=status.HTTP_201_CREATED, 
             dependencies=[Depends(require_role("ADMIN"))])
async def create_user(req: AdminCreateUserRequest):
    # Prevent duplicate usernames
    existing = await auth_users_collection.find_one(
        {"username": req.username}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    await auth_users_collection.insert_one({
        "username": req.username,
        "password_hash": hash_password(req.password),
        "role": req.role,
        "is_active": True,
        "created_at": datetime.utcnow(),
    })

    return {
        "message": "User created successfully",
        "username": req.username,
        "role": req.role,
    }

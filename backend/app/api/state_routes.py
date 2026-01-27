from fastapi import APIRouter, Depends
from app.core.database.collections import (
    campus_state_collection,
    student_logs_collection,
    visitor_logs_collection
)
from app.api.permissions import require_role
from typing import List

router = APIRouter()


@router.get("/visitors/inside", 
            dependencies=[Depends(require_role("GUARD", "ADMIN"))])
async def visitors_inside():
    """
    Returns all visitors currently inside the campus.
    """
    results = await campus_state_collection.find(
        {"user_type": "visitor", "is_inside": True}
    ).to_list(None)
    
    # Convert ObjectId to string for JSON serialization
    for result in results:
        if "_id" in result:
            result["_id"] = str(result["_id"])
    
    return results


@router.get("/students/outside",
            dependencies=[Depends(require_role("GUARD", "ADMIN"))])
async def students_outside():
    """
    Returns all students currently outside the campus.
    """
    results = await campus_state_collection.find(
        {"user_type": "student", "is_inside": False}
    ).to_list(None)
    
    # Convert ObjectId to string for JSON serialization
    for result in results:
        if "_id" in result:
            result["_id"] = str(result["_id"])
    
    return results


@router.get("/logs/students",
            dependencies=[Depends(require_role("GUARD", "ADMIN"))])
async def get_student_logs():
    """
    Returns all student entry/exit logs ordered by timestamp (newest first).
    """
    results = await student_logs_collection.find().sort("timestamp", -1).to_list(None)
    
    for result in results:
        if "_id" in result:
            result["_id"] = str(result["_id"])
    
    return results


@router.get("/logs/visitors",
            dependencies=[Depends(require_role("GUARD", "ADMIN"))])
async def get_visitor_logs():
    """
    Returns all visitor entry/exit logs ordered by timestamp (newest first).
    """
    results = await visitor_logs_collection.find().sort("timestamp", -1).to_list(None)
    
    for result in results:
        if "_id" in result:
            result["_id"] = str(result["_id"])
    
    return results

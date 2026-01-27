from fastapi import APIRouter, HTTPException, Depends

from app.schemas.student_entry import StudentEntryRequest 
from app.schemas.student_exit import StudentExitRequest 
from app.services.access.student_entry_service import StudentEntryService
from app.services.access.student_exit_service import StudentExitService 
from app.api.permissions import require_role

router = APIRouter() 

@router.post("/entry",
             dependencies=[Depends(require_role("GUARD"))])
async def student_entry(req: StudentEntryRequest):
    """
    Record a student's entry into campus.
    
    - Validates that the student exists in the database
    - Checks if the student is already inside
    - Validates entry timing if student had previously exited with a return time
    - Records the entry in access logs
    """
    service = StudentEntryService() 
    
    try:
        violation = await service.execute(
            roll_number=req.roll_number,
            name=req.name,
            phone_number=req.phone_number,
            gate_number=req.gate_number
        )
    except ValueError as e:
        return {
            "status": "entry_denied",
            "message": str(e),
            "roll_number": req.roll_number
        }
    
    if violation:
        return {
            "status": "entered_with_violation",
            "roll_number": req.roll_number,
            "violation": {
                "code": violation.code,
                "allowed_until": violation.allowed_until.isoformat() if violation.allowed_until else None,
                "entered_at": violation.entered_at.isoformat() if violation.entered_at else None
            }
        }
        
    return {
        "status": "entered_successfully",
        "roll_number": req.roll_number
    }
    
@router.post("/exit",
             dependencies=[Depends(require_role("GUARD"))])
async def student_exit(req: StudentExitRequest):
    """
    Record a student's exit from campus.
    
    - Validates that the student exists in the database
    - Checks if the student is currently inside campus
    - Validates exit purpose and return time
    - Creates an exit permission for re-entry validation
    - Records the exit in access logs
    """
    service = StudentExitService() 
    
    try:
        await service.execute(
            roll_number=req.roll_number,
            name=req.name,
            phone_number=req.phone_number,
            purpose=req.purpose,
            return_by=req.return_by,
            gate_number=req.gate_number
        )
    except ValueError as e:
        return {
            "status": "exit_denied",
            "message": str(e),
            "roll_number": req.roll_number
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {
        "status": "exit_recorded",
        "roll_number": req.roll_number,
        "purpose": req.purpose,
        "return_by": req.return_by.isoformat()
    }
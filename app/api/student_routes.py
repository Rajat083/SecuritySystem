from fastapi import APIRouter, HTTPException 

from app.schemas.student_entry import StudentEntryRequest 
from app.schemas.student_exit import StudentExitRequest 
from app.services.access.student_entry_service import StudentEntryService
from app.services.access.student_exit_service import StudentExitService 

router = APIRouter() 

@router.post("/entry")
async def student_entry(req: StudentEntryRequest):
    service = StudentEntryService() 
    
    try:
        violation = await service.execute(
            roll_number=req.roll_number,
            gate_number=req.gate_number
        )
    except ValueError as e:
        return {
            "status": "entry_denied",
            "message": str(e)
        }
    
    if violation:
        return {
            "status": "entered_with_violation",
            "violation": violation.code,
            "allowed_until": violation.allowed_until,
            "entered_at": violation.entered_at
        }
        
    return {
        "status": "entered_successfully"
    }
    
@router.post("/exit")
async def student_exit(req: StudentExitRequest):
    service = StudentExitService() 
    
    try:
        await service.execute(
            roll_number=req.roll_number,
            purpose=req.purpose,
            return_by=req.return_by,
            gate_number=req.gate_number
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {
        "status": "exit_recorded"
    }
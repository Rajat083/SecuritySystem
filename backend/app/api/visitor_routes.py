from fastapi import APIRouter, Body, Query, Depends

from app.schemas.visitor_entry import VisitorEntryRequest
from app.services.access.visitor_entry_service import VisitorEntryService
from app.services.access.visitor_exit_service import VisitorExitService
from app.api.permissions import require_role
router = APIRouter()


@router.post("/entry",
             dependencies=[Depends(require_role("GUARD"))])
async def visitor_entry(req: VisitorEntryRequest = Body(...)):
    service = VisitorEntryService()

    visitor_id = await service.execute(
        name=req.name,
        phone_number=req.phone_number,
        number_of_visitors=req.number_of_visitors,
        vehicle_number=req.vehicle_number,
        gate_number=req.gate_number
    )

    return {
        "status": "entered",
        "visitor_id": visitor_id
    }


@router.post("/exit/{visitor_id}",
             dependencies=[Depends(require_role("GUARD"))])
async def visitor_exit(visitor_id: str, gate_number: int = Query(..., ge=1, le=10)):
    service = VisitorExitService()
    await service.execute(visitor_id=visitor_id, gate_number=gate_number)

    return {"status": "exited"}

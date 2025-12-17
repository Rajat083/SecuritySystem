from fastapi import FastAPI

from app.api.student_routes import router as student_router
from app.api.visitor_routes import router as visitor_router
from app.api.state_routes import router as state_router
from app.core.database.client import MongoClient
from app.core.database.indexes import create_indexes

app = FastAPI(
    title="Campus Security System",
    version="1.0.0"
)


@app.on_event("startup")
async def startup():
    db = MongoClient.get_database()
    await create_indexes(db)


app.include_router(student_router, prefix="/student", tags=["Student"])
app.include_router(visitor_router, prefix="/visitor", tags=["Visitor"])
app.include_router(state_router, prefix="/state", tags=["Campus State"])

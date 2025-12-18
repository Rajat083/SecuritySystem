from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.api.student_routes import router as student_router
from app.api.visitor_routes import router as visitor_router
from app.api.state_routes import router as state_router
from app.core.database.client import MongoClient
from app.core.database.indexes import create_indexes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    MongoClient.get_client()
    yield
    # Shutdown
    MongoClient.close_client()



app = FastAPI(
    title="Campus Security System",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(student_router, prefix="/student", tags=["Student"])
app.include_router(visitor_router, prefix="/visitor", tags=["Visitor"])
app.include_router(state_router, prefix="/state", tags=["Campus State"])

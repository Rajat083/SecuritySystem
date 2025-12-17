from motor.motor_asyncio import  AsyncIOMotorClient 
from typing import Final
import os

MONGODB_URI: Final[str] = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME: Final[str] = os.getenv("DATABASE_NAME", "mydatabase")


class MongoClient:
    
    _cllient: AsyncIOMotorClient | None = None
    
    @classmethod 
    def get_client(cls) -> AsyncIOMotorClient:
        if cls._cllient is None:
            cls._cllient = AsyncIOMotorClient(MONGODB_URI)
        return cls._cllient 
    
    @classmethod
    def get_database(cls):
        client = cls.get_client()
        return cls.get_client()[DATABASE_NAME]
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Final
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI: Final[str] = os.getenv("MONGO_URI")
DATABASE_NAME: Final[str] = os.getenv("DATABASE_NAME", "campus_security")

class MongoClient:
    _client: AsyncIOMotorClient | None = None

    @classmethod
    def get_client(cls) -> AsyncIOMotorClient:
        if cls._client is None:
            if not MONGODB_URI:
                raise RuntimeError("MONGO_URI is not set")
            cls._client = AsyncIOMotorClient(MONGODB_URI)
        return cls._client

    @classmethod
    def get_database(cls):
        client = cls.get_client()
        return client[DATABASE_NAME]

    @classmethod
    def close_client(cls):
        if cls._client:
            cls._client.close()
            cls._client = None

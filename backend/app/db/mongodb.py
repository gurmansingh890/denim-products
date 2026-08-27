import logging
from typing import Optional, Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("uvicorn")

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_mock: bool = False

db = Database()

# In-memory dictionary fallback store if local MongoDB service is unavailable
mock_collections: Dict[str, List[Dict[str, Any]]] = {
    "users": [],
    "businesses": [],
    "products": [],
    "customization_options": [],
    "orders": [],
    "offers": [],
    "reviews": [],
    "support_tickets": [],
    "wishlists": []
}

async def connect_to_mongo():
    try:
        kwargs = {"serverSelectionTimeoutMS": 4000}
        if "mongodb+srv://" in settings.MONGODB_URL:
            try:
                import certifi
                kwargs["tlsCAFile"] = certifi.where()
            except ImportError:
                pass
        db.client = AsyncIOMotorClient(settings.MONGODB_URL, **kwargs)
        # Test connection
        await db.client.admin.command('ping')
        db.db = db.client[settings.DATABASE_NAME]
        db.is_mock = False
        logger.info(f"Connected to MongoDB at {settings.MONGODB_URL}")
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e}. Utilizing in-memory database fallback mode.")
        db.is_mock = True

async def close_mongo_connection():
    if db.client:
        db.client.close()
        logger.info("Closed MongoDB connection.")

def get_database() -> AsyncIOMotorDatabase:
    return db.db

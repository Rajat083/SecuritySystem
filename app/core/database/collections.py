from motor.motor_asyncio import AsyncIOMotorCollection 
from app.core.database.client import MongoClient 

db = MongoClient.get_database()


access_logs_collection: AsyncIOMotorCollection = db["access_logs"] 

student_logs_collection: AsyncIOMotorCollection = db["student_logs"]

visitor_logs_collection: AsyncIOMotorCollection = db["visitor_logs"]

campus_state_collection: AsyncIOMotorCollection = db["campus_state"]

exit_permissions_collection: AsyncIOMotorCollection = db["exit_permissions"] 

visitors_collection: AsyncIOMotorCollection = db["visitors"]
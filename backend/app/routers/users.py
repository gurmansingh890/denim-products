from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_user
from app.db.mongodb import db, mock_collections
from app.models.schemas import Address
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_copy = dict(current_user)
    if "password_hash" in user_copy:
        del user_copy["password_hash"]
    return user_copy

@router.post("/addresses")
async def add_address(address: Address, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user.get("_id", current_user.get("id")))
    address_dict = address.model_dump()
    address_dict["id"] = address_dict.get("id") or str(ObjectId())

    addresses = current_user.get("addresses", [])
    if address_dict.get("is_default"):
        for a in addresses:
            a["is_default"] = False
    addresses.append(address_dict)

    if db.is_mock or db.db is None:
        for u in mock_collections["users"]:
            if str(u.get("_id")) == user_id or str(u.get("id")) == user_id:
                u["addresses"] = addresses
    else:
        await db.db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": {"addresses": addresses}})

    return {"message": "Address added successfully", "addresses": addresses}

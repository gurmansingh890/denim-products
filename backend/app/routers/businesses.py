import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import BusinessCreate, BusinessResponse
from app.core.dependencies import get_current_user, require_role
from app.db.mongodb import db, mock_collections
from bson import ObjectId

router = APIRouter(prefix="/businesses", tags=["Businesses"])

@router.post("/register", response_model=BusinessResponse)
async def register_business(
    biz_in: BusinessCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user.get("_id", current_user.get("id")))

    # Check if business exists for user
    existing = None
    if db.is_mock or db.db is None:
        existing = next((b for b in mock_collections["businesses"] if str(b.get("user_id")) == user_id), None)
    else:
        existing = await db.db["businesses"].find_one({"user_id": user_id})

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a registered business application"
        )

    biz_dict = biz_in.model_dump()
    biz_dict["user_id"] = user_id
    biz_dict["verification_status"] = "pending"
    biz_dict["rating"] = 5.0
    biz_dict["review_count"] = 0
    biz_dict["created_at"] = datetime.utcnow().isoformat()

    if db.is_mock or db.db is None:
        b_id = str(uuid.uuid4())
        biz_dict["_id"] = b_id
        biz_dict["id"] = b_id
        mock_collections["businesses"].append(biz_dict)
        # Update user role to business
        for u in mock_collections["users"]:
            if str(u.get("_id")) == user_id or str(u.get("id")) == user_id:
                u["role"] = "business"
    else:
        res = await db.db["businesses"].insert_one(biz_dict)
        b_id = str(res.inserted_id)
        biz_dict["_id"] = b_id
        await db.db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": {"role": "business"}})

    return biz_dict

@router.get("/my-business", response_model=Optional[BusinessResponse])
async def get_my_business(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user.get("_id", current_user.get("id")))
    if db.is_mock or db.db is None:
        biz = next((b for b in mock_collections["businesses"] if str(b.get("user_id")) == user_id), None)
        if biz:
            biz["_id"] = str(biz.get("_id", biz.get("id")))
        return biz
    else:
        biz = await db.db["businesses"].find_one({"user_id": user_id})
        if biz:
            biz["_id"] = str(biz["_id"])
        return biz

@router.get("/pending", response_model=List[BusinessResponse])
async def list_pending_businesses(current_user: dict = Depends(require_role(["admin"]))):
    items = []
    if db.is_mock or db.db is None:
        items = [b for b in mock_collections["businesses"] if b.get("verification_status") == "pending"]
    else:
        cursor = db.db["businesses"].find({"verification_status": "pending"})
        items = await cursor.to_list(length=100)
        for item in items:
            item["_id"] = str(item["_id"])
    return items

@router.patch("/{business_id}/verify", response_model=BusinessResponse)
async def verify_business(
    business_id: str,
    action: str = "approve",  # approve or reject
    current_user: dict = Depends(require_role(["admin"]))
):
    status_str = "approved" if action == "approve" else "rejected"
    biz = None
    if db.is_mock or db.db is None:
        biz = next((b for b in mock_collections["businesses"] if str(b.get("_id")) == business_id or str(b.get("id")) == business_id), None)
        if biz:
            biz["verification_status"] = status_str
    else:
        try:
            biz = await db.db["businesses"].find_one({"_id": ObjectId(business_id)})
            if biz:
                await db.db["businesses"].update_one({"_id": ObjectId(business_id)}, {"$set": {"verification_status": status_str}})
                biz["verification_status"] = status_str
        except Exception:
            pass

    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    biz["_id"] = str(biz.get("_id", biz.get("id")))
    return biz

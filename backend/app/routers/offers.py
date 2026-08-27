import uuid
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import OfferCreate, OfferResponse
from app.core.dependencies import require_role
from app.db.mongodb import db, mock_collections
from bson import ObjectId

router = APIRouter(prefix="/offers", tags=["Offers"])

@router.get("/", response_model=List[OfferResponse])
async def list_offers():
    items = []
    if db.is_mock or db.db is None:
        items = list(mock_collections["offers"])
    else:
        cursor = db.db["offers"].find({"active": True})
        items = await cursor.to_list(length=100)
        for item in items:
            item["_id"] = str(item["_id"])
    return items

@router.post("/validate/{code}")
async def validate_code(code: str):
    offer = None
    if db.is_mock or db.db is None:
        offer = next((o for o in mock_collections["offers"] if o["code"].upper() == code.upper() and o.get("active")), None)
    else:
        offer = await db.db["offers"].find_one({"code": code.upper(), "active": True})

    if not offer:
        raise HTTPException(status_code=404, detail="Invalid or expired discount code")

    return {
        "code": offer["code"],
        "discount_type": offer["discount_type"],
        "value": offer["value"],
        "description": offer["description"]
    }

@router.post("/", response_model=OfferResponse)
async def create_offer(
    offer_in: OfferCreate,
    current_user: dict = Depends(require_role(["admin"]))
):
    off_dict = offer_in.model_dump()
    off_dict["code"] = off_dict["code"].upper()

    if db.is_mock or db.db is None:
        o_id = str(uuid.uuid4())
        off_dict["_id"] = o_id
        off_dict["id"] = o_id
        mock_collections["offers"].append(off_dict)
    else:
        res = await db.db["offers"].insert_one(off_dict)
        off_dict["_id"] = str(res.inserted_id)

    return off_dict

import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import OrderCreate, OrderResponse, OrderStatusUpdate, StatusHistoryItem
from app.core.dependencies import get_current_user, require_role
from app.db.mongodb import db, mock_collections
from bson import ObjectId

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_in: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user.get("_id", current_user.get("id")))
    
    subtotal = sum((item.unit_price * item.quantity) for item in order_in.items)
    customization_total = sum((item.customization_price * item.quantity) for item in order_in.items)
    delivery_fee = 15.0
    tax = round((subtotal + customization_total) * 0.08, 2)
    total = round(subtotal + customization_total + delivery_fee + tax, 2)

    order_dict = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "user_name": current_user.get("name", "Valued Customer"),
        "business_id": order_in.business_id,
        "business_name": "Matsui Dye House & Workshop",
        "items": [item.model_dump() for item in order_in.items],
        "subtotal": subtotal,
        "customization_total": customization_total,
        "delivery_fee": delivery_fee,
        "tax": tax,
        "total": total,
        "delivery_address": order_in.delivery_address.model_dump(),
        "delivery_estimate": "4-6 Business Days",
        "production_status": "confirmed",
        "status_history": [
            {
                "status": "confirmed",
                "timestamp": datetime.utcnow().isoformat(),
                "note": "Order confirmed and queued at Kyoto Craft House."
            }
        ],
        "created_at": datetime.utcnow().isoformat()
    }

    if db.is_mock or db.db is None:
        mock_collections["orders"].append(order_dict)
    else:
        await db.db["orders"].insert_one(order_dict)

    return order_dict

@router.get("/", response_model=List[OrderResponse])
async def list_orders(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user.get("_id", current_user.get("id")))
    user_role = current_user.get("role", "customer")

    orders = []
    if db.is_mock or db.db is None:
        orders = list(mock_collections["orders"])
    else:
        cursor = db.db["orders"].find({})
        orders = await cursor.to_list(length=500)
        for o in orders:
            o["_id"] = str(o["_id"])

    # Filter based on role
    if user_role == "customer":
        filtered = [o for o in orders if str(o.get("user_id")) == user_id]
    elif user_role == "business":
        filtered = [o for o in orders if str(o.get("business_id")) == user_id or o.get("business_id") == "b1"]
    else:  # admin sees all
        filtered = orders

    filtered.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)
    return filtered

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    order = None
    if db.is_mock or db.db is None:
        order = next((o for o in mock_collections["orders"] if str(o.get("_id")) == order_id or str(o.get("id")) == order_id), None)
    else:
        try:
            order = await db.db["orders"].find_one({"_id": ObjectId(order_id)})
        except Exception:
            order = await db.db["orders"].find_one({"_id": order_id})

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order["_id"] = str(order.get("_id", order.get("id")))
    return order

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_user: dict = Depends(require_role(["business", "admin"]))
):
    order = None
    if db.is_mock or db.db is None:
        order = next((o for o in mock_collections["orders"] if str(o.get("_id")) == order_id or str(o.get("id")) == order_id), None)
    else:
        try:
            order = await db.db["orders"].find_one({"_id": ObjectId(order_id)})
        except Exception:
            order = await db.db["orders"].find_one({"_id": order_id})

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = status_update.production_status
    history = order.get("status_history", [])
    history.append({
        "status": new_status,
        "timestamp": datetime.utcnow().isoformat(),
        "note": status_update.note or f"Status updated to {new_status} by artisan."
    })

    if db.is_mock or db.db is None:
        order["production_status"] = new_status
        order["status_history"] = history
    else:
        await db.db["orders"].update_one(
            {"_id": order["_id"]},
            {"$set": {"production_status": new_status, "status_history": history}}
        )

    order["_id"] = str(order.get("_id", order.get("id")))
    return order

from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import require_role
from app.db.mongodb import db, mock_collections

router = APIRouter(prefix="/admin", tags=["Admin Platform Control"])

@router.get("/analytics")
async def get_analytics(current_user: dict = Depends(require_role(["admin"]))):
    orders = []
    products = []
    users = []
    businesses = []
    
    if db.is_mock or db.db is None:
        orders = mock_collections["orders"]
        products = mock_collections["products"]
        users = mock_collections["users"]
        businesses = mock_collections["businesses"]
    else:
        orders = await db.db["orders"].find({}).to_list(length=1000)
        products = await db.db["products"].find({}).to_list(length=1000)
        users = await db.db["users"].find({}).to_list(length=1000)
        businesses = await db.db["businesses"].find({}).to_list(length=1000)

    total_sales = sum(o.get("total", 0) for o in orders)
    completed_orders = len([o for o in orders if o.get("production_status") == "delivered"])
    pending_businesses = len([b for b in businesses if b.get("verification_status") == "pending"])
    
    # Regional demand mock aggregation
    regional_demand = [
        {"region": "Kyoto, JP", "orders_count": 48, "volume": "$16,420"},
        {"region": "Brooklyn, NY", "orders_count": 86, "volume": "$29,580"},
        {"region": "Okayama, JP", "orders_count": 32, "volume": "$11,200"},
        {"region": "London, UK", "orders_count": 21, "volume": "$7,350"}
    ]

    return {
        "total_revenue": round(total_sales, 2),
        "total_orders": len(orders),
        "completed_orders": completed_orders,
        "total_products": len(products),
        "total_users": len(users),
        "pending_business_approvals": pending_businesses,
        "regional_demand": regional_demand,
        "sales_timeline": [
            {"month": "May", "revenue": 14200},
            {"month": "Jun", "revenue": 19800},
            {"month": "Jul", "revenue": 24500},
            {"month": "Aug", "revenue": 31900}
        ]
    }

@router.get("/users")
async def list_all_users(current_user: dict = Depends(require_role(["admin"]))):
    users = []
    if db.is_mock or db.db is None:
        users = list(mock_collections["users"])
    else:
        cursor = db.db["users"].find({})
        users = await cursor.to_list(length=500)
        for u in users:
            u["_id"] = str(u["_id"])
            if "password_hash" in u:
                del u["password_hash"]
    
    for u in users:
        u["_id"] = str(u.get("_id", u.get("id")))
        if "password_hash" in u:
            del u["password_hash"]
    return users

import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Query, HTTPException, status, Depends
from app.models.schemas import ProductCreate, ProductResponse
from app.core.dependencies import get_current_user, require_role
from app.db.mongodb import db, mock_collections
from bson import ObjectId

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    fabric_weight: Optional[str] = Query(None),
    is_customizable: Optional[bool] = Query(None),
    sort: Optional[str] = Query("trending"),  # trending, price_asc, price_desc, rating, newest
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    items = []
    if db.is_mock or db.db is None:
        items = list(mock_collections["products"])
    else:
        cursor = db.db["products"].find({})
        items = await cursor.to_list(length=500)
        for item in items:
            item["_id"] = str(item["_id"])

    # Filtering
    filtered = []
    for p in items:
        p["_id"] = str(p.get("_id", p.get("id", "")))
        if category and category.lower() != "all crafts" and p.get("category", "").lower() != category.lower():
            continue
        if min_price is not None and p.get("base_price", 0) < min_price:
            continue
        if max_price is not None and p.get("base_price", 0) > max_price:
            continue
        if fabric_weight and fabric_weight.lower() not in p.get("fabric_weight", "").lower():
            continue
        if is_customizable is not None and p.get("is_customizable") != is_customizable:
            continue
        if search:
            q = search.lower()
            t = p.get("title", "").lower()
            d = p.get("description", "").lower()
            cat = p.get("category", "").lower()
            if q not in t and q not in d and q not in cat:
                continue
        filtered.append(p)

    # Sorting
    if sort == "price_asc":
        filtered.sort(key=lambda x: x.get("base_price", 0))
    elif sort == "price_desc":
        filtered.sort(key=lambda x: x.get("base_price", 0), reverse=True)
    elif sort == "newest":
        filtered.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)
    else:  # trending default
        filtered.sort(key=lambda x: x.get("trending_score", 0), reverse=True)

    paginated = filtered[skip : skip + limit]
    return paginated

@router.get("/recommendations", response_model=List[ProductResponse])
async def get_recommendations(
    user_id: Optional[str] = Query(None),
    limit: int = Query(6, ge=1, le=20)
):
    """
    Personalized product recommendations based on trending items & category affinity.
    """
    items = []
    if db.is_mock or db.db is None:
        items = list(mock_collections["products"])
    else:
        cursor = db.db["products"].find({})
        items = await cursor.to_list(length=100)
        for item in items:
            item["_id"] = str(item["_id"])

    # High trending score or curated products
    items.sort(key=lambda x: (x.get("trending_score", 0), x.get("base_price", 0)), reverse=True)
    for p in items:
        p["_id"] = str(p.get("_id", p.get("id", "")))
    return items[:limit]

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = None
    if db.is_mock or db.db is None:
        product = next((p for p in mock_collections["products"] if str(p.get("_id")) == product_id or str(p.get("id")) == product_id), None)
    else:
        try:
            product = await db.db["products"].find_one({"_id": ObjectId(product_id)})
        except Exception:
            product = await db.db["products"].find_one({"id": product_id})

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product["_id"] = str(product.get("_id", product.get("id")))
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_in: ProductCreate,
    current_user: dict = Depends(require_role(["business", "admin"]))
):
    prod_dict = product_in.model_dump()
    if not prod_dict.get("business_id"):
        prod_dict["business_id"] = str(current_user.get("_id", current_user.get("id")))

    prod_dict["created_at"] = datetime.utcnow()
    prod_dict["trending_score"] = prod_dict.get("trending_score", 85.0)

    if db.is_mock or db.db is None:
        p_id = str(uuid.uuid4())
        prod_dict["_id"] = p_id
        prod_dict["id"] = p_id
        mock_collections["products"].append(prod_dict)
    else:
        res = await db.db["products"].insert_one(prod_dict)
        p_id = str(res.inserted_id)
        prod_dict["_id"] = p_id

    return prod_dict

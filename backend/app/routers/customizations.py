from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.models.schemas import PriceBreakdownRequest, PriceBreakdownResponse
from app.db.mongodb import db, mock_collections
from bson import ObjectId

router = APIRouter(prefix="/customizations", tags=["Customizations"])

CUSTOMIZATION_CONFIG = [
    {
        "id": "fit",
        "name": "Silhouette & Fit",
        "description": "Choose your tailored cut engineered on vintage shuttle looms.",
        "options": [
            {"id": "fit_selvedge_straight", "name": "Selvedge Straight Cut", "price_delta": 0.0, "weight": "14.5oz", "description": "Classic 1950s straight leg silhouette with standard rise."},
            {"id": "fit_archivist_slim", "name": "The Archivist Slim Fit", "price_delta": 15.0, "weight": "14.0oz", "description": "Modern tapered silhouette with narrow leg opening."},
            {"id": "fit_relaxed_workwear", "name": "Relaxed Workwear Fit", "price_delta": 25.0, "weight": "18.0oz", "description": "Spacious thigh and deep rise designed for heavy utility wear."}
        ]
    },
    {
        "id": "wash",
        "name": "Indigo Dye & Wash Finish",
        "description": "Natural plant indigo fermentation and artisanal wash techniques.",
        "options": [
            {"id": "wash_raw_unsanforized", "name": "Unsanforized Raw Deep Indigo", "price_delta": 0.0, "description": "100% pure raw state. Shrinks to fit with high fade contrast."},
            {"id": "wash_kyoto_shadow", "name": "Kyoto Shadow Hand Wash", "price_delta": 40.0, "description": "Triple hand-dipped in Kyoto indigo vats with sun-cured patina."},
            {"id": "wash_vintage_acid", "name": "Vintage Stone & Acid Distress", "price_delta": 30.0, "description": "Artisanal pumice stone wash replicating 10 years of authentic wear."}
        ]
    },
    {
        "id": "hardware",
        "name": "Buttons & Copper Rivets",
        "description": "Hand-hammered hardware produced by traditional metallurgists.",
        "options": [
            {"id": "hw_copper_rivet", "name": "Hand-Hammered Solid Copper", "price_delta": 0.0, "description": "Solid copper rivets that oxidize gracefully over time."},
            {"id": "hw_burnished_brass", "name": "Burnished Antique Brass", "price_delta": 10.0, "description": "Heritage brass hardware with laser-etched loom icon."},
            {"id": "hw_matte_black", "name": "Industrial Matte Black Iron", "price_delta": 15.0, "description": "Powder-coated heavy iron buttons with custom denim tacking."}
        ]
    },
    {
        "id": "stitching",
        "name": "Stitching Thread & Accent",
        "description": "Heavy gauge thread stitched on vintage Union Special machines.",
        "options": [
            {"id": "stitch_classic_amber", "name": "Classic Golden Amber Thread", "price_delta": 0.0, "description": "Traditional gold cotton-poly core thread for maximum seam strength."},
            {"id": "stitch_tone_on_tone", "name": "Indigo Tone-on-Tone Stitch", "price_delta": 12.0, "description": "Deep indigo thread that blends seamlessly into the fabric."},
            {"id": "stitch_contrast_white", "name": "Contrast Raw Cotton Stitch", "price_delta": 15.0, "description": "High-contrast off-white thread highlighting hand-sewn pocket details."}
        ]
    },
    {
        "id": "patches",
        "name": "Leather Patch & Monogram",
        "description": "Vegetable-tanned leather waistband patch and custom stamping.",
        "options": [
            {"id": "patch_tan_leather", "name": "Tan Vegetable-Tanned Horween Patch", "price_delta": 0.0, "description": "Premium 5oz leather patch stamped with workshop serial code."},
            {"id": "patch_charcoal_suede", "name": "Charcoal Reverse Suede Patch", "price_delta": 15.0, "description": "Soft suede patch with debossed copper leaf branding."},
            {"id": "patch_raw_edged", "name": "Raw-Edged Indigo Selvedge Patch", "price_delta": 10.0, "description": "Stitched denim selvedge ID patch with customized initials."}
        ]
    }
]

@router.get("/options")
async def get_customization_options():
    return CUSTOMIZATION_CONFIG

@router.post("/calculate-price", response_model=PriceBreakdownResponse)
async def calculate_price(req: PriceBreakdownRequest):
    # Lookup base product price
    product = None
    if db.is_mock or db.db is None:
        product = next((p for p in mock_collections["products"] if str(p.get("_id")) == req.product_id or str(p.get("id")) == req.product_id), None)
    else:
        try:
            product = await db.db["products"].find_one({"_id": ObjectId(req.product_id)})
        except Exception:
            product = await db.db["products"].find_one({"id": req.product_id})

    base_price = product.get("base_price", 280.0) if product else 280.0
    customization_total = sum(sel.price_delta for sel in req.selections)
    artisan_craft_fee = 25.0  # Hand-tailoring & shuttle loom setup fee
    delivery_fee = 15.0
    tax = round((base_price + customization_total + artisan_craft_fee) * 0.08, 2)
    total = round(base_price + customization_total + artisan_craft_fee + delivery_fee + tax, 2)

    breakdown_items = [
        {"label": "Base Garment (Shuttle Loom Woven)", "amount": base_price},
        {"label": "Artisan Craft & Stitching Fee", "amount": artisan_craft_fee}
    ]
    for sel in req.selections:
        if sel.price_delta > 0:
            breakdown_items.append({"label": f"Custom Option ({sel.option_name})", "amount": sel.price_delta})

    breakdown_items.append({"label": "Estimated Delivery & Courier", "amount": delivery_fee})
    breakdown_items.append({"label": "Est. Sales Tax (8%)", "amount": tax})

    return {
        "base_price": base_price,
        "customization_total": customization_total,
        "artisan_craft_fee": artisan_craft_fee,
        "delivery_fee": delivery_fee,
        "tax": tax,
        "total": total,
        "breakdown_items": breakdown_items
    }

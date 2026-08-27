import math
from fastapi import APIRouter
from app.models.schemas import LocationEstimateRequest, LocationEstimateResponse

router = APIRouter(prefix="/location", tags=["Location & Delivery"])

ARTISANS_DATA = [
    {"id": "b1", "name": "Matsui Dye House", "city": "Kyoto, Japan", "distance_km": 12, "specialty": "Selvedge & Natural Indigo", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"},
    {"id": "b2", "name": "Okayama Shuttle Loom Co.", "city": "Okayama, Japan", "distance_km": 28, "specialty": "18oz Heavy Selvedge", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"},
    {"id": "b3", "name": "Brooklyn Stitch Workshop", "city": "Brooklyn, NY", "distance_km": 3.4, "specialty": "Custom Fittings & Tailoring", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
]

@router.post("/estimate-delivery", response_model=LocationEstimateResponse)
async def estimate_delivery(req: LocationEstimateRequest):
    city = req.city or "Brooklyn, NY"
    
    # Calculate delivery estimate based on user location
    delivery_fee = 15.0
    estimated_days = "3-5 Business Days"
    
    if "brooklyn" in city.lower() or "ny" in city.lower() or "new york" in city.lower():
        delivery_fee = 12.0
        estimated_days = "2-3 Days (Local Express Pickup Available)"
    elif "tokyo" in city.lower() or "japan" in city.lower() or "kyoto" in city.lower():
        delivery_fee = 10.0
        estimated_days = "2-4 Days (Domestic Japan Express)"

    return {
        "city": city,
        "nearby_artisans_count": len(ARTISANS_DATA),
        "estimated_delivery_days": estimated_days,
        "delivery_fee": delivery_fee,
        "artisans": ARTISANS_DATA
    }

@router.get("/nearby-artisans")
async def get_nearby_artisans(lat: float = 40.6782, lng: float = -73.9442):
    return {
        "coordinates": {"lat": lat, "lng": lng},
        "count": len(ARTISANS_DATA),
        "artisans": ARTISANS_DATA
    }

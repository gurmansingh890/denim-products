from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

# Address Schema
class Address(BaseModel):
    id: Optional[str] = None
    name: str
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "USA"
    is_default: bool = False

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "customer"  # customer, business, admin
    phone: Optional[str] = None
    addresses: List[Address] = []

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Business Schemas
class LocationGeo(BaseModel):
    lat: float
    lng: float
    city: str
    address: Optional[str] = None

class BusinessBase(BaseModel):
    business_type: str  # artisan, bulk_buyer, both
    business_name: str
    tax_id: str
    location: LocationGeo
    bio: str
    portfolio_images: List[str] = []
    specialty: Optional[str] = "Selvedge Weaving & Hand Dyeing"

class BusinessCreate(BusinessBase):
    pass

class BusinessResponse(BusinessBase):
    id: str = Field(alias="_id")
    user_id: str
    verification_status: str = "pending"  # pending, approved, rejected
    rating: float = 4.9
    review_count: int = 18
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Product Schemas
class ProductBase(BaseModel):
    title: str
    description: str
    base_price: float
    category: str  # Raw Denim, Jackets, Custom Fits, Accessories
    fabric_weight: str  # e.g. "14.5oz", "18oz"
    images: List[str] = []
    is_customizable: bool = True
    ready_made_stock: int = 10
    tags: List[str] = []
    trending_score: float = 0.0

class ProductCreate(ProductBase):
    business_id: Optional[str] = None

class ProductResponse(ProductBase):
    id: str = Field(alias="_id")
    business_id: str
    business_name: Optional[str] = "Matsui Dye House"
    artisan_location: Optional[str] = "Kyoto, Japan"
    artisan_avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Customization Schemas
class CustomizationSelection(BaseModel):
    group: str  # fit, wash, hardware, stitching, patches
    option_name: str
    price_delta: float = 0.0

class CustomizationOptionGroup(BaseModel):
    id: str
    name: str
    description: str
    options: List[Dict[str, Any]]

class PriceBreakdownRequest(BaseModel):
    product_id: str
    selections: List[CustomizationSelection]
    delivery_zip: Optional[str] = "11201"

class PriceBreakdownResponse(BaseModel):
    base_price: float
    customization_total: float
    artisan_craft_fee: float
    delivery_fee: float
    tax: float
    total: float
    breakdown_items: List[Dict[str, Any]]

# Order Schemas
class OrderItem(BaseModel):
    product_id: str
    product_title: str
    product_image: Optional[str] = None
    customization_selections: List[CustomizationSelection] = []
    quantity: int = 1
    unit_price: float
    customization_price: float = 0.0

class OrderCreate(BaseModel):
    business_id: str
    items: List[OrderItem]
    delivery_address: Address
    payment_method: str = "credit_card"

class OrderStatusUpdate(BaseModel):
    production_status: str  # confirmed, in_production, stitching, shipped, delivered
    note: Optional[str] = None

class StatusHistoryItem(BaseModel):
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    note: Optional[str] = None

class OrderResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    user_name: Optional[str] = None
    business_id: str
    business_name: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    customization_total: float
    delivery_fee: float
    tax: float
    total: float
    delivery_address: Address
    delivery_estimate: str = "4-6 Days"
    production_status: str = "confirmed"  # confirmed, in_production, stitching, shipped, delivered
    status_history: List[StatusHistoryItem] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Offer Schemas
class OfferCreate(BaseModel):
    code: str
    description: str
    discount_type: str  # percent, flat
    value: float
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    applicable_categories: List[str] = []
    active: bool = True

class OfferResponse(OfferCreate):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

# Support Ticket Schemas
class SupportTicketCreate(BaseModel):
    subject: str
    message: str
    category: str = "Order Inquiry"
    order_id: Optional[str] = None

class TicketMessage(BaseModel):
    sender_role: str
    sender_name: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SupportTicketResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    user_name: str
    user_email: str
    subject: str
    message: str
    category: str
    order_id: Optional[str] = None
    status: str = "open"  # open, in_progress, resolved
    assigned_admin_id: Optional[str] = None
    messages: List[TicketMessage] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Location / Delivery Schemas
class LocationEstimateRequest(BaseModel):
    lat: Optional[float] = 40.6782
    lng: Optional[float] = -73.9442
    city: Optional[str] = "Brooklyn, NY"
    business_id: Optional[str] = None

class LocationEstimateResponse(BaseModel):
    city: str
    nearby_artisans_count: int
    estimated_delivery_days: str
    delivery_fee: float
    artisans: List[Dict[str, Any]]

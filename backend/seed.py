import asyncio
from datetime import datetime
from app.core.security import get_password_hash
from app.db.mongodb import db, connect_to_mongo, mock_collections

async def seed_data():
    await connect_to_mongo()

    print("Seeding Indigo & Stitch Database...")

    # Sample Users
    users_data = [
        {
            "_id": "u_customer_1",
            "name": "Maya Lin",
            "email": "maya@example.com",
            "password_hash": get_password_hash("password123"),
            "role": "customer",
            "phone": "+1 (555) 234-5678",
            "addresses": [
                {
                    "id": "addr_1",
                    "name": "Maya Lin",
                    "street": "142 Bedford Ave, Apt 3B",
                    "city": "Brooklyn",
                    "state": "NY",
                    "zip_code": "11211",
                    "country": "USA",
                    "is_default": True
                }
            ],
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "_id": "b1",
            "name": "Kenji Matsui",
            "email": "kenji@matsuidye.jp",
            "password_hash": get_password_hash("artisan123"),
            "role": "business",
            "phone": "+81 75 555 0192",
            "addresses": [],
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "_id": "u_admin_1",
            "name": "Indigo Admin",
            "email": "admin@indigostitch.com",
            "password_hash": get_password_hash("admin123"),
            "role": "admin",
            "phone": "+1 (800) 555-DENIM",
            "addresses": [],
            "created_at": datetime.utcnow().isoformat()
        }
    ]

    # Sample Businesses
    businesses_data = [
        {
            "_id": "b1",
            "user_id": "b1",
            "business_type": "artisan",
            "business_name": "Matsui Dye House & Workshop",
            "tax_id": "JP-88492019",
            "location": {
                "lat": 35.0116,
                "lng": 135.7681,
                "city": "Kyoto, Japan",
                "address": "Kamigamo Motoyama, Kita Ward"
            },
            "bio": "Third-generation Kyoto indigo dye house specializing in shuttle-loom selvedge denim and plant-based fermentation dyeing.",
            "portfolio_images": [
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80"
            ],
            "verification_status": "approved",
            "rating": 4.98,
            "review_count": 42,
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "_id": "b2",
            "user_id": "u_pending_artisan",
            "business_type": "bulk_buyer",
            "business_name": "Okayama Raw Denim Collective",
            "tax_id": "JP-99201948",
            "location": {
                "lat": 34.6555,
                "lng": 133.9198,
                "city": "Okayama, Japan",
                "address": "Kojima Denim Street"
            },
            "bio": "Supplier of heavy-ounce unsanforized selvedge roll goods and bulk heritage garments.",
            "portfolio_images": [],
            "verification_status": "pending",
            "rating": 4.85,
            "review_count": 12,
            "created_at": datetime.utcnow().isoformat()
        }
    ]

    # Sample Products
    products_data = [
        {
            "_id": "p1",
            "business_id": "b1",
            "title": "Kyoto Shadow Wash Selvedge",
            "description": "Crafted on vintage shuttle looms using 100% organic Supima cotton. Triple hand-dipped in natural indigo fermentation vats for rich vertical fading potential.",
            "base_price": 345.0,
            "category": "Raw Denim",
            "fabric_weight": "14.5oz",
            "images": [
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80"
            ],
            "is_customizable": True,
            "ready_made_stock": 12,
            "tags": ["Selvedge", "Kyoto Dye", "Unsanforized"],
            "trending_score": 98.5,
            "business_name": "Matsui Dye House",
            "artisan_location": "Kyoto, Japan",
            "artisan_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "_id": "p2",
            "business_id": "b1",
            "title": "The Archivist Slim Raw Jean",
            "description": "Narrow selvedge ID cuff, mid-high rise, tailored slim leg. Engineered for severe contrast fading and longevity.",
            "base_price": 280.0,
            "category": "Custom Fits",
            "fabric_weight": "14.0oz",
            "images": [
                "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80"
            ],
            "is_customizable": True,
            "ready_made_stock": 8,
            "tags": ["Slim Fit", "Raw Denim", "Red Line Selvedge"],
            "trending_score": 94.0,
            "business_name": "Matsui Dye House",
            "artisan_location": "Kyoto, Japan",
            "artisan_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "_id": "p3",
            "business_id": "b1",
            "title": "Type II Heritage Selvedge Jacket",
            "description": "Iconic pleated front Type II denim jacket with hand-burnished solid copper rivets, double flap chest pockets, and selvedge placket accent.",
            "base_price": 410.0,
            "category": "Jackets",
            "fabric_weight": "18.0oz",
            "images": [
                "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
            ],
            "is_customizable": True,
            "ready_made_stock": 5,
            "tags": ["Jacket", "Type II", "18oz Heavyweight"],
            "trending_score": 96.2,
            "business_name": "Matsui Dye House",
            "artisan_location": "Kyoto, Japan",
            "artisan_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "_id": "p4",
            "business_id": "b1",
            "title": "Hand-Burnished Horween Leather Belt",
            "description": "5mm heavy full-grain Horween Chromexcel leather belt featuring a solid hand-cast copper buckle and stitched bevel edges.",
            "base_price": 120.0,
            "category": "Accessories",
            "fabric_weight": "Heavy Leather",
            "images": [
                "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80"
            ],
            "is_customizable": False,
            "ready_made_stock": 25,
            "tags": ["Leather", "Horween", "Accessories"],
            "trending_score": 88.0,
            "business_name": "Matsui Dye House",
            "artisan_location": "Kyoto, Japan",
            "artisan_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "created_at": datetime.utcnow().isoformat()
        }
    ]

    # Sample Orders
    orders_data = [
        {
            "_id": "ord_1001",
            "user_id": "u_customer_1",
            "user_name": "Maya Lin",
            "business_id": "b1",
            "business_name": "Matsui Dye House & Workshop",
            "items": [
                {
                    "product_id": "p1",
                    "product_title": "Kyoto Shadow Wash Selvedge",
                    "product_image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&auto=format&fit=crop&q=80",
                    "customization_selections": [
                        {"group": "fit", "option_name": "The Archivist Slim Fit", "price_delta": 15.0},
                        {"group": "wash", "option_name": "Kyoto Shadow Hand Wash", "price_delta": 40.0},
                        {"group": "hardware", "option_name": "Hand-Hammered Solid Copper", "price_delta": 0.0}
                    ],
                    "quantity": 1,
                    "unit_price": 345.0,
                    "customization_price": 55.0
                }
            ],
            "subtotal": 345.0,
            "customization_total": 55.0,
            "delivery_fee": 15.0,
            "tax": 32.0,
            "total": 447.0,
            "delivery_address": {
                "name": "Maya Lin",
                "street": "142 Bedford Ave, Apt 3B",
                "city": "Brooklyn",
                "state": "NY",
                "zip_code": "11211",
                "country": "USA",
                "is_default": True
            },
            "delivery_estimate": "August 18, 2026",
            "production_status": "stitching",
            "status_history": [
                {"status": "confirmed", "timestamp": "2026-08-10T14:30:00Z", "note": "Order confirmed and loom queued."},
                {"status": "in_production", "timestamp": "2026-08-11T09:15:00Z", "note": "Indigo dyeing process initiated."},
                {"status": "stitching", "timestamp": "2026-08-12T16:00:00Z", "note": "Tailoring & seam stitching on Union Special 43200G machine."}
            ],
            "created_at": "2026-08-10T14:30:00Z"
        }
    ]

    # Sample Offers
    offers_data = [
        {
            "_id": "off_1",
            "code": "INDIGO10",
            "description": "10% off your first artisanal selvedge order",
            "discount_type": "percent",
            "value": 10.0,
            "applicable_categories": [],
            "active": True
        },
        {
            "_id": "off_2",
            "code": "CRAFT50",
            "description": "$50 flat discount on orders over $300",
            "discount_type": "flat",
            "value": 50.0,
            "applicable_categories": [],
            "active": True
        }
    ]

    # Sample Support Tickets
    tickets_data = [
        {
            "_id": "tick_1",
            "user_id": "u_customer_1",
            "user_name": "Maya Lin",
            "user_email": "maya@example.com",
            "subject": "Customization fit advice for Archivist Slim",
            "message": "Hello! Should I size up by 1 inch for the unsanforized raw denim shrink-to-fit process?",
            "category": "Sizing & Fit Advice",
            "order_id": "ord_1001",
            "status": "in_progress",
            "assigned_admin_id": "u_admin_1",
            "messages": [
                {
                    "sender_role": "customer",
                    "sender_name": "Maya Lin",
                    "message": "Hello! Should I size up by 1 inch for the unsanforized raw denim shrink-to-fit process?",
                    "timestamp": "2026-08-11T10:00:00Z"
                },
                {
                    "sender_role": "admin",
                    "sender_name": "Indigo Master Tailor",
                    "message": "Hi Maya! Yes, unsanforized denim will shrink approximately 3% in waist and 5% in inseam upon first hot soak. Sizing up 1 inch is highly recommended!",
                    "timestamp": "2026-08-11T11:20:00Z"
                }
            ],
            "created_at": "2026-08-11T10:00:00Z"
        }
    ]

    if not db.is_mock and db.db is not None:
        await db.db["users"].delete_many({})
        await db.db["businesses"].delete_many({})
        await db.db["products"].delete_many({})
        await db.db["orders"].delete_many({})
        await db.db["offers"].delete_many({})
        await db.db["support_tickets"].delete_many({})

        await db.db["users"].insert_many(users_data)
        await db.db["businesses"].insert_many(businesses_data)
        await db.db["products"].insert_many(products_data)
        await db.db["orders"].insert_many(orders_data)
        await db.db["offers"].insert_many(offers_data)
        await db.db["support_tickets"].insert_many(tickets_data)
        print("Database seeded in MongoDB Atlas / Local MongoDB successfully!")
    else:
        mock_collections["users"] = users_data
        mock_collections["businesses"] = businesses_data
        mock_collections["products"] = products_data
        mock_collections["orders"] = orders_data
        mock_collections["offers"] = offers_data
        mock_collections["support_tickets"] = tickets_data
        print("In-memory mock collections seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.routers import auth, users, products, customizations, location, orders, businesses, offers, support, admin
from seed import seed_data

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    # Seed initial demo data
    try:
        await seed_data()
    except Exception as e:
        print(f"Seed execution note: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Include API Routers (Mount under /api/v1, /api, and root to guarantee 100% route matching)
routers = [auth.router, users.router, products.router, customizations.router, location.router, orders.router, businesses.router, offers.router, support.router, admin.router]

for r in routers:
    app.include_router(r, prefix="/api/v1")
    app.include_router(r, prefix="/api")
    app.include_router(r)

@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {
        "message": "Welcome to Indigo & Stitch Handmade Denim Marketplace API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

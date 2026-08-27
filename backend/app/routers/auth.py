import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import UserCreate, UserLogin, Token, UserResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user
from app.db.mongodb import db, mock_collections
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate):
    # Check if email exists
    existing = None
    if db.is_mock or db.db is None:
        existing = next((u for u in mock_collections["users"] if u["email"].lower() == user_in.email.lower()), None)
    else:
        existing = await db.db["users"].find_one({"email": user_in.email.lower()})

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    user_dict = user_in.model_dump()
    user_dict["email"] = user_in.email.lower()
    user_dict["password_hash"] = get_password_hash(user_in.password)
    del user_dict["password"]
    user_dict["created_at"] = datetime.utcnow()

    if db.is_mock or db.db is None:
        user_id = str(uuid.uuid4())
        user_dict["_id"] = user_id
        user_dict["id"] = user_id
        mock_collections["users"].append(user_dict)
    else:
        res = await db.db["users"].insert_one(user_dict)
        user_id = str(res.inserted_id)
        user_dict["_id"] = user_id

    access_token = create_access_token(subject=user_id, role=user_dict["role"])
    
    clean_user = dict(user_dict)
    if "password_hash" in clean_user:
        del clean_user["password_hash"]

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": clean_user
    }

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin):
    user = None
    if db.is_mock or db.db is None:
        user = next((u for u in mock_collections["users"] if u["email"].lower() == user_in.email.lower()), None)
    else:
        user = await db.db["users"].find_one({"email": user_in.email.lower()})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not verify_password(user_in.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    user_id = str(user.get("_id", user.get("id")))
    user_role = user.get("role", "customer")
    access_token = create_access_token(subject=user_id, role=user_role)

    clean_user = dict(user)
    clean_user["_id"] = user_id
    if "password_hash" in clean_user:
        del clean_user["password_hash"]

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": clean_user
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user_copy = dict(current_user)
    if "password_hash" in user_copy:
        del user_copy["password_hash"]
    return user_copy

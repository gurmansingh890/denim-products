from typing import List, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.db.mongodb import db, mock_collections
from bson import ObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Check MongoDB or fallback store
    if db.is_mock or db.db is None:
        for u in mock_collections["users"]:
            if str(u.get("_id")) == str(user_id) or str(u.get("id")) == str(user_id):
                user_copy = dict(u)
                user_copy["_id"] = str(user_copy.get("_id", user_copy.get("id")))
                return user_copy
    else:
        try:
            user = await db.db["users"].find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
                return user
        except Exception:
            user = await db.db["users"].find_one({"id": user_id})
            if user:
                user["_id"] = str(user.get("_id", user.get("id")))
                return user

    raise credentials_exception

def require_role(roles: List[str]) -> Callable:
    async def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "customer")
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role '{user_role}'. Required roles: {roles}"
            )
        return current_user
    return role_checker

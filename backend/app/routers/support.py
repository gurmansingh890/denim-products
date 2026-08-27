import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import SupportTicketCreate, SupportTicketResponse, TicketMessage
from app.core.dependencies import get_current_user, require_role
from app.db.mongodb import db, mock_collections
from bson import ObjectId

router = APIRouter(prefix="/support", tags=["Support & Customer Care"])

@router.post("/tickets", response_model=SupportTicketResponse)
async def create_ticket(
    ticket_in: SupportTicketCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user.get("_id", current_user.get("id")))
    
    ticket_dict = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "user_name": current_user.get("name", "Customer"),
        "user_email": current_user.get("email", "customer@example.com"),
        "subject": ticket_in.subject,
        "message": ticket_in.message,
        "category": ticket_in.category,
        "order_id": ticket_in.order_id,
        "status": "open",
        "assigned_admin_id": None,
        "messages": [
            {
                "sender_role": "customer",
                "sender_name": current_user.get("name", "Customer"),
                "message": ticket_in.message,
                "timestamp": datetime.utcnow().isoformat()
            }
        ],
        "created_at": datetime.utcnow().isoformat()
    }

    if db.is_mock or db.db is None:
        mock_collections["support_tickets"].append(ticket_dict)
    else:
        await db.db["support_tickets"].insert_one(ticket_dict)

    return ticket_dict

@router.get("/tickets", response_model=List[SupportTicketResponse])
async def list_tickets(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user.get("_id", current_user.get("id")))
    user_role = current_user.get("role", "customer")

    tickets = []
    if db.is_mock or db.db is None:
        tickets = list(mock_collections["support_tickets"])
    else:
        cursor = db.db["support_tickets"].find({})
        tickets = await cursor.to_list(length=200)
        for t in tickets:
            t["_id"] = str(t["_id"])

    if user_role == "customer":
        filtered = [t for t in tickets if str(t.get("user_id")) == user_id]
    else:
        filtered = tickets

    filtered.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)
    return filtered

@router.post("/tickets/{ticket_id}/reply", response_model=SupportTicketResponse)
async def reply_to_ticket(
    ticket_id: str,
    message: str,
    status_update: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    ticket = None
    if db.is_mock or db.db is None:
        ticket = next((t for t in mock_collections["support_tickets"] if str(t.get("_id")) == ticket_id or str(t.get("id")) == ticket_id), None)
    else:
        try:
            ticket = await db.db["support_tickets"].find_one({"_id": ObjectId(ticket_id)})
        except Exception:
            ticket = await db.db["support_tickets"].find_one({"_id": ticket_id})

    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found")

    messages = ticket.get("messages", [])
    messages.append({
        "sender_role": current_user.get("role", "customer"),
        "sender_name": current_user.get("name", "Support Agent"),
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    })

    new_status = status_update or ticket.get("status", "in_progress")

    if db.is_mock or db.db is None:
        ticket["messages"] = messages
        ticket["status"] = new_status
    else:
        await db.db["support_tickets"].update_one(
            {"_id": ticket["_id"]},
            {"$set": {"messages": messages, "status": new_status}}
        )

    ticket["_id"] = str(ticket.get("_id", ticket.get("id")))
    return ticket

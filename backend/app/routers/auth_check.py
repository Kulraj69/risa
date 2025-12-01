from fastapi import APIRouter, HTTPException
from app.models import CheckAuthRequest, CheckAuthResponse
from app.rules_engine import find_rule
from app.llm_client import LLMClient

router = APIRouter()
llm_client = LLMClient()

@router.post("/check_auth_need", response_model=CheckAuthResponse)
async def check_auth_need(request: CheckAuthRequest):
    rule = find_rule(request.payer, request.code)
    
    auth_needed = False
    rule_id = None
    
    if rule:
        rule_id = rule["id"]
        # Simple logic: if rule exists and requires_auth is True
        # In a real engine, we'd check conditions against patient data
        auth_needed = rule["requires_auth"]
    
    # Generate explanation
    reason = llm_client.explain_auth_need(rule, request.dict())
    
    return CheckAuthResponse(
        auth_needed=auth_needed,
        reason=reason,
        rule_id=rule_id
    )

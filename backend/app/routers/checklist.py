from fastapi import APIRouter
from app.models import ChecklistRequest, ChecklistResponse
from app.llm_client import LLMClient

router = APIRouter()
llm_client = LLMClient()

@router.post("/generate_checklist", response_model=ChecklistResponse)
async def generate_checklist(request: ChecklistRequest):
    checklist = llm_client.generate_checklist(request.diagnosis, request.stage, request.code)
    return ChecklistResponse(checklist=checklist)

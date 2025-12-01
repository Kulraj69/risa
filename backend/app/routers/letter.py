from fastapi import APIRouter
from app.models import DraftLetterRequest, DraftLetterResponse
from app.llm_client import LLMClient

router = APIRouter()
llm_client = LLMClient()

@router.post("/draft_letter", response_model=DraftLetterResponse)
async def draft_letter(request: DraftLetterRequest):
    letter = llm_client.draft_letter(
        request.patient_name,
        request.payer,
        request.code,
        request.justification_points
    )
    return DraftLetterResponse(letter_content=letter)

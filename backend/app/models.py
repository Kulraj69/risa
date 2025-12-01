from pydantic import BaseModel
from typing import List, Optional

class CheckAuthRequest(BaseModel):
    payer: str
    code: str
    diagnosis: str
    stage: str
    clinical_note: Optional[str] = None

class CheckAuthResponse(BaseModel):
    auth_needed: bool
    reason: str
    rule_id: Optional[str] = None

class ChecklistRequest(BaseModel):
    diagnosis: str
    stage: str
    clinical_note: Optional[str] = None
    code: str

class ChecklistItem(BaseModel):
    category: str
    item: str
    mandatory: bool
    reason: str

class ChecklistResponse(BaseModel):
    checklist: List[ChecklistItem]

class DraftLetterRequest(BaseModel):
    patient_name: str
    payer: str
    code: str
    clinical_note: Optional[str] = None
    justification_points: List[str]

class DraftLetterResponse(BaseModel):
    letter_content: str

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mini-RISA PA API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Mini-RISA PA API", "status": "ok"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.post("/api/check_auth_need")
def check_auth_need(request: dict):
    code = request.get("code", "")
    payer = request.get("payer", "")
    
    if code in ["J9035", "J9271", "J9355", "J9299"]:
        return {
            "auth_needed": True,
            "reason": f"Prior authorization required by {payer} for specialty drugs",
            "rule_id": "PA-001"
        }
    return {"auth_needed": False, "reason": "No auth required", "rule_id": None}

@app.post("/api/generate_checklist")
def generate_checklist(request: dict):
    diagnosis = request.get("diagnosis", "")
    return {
        "checklist": [
            {"category": "Clinical", "item": "Patient Consent", "mandatory": True, "reason": "Federal requirement"},
            {"category": "Clinical", "item": f"Pathology Report for {diagnosis}", "mandatory": True, "reason": "Diagnosis confirmation"},
            {"category": "Treatment", "item": "Previous Therapy History", "mandatory": True, "reason": "Medical necessity"},
            {"category": "Lab", "item": "Recent Lab Results", "mandatory": True, "reason": "Treatment safety"},
        ]
    }

@app.post("/api/draft_letter")
def draft_letter(request: dict):
    patient = request.get("patient_name", "Patient")
    payer = request.get("payer", "Payer")
    code = request.get("code", "CODE")
    
    return {
        "letter_content": f"""Medical Necessity Letter

To: {payer}
Re: {patient} - Treatment Code: {code}

This letter supports the medical necessity for the requested treatment.

Clinical justification and supporting documentation attached.

Sincerely,
Medical Team"""
    }

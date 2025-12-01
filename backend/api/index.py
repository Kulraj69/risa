import sys
import os

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

# Create a simple FastAPI app
app = FastAPI(
    title="Mini-RISA PA API",
    description="Prior Authorization Automation API",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Mini-RISA PA API is running", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Mock endpoints for demo
@app.post("/check_auth_need")
async def check_auth_need(request: dict):
    return {
        "auth_needed": True,
        "reason": "Prior authorization required by payer policy for high-cost specialty drugs",
        "rule_id": "PA-ONCOLOGY-001"
    }

@app.post("/generate_checklist")
async def generate_checklist(request: dict):
    return {
        "checklist": [
            {
                "category": "Clinical Documentation",
                "item": "Patient Consent Form",
                "mandatory": True,
                "reason": "Required by federal regulation"
            },
            {
                "category": "Clinical Documentation",
                "item": "Pathology Report (Confirmed Diagnosis)",
                "mandatory": True,
                "reason": "Payer requires diagnosis confirmation"
            },
            {
                "category": "Treatment History",
                "item": "Previous Therapy History",
                "mandatory": True,
                "reason": "Must demonstrate medical necessity"
            },
            {
                "category": "Laboratory",
                "item": "Genetic Testing Results (BRAF/EGFR)",
                "mandatory": False,
                "reason": "May support therapy selection"
            }
        ]
    }

@app.post("/draft_letter")
async def draft_letter(request: dict):
    patient_name = request.get("patient_name", "Patient")
    payer = request.get("payer", "Insurance")
    code = request.get("code", "J-CODE")
    
    letter = f"""Dear {payer} Medical Review Team,

I am writing to request prior authorization for {code} for my patient {patient_name}.

CLINICAL SUMMARY:
The patient has been diagnosed with advanced stage cancer and requires this therapy based on established clinical guidelines and evidence-based medicine.

JUSTIFICATION:
- Treatment aligns with NCCN guidelines for this diagnosis
- Medical necessity supported by clinical documentation
- Patient has appropriate performance status
- Expected to derive significant clinical benefit

SUPPORTING DOCUMENTATION:
All required documentation is attached, including pathology reports, imaging studies, and previous treatment history.

Thank you for your prompt consideration of this request.

Sincerely,
Medical Oncology Department"""
    
    return {"letter_content": letter}

# Create the handler for Vercel
handler = Mangum(app)

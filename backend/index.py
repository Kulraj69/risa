from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any

app = FastAPI(
    title="Mini-RISA PA API",
    description="Prior Authorization Automation API",
    version="0.2.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Mini-RISA PA API is running",
        "status": "ok",
        "version": "0.2.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "mini-risa-pa"}

@app.post("/check_auth_need")
def check_auth_need(request: Dict[str, Any]) -> Dict[str, Any]:
    """Check if prior authorization is needed"""
    payer = request.get("payer", "")
    code = request.get("code", "")
    
    # Specialty drugs requiring PA
    high_cost_codes = ["J9035", "J9271", "J9355", "J9299", "J9041"]
    
    if code in high_cost_codes:
        return {
            "auth_needed": True,
            "reason": f"Prior authorization required by {payer} policy for high-cost specialty drugs",
            "rule_id": "PA-ONCOLOGY-001"
        }
    return {
        "auth_needed": False,
        "reason": f"No specific authorization required for {code}",
        "rule_id": None
    }

@app.post("/generate_checklist")
def generate_checklist(request: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    """Generate documentation checklist"""
    diagnosis = request.get("diagnosis", "")
    stage = request.get("stage", "")
    
    checklist = [
        {
            "category": "Clinical Documentation",
            "item": "Patient Consent Form",
            "mandatory": True,
            "reason": "Required by federal regulation"
        },
        {
            "category": "Clinical Documentation",
            "item": f"Pathology Report confirming {diagnosis}",
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
            "item": "Recent Lab Results (CBC, CMP)",
            "mandatory": True,
            "reason": "Required for treatment safety assessment"
        },
        {
            "category": "Imaging",
            "item": f"Imaging confirming {stage}",
            "mandatory": True,
            "reason": "Staging documentation required"
        },
        {
            "category": "Laboratory",
            "item": "Genetic Testing Results",
            "mandatory": False,
            "reason": "May support therapy selection for targeted treatments"
        }
    ]
    
    return {"checklist": checklist}

@app.post("/draft_letter")
def draft_letter(request: Dict[str, Any]) -> Dict[str, str]:
    """Draft medical necessity letter"""
    patient_name = request.get("patient_name", "Patient")
    payer = request.get("payer", "Insurance Provider")
    code = request.get("code", "TREATMENT-CODE")
    clinical_note = request.get("clinical_note", "")
    justification_points = request.get("justification_points", [])
    
    justification_text = "\n".join([f"• {point}" for point in justification_points])
    
    letter = f"""Date: [Current Date]

To: {payer} Medical Review Department
Re: Prior Authorization Request for {patient_name}
Treatment Code: {code}

Dear Medical Director,

I am writing to request prior authorization for the above-referenced treatment for my patient, {patient_name}.

CLINICAL SUMMARY:
{clinical_note}

MEDICAL JUSTIFICATION:
{justification_text}

This treatment represents the standard of care and is supported by:
• Current NCCN Clinical Practice Guidelines
• Evidence-based medical literature
• Patient's clinical presentation and treatment history

SUPPORTING DOCUMENTATION:
All required clinical documentation is attached, including pathology reports, imaging studies, previous treatment records, and current laboratory values.

Thank you for your prompt consideration.

Sincerely,
[Physician Name]
[Institution]"""

    return {"letter_content": letter}

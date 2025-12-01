from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from typing import Dict, List, Any

# Create FastAPI app
app = FastAPI(
    title="Mini-RISA PA API",
    description="Prior Authorization Automation API - Demo Version",
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
async def root():
    return {
        "message": "Mini-RISA PA API is running",
        "status": "ok",
        "version": "0.2.0"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "mini-risa-pa"}

@app.post("/check_auth_need")
async def check_auth_need(request: Dict[str, Any]) -> Dict[str, Any]:
    """Check if prior authorization is needed for a treatment"""
    payer = request.get("payer", "")
    code = request.get("code", "")
    diagnosis = request.get("diagnosis", "")
    stage = request.get("stage", "")
    
    # Demo logic - in production this would check actual payer rules
    high_cost_codes = ["J9035", "J9271", "J9355", "J9299"]
    
    if code in high_cost_codes:
        return {
            "auth_needed": True,
            "reason": f"Prior authorization required by {payer} policy for high-cost specialty drugs",
            "rule_id": "PA-ONCOLOGY-001"
        }
    else:
        return {
            "auth_needed": False,
            "reason": f"No specific authorization required for {code}",
            "rule_id": None
        }

@app.post("/generate_checklist")
async def generate_checklist(request: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    """Generate documentation checklist for prior authorization"""
    diagnosis = request.get("diagnosis", "")
    stage = request.get("stage", "")
    code = request.get("code", "")
    
    # Standard checklist items
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
            "reason": "Must demonstrate medical necessity and prior treatment failures"
        },
        {
            "category": "Laboratory",
            "item": "Recent Lab Results (CBC, CMP)",
            "mandatory": True,
            "reason": "Required to ensure patient can safely receive treatment"
        },
        {
            "category": "Imaging",
            "item": f"Imaging confirming {stage}",
            "mandatory": True,
            "reason": "Staging documentation required for treatment justification"
        },
        {
            "category": "Laboratory",
            "item": "Genetic Testing Results (if applicable)",
            "mandatory": False,
            "reason": "May support therapy selection for targeted treatments"
        }
    ]
    
    return {"checklist": checklist}

@app.post("/draft_letter")
async def draft_letter(request: Dict[str, Any]) -> Dict[str, str]:
    """Draft a medical necessity letter for prior authorization"""
    patient_name = request.get("patient_name", "Patient")
    payer = request.get("payer", "Insurance Provider")
    code = request.get("code", "TREATMENT-CODE")
    clinical_note = request.get("clinical_note", "")
    justification_points = request.get("justification_points", [])
    
    # Format justification points
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

This treatment represents the standard of care for this patient's condition and is supported by:
• Current NCCN (National Comprehensive Cancer Network) Clinical Practice Guidelines
• Evidence-based medical literature
• The patient's specific clinical presentation and treatment history
• Expected significant clinical benefit with acceptable risk-benefit ratio

SUPPORTING DOCUMENTATION:
All required clinical documentation is attached, including:
• Pathology reports confirming diagnosis
• Imaging studies demonstrating disease extent
• Previous treatment records
• Current laboratory values
• Detailed clinical notes supporting medical necessity

I am available to discuss this case further if needed. Please contact me at your earliest convenience if additional information would be helpful.

Thank you for your prompt consideration of this request.

Sincerely,

[Physician Name]
[Credentials]
[Institution]
[Contact Information]"""

    return {"letter_content": letter}

# Vercel serverless handler
handler = Mangum(app, lifespan="off")

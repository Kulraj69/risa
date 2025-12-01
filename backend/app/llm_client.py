import os
from typing import List, Dict
from app.agent_workflow import auth_app, checklist_app, letter_app

class LLMClient:
    def __init__(self):
        # We don't need to init the client here anymore as the graph handles it per request
        # but we check if env vars are set
        self.has_azure = os.getenv("AZURE_OPENAI_API_KEY") is not None

    def explain_auth_need(self, rule: Dict, patient_data: Dict) -> str:
        if not self.has_azure:
            return self._mock_explain_auth_need(rule, patient_data)
            
        # Invoke LangGraph
        state = {
            "payer": patient_data.get("payer"),
            "code": patient_data.get("code"),
            "diagnosis": patient_data.get("diagnosis"),
            "stage": patient_data.get("stage"),
            "clinical_note": patient_data.get("clinical_note"),
            # We pass the rule result if we have it, but the graph also checks rules.
            # For consistency with the graph's logic, we let the graph do the work.
        }
        
        result = auth_app.invoke(state)
        return result.get("reason", "Could not generate explanation.")

    def generate_checklist(self, diagnosis: str, stage: str, code: str) -> List[Dict]:
        if not self.has_azure:
            return self._mock_checklist(diagnosis, stage, code)
            
        state = {
            "diagnosis": diagnosis,
            "stage": stage,
            "code": code
        }
        result = checklist_app.invoke(state)
        return result.get("checklist", [])

    def draft_letter(self, patient_name: str, payer: str, code: str, justification: List[str]) -> str:
        if not self.has_azure:
            return self._mock_letter(patient_name, payer, code, justification)
            
        state = {
            "patient_name": patient_name,
            "payer": payer,
            "code": code,
            "clinical_note": "\n".join(justification) # Passing justification as note for simplicity
        }
        result = letter_app.invoke(state)
        return result.get("letter_draft", "Could not draft letter.")

    # --- Mock Fallbacks (kept for safety) ---
    def _mock_explain_auth_need(self, rule: Dict, patient_data: Dict) -> str:
        diagnosis = patient_data.get("diagnosis", "Unknown")
        stage = patient_data.get("stage", "Unknown")
        payer = patient_data.get("payer", "Unknown")
        code = patient_data.get("code", "Unknown")
        
        if rule:
             return f"For {code} under {payer}, prior authorization is required for {diagnosis} {stage}. This patient matches the criteria, so prior auth is required."
        return f"No specific rule found for {code} under {payer}. Standard protocol suggests verifying with the payer directly."

    def _mock_checklist(self, diagnosis: str, stage: str, code: str) -> List[Dict]:
        return [
            {
                "category": "Pathology",
                "item": f"Biopsy report confirming {diagnosis}",
                "mandatory": True,
                "reason": "Required to verify diagnosis specificity."
            },
            {
                "category": "Imaging",
                "item": f"Recent CT/PET scan for {stage} confirmation",
                "mandatory": True,
                "reason": "Needed to establish disease progression/staging."
            },
            {
                "category": "Clinical Notes",
                "item": "Oncologist consultation notes from last 30 days",
                "mandatory": True,
                "reason": "To verify current clinical status and treatment plan."
            }
        ]

    def _mock_letter(self, patient_name: str, payer: str, code: str, justification: List[str]) -> str:
        points = "\n- ".join(justification)
        return f"""Date: [Current Date]

To: {payer} Utilization Management
Re: Medical Necessity for {patient_name}
Treatment Code: {code}

To Whom It May Concern,

I am writing to provide clinical justification for the treatment of my patient, {patient_name}, with the requested therapy ({code}).

The patient has a confirmed diagnosis that requires this specific intervention. The following clinical factors support this request:
- {points}

This treatment aligns with current NCCN guidelines and is considered the standard of care for this clinical presentation.

Please review the attached documentation for further details.

Sincerely,

[Physician Name]
[Institution]"""

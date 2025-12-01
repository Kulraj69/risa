import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.agent_workflow import auth_app, checklist_app, letter_app

def test_auth_flow():
    print("Testing Auth Flow...")
    state = {
        "payer": "MockHealth",
        "code": "J9312",
        "diagnosis": "Non-small cell lung cancer",
        "stage": "Stage IV",
        "clinical_note": "Patient has progressed on prior therapy."
    }
    result = auth_app.invoke(state)
    print("Result:", result.get("reason"))
    print("-" * 20)

def test_checklist_flow():
    print("Testing Checklist Flow...")
    state = {
        "diagnosis": "Breast Cancer",
        "stage": "Stage II",
        "code": "J9000"
    }
    result = checklist_app.invoke(state)
    print("Result:", result.get("checklist"))
    print("-" * 20)

def test_letter_flow():
    print("Testing Letter Flow...")
    state = {
        "patient_name": "Jane Doe",
        "payer": "BlueCross",
        "code": "J9312",
        "diagnosis": "Lung Cancer",
        "clinical_note": "Standard of care requires this treatment."
    }
    result = letter_app.invoke(state)
    print("Result:", result.get("letter_draft")[:200] + "...") # Print first 200 chars
    print("-" * 20)

if __name__ == "__main__":
    test_auth_flow()
    test_checklist_flow()
    test_letter_flow()

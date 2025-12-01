from typing import List, Dict, Optional

MOCK_RULES = [
    {
        "id": "R-001",
        "payer": "MockHealth",
        "code": "J9312",
        "requires_auth": True,
        "conditions": {
            "diagnosis_keywords": ["non-small cell lung cancer", "nsclc"],
            "stages": ["stage iii", "stage iv"]
        }
    },
    {
        "id": "R-002",
        "payer": "MockHealth",
        "code": "J9000",
        "requires_auth": False,
        "conditions": {}
    },
    {
        "id": "R-003",
        "payer": "BlueCross",
        "code": "J9312",
        "requires_auth": True,
        "conditions": {
             "diagnosis_keywords": ["lung cancer"],
             "stages": ["stage iv"]
        }
    }
]

def find_rule(payer: str, code: str) -> Optional[Dict]:
    for rule in MOCK_RULES:
        if rule["payer"].lower() == payer.lower() and rule["code"] == code:
            return rule
    return None

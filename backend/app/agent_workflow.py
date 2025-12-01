import os
from typing import TypedDict, List, Optional
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv

load_dotenv()

# --- State Definition ---
class AgentState(TypedDict):
    # Inputs
    payer: str
    code: str
    diagnosis: str
    stage: str
    clinical_note: Optional[str]
    
    # Outputs
    auth_needed: Optional[bool]
    reason: Optional[str]
    checklist: Optional[List[dict]]
    letter_draft: Optional[str]

# --- Node: Rule Check (Mock) ---
def check_rules_node(state: AgentState):
    """
    Deterministic check against mock rules.
    """
    payer = state.get("payer", "").lower()
    code = state.get("code", "")
    
    # Simple mock rule logic
    if payer == "mockhealth" and code == "J9312":
        return {
            "auth_needed": True,
            "reason": "Rule R-001: J9312 requires auth for MockHealth."
        }
    elif payer == "mockhealth" and code == "J9000":
        return {
            "auth_needed": False,
            "reason": "Rule R-002: J9000 is exempt from auth."
        }
    
    return {"reason": "No specific rule found."}

# --- Node: LLM Analysis ---
def llm_analysis_node(state: AgentState):
    """
    Uses Azure OpenAI to explain the decision or infer if auth is needed based on clinical context.
    """
    llm = AzureChatOpenAI(
        azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        temperature=0.7
    )
    
    diagnosis = state.get("diagnosis")
    stage = state.get("stage")
    payer = state.get("payer")
    code = state.get("code")
    current_reason = state.get("reason", "")
    auth_needed = state.get("auth_needed")

    prompt = f"""
    You are a prior authorization specialist.
    
    Context:
    - Payer: {payer}
    - Code: {code}
    - Diagnosis: {diagnosis}
    - Stage: {stage}
    - Preliminary Rule Result: {auth_needed} (Reason: {current_reason})
    
    Task:
    Provide a clear, natural language explanation for the user. 
    If the rule result is definitive, explain it.
    If the rule result is unknown, use your general medical knowledge to suggest if this typically requires auth for this condition.
    
    Keep it concise (2-3 sentences).
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    
    return {"reason": response.content}

# --- Node: Checklist Generator ---
def checklist_node(state: AgentState):
    llm = AzureChatOpenAI(
        azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        temperature=0.7
    )
    
    prompt = f"""
    Generate a checklist of 3-5 mandatory documents for prior auth submission.
    Diagnosis: {state.get("diagnosis")}
    Stage: {state.get("stage")}
    Code: {state.get("code")}
    
    Output ONLY a JSON list of objects with keys: category, item, mandatory (bool), reason.
    Example:
    [
      {{"category": "Pathology", "item": "Biopsy Report", "mandatory": true, "reason": "Confirm diagnosis"}}
    ]
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    
    # In a real app, we'd use PydanticOutputParser here. 
    # For this demo, we'll rely on the LLM being smart or do simple cleaning.
    import json
    try:
        content = response.content.strip()
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "")
        checklist = json.loads(content)
    except:
        checklist = []
        
    return {"checklist": checklist}

# --- Node: Letter Drafter ---
def letter_node(state: AgentState):
    llm = AzureChatOpenAI(
        azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        temperature=0.7
    )
    
    prompt = f"""
    Draft a medical necessity letter.
    Patient: {state.get("patient_name", "The Patient")}
    Payer: {state.get("payer")}
    Code: {state.get("code")}
    Diagnosis: {state.get("diagnosis")}
    Clinical Note: {state.get("clinical_note")}
    
    Keep it formal and professional.
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"letter_draft": response.content}

# --- Graph Construction ---

# 1. Auth Check Graph
auth_workflow = StateGraph(AgentState)
auth_workflow.add_node("check_rules", check_rules_node)
auth_workflow.add_node("llm_explain", llm_analysis_node)
auth_workflow.set_entry_point("check_rules")
auth_workflow.add_edge("check_rules", "llm_explain")
auth_workflow.add_edge("llm_explain", END)
auth_app = auth_workflow.compile()

# 2. Checklist Graph (Simple single node for now, but extensible)
checklist_workflow = StateGraph(AgentState)
checklist_workflow.add_node("generate", checklist_node)
checklist_workflow.set_entry_point("generate")
checklist_workflow.add_edge("generate", END)
checklist_app = checklist_workflow.compile()

# 3. Letter Graph
letter_workflow = StateGraph(AgentState)
letter_workflow.add_node("draft", letter_node)
letter_workflow.set_entry_point("draft")
letter_workflow.add_edge("draft", END)
letter_app = letter_workflow.compile()

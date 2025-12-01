# Architecture

## Components & Responsibilities

### 1. Frontend (Next.js)
*   **Role**: User interface for data entry and result visualization.
*   **Key Features**:
    *   Dynamic form handling.
    *   Real-time API interaction.
    *   Premium UI with glassmorphism design.

### 2. Backend (FastAPI)
*   **Role**: Orchestrates the logic between rules, AI, and the client.
*   **Endpoints**:
    *   `/check_auth_need`: Combines rule lookup with LLM explanation.
    *   `/generate_checklist`: purely LLM-driven generation based on clinical context.
    *   `/draft_letter`: LLM-driven drafting of formal correspondence.

### 3. Rules Engine (Python)
*   **Role**: Provides deterministic "guardrails".
*   **Logic**: Matches `(Payer, Code)` tuples to specific policy requirements (e.g., "Diagnosis must contain 'Lung Cancer'").

### 4. AI Layer (LLM Client)
*   **Role**: Handles the "fuzzy" logic of explaining rules and generating text.
*   **Safety**: Uses a fallback mechanism (Mock Mode) if the LLM service is unavailable, ensuring demo reliability.

## Scalability & Future Work
*   **Agents**: Decompose the workflow into agents (e.g., a "Clinical Extractor" agent that reads raw notes).
*   **Vector DB**: Store thousands of payer policies in a vector store for semantic retrieval (RAG).
*   **EHR Integration**: Use FHIR/HL7 to pull patient data automatically.

# Mini-RISA PA

**Mini-RISA for prior authorization** is a simplified AI + rules-based service that predicts prior auth need, generates documentation checklists, and drafts medical necessity letters for oncology use cases.

## Why I built this
*   **Prior Auth Friction**: Oncology treatments are complex and urgent; delays in authorization can impact patient outcomes.
*   **Oncology Specificity**: Generic tools fail with complex regimens like J9312; this tool understands specific codes and staging.
*   **Explainable Automation**: It's not enough to say "yes/no"; we provide the *why* based on payer rules and clinical data.

## Architecture
*   **UI**: Next.js (React) for a premium, responsive experience.
*   **Backend**: FastAPI for high-performance REST endpoints.
*   **AI Layer**: LLM (OpenAI/Mock) for natural language explanation and generation.
*   **Rules Engine**: Deterministic logic for payer policy matching.

## Quickstart

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API Docs available at: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

## Example Flows
1.  **Check Auth**: Enter "J9312" for "MockHealth". Result: **Auth Required** (Rule R-001).
2.  **Generate Checklist**: Get a list of required docs (Biopsy, CT Scan).
3.  **Draft Letter**: Generate a medical necessity letter for the payer.

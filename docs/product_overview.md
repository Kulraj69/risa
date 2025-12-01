# Product Overview: Mini-RISA PA

## Problem Statement
Prior authorization (PA) in oncology is a manual, error-prone process. Staff spend hours cross-referencing payer policies with patient charts, leading to delays in life-saving treatments.

## Target Users
*   **Oncology PA Specialists**: The primary users who manage the administrative burden of authorizations.
*   **Financial Counselors**: Who need to verify coverage before treatment begins.

## User Journey
1.  **Case Entry**: Staff enters patient details (Age, Diagnosis, Stage) and treatment (Payer, Code).
2.  **Decision Support**: The system checks deterministic rules and uses AI to explain *why* auth is needed.
3.  **Action**:
    *   If auth is needed, the user generates a **Checklist** of required evidence.
    *   The user then generates a **Medical Necessity Letter** to attach to the submission.

## Limitations (MVP)
*   **Mock Rules**: The rules engine uses a static set of example rules (e.g., for J9312).
*   **Synthetic Data**: No real PHI is processed; data is for demonstration purposes.
*   **No EMR Integration**: In a production version, this would integrate directly with Epic/Cerner.

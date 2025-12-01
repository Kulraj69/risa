from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_check, checklist, letter

app = FastAPI(
    title="Mini-RISA PA API",
    description="Prior Authorization Automation API",
    version="0.1.0"
)

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_check.router)
app.include_router(checklist.router)
app.include_router(letter.router)

@app.get("/")
async def root():
    return {"message": "Mini-RISA PA API is running"}

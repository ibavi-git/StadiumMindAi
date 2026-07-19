"""
StadiumMind AI — FastAPI Application Entry Point (FIXED FOR PRODUCTION)
=================================================
Wires together all routers and defines the core AI service endpoints.
"""
import os
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime

from data_loader import data_loader
from routes.crowd import router as crowd_router
from routes.volunteers import router as volunteer_router
from routes.incidents import router as incident_router
from routes.dashboard import router as dashboard_router

from models.request_models import AskRequest, TranslateRequest, EmergencyRequest
from models.response_models import (
    AIResponse,
    TranslationResponse,
    EmergencyResponseModel,
)
from gemini_service import gemini_service
from prompts.volunteer_prompt import build_volunteer_prompt
from prompts.translation_prompt import build_translation_prompt
from prompts.emergency_prompt import build_emergency_prompt


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Pre-warm the data loader cache on startup."""
    data_loader.get_full_context()
    yield


app = FastAPI(
    title="StadiumMind AI",
    version="2.0.0",
    description="AI-powered Volunteer Co-Pilot for FIFA World Cup 2026. "
                "Built for the Google Prompt Wars Virtual Challenge.",
    lifespan=lifespan,
)

# ── CORS Configuration (Production-Ready) ───────────────────────────────────
# In production, environment variables define allowed origins
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Dynamically loaded from environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── AI Service Router ─────────────────────────────────────────────────────────
ai_router = APIRouter(prefix="/api/ai", tags=["AI Services"])


@ai_router.post("/ask", response_model=AIResponse)
def ask_question(req: AskRequest):
    """
    Volunteer Co-Pilot endpoint.

    Builds a prompt with all 6 context sources and the volunteer's profile,
    then calls Gemini to produce an 8-field structured reasoning response.
    """
    context = data_loader.get_full_context()
    prompt = build_volunteer_prompt(
        context=context,
        question=req.question,
        volunteer_id=req.volunteer_id,
        language=req.language,
    )
    try:
        answer = gemini_service.generate(prompt)
        return AIResponse(
            answer=answer,
            confidence="High",
            sources_used=["Stadium", "Crowd", "Volunteers", "Incidents", "Transport", "Match"],
            reasoning_summary="Synthesised from live stadium context across 6 data sources.",
            timestamp=datetime.utcnow().isoformat() + "Z",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@ai_router.post("/translate", response_model=TranslationResponse)
def translate(req: TranslateRequest):
    """
    Multilingual translation endpoint.

    Translates text with full stadium context awareness, tone calibration,
    and proper noun preservation.
    """
    context = data_loader.get_full_context()
    prompt = build_translation_prompt(
        text=req.text,
        target_language=req.target_language,
        context_type=req.context_type,
        context=context,
    )
    res = gemini_service.generate_json(prompt)
    return TranslationResponse(
        original=req.text,
        translated=res.get("translated", ""),
        target_language=req.target_language,
        context_notes=res.get("context_notes", ""),
        timestamp=datetime.utcnow().isoformat() + "Z",
    )


@ai_router.post("/emergency", response_model=EmergencyResponseModel)
def emergency_response(req: EmergencyRequest):
    """
    Emergency Response AI endpoint.

    Generates a complete emergency response plan grounded in live zone
    crowd data, available volunteer roster, transport context, and match state.
    Includes: volunteer instructions, PA announcement, organizer actions,
    evacuation guidance (when applicable), reasoning, and confidence.
    """
    context = data_loader.get_full_context()
    prompt = build_emergency_prompt(
        context=context,
        emergency_type=req.emergency_type,
        zone_id=req.zone_id,
        description=req.description,
        severity=req.severity,
    )
    try:
        res = gemini_service.generate_json(prompt)
        return EmergencyResponseModel(
            emergency_type=req.emergency_type,
            zone=req.zone_id,
            severity=req.severity,
            volunteer_instructions=res.get("volunteer_instructions", []),
            public_announcement=res.get("public_announcement", ""),
            organizer_recommendations=res.get("organizer_recommendations", []),
            evacuation_guidance=res.get("evacuation_guidance"),
            reasoning=res.get("reasoning"),
            expected_outcome=res.get("expected_outcome"),
            confidence=res.get("confidence"),
            coordination_required=res.get("coordination_required"),
            timestamp=datetime.utcnow().isoformat() + "Z",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@ai_router.get("/health")
def ai_health():
    """AI service health check."""
    return {"status": "ok", "model": "gemini-2.5-flash"}


# ── Register All Routers ──────────────────────────────────────────────────────
app.include_router(ai_router)
app.include_router(crowd_router)
app.include_router(volunteer_router)
app.include_router(incident_router)
app.include_router(dashboard_router)


# ── Root Endpoints ────────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {
        "name": "StadiumMind AI",
        "version": "2.0.0",
        "tagline": "AI-Powered Volunteer Co-Pilot for FIFA World Cup 2026",
        "status": "online",
        "docs": "/docs",
        "prompt_wars": "Google Prompt Wars Virtual Challenge 2026",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "model": "gemini-2.5-flash",
        "context_sources": [
            "stadium",
            "crowd",
            "transport",
            "volunteers",
            "incidents",
            "match",
        ],
        "ai_features": [
            "volunteer_copilot",
            "crowd_intelligence",
            "emergency_response",
            "translation",
            "task_assignment",
            "situation_report",
        ],
    }
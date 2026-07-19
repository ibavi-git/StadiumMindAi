"""
Crowd Routes
=============
Crowd density, heatmap, zone analytics, and AI intelligence endpoints.

Endpoints:
- GET /api/crowd/           — Heatmap data (all zones enriched)
- GET /api/crowd/heatmap    — Alias for /
- GET /api/crowd/zone/{id}  — Single zone summary
- GET /api/crowd/alerts     — Congestion alerts
- GET /api/crowd/stats      — Aggregate statistics
- GET /api/crowd/insights   — AI Crowd Intelligence Report (new)
"""
from fastapi import APIRouter, HTTPException
from data_loader import data_loader
from services.crowd_service import CrowdService
from gemini_service import gemini_service
from prompts.crowd_insight_prompt import build_crowd_insights_prompt
from models.response_models import CrowdIntelligenceResponse
from datetime import datetime

router = APIRouter(prefix="/api/crowd", tags=["Crowd Intelligence"])
crowd_service = CrowdService()


@router.get("/")
def get_crowd():
    """Heatmap-ready payload for all zones, enriched with volunteer coverage."""
    return crowd_service.get_heatmap_data(
        data_loader.get_crowd(),
        data_loader.get_stadium(),
        data_loader.get_volunteers(),
    )


@router.get("/heatmap")
def get_heatmap():
    """Alias for / — returns heatmap data."""
    return get_crowd()


@router.get("/zone/{zone_id}")
def get_zone(zone_id: str):
    """Single zone crowd summary by zone ID."""
    res = crowd_service.get_zone_summary(zone_id, data_loader.get_crowd())
    if not res:
        raise HTTPException(status_code=404, detail=f"Zone '{zone_id}' not found")
    return res


@router.get("/alerts")
def get_alerts():
    """Active congestion alerts."""
    return data_loader.get_crowd().get("congestion_alerts", [])


@router.get("/stats")
def get_stats():
    """Aggregate crowd statistics across all zones."""
    return crowd_service.calculate_overall_stats(data_loader.get_crowd())


@router.get("/insights", response_model=CrowdIntelligenceResponse)
def get_crowd_insights():
    """
    AI Crowd Intelligence Report.

    Analyses multi-zone crowd data to detect trends, predict congestion timing,
    recommend gate adjustments, and identify volunteer deployment needs.
    Synthesises crowd, volunteer, transport, and match context.
    """
    context = data_loader.get_full_context()
    prompt = build_crowd_insights_prompt(context)

    try:
        result = gemini_service.generate_json(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    return CrowdIntelligenceResponse(
        crowd_intelligence_summary=result.get("crowd_intelligence_summary", ""),
        trend=result.get("trend", "STABLE"),
        trend_reasoning=result.get("trend_reasoning", ""),
        key_insights=result.get("key_insights", []),
        congestion_predictions=result.get("congestion_predictions", []),
        gate_recommendations=result.get("gate_recommendations", []),
        volunteer_deployment_urgency=result.get("volunteer_deployment_urgency", {}),
        kickoff_prediction=result.get("kickoff_prediction", ""),
        timestamp=datetime.utcnow().isoformat() + "Z",
    )

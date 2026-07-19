"""
Dashboard Routes
=================
Organizer Command Center endpoints.

Endpoints:
- GET /api/dashboard/summary   — KPIs + AI insights (for backward compat)
- GET /api/dashboard/sitrep    — Full AI Situation Report (new)
- GET /api/dashboard/kpis      — Raw KPI metrics only (no AI call)
- GET /api/dashboard/match     — Match data
"""
from fastapi import APIRouter, HTTPException
from data_loader import data_loader
from models.response_models import DashboardSummary, SituationReport
from gemini_service import gemini_service
from prompts.organizer_prompt import build_organizer_insights_prompt
from services.crowd_service import CrowdService
from services.task_service import TaskService
from services.emergency_service import EmergencyService
from datetime import datetime

router = APIRouter(prefix="/api/dashboard", tags=["Organizer Dashboard"])
crowd_service = CrowdService()
task_service = TaskService()
emergency_service = EmergencyService()


def _compute_kpi_dict(c_data, v_data, i_data, match):
    """Shared KPI computation to avoid duplication across endpoints."""
    overall_attendance = crowd_service.calculate_overall_stats(c_data).get("overall_attendance", 0)
    stadium_cap = data_loader.get_stadium().get("capacity", 80000)
    capacity_percent = (overall_attendance / stadium_cap * 100) if stadium_cap > 0 else 0

    return {
        "attendance": overall_attendance,
        "capacity_percent": round(capacity_percent, 2),
        "active_incidents": len(emergency_service.get_active_incidents(i_data)),
        "volunteers_active": len([v for v in v_data.get("volunteers", []) if v.get("status") == "ACTIVE"]),
        "volunteers_on_break": len([v for v in v_data.get("volunteers", []) if v.get("status") == "ON_BREAK"]),
        "volunteers_unassigned": len([v for v in v_data.get("volunteers", []) if v.get("status") == "UNASSIGNED"]),
        "critical_zones_count": len(crowd_service.get_critical_zones(c_data)),
        "weather_condition": emergency_service.get_weather_advisory(i_data).get("condition", "Clear"),
        "match_phase": match.get("match_phase", c_data.get("match_phase", "Pre-Match")),
    }


@router.get("/summary", response_model=DashboardSummary)
def get_summary():
    """
    Organizer Dashboard summary.
    Generates AI insights using the full 6-source organizer prompt and
    returns them alongside real-time KPIs.
    """
    context = data_loader.get_full_context()
    prompt = build_organizer_insights_prompt(context)

    try:
        sitrep = gemini_service.generate_json(prompt)
        # Extract the ai_insights array from the rich situation report
        ai_insights = sitrep.get("ai_insights", [])
        top_action = (
            sitrep.get("immediate_actions", [{}])[0].get("action", "Review AI Situation Report")
            if sitrep.get("immediate_actions") else "Review AI Situation Report"
        )
    except Exception:
        ai_insights = []
        top_action = "Review AI Situation Report"

    c_data = data_loader.get_crowd()
    v_data = data_loader.get_volunteers()
    i_data = data_loader.get_incidents()
    match = data_loader.get_match()
    kpis = _compute_kpi_dict(c_data, v_data, i_data, match)

    return DashboardSummary(
        overall_attendance=kpis["attendance"],
        overall_capacity_percent=kpis["capacity_percent"],
        active_incidents=kpis["active_incidents"],
        volunteers_active=kpis["volunteers_active"],
        volunteers_unassigned=kpis["volunteers_unassigned"],
        critical_zones=crowd_service.get_critical_zones(c_data),
        ai_insights=ai_insights,
        top_priority_action=top_action,
        timestamp=datetime.utcnow().isoformat() + "Z",
    )


@router.get("/sitrep", response_model=SituationReport)
def get_situation_report():
    """
    Full AI Situation Report for the Organizer Command Center.

    Generates a comprehensive operational intelligence report covering:
    - Operational status (GREEN / YELLOW / ORANGE / RED)
    - Crowd assessment with predictions
    - Risk matrix with time-to-impact estimates
    - Immediate action queue with reasoning
    - Volunteer utilisation analysis
    - Transport observations
    - Full AI insights array
    """
    context = data_loader.get_full_context()
    prompt = build_organizer_insights_prompt(context)

    try:
        sitrep = gemini_service.generate_json(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    return SituationReport(
        operational_status=sitrep.get("operational_status", "YELLOW"),
        status_summary=sitrep.get("status_summary", ""),
        crowd_assessment=sitrep.get("crowd_assessment", {}),
        top_risks=sitrep.get("top_risks", []),
        immediate_actions=sitrep.get("immediate_actions", []),
        volunteer_utilization=sitrep.get("volunteer_utilization", {}),
        transport_observations=sitrep.get("transport_observations", ""),
        ai_insights=sitrep.get("ai_insights", []),
        confidence=sitrep.get("confidence", "MODERATE"),
        report_reasoning=sitrep.get("report_reasoning", ""),
        timestamp=datetime.utcnow().isoformat() + "Z",
    )


@router.get("/kpis")
def get_kpis():
    """Raw KPI metrics — no AI call. Fast response for polling."""
    c_data = data_loader.get_crowd()
    v_data = data_loader.get_volunteers()
    i_data = data_loader.get_incidents()
    match = data_loader.get_match()
    return _compute_kpi_dict(c_data, v_data, i_data, match)


@router.get("/match")
def get_match():
    """Match data including event timeline and emergency contacts."""
    return data_loader.get_match()

"""
Volunteer Routes
=================
Volunteer data and AI task assignment endpoints.

Endpoints:
- GET /api/volunteers/              — All volunteer data
- GET /api/volunteers/gaps          — Zone coverage gaps
- GET /api/volunteers/zone/{id}     — Volunteers in a specific zone
- GET /api/volunteers/{id}          — Single volunteer by ID
- POST /api/volunteers/tasks        — AI task assignment
"""
from fastapi import APIRouter, HTTPException
from data_loader import data_loader
from services.task_service import TaskService
from models.request_models import TaskAssignRequest
from models.response_models import TaskAssignmentResponse
from gemini_service import gemini_service
import json
from datetime import datetime

router = APIRouter(prefix="/api/volunteers", tags=["Volunteers"])
task_service = TaskService()


@router.get("/")
def get_volunteers():
    """All volunteer data including roster, zone coverage, and role summary."""
    return data_loader.get_volunteers()


@router.get("/gaps")
def get_gaps():
    """Zone coverage gaps sorted by severity — zones with the most critical shortfalls first."""
    return task_service.get_deployment_gaps(data_loader.get_volunteers())


@router.get("/zone/{zone_id}")
def get_zone_volunteers(zone_id: str):
    """All volunteers currently assigned to a specific zone."""
    return [
        v for v in data_loader.get_volunteers().get("volunteers", [])
        if v.get("zone") == zone_id
    ]


@router.get("/{volunteer_id}")
def get_volunteer(volunteer_id: str):
    """Single volunteer profile by ID."""
    vol = next(
        (v for v in data_loader.get_volunteers().get("volunteers", []) if v.get("id") == volunteer_id),
        None,
    )
    if not vol:
        raise HTTPException(status_code=404, detail=f"Volunteer '{volunteer_id}' not found")
    return vol


@router.post("/tasks", response_model=TaskAssignmentResponse)
def assign_tasks(request: TaskAssignRequest):
    """
    AI Task Assignment endpoint.

    Identifies unassigned/available volunteers and critical zones,
    then uses Gemini to generate optimal assignments with explicit
    reasoning for why each volunteer was matched to each zone.

    The AI considers: volunteer role, certifications, languages,
    zone crowd density, volunteer gap, and incident status.
    """
    v_data = data_loader.get_volunteers()
    c_data = data_loader.get_crowd()
    i_data = data_loader.get_incidents()

    unassigned = task_service.get_available_volunteers(v_data)
    critical = task_service.get_priority_zones(c_data)
    active_incidents = i_data.get("active_incidents", [])

    prompt = f"""You are the StadiumMind AI Task Assignment Engine for the FIFA World Cup 2026.

Your task is to optimally match available volunteers to critical zones.

AVAILABLE VOLUNTEERS (unassigned or on break):
{json.dumps(unassigned, indent=2)}

CRITICAL ZONES (sorted by density, most critical first):
{json.dumps(critical, indent=2)}

ACTIVE INCIDENTS (for context):
{json.dumps(active_incidents, indent=2)}

ASSIGNMENT RULES:
1. Match volunteer ROLE to zone need (e.g., Medical Support → high-density zones with incidents)
2. Consider volunteer CERTIFICATIONS for emergency zones
3. Consider volunteer LANGUAGES for zones with international fan concentration
4. Provide specific TASKS not just zone assignments — tell the volunteer exactly what to do
5. Every assignment must include reasoning that references specific data from above

Return a JSON array of assignment objects (no markdown fences):
[
  {{
    "volunteer_id": "VOL-XXX",
    "zone": "ZONE_XXXX",
    "task": "Specific, actionable task description (e.g., 'Deploy to Gate D south entrance, manage queue flow, redirect overflow fans to Gate E')",
    "priority": "CRITICAL|HIGH|MEDIUM|LOW",
    "estimated_minutes": integer,
    "reasoning": "WHY this volunteer was chosen for this zone — cite specific role, certifications, zone density, and gap data",
    "suggested_response": "What the volunteer should say/do when they arrive"
  }}
]

Generate one assignment per available volunteer. Prioritise critical zones first.
ONLY return the JSON array.
"""

    try:
        ai_assignments = gemini_service.generate_json(prompt)
        if not isinstance(ai_assignments, list):
            ai_assignments = []
    except Exception:
        ai_assignments = []

    assignments = task_service.build_task_assignments(c_data, v_data, i_data, ai_assignments)

    # Build an AI summary from the assignments
    critical_zone_labels = [z.get("label", z.get("zone_id", "")) for z in critical[:2]]
    ai_summary = (
        f"Deployed {len(assignments)} volunteer(s) to priority zones. "
        f"Focus areas: {', '.join(critical_zone_labels)}. "
        f"Assignments grounded in live crowd density and volunteer availability data."
        if assignments
        else "No available volunteers for assignment at this time."
    )

    return TaskAssignmentResponse(
        assignments=assignments,
        ai_summary=ai_summary,
        total_volunteers_deployed=len(assignments),
        timestamp=datetime.utcnow().isoformat() + "Z",
    )

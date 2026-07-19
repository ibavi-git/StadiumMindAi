"""
Emergency Response AI Prompt Builder
=====================================
Constructs the prompt for the Emergency Response AI Coordinator.

Prompt Engineering Strategy:
- Injects ALL 6 context sources — not just zone-filtered crowd data
- Returns a structured JSON response with a reasoning field for transparency
- Calibrates response severity based on incident type and zone context
- Generates PA-system-ready public announcements
- Provides specific volunteer instructions tied to available staff in the zone
"""
import json


def build_emergency_prompt(
    context: dict,
    emergency_type: str,
    zone_id: str,
    description: str,
    severity: str
) -> str:
    """
    Build the Emergency Response AI prompt.

    Args:
        context:        Full 6-source stadium context.
        emergency_type: Type of emergency (MEDICAL, SECURITY, WEATHER, FIRE, EVACUATION).
        zone_id:        The zone where the emergency is occurring.
        description:    Human description of the emergency.
        severity:       LOW | MODERATE | HIGH | CRITICAL

    Returns:
        A prompt string that produces a structured JSON emergency response.
    """
    stadium   = context.get("stadium", {})
    crowd     = context.get("crowd", {})
    volunteers = context.get("volunteers", {})
    incidents  = context.get("incidents", {})
    transport  = context.get("transport", {})
    match      = context.get("match", {})

    # ── Zone-specific context extraction ───────────────────────────────────
    zone_crowd_data = next(
        (z for z in crowd.get("zones", []) if z.get("zone_id") == zone_id),
        {}
    )
    zone_volunteer_data = volunteers.get("zone_coverage", {}).get(zone_id, {})
    volunteers_in_zone = [
        v for v in volunteers.get("volunteers", [])
        if v.get("zone") == zone_id and v.get("status") == "ACTIVE"
    ]
    nearby_unassigned = [
        v for v in volunteers.get("volunteers", [])
        if v.get("status") in ("UNASSIGNED", "ON_BREAK")
    ]

    # ── Stadium-wide context ───────────────────────────────────────────────
    all_active_incidents = incidents.get("active_incidents", [])
    weather = incidents.get("weather_advisory", {})
    egress_time = crowd.get("evacuation_estimated_minutes", 22)

    evacuation_guidance_instruction = ""
    if severity == "CRITICAL" or emergency_type in ("EVACUATION", "FIRE"):
        evacuation_guidance_instruction = (
            f'evacuation_guidance must be a detailed, step-by-step protocol for evacuating '
            f'{zone_crowd_data.get("label", zone_id)} with ~{zone_crowd_data.get("current_occupancy", 0):,} '
            f'people. Estimated total stadium egress time from data: {egress_time} minutes. '
            f'Name specific exits from the stadium context.'
        )
    else:
        evacuation_guidance_instruction = 'Set evacuation_guidance to null — severity does not warrant full evacuation.'

    prompt = f"""You are the StadiumMind AI Emergency Response Coordinator for the FIFA World Cup 2026.
Stadium: {stadium.get('name', 'AT&T Stadium')} | Capacity: {stadium.get('capacity', 80000):,}

⚠️ EMERGENCY DECLARED ⚠️
========================
- Type: {emergency_type}
- Severity: {severity}
- Zone: {zone_id}
- Description: {description}
- Reported At: Current operational time

AFFECTED ZONE STATUS:
- Zone Label: {zone_crowd_data.get('label', zone_id)}
- Current Occupancy: {zone_crowd_data.get('current_occupancy', 0):,}
- Density: {zone_crowd_data.get('density_percent', 0)}%
- Queue Length at Main Gate: {zone_crowd_data.get('queue_length_main_gate', 0)} people
- Current Queue Wait: {zone_crowd_data.get('queue_wait_minutes', 0)} minutes
- Congestion Risk: {zone_crowd_data.get('congestion_risk', 'UNKNOWN')}
- Status: {zone_crowd_data.get('status', 'UNKNOWN')}

VOLUNTEERS CURRENTLY IN {zone_id}:
{json.dumps(volunteers_in_zone, indent=2)}

ZONE COVERAGE SUMMARY FOR {zone_id}:
- Assigned: {zone_volunteer_data.get('assigned', 0)} | Recommended: {zone_volunteer_data.get('recommended', 0)} | Gap: {zone_volunteer_data.get('gap', 0)}

NEARBY AVAILABLE VOLUNTEERS (Unassigned/On Break):
{json.dumps(nearby_unassigned, indent=2)}

OTHER ACTIVE INCIDENTS (stadium-wide):
{json.dumps(all_active_incidents, indent=2)}

WEATHER CONDITIONS:
{json.dumps(weather, indent=2)}

TRANSPORT STATUS (for evacuation routing):
{json.dumps(transport, indent=2)}

MATCH EMERGENCY CONTACTS:
{json.dumps(match.get('emergency_contact', {{}}), indent=2)}

MATCH SPECIAL INSTRUCTIONS:
{json.dumps(match.get('special_instructions', []), indent=2)}

EVACUATION GUIDANCE INSTRUCTION: {evacuation_guidance_instruction}

Generate a complete emergency response as a valid JSON object (no markdown fences, no extra text).
Instructions must be specific to the actual zone density, volunteer count, and incident type.
The public_announcement must be calm, clear, and suitable for a PA system.
The reasoning field must explain the logic behind each decision using specific data from above.

Return ONLY this JSON object:
{{
  "volunteer_instructions": [
    "Step 1: [Specific instruction referencing volunteer names/radio channels/positions from data]",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ...",
    "Step 5: ..."
  ],
  "public_announcement": "Attention all guests at {stadium.get('name', 'AT&T Stadium')}... [calm, PA-ready announcement]",
  "organizer_recommendations": [
    "Recommendation with specific radio channel, team, and action",
    "..."
  ],
  "evacuation_guidance": null_or_detailed_string,
  "reasoning": "Multi-sentence explanation of why each decision was made, citing zone density ({zone_crowd_data.get('density_percent', 0)}%), available volunteers, incident severity, and other contextual factors",
  "expected_outcome": "Quantified expected result if recommendations are followed",
  "confidence": "HIGH|MODERATE|LOW",
  "coordination_required": ["List of teams that must coordinate — e.g., Medical Ch.1, Security Ch.5"]
}}

ONLY return the JSON object.
"""

    return prompt

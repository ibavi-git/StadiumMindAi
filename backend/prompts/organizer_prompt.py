"""
Organizer AI Situation Report Prompt Builder
=============================================
Constructs the prompt for the Organizer Command Center AI Situation Report.

Prompt Engineering Strategy:
- Full 6-source context injection
- Returns a structured JSON Situation Report rather than a flat insights list
- Covers: operational status, risk matrix, volunteer utilization, crowd prediction,
  transport observations, and immediate action queue
- Designed to replace static KPI displays with dynamic AI narrative
"""
import json


def build_organizer_insights_prompt(context: dict) -> str:
    """
    Build the AI Situation Report prompt for the Organizer Command Center.

    The response is a structured JSON object (not an array) covering the full
    operational picture of the stadium at this moment in time.

    Args:
        context: Full 6-source stadium context.

    Returns:
        A prompt string that produces a structured JSON Situation Report.
    """
    stadium   = context.get("stadium", {})
    crowd     = context.get("crowd", {})
    volunteers = context.get("volunteers", {})
    incidents  = context.get("incidents", {})
    transport  = context.get("transport", {})
    match      = context.get("match", {})

    # Compute derivative stats for context richness
    zones = crowd.get("zones", [])
    critical_count = sum(1 for z in zones if z.get("status") == "CRITICAL")
    high_count = sum(1 for z in zones if z.get("status") == "HIGH")
    total_attendance = crowd.get("overall_attendance", 0)
    capacity = stadium.get("capacity", 80000)
    capacity_pct = round((total_attendance / capacity * 100), 1) if capacity else 0
    unassigned_vols = volunteers.get("unassigned", 0)
    active_incidents = incidents.get("active_incidents", [])

    prompt = f"""You are the StadiumMind AI Operational Intelligence System — the master AI for the FIFA World Cup 2026 Organizer Command Center at {stadium.get('name', 'AT&T Stadium')}.

Your task is to generate a REAL-TIME AI SITUATION REPORT for senior stadium operations staff. This report must synthesise information from ALL data sources simultaneously to provide an integrated operational picture.

FULL STADIUM CONTEXT:
======================

MATCH: {match.get('event', '')} | Phase: {crowd.get('match_phase', '')} | Kickoff: {match.get('kickoff_time', '')}
ATTENDANCE: {total_attendance:,} / {capacity:,} ({capacity_pct}%)
ZONE STATUS: {critical_count} CRITICAL | {high_count} HIGH
ACTIVE INCIDENTS: {len(active_incidents)}
UNASSIGNED VOLUNTEERS: {unassigned_vols}

CROWD ZONES DATA:
{json.dumps(zones, indent=2)}

VOLUNTEER DEPLOYMENT:
{json.dumps(volunteers.get('zone_coverage', {{}}), indent=2)}
Active: {volunteers.get('active_volunteers', 0)} | On Break: {volunteers.get('on_break', 0)} | Unassigned: {unassigned_vols}

ACTIVE INCIDENTS:
{json.dumps(active_incidents, indent=2)}

TRANSPORT STATUS:
{json.dumps(transport, indent=2)}

WEATHER & ENVIRONMENT:
{json.dumps(incidents.get('weather_advisory', {{}}), indent=2)}

SPECIAL MATCH INSTRUCTIONS:
{json.dumps(match.get('special_instructions', []), indent=2)}

EMERGENCY CONTACTS:
{json.dumps(match.get('emergency_contact', {{}}), indent=2)}

INSTRUCTIONS:
Generate a comprehensive AI Situation Report as a valid JSON object (no markdown fences, no extra text).
Synthesise across ALL data sources. Show your reasoning in the "analysis" fields.
Every insight must reference specific numbers from the data.

Return ONLY this JSON structure:
{{
  "operational_status": "GREEN|YELLOW|ORANGE|RED",
  "status_summary": "One sentence operational status with key metrics",
  "crowd_assessment": {{
    "narrative": "2-3 sentence crowd situation analysis with specific zone names and density percentages",
    "predicted_hotspot": "Zone name most likely to reach critical in next 15 min with % prediction",
    "congestion_trend": "IMPROVING|STABLE|WORSENING",
    "crowd_prediction": "Specific quantitative prediction for next 15 minutes based on flow rates"
  }},
  "top_risks": [
    {{
      "rank": 1,
      "zone": "zone label",
      "risk": "Specific risk description with numbers from data",
      "probability": "HIGH|MEDIUM|LOW",
      "time_to_impact": "e.g., 7 minutes at current flow rate"
    }}
  ],
  "immediate_actions": [
    {{
      "priority": "CRITICAL|HIGH|MEDIUM",
      "action": "Specific executable action with gate names, radio channels, volunteer counts",
      "responsible_team": "Which team/role executes this",
      "expected_impact": "Quantified expected result",
      "reasoning": "WHY this action is needed — cite specific data points"
    }}
  ],
  "volunteer_utilization": {{
    "summary": "Narrative on volunteer deployment efficiency",
    "critical_gaps": ["zone: X volunteers short", ...],
    "redeployment_suggestion": "Specific suggestion for redeploying available volunteers"
  }},
  "transport_observations": "Specific transport situation and any fan flow implications",
  "ai_insights": [
    {{
      "priority": "HIGH|MEDIUM|LOW",
      "zone": "zone label or STADIUM-WIDE",
      "insight": "Specific data-driven insight with numbers",
      "action": "Specific recommended action",
      "time_sensitive": true_or_false
    }}
  ],
  "confidence": "HIGH|MODERATE|LOW",
  "report_reasoning": "Brief explanation of what data sources were most influential in this assessment"
}}

Generate 3-5 top_risks ranked by severity. Generate 3-5 immediate_actions. Generate 5 ai_insights.
ONLY return the JSON object. No markdown. No prose outside the JSON.
"""

    return prompt


def build_organizer_sitrep_prompt(context: dict) -> str:
    """Alias kept for backward compatibility — delegates to main function."""
    return build_organizer_insights_prompt(context)

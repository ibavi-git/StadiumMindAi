"""
Crowd Intelligence Prompt Builder
===================================
Constructs the prompt for AI-driven crowd intelligence narrative generation.

Prompt Engineering Strategy:
- Analyses multi-zone crowd data to detect trends, not just report status
- Generates specific quantitative predictions (e.g., "Zone X will reach capacity in ~7 minutes")
- Provides gate-specific recommendations backed by flow rate data
- Synthesises volunteer coverage gaps alongside crowd data for operational relevance
"""
import json


def build_crowd_insights_prompt(context: dict) -> str:
    """
    Build the AI Crowd Intelligence prompt.

    Produces a structured JSON response with trend analysis, congestion
    predictions, and gate-level recommendations based on all available
    crowd, volunteer, and transport data.

    Args:
        context: Full 6-source stadium context.

    Returns:
        A prompt string that produces a structured JSON crowd intelligence response.
    """
    crowd     = context.get("crowd", {})
    volunteers = context.get("volunteers", {})
    transport  = context.get("transport", {})
    match      = context.get("match", {})
    stadium    = context.get("stadium", {})

    zones = crowd.get("zones", [])
    zone_coverage = volunteers.get("zone_coverage", {})

    # ── Enrich zones with volunteer gap data ────────────────────────────────
    enriched_zones = []
    for z in zones:
        zid = z.get("zone_id", "")
        coverage = zone_coverage.get(zid, {})
        enriched_zones.append({
            **z,
            "volunteer_assigned": coverage.get("assigned", 0),
            "volunteer_recommended": coverage.get("recommended", 0),
            "volunteer_gap": coverage.get("gap", 0),
        })

    prompt = f"""You are the StadiumMind AI Crowd Intelligence Engine for the FIFA World Cup 2026.
Stadium: {stadium.get('name', 'AT&T Stadium')} | Capacity: {stadium.get('capacity', 80000):,}
Match Phase: {crowd.get('match_phase', 'PRE_MATCH')} | Overall Attendance: {crowd.get('overall_attendance', 0):,} ({crowd.get('overall_capacity_percent', 0):.1f}%)

FULL ZONE-BY-ZONE DATA (with volunteer coverage):
{json.dumps(enriched_zones, indent=2)}

CONGESTION ALERTS:
{json.dumps(crowd.get('congestion_alerts', []), indent=2)}

TRANSPORT STATUS:
{json.dumps(transport, indent=2)}

HISTORICAL PEAK TIMES FOR THIS VENUE:
{json.dumps(crowd.get('historical_peak_times', []), indent=2)}

VOLUNTEER UNASSIGNED/AVAILABLE:
{json.dumps([v for v in volunteers.get('volunteers', []) if v.get('status') in ('UNASSIGNED', 'ON_BREAK')], indent=2)}

MATCH TIMELINE CONTEXT:
{json.dumps(match.get('event_timeline', []), indent=2)}

TASK: Generate a real-time AI Crowd Intelligence Report. Analyse:
1. Which zones are trending toward congestion (based on predicted_density_15min vs current density_percent)?
2. What is the queue growth rate where data allows?
3. Which specific gate adjustments would relieve the most pressure?
4. Which transport nodes are contributing to crowd build-up?
5. What will crowd distribution look like at kickoff given current flow rates?

Return ONLY a valid JSON object (no markdown fences):
{{
  "crowd_intelligence_summary": "2-3 sentence executive summary of the current crowd situation with specific numbers",
  "trend": "IMPROVING|STABLE|WORSENING",
  "trend_reasoning": "Specific data-backed explanation of trend classification",
  "key_insights": [
    {{
      "insight_type": "QUEUE_GROWTH|CONGESTION_RISK|VOLUNTEER_GAP|TRANSPORT|PREDICTION",
      "zone": "zone label",
      "insight": "Specific measurable insight (e.g., 'Queue growth increased 18% in the last update period')",
      "severity": "CRITICAL|HIGH|MODERATE|LOW",
      "data_basis": "The specific numbers that support this insight"
    }}
  ],
  "congestion_predictions": [
    {{
      "zone": "zone label",
      "predicted_density_15min": 0.0,
      "time_to_critical_minutes": null_or_integer,
      "prediction_basis": "Flow rate and current density calculation"
    }}
  ],
  "gate_recommendations": [
    {{
      "action": "Open|Close|Redirect|Staff",
      "gate": "Gate X",
      "zone": "zone label",
      "expected_impact": "Quantified relief expected (e.g., reduce queue by ~30%)",
      "reasoning": "Why this gate action addresses the specific bottleneck"
    }}
  ],
  "volunteer_deployment_urgency": {{
    "zones_needing_immediate_deployment": ["zone label with gap count"],
    "available_volunteers": {volunteers.get('unassigned', 0)},
    "deployment_recommendation": "Specific redeployment plan"
  }},
  "kickoff_prediction": "What crowd levels will look like at kickoff based on current trends and flow rates"
}}

Generate 4-6 key_insights, 3-4 congestion_predictions, and 2-3 gate_recommendations.
ONLY return the JSON object.
"""

    return prompt

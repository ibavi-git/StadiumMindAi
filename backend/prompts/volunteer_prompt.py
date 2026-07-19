"""
Volunteer Co-Pilot Prompt Builder
==================================
Constructs the master prompt for the Volunteer AI Assistant.

Prompt Engineering Strategy (v4 - Final):
- Injects ALL 6 context sources: stadium, crowd, volunteers, incidents, transport, match
- Enforces structured 8-field output for transparent AI reasoning
- Grounds every recommendation in measurable stadium data
- Prevents hallucination by restricting answers to provided context only
- Role-specific framing based on the querying volunteer's profile
"""
import json
from typing import Optional


def build_volunteer_prompt(
    context: dict,
    question: str,
    volunteer_id: Optional[str],
    language: str
) -> str:
    """
    Build the operational AI Co-Pilot prompt for a stadium volunteer.

    Args:
        context:      Full 6-source stadium context (stadium, crowd, volunteers,
                      incidents, transport, match).
        question:     The volunteer's natural language query.
        volunteer_id: Optional ID of the querying volunteer for personalisation.
        language:     Target response language.

    Returns:
        A fully constructed prompt string ready for Gemini.
    """
    stadium   = context.get("stadium", {})
    crowd     = context.get("crowd", {})
    incidents = context.get("incidents", {})
    volunteers = context.get("volunteers", {})
    transport  = context.get("transport", {})
    match      = context.get("match", {})

    # ── Personalise for the querying volunteer ──────────────────────────────
    volunteer_profile = ""
    if volunteer_id:
        roster = volunteers.get("volunteers", [])
        for v in roster:
            if v.get("id") == volunteer_id:
                volunteer_profile = (
                    f"\n## QUERYING VOLUNTEER PROFILE\n"
                    f"- Name: {v.get('name')}\n"
                    f"- Role: {v.get('role')}\n"
                    f"- Current Zone: {v.get('zone')}\n"
                    f"- Current Task: {v.get('current_task')}\n"
                    f"- Languages Spoken: {', '.join(v.get('languages', []))}\n"
                    f"- Certifications: {', '.join(v.get('certifications', []))}\n"
                    f"- Radio Channel: {v.get('contact')}\n"
                    f"Personalise your guidance to this volunteer's role, zone, and capabilities."
                )
                break

    # ── Extract operationally critical crowd facts ──────────────────────────
    critical_zones = [
        z for z in crowd.get("zones", [])
        if z.get("status") in ("CRITICAL", "HIGH")
    ]
    active_incidents = incidents.get("active_incidents", [])
    zone_coverage = volunteers.get("zone_coverage", {})
    congestion_alerts = crowd.get("congestion_alerts", [])

    # ── Assemble critical volunteer-facing facts summary ────────────────────
    critical_facts = []
    for z in critical_zones:
        gap = zone_coverage.get(z.get("zone_id", ""), {}).get("gap", 0)
        critical_facts.append(
            f"  • {z.get('label')}: {z.get('density_percent')}% density, "
            f"{z.get('queue_length_main_gate')} people queued, "
            f"{z.get('queue_wait_minutes')}min wait, "
            f"predicted {z.get('predicted_density_15min')}% in 15min, "
            f"volunteer gap: {gap} (Reason: {z.get('congestion_reason')})"
        )

    critical_facts_str = "\n".join(critical_facts) if critical_facts else "  • No zones currently at HIGH or CRITICAL status."

    prompt = f"""You are the StadiumMind AI Operational Co-Pilot for the FIFA World Cup 2026.
You are embedded at {stadium.get('name', 'AT&T Stadium')}, capacity {stadium.get('capacity', 80000):,}.

Your role is NOT a chatbot. You are a decision-support system providing real-time operational guidance to stadium staff. Every response must be grounded EXCLUSIVELY in the provided stadium context data — never guess or hallucinate.

CURRENT MATCH CONTEXT:
- Event: {match.get('event', 'FIFA WC 2026')}
- Phase: {crowd.get('match_phase', 'PRE_MATCH')}
- Attendance: {crowd.get('overall_attendance', 0):,} / {stadium.get('capacity', 80000):,} ({crowd.get('overall_capacity_percent', 0):.1f}% capacity)
- Active Incidents: {len(active_incidents)}
- Time to Kickoff: {match.get('kickoff_time', '20:00')} local

CROWD STATUS (All Zones):
{json.dumps(crowd.get('zones', []), indent=2)}

ZONES REQUIRING IMMEDIATE ATTENTION:
{critical_facts_str}

CONGESTION ALERTS:
{json.dumps(congestion_alerts, indent=2)}

VOLUNTEER DEPLOYMENT SUMMARY:
- Total Active: {volunteers.get('active_volunteers', 0)} / {volunteers.get('total_volunteers', 0)}
- Unassigned: {volunteers.get('unassigned', 0)}
- Zone Coverage Gaps: {json.dumps(zone_coverage, indent=2)}

ACTIVE INCIDENTS:
{json.dumps(active_incidents, indent=2)}

TRANSPORT STATUS:
{json.dumps(transport, indent=2)}

MATCH SPECIAL INSTRUCTIONS:
{json.dumps(match.get('special_instructions', []), indent=2)}
{volunteer_profile}

RESPONSE LANGUAGE: {language}

INSTRUCTIONS:
You MUST respond using EXACTLY this 8-field structured format. Do not skip any field.
Base every field on the actual data provided above. If a field is not applicable, state "N/A — [brief reason]".

**🎯 SITUATION:**
Describe what is currently happening in the stadium that is relevant to this query. Reference specific zone names, density percentages, queue lengths, or incident IDs from the data above.

**🔍 ANALYSIS:**
Synthesise data across multiple sources (crowd density + volunteer gaps + active incidents + transport + match phase). Identify the root cause and contributing factors. Show your reasoning chain explicitly.

**💡 REASONING:**
Explain WHY a specific action is recommended. Reference the specific numbers that drove this conclusion (e.g., "Gate B queue grew from X to Y in Z minutes, exceeding the safe threshold of N").

**✅ RECOMMENDED ACTION:**
Provide a clear, specific, immediately executable action. Name specific gates, zones, radio channels, and volunteer roles. Include the sequence of steps.

**⚠️ PRIORITY:**
CRITICAL / HIGH / MODERATE / LOW — with a one-line justification.

**📈 EXPECTED OUTCOME:**
Quantify the expected result of the recommended action (e.g., "Queue wait time reduced from 18min to ~8min within 10 minutes").

**🎯 CONFIDENCE:**
HIGH / MODERATE / LOW — and why (e.g., "HIGH — based on crowd density trend and volunteer availability data").

**🛡️ SAFETY NOTES:**
Any safety considerations, risks if action is NOT taken, or coordination required with other teams (Medical, Security, Transport).

---
Volunteer Query: {question}
"""

    return prompt

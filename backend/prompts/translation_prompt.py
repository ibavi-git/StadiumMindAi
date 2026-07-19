"""
Translation Prompt Builder
===========================
Constructs the prompt for the multilingual stadium communications assistant.

Prompt Engineering Strategy:
- Enriched with stadium-specific terminology context
- Aware of active incidents for emergency-tone calibration
- Preserves FIFA-specific proper nouns and zone labels
"""
import json


def build_translation_prompt(
    text: str,
    target_language: str,
    context_type: str,
    context: dict
) -> str:
    """
    Build the translation prompt with full stadium context.

    Args:
        text:            Text to translate.
        target_language: Target language name (e.g., "Spanish", "Arabic").
        context_type:    Tone hint — general | emergency | announcement | instruction.
        context:         Full 6-source stadium context.

    Returns:
        A prompt string producing a JSON translation response.
    """
    stadium  = context.get("stadium", {})
    match    = context.get("match", {})
    incidents = context.get("incidents", {})
    crowd    = context.get("crowd", {})

    # Derive alert level to calibrate urgency tone
    critical_zones = [
        z.get("label", "") for z in crowd.get("zones", [])
        if z.get("status") in ("CRITICAL", "HIGH")
    ]
    active_incident_count = len(incidents.get("active_incidents", []))

    # Stadium terminology that must NOT be translated
    proper_nouns = (
        f"Stadium name: '{stadium.get('name', 'AT&T Stadium')}'. "
        f"Keep gate names (Gate A, Gate B, etc.), zone labels "
        f"(North Stand, South Stand, East Stand, West Stand, Main Concourse, Field Level), "
        f"and team names (Argentina, France, ARG, FRA) in their original English form."
    )

    context_tone_map = {
        "emergency":     "URGENT and IMPERATIVE — short sentences, active voice, no ambiguity. Lives may depend on clarity.",
        "announcement":  "FORMAL and AUTHORITATIVE — suitable for public address system broadcast.",
        "instruction":   "DIRECT and CLEAR — step-by-step action-oriented phrasing.",
        "general":       "NATURAL and HELPFUL — conversational tone appropriate for fan assistance.",
    }
    tone_instruction = context_tone_map.get(context_type, context_tone_map["general"])

    prompt = f"""You are the FIFA World Cup 2026 official multilingual stadium communications specialist.

CURRENT STADIUM CONTEXT:
- Stadium: {stadium.get('name', 'AT&T Stadium')}
- Match: {match.get('event', 'FIFA WC 2026')} — {match.get('home_team', {{}}).get('name', 'Argentina')} vs {match.get('away_team', {{}}).get('name', 'France')}
- Match Phase: {crowd.get('match_phase', 'PRE_MATCH')}
- High-Pressure Zones: {', '.join(critical_zones) if critical_zones else 'None currently'}
- Active Incidents: {active_incident_count}
- Context Type: {context_type.upper()}

TRANSLATION RULES:
1. Tone: {tone_instruction}
2. Proper nouns to preserve: {proper_nouns}
3. Translate to: {target_language}
4. Stadium jargon: use locally natural equivalents when an exact term does not exist in {target_language}.
5. Fan-facing language: ensure the translation is culturally respectful and clear to a non-native {target_language} speaker visiting from abroad.

TEXT TO TRANSLATE:
{text}

Return ONLY a valid JSON object (no markdown fences, no extra text):
{{
  "translated": "the translated text in {target_language}",
  "context_notes": "Brief explanation of any translation decisions, cultural considerations, or terminology choices made"
}}
"""

    return prompt

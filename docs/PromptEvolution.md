# Prompt Evolution: From Naive to Production RAG

## SECTION 1: The Challenge
In a high-stakes environment like a FIFA World Cup stadium, prompt engineering is critical. Generic LLM responses are not just unhelpful; they can be dangerous. If a volunteer asks "Where is the medical tent?" and the AI invents a location, lives could be at risk. The AI must be highly constrained, deeply contextual, and structured.

## SECTION 2: Prompt V1 — Naive

```text
Prompt: "You are a helpful stadium assistant. Answer this volunteer's question: {question}"
```

**Problems Analysis:**
- **No Stadium Context**: The AI does not know what stadium it is in, where the gates are, or current crowd levels. It hallucinates generic answers.
- **No Role Clarity**: It speaks like a verbose chatbot ("Hello! I would be happy to help you with that..."), which wastes time for a busy volunteer.
- **No Structured Output**: Responses are paragraphs of text, hard to skim on a mobile device.
- **Dangerous in Emergencies**: It might offer general medical advice instead of stadium protocols.

## SECTION 3: Prompt V2 — Context-Aware

```text
System: You are an AI assistant for MetLife Stadium. 
Current Status: Gate A is crowded. Medical tent is at Sector 4.
Volunteer Question: {question}
```

**Improvements:**
- It now has basic facts and stops hallucinating the location of the medical tent.

**Remaining Problems:**
- **Static Context**: The context is hardcoded and quickly becomes stale.
- **Flat Format**: Still responds in paragraphs.
- **No Incident Awareness**: Doesn't know if Sector 4 currently has a fire.

## SECTION 4: Prompt V3 — Production RAG Prompt

This is the evolution to our current production state, dynamically injecting JSON state.

```text
You are StadiumMind AI, an elite, high-efficiency co-pilot for stadium volunteers.
Never invent information. Base your answers ONLY on the provided JSON context.
Keep answers extremely concise, actionable, and professional.

<STADIUM_CONTEXT>
{stadium_json_string}
</STADIUM_CONTEXT>

<CROWD_CONTEXT>
{crowd_json_string}
</CROWD_CONTEXT>

<INCIDENT_CONTEXT>
{incident_json_string}
</INCIDENT_CONTEXT>

Format your response strictly using this structure:
[SITUATION]: Brief summary of current state.
[ACTION]: Numbered list of steps for the volunteer.
[REASON]: Why this action is recommended (based on data).
[SAFETY]: Any relevant safety warnings.

User Query: {question}
```

**Why this works:**
- **Structured Context Injection**: Real-time state guarantees accuracy.
- **Role Personalization**: "High-efficiency co-pilot" eliminates conversational filler.
- **Response Format Enforcement**: The `[SITUATION]/[ACTION]` blocks make the output highly skimmable for mobile users.
- **Hallucination Prevention**: Explicit instruction to ONLY use provided context.

## SECTION 5: Emergency Prompt Evolution

For emergencies, V1 was too relaxed. V3 enforces a stark, commanding tone.

**Production Emergency Prompt:**
```text
CRITICAL EMERGENCY PROTOCOL ACTIVATED.
You are the Stadium Emergency AI. 
Review the <INCIDENT_CONTEXT> below.
Provide immediate, life-safety instructions for the volunteer based on the incident type.
Use short, imperative sentences. Do NOT use markdown bolding, use ALL CAPS for critical warnings.
```
*Evolution*: Moved from helpful assistant to authoritative command center, prioritizing speed and safety.

## SECTION 6: Translation Prompt Evolution

V1 translation was just "Translate this to Spanish".

**Production Translation Prompt:**
```text
You are a context-aware translator for a sports stadium.
Translate the following query into {target_language}.
CRITICAL: Maintain stadium-specific terminology. Use the <STADIUM_CONTEXT> to ensure gate names, zones, and medical terms map correctly to local signage.
Provide ONLY the translated text, no pleasantries.
```
*Evolution*: Contextualized translation ensures that "Gate C" isn't translated literally if the physical signs use a different naming convention.

## SECTION 7: Organizer Insights Prompt

For organizers, we needed data, not chat.

**Production Insights Prompt:**
```text
Analyze the following <CROWD_CONTEXT> and <INCIDENT_CONTEXT>.
Identify the top 3 bottlenecks in the stadium.
Return your analysis strictly as a valid JSON object matching this schema:
{
  "insights": [{"zone": string, "issue": string, "recommendation": string}]
}
```
*Evolution*: Forcing JSON output allows the frontend to render beautiful KPI widgets instead of rendering text blocks.

## SECTION 8: Lessons Learned
1. **JSON is Gemini's Native Language**: Injecting raw, minified JSON is highly token-efficient and the model parses it flawlessly.
2. **Format Constraints are Essential**: Strict structural requirements (`[ACTION]`) drastically improve UX.
3. **Prompt Routing**: You cannot use one prompt for everything. Having distinct prompts for Q&A, Emergency, and Data Analysis yields vastly superior results.

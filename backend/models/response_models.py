"""
Response Models
===============
Pydantic models for all StadiumMind AI API responses.
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any


# ── AI Core Responses ────────────────────────────────────────────────────────

class AIResponse(BaseModel):
    """Structured response from the Volunteer AI Co-Pilot."""
    answer: str
    confidence: str
    sources_used: List[str]
    reasoning_summary: str
    timestamp: str


class TranslationResponse(BaseModel):
    """Response from the multilingual translation service."""
    original: str
    translated: str
    target_language: str
    context_notes: str
    timestamp: str


class EmergencyResponseModel(BaseModel):
    """Structured AI emergency response plan."""
    emergency_type: str
    zone: str
    severity: str
    volunteer_instructions: List[str]
    public_announcement: str
    organizer_recommendations: List[str]
    evacuation_guidance: Optional[str] = None
    reasoning: Optional[str] = None
    expected_outcome: Optional[str] = None
    confidence: Optional[str] = None
    coordination_required: Optional[List[str]] = None
    timestamp: str


# ── Volunteer Task Responses ─────────────────────────────────────────────────

class TaskAssignment(BaseModel):
    """A single AI-generated volunteer task assignment."""
    volunteer_id: str
    volunteer_name: str
    zone: str
    task: str
    priority: str
    estimated_minutes: int
    reasoning: str
    suggested_response: str


class TaskAssignmentResponse(BaseModel):
    """Batch AI task assignment response."""
    assignments: List[TaskAssignment]
    ai_summary: str
    total_volunteers_deployed: int
    timestamp: str


# ── Crowd Analytics Responses ────────────────────────────────────────────────

class ZoneMetric(BaseModel):
    """Per-zone crowd analytics metric."""
    zone_id: str
    label: str
    density_percent: float
    status: str
    congestion_risk: str
    volunteer_count: int
    recommended_volunteers: int
    gap: int
    queue_length: int
    wait_minutes: int


class CrowdInsight(BaseModel):
    """A single AI-generated crowd intelligence insight."""
    insight_type: str
    zone: str
    insight: str
    severity: str
    data_basis: Optional[str] = None


class CongestionPrediction(BaseModel):
    """AI-generated congestion prediction for a zone."""
    zone: str
    predicted_density_15min: float
    time_to_critical_minutes: Optional[int] = None
    prediction_basis: str


class GateRecommendation(BaseModel):
    """AI-recommended gate action."""
    action: str
    gate: str
    zone: str
    expected_impact: str
    reasoning: str


class CrowdIntelligenceResponse(BaseModel):
    """Full AI Crowd Intelligence Report."""
    crowd_intelligence_summary: str
    trend: str
    trend_reasoning: str
    key_insights: List[Dict[str, Any]]
    congestion_predictions: List[Dict[str, Any]]
    gate_recommendations: List[Dict[str, Any]]
    volunteer_deployment_urgency: Dict[str, Any]
    kickoff_prediction: str
    timestamp: str


# ── Organizer Dashboard Responses ────────────────────────────────────────────

class DashboardSummary(BaseModel):
    """
    Organizer dashboard summary combining KPIs and AI insights.
    ai_insights is a flexible list of dicts to accommodate the rich
    structured Situation Report returned by the upgraded organizer prompt.
    """
    overall_attendance: int
    overall_capacity_percent: float
    active_incidents: int
    volunteers_active: int
    volunteers_unassigned: int
    critical_zones: List[str]
    ai_insights: List[Dict[str, Any]]
    top_priority_action: str
    timestamp: str


class SituationReport(BaseModel):
    """
    Full AI Situation Report for the Organizer Command Center.
    Contains the rich structured output from the organizer AI prompt.
    """
    operational_status: str
    status_summary: str
    crowd_assessment: Dict[str, Any]
    top_risks: List[Dict[str, Any]]
    immediate_actions: List[Dict[str, Any]]
    volunteer_utilization: Dict[str, Any]
    transport_observations: str
    ai_insights: List[Dict[str, Any]]
    confidence: str
    report_reasoning: str
    timestamp: str


# ── Incident Responses ───────────────────────────────────────────────────────

class IncidentResponse(BaseModel):
    """A created or retrieved incident record."""
    id: str
    type: str
    severity: str
    zone: str
    description: str
    status: str
    assigned_volunteers: List[str]
    ai_recommended_actions: List[str]
    reported_at: str

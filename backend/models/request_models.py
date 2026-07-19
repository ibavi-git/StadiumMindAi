from pydantic import BaseModel, Field
from typing import Optional, Literal

class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    language: str = 'English'
    volunteer_id: Optional[str] = None
    zone_context: Optional[str] = None

class TranslateRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    target_language: str
    context_type: Literal['general','emergency','instruction','announcement'] = 'general'

class EmergencyRequest(BaseModel):
    emergency_type: Literal['MEDICAL','SECURITY','WEATHER','FIRE','EVACUATION']
    zone_id: str
    description: str = Field(min_length=10, max_length=500)
    severity: Literal['LOW','MODERATE','HIGH','CRITICAL'] = 'HIGH'

class TaskAssignRequest(BaseModel):
    zone_id: Optional[str] = None
    priority: Literal['AUTO','HIGH','MEDIUM','LOW'] = 'AUTO'

class IncidentReportRequest(BaseModel):
    type: str
    severity: str
    zone: str
    gate: Optional[str] = None
    description: str = Field(min_length=10)
    reported_by: str

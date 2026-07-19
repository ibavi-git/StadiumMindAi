from fastapi import APIRouter, HTTPException
from data_loader import data_loader
from services.emergency_service import EmergencyService
from models.request_models import IncidentReportRequest
from models.response_models import IncidentResponse

router = APIRouter(prefix='/api/incidents', tags=['Incidents'])
emergency_service = EmergencyService()

@router.get('/')
def get_active_incidents():
    return emergency_service.get_active_incidents(data_loader.get_incidents())

@router.get('/all')
def get_all_incidents():
    inc_data = data_loader.get_incidents()
    return inc_data.get('active_incidents', []) + inc_data.get('resolved_incidents', [])

@router.get('/weather')
def get_weather():
    return emergency_service.get_weather_advisory(data_loader.get_incidents())

@router.get('/{incident_id}')
def get_incident(incident_id: str):
    inc = emergency_service.get_incident_by_id(data_loader.get_incidents(), incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.post('/', response_model=IncidentResponse)
def create_incident(report: IncidentReportRequest):
    new_inc = emergency_service.create_incident_record(report, data_loader.get_incidents())
    return IncidentResponse(**new_inc)

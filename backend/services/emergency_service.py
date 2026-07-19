from datetime import datetime
from models.request_models import IncidentReportRequest

class EmergencyService:
    def get_active_incidents(self, incident_data: dict) -> list[dict]:
        return incident_data.get('active_incidents', [])

    def get_incidents_by_zone(self, incident_data: dict, zone_id: str) -> list[dict]:
        return [i for i in self.get_active_incidents(incident_data) if i.get('zone') == zone_id]

    def get_incident_by_id(self, incident_data: dict, incident_id: str) -> dict | None:
        all_incidents = incident_data.get('active_incidents', []) + incident_data.get('resolved_incidents', [])
        return next((i for i in all_incidents if i.get('id') == incident_id), None)

    def create_incident_record(self, report: IncidentReportRequest, incident_data: dict) -> dict:
        year = datetime.utcnow().year
        all_incidents = incident_data.get('active_incidents', []) + incident_data.get('resolved_incidents', [])
        count = len(all_incidents) + 1
        new_id = f"INC-{year}-{count:04d}"
        
        return {
            "id": new_id,
            "type": report.type,
            "severity": report.severity,
            "zone": report.zone,
            "description": report.description,
            "status": "ACTIVE",
            "assigned_volunteers": [],
            "ai_recommended_actions": [],
            "reported_at": datetime.utcnow().isoformat() + "Z"
        }

    def get_weather_advisory(self, incident_data: dict) -> dict:
        return incident_data.get('weather_advisory', {})

from services.emergency_service import EmergencyService
from models.request_models import IncidentReportRequest

def test_get_active_incidents_count():
    es = EmergencyService()
    incident_data = {"active_incidents": [{"id": "1"}, {"id": "2"}]}
    assert len(es.get_active_incidents(incident_data)) == 2

def test_get_incidents_by_zone_filters_correctly():
    es = EmergencyService()
    incident_data = {"active_incidents": [{"zone": "ZONE_SOUTH"}, {"zone": "ZONE_NORTH"}]}
    res = es.get_incidents_by_zone(incident_data, "ZONE_SOUTH")
    assert len(res) == 1
    assert res[0]['zone'] == "ZONE_SOUTH"

def test_get_incident_by_id_found():
    es = EmergencyService()
    incident_data = {"active_incidents": [{"id": "INC-2026-0048"}]}
    res = es.get_incident_by_id(incident_data, "INC-2026-0048")
    assert res is not None

def test_get_incident_by_id_not_found_returns_none():
    es = EmergencyService()
    incident_data = {"active_incidents": []}
    assert es.get_incident_by_id(incident_data, "FAKE") is None

def test_create_incident_record_generates_id():
    es = EmergencyService()
    req = IncidentReportRequest(type="FIRE", severity="HIGH", zone="Z1", description="1234567890", reported_by="me")
    res = es.create_incident_record(req, {"active_incidents": []})
    assert res['id'].startswith("INC-")

def test_get_weather_advisory_returns_dict():
    es = EmergencyService()
    incident_data = {"weather_advisory": {"condition": "Clear"}}
    assert isinstance(es.get_weather_advisory(incident_data), dict)

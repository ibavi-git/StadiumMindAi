from services.task_service import TaskService

def test_get_priority_zones_returns_high_and_critical_only():
    ts = TaskService()
    crowd_data = {"zones": [{"status": "HIGH"}, {"status": "LOW"}, {"status": "CRITICAL"}]}
    res = ts.get_priority_zones(crowd_data)
    assert len(res) == 2
    assert all(z['status'] in ['HIGH', 'CRITICAL'] for z in res)

def test_get_available_volunteers_returns_unassigned():
    ts = TaskService()
    vol_data = {"volunteers": [{"status": "UNASSIGNED"}, {"status": "ACTIVE"}, {"status": "ON_BREAK"}]}
    res = ts.get_available_volunteers(vol_data)
    assert len(res) == 2

def test_get_deployment_gaps_sorted_by_gap_desc():
    ts = TaskService()
    vol_data = {"zone_coverage": [{"gap": 2}, {"gap": 5}, {"gap": 0}]}
    res = ts.get_deployment_gaps(vol_data)
    assert len(res) == 2
    assert res[0]['gap'] == 5

def test_get_available_volunteers_filters_by_zone():
    ts = TaskService()
    vol_data = {"volunteers": [
        {"status": "UNASSIGNED", "zone": "Z1"},
        {"status": "UNASSIGNED", "zone": "Z2"}
    ]}
    res = ts.get_available_volunteers(vol_data, "Z1")
    assert len(res) == 1
    assert res[0]['zone'] == "Z1"

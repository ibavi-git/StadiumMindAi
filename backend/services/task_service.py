from models.response_models import TaskAssignment

class TaskService:
    def get_priority_zones(self, crowd_data: dict) -> list[dict]:
        zones = [z for z in crowd_data.get('zones', []) if z.get('status') in ['HIGH', 'CRITICAL']]
        return sorted(zones, key=lambda x: x.get('density_percent', 0), reverse=True)

    def get_available_volunteers(self, volunteer_data: dict, zone_id: str = None) -> list[dict]:
        available = [v for v in volunteer_data.get('volunteers', []) if v.get('status') in ['UNASSIGNED', 'ON_BREAK']]
        if zone_id:
            available = [v for v in available if v.get('zone') == zone_id]
        return available

    def build_task_assignments(self, crowd_data: dict, volunteer_data: dict, incident_data: dict, ai_assignments: list[dict]) -> list[TaskAssignment]:
        results = []
        roster = volunteer_data.get('volunteers', [])
        for a in ai_assignments:
            vol_id = a.get('volunteer_id')
            v_info = next((v for v in roster if v.get('id') == vol_id), None)
            v_name = v_info.get('name') if v_info else "Unknown"
            
            results.append(TaskAssignment(
                volunteer_id=vol_id,
                volunteer_name=v_name,
                zone=a.get('zone', ''),
                task=a.get('task', ''),
                priority=a.get('priority', 'LOW'),
                estimated_minutes=a.get('estimated_minutes', 0),
                reasoning=a.get('reasoning', ''),
                suggested_response=a.get('suggested_response', '')
            ))
        return results

    def get_deployment_gaps(self, volunteer_data: dict) -> list[dict]:
        gaps = [z for z in volunteer_data.get('zone_coverage', []) if z.get('gap', 0) > 0]
        return sorted(gaps, key=lambda x: x.get('gap', 0), reverse=True)

"""
CrowdService: Stadium crowd analytics and heatmap generation.
Merges crowd density data with stadium capacity and volunteer coverage.
"""


class CrowdService:
    """Provides analytics over live crowd data merged with stadium and volunteer context."""

    def get_heatmap_data(
        self, crowd_data: dict, stadium_data: dict, volunteer_data: dict
    ) -> list[dict]:
        """
        Build heatmap-ready payload for each zone by merging:
        - crowd density / queue / congestion from crowd.json
        - seating capacity from stadium.json
        - volunteer coverage from volunteers.json

        Returns list of enriched zone dicts suitable for frontend rendering.
        """
        heatmap = []

        # volunteer_data['zone_coverage'] is a dict keyed by zone_id
        zone_coverage: dict = volunteer_data.get("zone_coverage", {})

        for c_zone in crowd_data.get("zones", []):
            zone_id: str = c_zone.get("zone_id", "")

            # Find matching stadium zone by id field
            s_zone = next(
                (z for z in stadium_data.get("zones", []) if z.get("id") == zone_id),
                {},
            )

            # Coverage is keyed directly by zone_id string
            v_coverage: dict = zone_coverage.get(zone_id, {})

            # queue_length_main_gate from crowd zone
            queue_length = c_zone.get("queue_length_main_gate", 0)
            wait_minutes = c_zone.get("queue_wait_minutes", 0)

            heatmap.append(
                {
                    "zone_id": zone_id,
                    "label": c_zone.get("label", ""),
                    "density_percent": c_zone.get("density_percent", 0.0),
                    "status": c_zone.get("status", "UNKNOWN"),
                    "congestion_risk": c_zone.get("congestion_risk", "NONE"),
                    "congestion_reason": c_zone.get("congestion_reason", ""),
                    "recommended_action": c_zone.get("recommended_action", ""),
                    "current_occupancy": c_zone.get("current_occupancy", 0),
                    "seating_capacity": s_zone.get("seating_capacity", 0),
                    "queue_length": queue_length,
                    "wait_minutes": wait_minutes,
                    "predicted_density_15min": c_zone.get(
                        "predicted_density_15min", 0.0
                    ),
                    "volunteer_count": v_coverage.get("assigned", 0),
                    "recommended_volunteers": v_coverage.get("recommended", 0),
                    "gap": v_coverage.get("gap", 0),
                    "coordinates": s_zone.get("coordinates", {"x": 50, "y": 50}),
                }
            )

        return heatmap

    def get_critical_zones(self, crowd_data: dict) -> list[str]:
        """Return labels of zones with HIGH or CRITICAL status."""
        return [
            z.get("label", "")
            for z in crowd_data.get("zones", [])
            if z.get("status") in ("HIGH", "CRITICAL")
        ]

    def get_zone_summary(self, zone_id: str, crowd_data: dict) -> dict | None:
        """Find a specific zone's crowd data by zone_id. Returns None if not found."""
        for zone in crowd_data.get("zones", []):
            if zone.get("zone_id") == zone_id:
                return zone
        return None

    def calculate_overall_stats(self, crowd_data: dict) -> dict:
        """
        Aggregate crowd statistics across all zones.

        Returns:
            overall_attendance, overall_capacity_percent, zones_critical,
            zones_high, zones_moderate, avg_wait_minutes
        """
        zones = crowd_data.get("zones", [])
        total_occupancy = sum(z.get("current_occupancy", 0) for z in zones)
        overall_capacity_percent = crowd_data.get("overall_capacity_percent", 0.0)

        wait_times = [z.get("queue_wait_minutes", 0) for z in zones if z.get("queue_wait_minutes", 0) > 0]
        avg_wait = round(sum(wait_times) / len(wait_times), 1) if wait_times else 0

        status_counts = {"CRITICAL": 0, "HIGH": 0, "MODERATE": 0, "LOW": 0, "RESTRICTED": 0}
        for z in zones:
            s = z.get("status", "")
            if s in status_counts:
                status_counts[s] += 1

        return {
            "overall_attendance": crowd_data.get("overall_attendance", total_occupancy),
            "overall_capacity_percent": overall_capacity_percent,
            "zones_critical": status_counts["CRITICAL"],
            "zones_high": status_counts["HIGH"],
            "zones_moderate": status_counts["MODERATE"],
            "zones_low": status_counts["LOW"],
            "avg_wait_minutes": avg_wait,
            "evacuation_estimated_minutes": crowd_data.get("evacuation_estimated_minutes", 0),
        }

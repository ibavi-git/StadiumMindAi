from datetime import datetime

def format_timestamp(iso_string: str) -> str:
    try:
        dt = datetime.fromisoformat(iso_string.replace('Z', '+00:00'))
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        return iso_string

def calculate_fill_percent(current: int, capacity: int) -> float:
    if capacity <= 0:
        return 0.0
    return (current / capacity) * 100.0

def get_severity_color(severity: str) -> str:
    s = severity.upper()
    if s == 'LOW': return '#4ade80'
    if s == 'MODERATE': return '#facc15'
    if s == 'HIGH': return '#f97316'
    if s == 'CRITICAL': return '#ef4444'
    return '#9ca3af'

def truncate_text(text: str, max_length: int) -> str:
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."

def zone_status_to_level(status: str) -> int:
    s = status.upper()
    levels = {'RESTRICTED': 0, 'LOW': 1, 'MODERATE': 2, 'HIGH': 3, 'CRITICAL': 4}
    return levels.get(s, 1)

# API Reference

**Base URL**: `http://localhost:8000`  
**Authentication**: Currently none (Add Bearer tokens for production).  
**Response Format**: All responses are standard JSON.  
**Error Handling**: Errors return standard HTTP status codes with a body format: `{"detail": "Error message description"}`

---

### 1. GET `/`
- **Description**: Root endpoint, returns API metadata.
- **Response**: `{"name": "StadiumMind AI API", "version": "1.0"}`

### 2. GET `/health`
- **Description**: Standard health check for the API.
- **Response**: `{"status": "ok", "timestamp": "2026-07-18T10:00:00Z"}`

### 3. GET `/api/ai/health`
- **Description**: Checks connectivity to the Google Gemini API.
- **Response**: `{"gemini_api": "connected"}`

### 4. POST `/api/ai/ask`
- **Description**: RAG-powered Q&A for volunteers.
- **Request Body**:
  ```json
  { "question": "Where is the nearest medical tent to Gate A?", "role": "volunteer" }
  ```
- **Response**:
  ```json
  { "answer": "[SITUATION]...\n[ACTION]..." }
  ```

### 5. POST `/api/ai/translate`
- **Description**: Context-aware multilingual translation.
- **Request Body**:
  ```json
  { "text": "Medical tent is at Gate B", "target_language": "Spanish" }
  ```
- **Response**:
  ```json
  { "translated_text": "La carpa médica está en la Puerta B." }
  ```

### 6. POST `/api/ai/emergency`
- **Description**: Generates emergency response protocols based on live incidents.
- **Request Body**:
  ```json
  { "incident_id": "INC-001", "volunteer_location": "Gate A" }
  ```
- **Response**:
  ```json
  { "protocol": "EVACUATE GATE A IMMEDIATELY..." }
  ```

### 7. GET `/api/crowd/heatmap`
- **Description**: Returns density data for rendering UI heatmaps.
- **Response**:
  ```json
  { "zones": [{ "id": "Z-1", "density": 85 }] }
  ```

### 8. GET `/api/crowd/stats`
- **Description**: Aggregate stadium capacity stats.
- **Response**:
  ```json
  { "total_attendance": 85000, "capacity_percentage": 92 }
  ```

### 9. GET `/api/crowd/alerts`
- **Description**: Returns zones exceeding safe capacity thresholds.
- **Response**:
  ```json
  { "alerts": [{ "zone": "North Concourse", "density": 95 }] }
  ```

### 10. GET `/api/crowd/zone/{zone_id}`
- **Description**: Specific details for a single zone.
- **Response**: `{ "id": "Z-1", "status": "crowded" }`

### 11. GET `/api/volunteers`
- **Description**: Roster of all active volunteers.
- **Response**: `{ "volunteers": [...] }`

### 12. GET `/api/volunteers/gaps`
- **Description**: AI-identified staffing shortages based on crowd density.
- **Response**: `{ "gaps": [{ "zone": "Gate C", "required": 5 }] }`

### 13. POST `/api/volunteers/tasks`
- **Description**: Assign AI-generated tasks to volunteers.
- **Request Body**: `{ "volunteer_id": "V-123", "task_type": "crowd_control" }`
- **Response**: `{ "status": "assigned", "task": {...} }`

### 14. GET `/api/incidents`
- **Description**: List of active incidents.
- **Response**: `{ "incidents": [...] }`

### 15. POST `/api/incidents`
- **Description**: Report a new incident.
- **Request Body**: `{ "type": "medical", "location": "Gate D", "description": "Fainted fan" }`
- **Response**: `{ "id": "INC-009", "status": "logged" }`

### 16. GET `/api/incidents/weather`
- **Description**: Weather-related alerts affecting stadium operations.
- **Response**: `{ "alerts": ["High heat warning"] }`

### 17. GET `/api/dashboard/summary`
- **Description**: AI-generated textual summary of stadium health.
- **Response**: `{ "summary": "Operations are nominal. Minor congestion at Gate C." }`

### 18. GET `/api/dashboard/kpis`
- **Description**: Key performance indicators for the organizer view.
- **Response**: `{ "avg_wait_time": "12m", "active_incidents": 2 }`

### 19. GET `/api/dashboard/match`
- **Description**: Metadata regarding the current match status.
- **Response**: `{ "teams": "USA vs ENG", "time": "45:00", "score": "0-0" }`

import axios from 'axios';

/**
 * StadiumMind AI — API Client
 * Connects to FastAPI backend at localhost:8000.
 * AI endpoints use extended timeout (30s) for Gemini reasoning calls.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
});

// Extended timeout client for AI generation endpoints
const aiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
});

const extractData = response => response.data;
const handleError = error => Promise.reject(error);

apiClient.interceptors.request.use(config => {
  config.headers['Accept'] = 'application/json';
  return config;
});
apiClient.interceptors.response.use(extractData, handleError);

aiClient.interceptors.request.use(config => {
  config.headers['Accept'] = 'application/json';
  return config;
});
aiClient.interceptors.response.use(extractData, handleError);

// ── Crowd ────────────────────────────────────────────────────────────────────
export const getCrowdHeatmap    = ()         => apiClient.get('/api/crowd/heatmap');
export const getCrowdAlerts     = ()         => apiClient.get('/api/crowd/alerts');
export const getCrowdStats      = ()         => apiClient.get('/api/crowd/stats');
export const getCrowdZone       = (zoneId)   => apiClient.get(`/api/crowd/zone/${zoneId}`);
export const getCrowdInsights   = ()         => aiClient.get('/api/crowd/insights');

// ── Volunteers ───────────────────────────────────────────────────────────────
export const getVolunteers      = ()         => apiClient.get('/api/volunteers');
export const getVolunteerGaps   = ()         => apiClient.get('/api/volunteers/gaps');
export const assignTasks        = (data)     => aiClient.post('/api/volunteers/tasks', data);

// ── Incidents ────────────────────────────────────────────────────────────────
export const getIncidents       = ()         => apiClient.get('/api/incidents');
export const getWeatherAdvisory = ()         => apiClient.get('/api/incidents/weather');
export const reportIncident     = (data)     => apiClient.post('/api/incidents', data);

// ── AI Services ──────────────────────────────────────────────────────────────
export const askAI              = (data)     => aiClient.post('/api/ai/ask', data);
export const translateText      = (data)     => aiClient.post('/api/ai/translate', data);
export const getEmergencyResponse = (data)   => aiClient.post('/api/ai/emergency', data);

// ── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardSummary = ()        => aiClient.get('/api/dashboard/summary');
export const getDashboardSitRep  = ()        => aiClient.get('/api/dashboard/sitrep');
export const getDashboardKPIs    = ()        => apiClient.get('/api/dashboard/kpis');
export const getMatchData        = ()        => apiClient.get('/api/dashboard/match');

import { useState, useEffect, useCallback } from 'react';
import { getIncidents, getWeatherAdvisory, reportIncident as reportIncidentApi } from '../services/api';

export function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [incRes, weaRes] = await Promise.all([
        getIncidents(),
        getWeatherAdvisory()
      ]);
      setIncidents(incRes || []);
      setWeather(weaRes || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 20000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const report = async (data) => {
    try {
      const res = await reportIncidentApi(data);
      await fetchAll();
      return res;
    } catch (err) {
      throw err;
    }
  };

  return { incidents, weather, loading, error, report, refresh: fetchAll };
}

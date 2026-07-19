import { useState, useEffect, useCallback } from 'react';
import { getCrowdHeatmap, getCrowdStats, getCrowdAlerts } from '../services/api';

export function useStadiumData() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [heatRes, statsRes, alertsRes] = await Promise.all([
        getCrowdHeatmap(),
        getCrowdStats(),
        getCrowdAlerts()
      ]);
      setHeatmapData(heatRes || []);
      setStats(statsRes || {});
      setAlerts(alertsRes || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch stadium data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { heatmapData, stats, alerts, loading, error, lastUpdated, refresh: fetchAll };
}

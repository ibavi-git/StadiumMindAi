import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MetricBar from '../components/organizer/MetricBar';
import HeatmapGrid from '../components/crowd/HeatmapGrid';
import AIInsightPanel from '../components/organizer/AIInsightPanel';
import VolunteerMap from '../components/organizer/VolunteerMap';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useStadiumData } from '../hooks/useStadiumData';
import { getVolunteers, getIncidents, getDashboardSummary, getDashboardKPIs, getMatchData } from '../services/api';
import { Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import Button from '../components/ui/Button';

export default function OrganizerPage() {
  const { heatmapData, alerts } = useStadiumData();
  const [volunteers, setVolunteers] = useState([]);
  const [zoneCoverage, setZoneCoverage] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [volRes, incRes, kpiRes, matchRes] = await Promise.all([
          getVolunteers(),
          getIncidents(),
          getDashboardKPIs(),
          getMatchData()
        ]);
        
        if (volRes) {
          setVolunteers(volRes.volunteers || []);
          setZoneCoverage(volRes.zone_coverage || {});
        }
        setIncidents(incRes || []);
        setKpis(kpiRes || null);
        setMatchData(matchRes || null);
      } catch (err) {
        console.error("Error fetching organizer data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAll();
    const int = setInterval(fetchAll, 60000);
    return () => clearInterval(int);
  }, []);

  const handleGenerateReport = async () => {
    try {
      const res = await getDashboardSummary();
      setSummary(res);
      setShowSummaryModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Mock insights based on alerts for demo
  const mockInsights = alerts.map((a, i) => ({
    priority: a.severity,
    zone: a.zone_id,
    insight: a.message,
    action: a.severity === 'CRITICAL' ? 'Deploy response team immediately' : 'Monitor situation closely',
    time_sensitive: a.severity === 'CRITICAL'
  }));

  return (
    <DashboardLayout title="Organizer Command Center" subtitle="Live Stadium Intelligence">
      <div className="space-y-6">
        
        {/* Metric Bar */}
        <section>
          <MetricBar kpis={kpis} />
        </section>

        {/* Heatmap & Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <HeatmapGrid zones={heatmapData} />
            </Card>
          </div>
          <div className="lg:col-span-1 h-[400px] lg:h-auto">
            <AIInsightPanel insights={mockInsights} loading={loading} />
          </div>
        </section>

        {/* Volunteers & Incidents */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
          <div className="h-full">
            <VolunteerMap volunteers={volunteers} zoneCoverage={zoneCoverage} heatmapData={heatmapData} />
          </div>
          
          <Card className="h-full flex flex-col p-0">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="font-bold text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
                Active Incidents
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {incidents.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No active incidents.</div>
              ) : (
                incidents.map(inc => (
                  <div key={inc.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <Badge status={inc.type} />
                        <Badge status={inc.severity} />
                      </div>
                      <span className="text-xs text-gray-500">{new Date(inc.reported_time).toLocaleTimeString()}</span>
                    </div>
                    <div className="font-medium mb-1">{inc.zone_id}</div>
                    <p className="text-sm text-gray-300 truncate">{inc.description}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        {/* Match Timeline */}
        {matchData && matchData.event_timeline && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Match Timeline</h2>
              <Button variant="secondary" size="sm" icon={FileText} onClick={handleGenerateReport}>
                Generate AI Report
              </Button>
            </div>
            
            <div className="flex justify-between items-center relative py-4 overflow-x-auto scrollbar-hide">
              <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/10 -z-10"></div>
              {matchData.event_timeline.map((event, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[100px] bg-dash-card px-2">
                  <div className="text-xs text-gray-400 mb-2">{event.time}</div>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-2 z-10 ${
                    event.status === 'COMPLETED' ? 'bg-green-500' :
                    event.status === 'ACTIVE' ? 'bg-blue-500 ring-4 ring-blue-500/30' :
                    'bg-gray-700'
                  }`}>
                    {event.status === 'COMPLETED' ? <CheckCircle2 className="h-4 w-4 text-white" /> : 
                     event.status === 'ACTIVE' ? <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div> :
                     <Clock className="h-3 w-3 text-gray-400" />}
                  </div>
                  <div className={`text-xs font-medium text-center ${event.status === 'ACTIVE' ? 'text-white' : 'text-gray-500'}`}>
                    {event.event}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>

      {/* Summary Modal */}
      {showSummaryModal && summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSummaryModal(false)}></div>
          <Card animate glow="blue" className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-4">AI Executive Summary</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-blue-200 mb-6">{summary.ai_insights}</p>
              
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-6">
                <h3 className="text-red-400 font-bold mb-2 uppercase text-sm">Top Priority Action</h3>
                <p>{summary.top_priority_action}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm">Attendance</p>
                  <p className="text-2xl font-bold">{summary.overall_attendance?.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded">
                  <p className="text-gray-400 text-sm">Critical Zones</p>
                  <p className="text-2xl font-bold text-red-400">{summary.critical_zones}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-right">
              <Button onClick={() => setShowSummaryModal(false)}>Close Report</Button>
            </div>
          </Card>
        </div>
      )}

    </DashboardLayout>
  );
}

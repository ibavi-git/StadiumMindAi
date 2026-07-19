import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import EmergencyButton from '../components/emergency/EmergencyButton';
import IncidentForm from '../components/emergency/IncidentForm';
import ResponseCard from '../components/emergency/ResponseCard';
import CongestionBanner from '../components/crowd/CongestionBanner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useIncidents } from '../hooks/useIncidents';
import { useAI } from '../hooks/useAI';
import { useStadiumData } from '../hooks/useStadiumData';
import { AlertOctagon, CloudRain, Shield, Radio, Activity, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

export default function EmergencyPage() {
  const { alerts } = useStadiumData();
  const { incidents, weather, report, refresh } = useIncidents();
  const { emergency, loading: aiLoading } = useAI();
  
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState(null);

  const handleEmergencyTrigger = () => {
    setShowForm(true);
    setActiveResponse(null);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      // 1. Report incident to backend
      await report(data);
      
      // 2. Generate AI response
      const res = await emergency(data.type, data.zone, data.description, data.severity);
      setActiveResponse(res);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleGetGuidance = async (inc) => {
    try {
      const res = await emergency(inc.type, inc.zone_id, inc.description, inc.severity);
      setActiveResponse(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Emergency Response Center" subtitle="AI-powered incident management">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <CongestionBanner alerts={alerts} />
          
          <Card className="text-center bg-red-950/20 border-red-900/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <h2 className="text-2xl font-black text-red-100 mt-2 mb-2">EMERGENCY OVERRIDE</h2>
            <p className="text-red-300 text-sm mb-4">Activate to generate immediate AI containment protocol</p>
            <EmergencyButton onClick={handleEmergencyTrigger} disabled={showForm || formLoading || aiLoading} />
          </Card>

          {/* Slide-up Form */}
          {showForm && (
            <div className="animate-slide-up">
              <IncidentForm 
                onSubmit={handleFormSubmit} 
                onCancel={() => setShowForm(false)} 
                loading={formLoading || aiLoading} 
              />
            </div>
          )}

          {/* Weather Advisory */}
          {weather && weather.condition !== 'Clear' && (
            <Card glow="blue" className="bg-blue-950/20 border-blue-500/30">
              <div className="flex items-center gap-4">
                <CloudRain className="h-10 w-10 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-lg text-blue-100 flex items-center">
                    Weather Advisory 
                    <Badge status="MODERATE" label={weather.condition} className="ml-2 scale-75" />
                  </h3>
                  <p className="text-sm text-blue-200 mt-1">{weather.advisory_text}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Active Incidents List */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-gray-400" />
              Active Incident Log
            </h3>
            
            <div className="space-y-4">
              {incidents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/10">
                  No active incidents recorded.
                </div>
              ) : (
                incidents.map(inc => (
                  <Card key={inc.id} padding="sm" className="bg-black/40 border-l-4 border-l-orange-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge status={inc.type} />
                        <Badge status={inc.severity} />
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(inc.reported_time).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="font-bold text-lg mb-1">{inc.zone_id}</div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{inc.description}</p>
                    
                    <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-2">
                      <div className="text-xs text-gray-400">
                        Assigned: {inc.assigned_volunteers || 0}
                      </div>
                      <Button variant="secondary" size="sm" icon={Shield} onClick={() => handleGetGuidance(inc)}>
                        AI Response
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 h-full flex flex-col relative">
          
          {(aiLoading || formLoading) && (
            <div className="absolute inset-0 z-10 bg-dash-bg/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-white/10 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-500 blur-xl opacity-50 animate-pulse"></div>
                <AlertOctagon className="h-16 w-16 text-red-500 relative z-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold mt-6 text-white">Gemini Analyzing Incident...</h3>
              <p className="text-red-300 mt-2 text-center max-w-sm">Generating emergency protocols, public announcements, and evacuation paths based on live crowd telemetry.</p>
            </div>
          )}

          {activeResponse ? (
            <div className="flex-1">
              <ResponseCard response={activeResponse} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <Card className="flex-1 flex flex-col items-center justify-center text-center opacity-60 border-dashed">
                <Shield className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400">No Active AI Response</h3>
                <p className="text-gray-500 mt-2 max-w-md">Trigger an emergency or select an incident from the log to generate AI guidance.</p>
              </Card>
            </div>
          )}

          <Card className="bg-black/60 border-white/5">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4 flex items-center">
              <Radio className="h-4 w-4 mr-2" />
              Command Network Directory
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-300">Command Center</span>
                <span className="font-mono text-blue-400">Ch. 1</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-300">Medical Lead</span>
                <span className="font-mono text-red-400">Ch. 3</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-300">Security Chief</span>
                <span className="font-mono text-orange-400">Ch. 5</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-300">Transport Coord</span>
                <span className="font-mono text-green-400">Ch. 6</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-300">Volunteer Coord</span>
                <span className="font-mono text-blue-400">Ch. 2</span>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}

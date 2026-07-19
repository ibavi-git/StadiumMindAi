import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import AIAssistant from '../components/volunteer/AIAssistant';
import TaskCard from '../components/volunteer/TaskCard';
import HeatmapGrid from '../components/crowd/HeatmapGrid';
import ZoneCard from '../components/crowd/ZoneCard';
import CongestionBanner from '../components/crowd/CongestionBanner';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import { getVolunteers, assignTasks } from '../services/api';
import { useStadiumData } from '../hooks/useStadiumData';
import { useAI } from '../hooks/useAI';
import { useApp } from '../context/AppContext';
import { ChevronDown, RefreshCw, Languages } from 'lucide-react';

export default function VolunteerPage() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('assistant');
  const [volunteers, setVolunteers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  
  // Translation state
  const [transInput, setTransInput] = useState('');
  const [transOutput, setTransOutput] = useState('');
  const [transContext, setTransContext] = useState('');
  const { translate, loading: transLoading } = useAI();

  const { heatmapData, alerts, loading: dataLoading } = useStadiumData();

  useEffect(() => {
    getVolunteers().then(res => {
      if (res && res.volunteers) {
        setVolunteers(res.volunteers);
        if (!state.volunteerId && res.volunteers.length > 0) {
          dispatch({ type: 'SET_VOLUNTEER', payload: res.volunteers[0] });
        }
      }
    }).catch(console.error);
  }, [dispatch, state.volunteerId]);

  const handleGenerateTasks = async () => {
    setTaskLoading(true);
    try {
      const res = await assignTasks({ priority: 'high' });
      if (res) {
        setTasks(res.assignments || []);
        setAiSummary(res.ai_summary || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTaskLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!transInput.trim()) return;
    try {
      const res = await translate(transInput, state.selectedLanguage, 'GENERAL');
      setTransOutput(res.translated);
      setTransContext(res.context_notes);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedVol = volunteers.find(v => v.id === state.volunteerId) || {};
  const currentZoneData = heatmapData.find(z => z.zone_id === selectedVol.current_zone) || null;

  return (
    <DashboardLayout title="Volunteer Co-Pilot" subtitle="AI-powered guidance for your shift">
      
      {/* Volunteer Selector */}
      <div className="mb-6 bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold">
            {selectedVol.name ? selectedVol.name.charAt(0) : 'V'}
          </div>
          <div>
            <div className="relative">
              <select 
                className="appearance-none bg-transparent font-bold text-lg text-white pr-8 focus:outline-none"
                value={state.volunteerId || ''}
                onChange={(e) => {
                  const vol = volunteers.find(v => v.id === e.target.value);
                  if (vol) dispatch({ type: 'SET_VOLUNTEER', payload: vol });
                }}
              >
                {volunteers.map(v => (
                  <option key={v.id} value={v.id} className="bg-dash-bg text-white">{v.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <span>{selectedVol.role || 'Volunteer'}</span>
              <span>•</span>
              <span className="text-blue-400">{selectedVol.current_zone || 'Unassigned'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
        {['assistant', 'tasks', 'crowd', 'translate'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab === 'assistant' && 'AI Assistant'}
            {tab === 'tasks' && 'My Tasks'}
            {tab === 'crowd' && 'Crowd Intel'}
            {tab === 'translate' && 'Live Translate'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        
        {activeTab === 'assistant' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2">
              <AIAssistant 
                volunteerId={state.volunteerId}
                volunteerName={selectedVol.name}
                volunteerZone={selectedVol.current_zone}
                language={state.selectedLanguage}
              />
            </div>
            <div className="lg:col-span-1">
              <h3 className="font-bold text-gray-300 mb-4 uppercase tracking-wider text-sm">Your Current Zone</h3>
              {dataLoading ? <Spinner /> : <ZoneCard zone={currentZoneData} />}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="animate-fade-in max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">AI-Generated Tasks</h2>
              <Button onClick={handleGenerateTasks} loading={taskLoading} icon={RefreshCw}>
                Generate Assignments
              </Button>
            </div>
            
            {taskLoading && (
              <div className="py-12 flex flex-col items-center justify-center text-blue-400">
                <Spinner size="lg" className="mb-4" />
                <p>Gemini is analyzing crowd data to assign tasks...</p>
              </div>
            )}

            {!taskLoading && tasks.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-white/5 rounded-xl border border-white/10">
                <p>No active tasks. Click generate to query AI for new assignments.</p>
              </div>
            )}

            {!taskLoading && tasks.length > 0 && (
              <div className="space-y-6">
                {aiSummary && (
                  <Card className="bg-blue-900/20 border-blue-500/30">
                    <p className="text-blue-200 font-medium">{aiSummary}</p>
                  </Card>
                )}
                
                <div className="grid gap-4">
                  {tasks.map((task, idx) => (
                    <TaskCard key={idx} assignment={task} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'crowd' && (
          <div className="animate-fade-in">
            <CongestionBanner alerts={alerts} />
            <div className="mb-8">
              <HeatmapGrid zones={heatmapData} />
            </div>
            <h3 className="font-bold text-gray-300 mb-4 uppercase tracking-wider text-sm">All Zones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {heatmapData.map(zone => (
                <ZoneCard key={zone.zone_id} zone={zone} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'translate' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <Card>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <Languages className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold">Live Translation</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">What did they say?</label>
                  <textarea
                    value={transInput}
                    onChange={(e) => setTransInput(e.target.value)}
                    className="input-field h-24 resize-none text-lg"
                    placeholder="Enter text to translate..."
                  ></textarea>
                </div>
                
                <Button onClick={handleTranslate} loading={transLoading} className="w-full">
                  Translate to {state.selectedLanguage}
                </Button>
                
                {transOutput && (
                  <div className="mt-6 pt-6 border-t border-white/10 animate-slide-up">
                    <label className="block text-sm text-gray-400 mb-1">Translation:</label>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-xl font-medium text-white mb-4">
                      {transOutput}
                    </div>
                    {transContext && (
                      <div className="bg-white/5 rounded p-3 text-sm text-gray-300 border-l-2 border-l-purple-500">
                        <span className="font-bold text-purple-400 block mb-1">Cultural Context:</span>
                        {transContext}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

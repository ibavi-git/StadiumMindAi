import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, User, Settings, ShieldAlert, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleRoleSelect = (role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
    if (role === 'volunteer') navigate('/volunteer');
    if (role === 'organizer') navigate('/organizer');
  };

  return (
    <div className="min-h-screen bg-dash-bg flex flex-col relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-600/20 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px]"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center p-4 bg-dash-card/50 rounded-2xl border border-white/10 backdrop-blur-md mb-6 shadow-2xl">
            <Brain className="h-12 w-12 text-blue-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">StadiumMind <span className="text-blue-500">AI</span></h1>
          </div>
          <h2 className="text-xl md:text-2xl text-gray-300 font-medium max-w-2xl mx-auto mb-4">
            AI Volunteer Co-Pilot for FIFA World Cup 2026
          </h2>
          <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Powered by Google Gemini
            </span>
          </div>
        </div>

        {/* Match Info */}
        <Card className="mb-12 border-white/10 bg-black/40 w-full max-w-2xl text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-4">
              <img src="https://flagcdn.com/w80/ar.png" alt="Argentina" className="w-16 h-12 rounded shadow-md border border-white/20" />
              <span className="text-2xl font-bold text-gray-400">vs</span>
              <img src="https://flagcdn.com/w80/fr.png" alt="France" className="w-16 h-12 rounded shadow-md border border-white/20" />
            </div>
            <div className="h-12 w-px bg-white/10 hidden md:block"></div>
            <div className="text-left">
              <p className="text-blue-400 font-bold tracking-wider text-sm">FINAL MATCH</p>
              <p className="font-semibold text-lg">AT&T Stadium, Dallas</p>
              <p className="text-gray-400 text-sm">Kick-off: 20:00 Local Time</p>
            </div>
          </div>
        </Card>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          
          <button 
            onClick={() => handleRoleSelect('volunteer')}
            className="group text-left animate-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            <Card hover glow="blue" className="h-full flex flex-col items-center text-center p-8 border-blue-500/20 bg-blue-950/10">
              <div className="bg-blue-600 p-4 rounded-2xl mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">I'm a Volunteer</h3>
              <p className="text-gray-400 mb-6 text-sm h-10">Access your AI assistant, view smart tasks, and report issues in your language.</p>
              
              <ul className="text-sm text-gray-300 space-y-2 mb-8 text-left w-full">
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Multi-lingual Support</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Dynamic Task Generation</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-500" /> Live Zone Guidance</li>
              </ul>
              
              <div className="mt-auto w-full py-3 rounded-lg bg-blue-600 group-hover:bg-blue-500 transition-colors font-bold">
                Enter Co-Pilot
              </div>
            </Card>
          </button>

          <button 
            onClick={() => handleRoleSelect('organizer')}
            className="group text-left animate-slide-up"
            style={{ animationDelay: '400ms' }}
          >
            <Card hover glow="green" className="h-full flex flex-col items-center text-center p-8 border-green-500/20 bg-green-950/10">
              <div className="bg-green-600 p-4 rounded-2xl mb-6 shadow-[0_0_20px_rgba(22,163,74,0.4)] group-hover:scale-110 transition-transform">
                <Settings className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">I'm an Organizer</h3>
              <p className="text-gray-400 mb-6 text-sm h-10">Monitor stadium crowd dynamics and AI-driven deployment insights.</p>
              
              <ul className="text-sm text-gray-300 space-y-2 mb-8 text-left w-full">
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-green-500" /> Live Crowd Heatmaps</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-green-500" /> Predictive Insights</li>
                <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-green-500" /> Volunteer Tracking</li>
              </ul>
              
              <div className="mt-auto w-full py-3 rounded-lg bg-green-600 group-hover:bg-green-500 transition-colors font-bold">
                Enter Command Center
              </div>
            </Card>
          </button>

        </div>
      </div>
      
      <footer className="text-center p-4 text-xs text-gray-500 z-10 border-t border-white/5 bg-black/20">
        Prompt Wars Virtual Challenge 2026 • AI-Powered by Google Gemini
      </footer>
    </div>
  );
}

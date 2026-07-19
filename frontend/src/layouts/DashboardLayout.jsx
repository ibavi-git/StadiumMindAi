import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, BarChart2, AlertTriangle, Menu, X } from 'lucide-react';
import LanguageSelector from '../components/volunteer/LanguageSelector';
import { useApp } from '../context/AppContext';

export default function DashboardLayout({ children, title, subtitle }) {
  const { state, dispatch } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Home', exact: true },
    { to: '/volunteer', icon: User, label: 'Volunteer Co-Pilot' },
    { to: '/organizer', icon: BarChart2, label: 'Organizer Dashboard' },
    { to: '/emergency', icon: AlertTriangle, label: 'Emergency Center', color: 'text-red-400' }
  ];

  const handleLanguageChange = (lang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dash-bg">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-16 hover:w-64 transition-all duration-300 bg-dash-card border-r border-dash-border z-20 overflow-hidden group absolute md:relative h-full">
        <div className="h-16 flex items-center justify-center border-b border-dash-border w-full flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
            S
          </div>
          <span className="ml-3 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">StadiumMind AI</span>
        </div>
        
        <nav className="flex-1 py-4 space-y-2 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => 
                `flex items-center px-3 py-3 rounded-lg transition-colors whitespace-nowrap ${
                  isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className={`h-5 w-5 shrink-0 ${item.color || ''}`} />
              <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dash-border">
          <div className="flex items-center gap-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            <img src="https://flagcdn.com/w40/ar.png" alt="ARG" className="w-6 h-4 rounded-sm" />
            <span className="text-xs font-bold text-gray-300">vs</span>
            <img src="https://flagcdn.com/w40/fr.png" alt="FRA" className="w-6 h-4 rounded-sm" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-dash-card/50 backdrop-blur-md border-b border-dash-border z-10 shrink-0">
          <div className="flex items-center">
            {/* Mobile menu toggle */}
            <button className="md:hidden mr-4 text-gray-400" onClick={() => setMobileOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
              {subtitle && <p className="hidden md:block text-sm text-gray-400">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              <span className="relative flex h-2.5 w-2.5 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wider text-green-400 mr-3">LIVE</span>
              <span className="text-xs text-gray-300 border-l border-white/20 pl-3">ARG vs FRA | PRE-MATCH | 20:00</span>
            </div>
            
            <div className="w-32 md:w-40">
              <LanguageSelector value={state.selectedLanguage} onChange={handleLanguageChange} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 relative z-0">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
          <aside className="relative w-64 bg-dash-card h-full flex flex-col shadow-2xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-dash-border">
              <span className="font-bold text-lg">StadiumMind AI</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400'
                    }`
                  }
                >
                  <item.icon className={`h-5 w-5 ${item.color || ''}`} />
                  <span className="ml-4 font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

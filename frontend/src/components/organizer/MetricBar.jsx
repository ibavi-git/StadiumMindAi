import React from 'react';
import Card from '../ui/Card';
import { Users, AlertTriangle, UserCheck, UserMinus, ShieldAlert, CloudRain } from 'lucide-react';

export default function MetricBar({ kpis }) {
  if (!kpis) return null;

  const metrics = [
    {
      id: 'attendance',
      label: 'Total Attendance',
      value: kpis.overall_attendance?.toLocaleString() || '0',
      subtext: `${kpis.overall_capacity_percent || 0}% Capacity`,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      id: 'incidents',
      label: 'Active Incidents',
      value: kpis.active_incidents || 0,
      subtext: 'Requires attention',
      icon: AlertTriangle,
      color: kpis.active_incidents > 0 ? 'text-red-400' : 'text-gray-400',
      bg: kpis.active_incidents > 0 ? 'bg-red-500/10' : 'bg-gray-500/10',
      pulse: kpis.active_incidents > 0
    },
    {
      id: 'vol_active',
      label: 'Volunteers Active',
      value: kpis.volunteers_active || 0,
      subtext: 'On duty now',
      icon: UserCheck,
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      id: 'vol_unassigned',
      label: 'Unassigned',
      value: kpis.volunteers_unassigned || 0,
      subtext: 'Available for tasks',
      icon: UserMinus,
      color: kpis.volunteers_unassigned > 0 ? 'text-orange-400' : 'text-gray-400',
      bg: kpis.volunteers_unassigned > 0 ? 'bg-orange-500/10' : 'bg-gray-500/10'
    },
    {
      id: 'critical_zones',
      label: 'Critical Zones',
      value: kpis.critical_zones || 0,
      subtext: 'Congestion risk',
      icon: ShieldAlert,
      color: kpis.critical_zones > 0 ? 'text-red-400' : 'text-green-400',
      bg: kpis.critical_zones > 0 ? 'bg-red-500/10' : 'bg-green-500/10'
    },
    {
      id: 'weather',
      label: 'Weather',
      value: kpis.weather_condition || 'Clear',
      subtext: 'Stadium status',
      icon: CloudRain,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    }
  ];

  return (
    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
      {metrics.map((m) => (
        <Card key={m.id} padding="sm" className="min-w-[200px] flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-lg ${m.bg}`}>
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </div>
            {m.pulse && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm font-medium">{m.label}</p>
          <p className="text-2xl font-bold text-white my-1">{m.value}</p>
          <p className="text-xs text-gray-500">{m.subtext}</p>
        </Card>
      ))}
    </div>
  );
}

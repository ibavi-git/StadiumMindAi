import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Users } from 'lucide-react';

export default function ZoneCard({ zone }) {
  if (!zone) return null;

  const getGlow = (status) => {
    if (status === 'CRITICAL') return 'red';
    if (status === 'HIGH') return 'red';
    if (status === 'MODERATE') return 'blue';
    return null;
  };

  const getBarColor = (density) => {
    if (density >= 85) return 'bg-red-500';
    if (density >= 70) return 'bg-orange-500';
    if (density >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card glow={getGlow(zone.status)} className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg truncate pr-2">{zone.zone_name || zone.zone_id}</h3>
        <Badge status={zone.status} />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Capacity</span>
          <span className="font-bold">{zone.density_percent}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className={`${getBarColor(zone.density_percent)} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, zone.density_percent)}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-gray-400 text-xs mb-1">Queue Time</p>
          <p className="font-semibold">{zone.queue_time_mins ? `${zone.queue_time_mins} min` : 'N/A'}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-gray-400 text-xs mb-1">Volunteers</p>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-blue-400" />
            <span className="font-semibold">{zone.volunteers_present || 0}</span>
            <span className="text-gray-500 ml-1">/ {zone.recommended_volunteers || 0}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2 text-sm border-t border-white/10 pt-3">
        {zone.congestion_reason && (
          <div>
            <span className="text-gray-400 text-xs block">Issue:</span>
            <span className="text-gray-200">{zone.congestion_reason}</span>
          </div>
        )}
        {zone.recommended_action && (
          <div>
            <span className="text-gray-400 text-xs block">Action:</span>
            <span className="text-blue-300 font-medium">{zone.recommended_action}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

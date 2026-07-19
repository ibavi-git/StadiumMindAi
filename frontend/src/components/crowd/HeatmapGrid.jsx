import React, { useState } from 'react';
import Badge from '../ui/Badge';
import { ChevronDown } from 'lucide-react';

export default function HeatmapGrid({ zones = [] }) {
  const [expandedZone, setExpandedZone] = useState(null);
  
  if (!zones || zones.length === 0) {
    return <div className="text-gray-400 text-center py-8">No heatmap data available</div>;
  }

  const getDensityColor = (density) => {
    if (density < 50) return 'bg-green-500/20 border-green-500/40 text-green-400';
    if (density < 70) return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
    if (density < 85) return 'bg-orange-500/20 border-orange-500/40 text-orange-400';
    return 'bg-red-500/20 border-red-500/40 text-red-400';
  };

  const selectedData = zones.find(z => z.zone_id === expandedZone);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
        <span>Live Stadium Heatmap</span>
        <span>Updated: Just now</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {zones.map((zone, i) => (
          <button
            key={zone.zone_id}
            onClick={() => setExpandedZone(zone.zone_id === expandedZone ? null : zone.zone_id)}
            className={`animate-fade-in relative overflow-hidden rounded-xl border p-4 text-left transition-all hover:scale-[1.02] ${getDensityColor(zone.density_percent)} ${expandedZone === zone.zone_id ? 'ring-2 ring-white/50' : ''}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{zone.zone_name || zone.zone_id}</span>
              <Badge status={zone.status} />
            </div>
            <div className="text-3xl font-bold mb-1">{zone.density_percent}%</div>
            <div className="text-xs opacity-80 uppercase tracking-wide">Capacity</div>
            
            {zone.congestion_risk === 'HIGH' && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {selectedData && (
        <div className="animate-slide-up glass-card p-5 mt-4 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-lg">{selectedData.zone_name || selectedData.zone_id} Details</h4>
            <button onClick={() => setExpandedZone(null)} className="text-gray-400 hover:text-white">
              <ChevronDown className="h-5 w-5 transform rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Congestion Reason</p>
              <p className="font-medium text-white">{selectedData.congestion_reason || 'Normal flow'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Recommended Action</p>
              <p className="font-medium text-blue-300">{selectedData.recommended_action || 'Continue standard monitoring'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

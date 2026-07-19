import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Users, AlertCircle } from 'lucide-react';

export default function VolunteerMap({ volunteers = [], zoneCoverage = {}, heatmapData = [] }) {
  // Sort zones by gap descending
  const sortedZones = Object.entries(zoneCoverage)
    .map(([zoneId, data]) => {
      const heat = heatmapData.find(h => h.zone_id === zoneId);
      return {
        id: zoneId,
        ...data,
        density: heat ? heat.density_percent : 0,
        status: heat ? heat.status : 'NORMAL'
      };
    })
    .sort((a, b) => b.gap - a.gap);

  const totalVols = volunteers.length;
  const activeVols = volunteers.filter(v => v.status === 'ACTIVE').length;

  return (
    <Card className="h-full flex flex-col p-0">
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h2 className="font-bold text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-400" />
          Volunteer Deployment
        </h2>
        <div className="text-sm">
          <span className="text-green-400 font-bold">{activeVols}</span>
          <span className="text-gray-400"> / {totalVols} Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-white/5 bg-black/40 sticky top-0 z-10">
              <th className="py-3 px-5 font-medium">Zone</th>
              <th className="py-3 px-5 font-medium text-center">Staffing</th>
              <th className="py-3 px-5 font-medium text-center">Gap</th>
              <th className="py-3 px-5 font-medium text-center">Crowd</th>
              <th className="py-3 px-5 font-medium">Personnel (Sample)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedZones.map((zone) => {
              const zoneVols = volunteers.filter(v => v.current_zone === zone.id);
              const hasCriticalGap = zone.gap >= 3;

              return (
                <tr key={zone.id} className={`hover:bg-white/5 transition-colors ${hasCriticalGap ? 'bg-red-500/5' : ''}`}>
                  <td className="py-3 px-5">
                    <div className="font-medium text-sm">{zone.id.replace('ZONE_', '').replace('_', ' ')}</div>
                    <Badge status={zone.status} className="mt-1 scale-75 origin-left" />
                  </td>
                  
                  <td className="py-3 px-5 text-center">
                    <span className="text-lg font-bold">{zone.assigned}</span>
                    <span className="text-gray-500 text-sm">/{zone.recommended}</span>
                  </td>
                  
                  <td className="py-3 px-5 text-center">
                    {zone.gap > 0 ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded font-bold text-xs ${hasCriticalGap ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        -{zone.gap}
                        {hasCriticalGap && <AlertCircle className="h-3 w-3 ml-1" />}
                      </span>
                    ) : (
                      <span className="text-green-400 text-xs font-medium">Optimal</span>
                    )}
                  </td>
                  
                  <td className="py-3 px-5 text-center">
                    <div className="w-full bg-black/40 rounded-full h-1.5 mb-1 max-w-[60px] mx-auto">
                      <div 
                        className={`h-1.5 rounded-full ${zone.density > 80 ? 'bg-red-500' : zone.density > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min(100, zone.density)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{zone.density}%</span>
                  </td>
                  
                  <td className="py-3 px-5">
                    <div className="flex -space-x-2 overflow-hidden">
                      {zoneVols.slice(0, 3).map((v, i) => (
                        <div key={v.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-dash-card bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white z-10" title={`${v.name} (${v.role})`}>
                          {v.name.charAt(0)}
                        </div>
                      ))}
                      {zoneVols.length > 3 && (
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-dash-card bg-gray-600 flex items-center justify-center text-[10px] font-bold text-white z-0">
                          +{zoneVols.length - 3}
                        </div>
                      )}
                      {zoneVols.length === 0 && (
                        <span className="text-xs text-gray-500 italic">No assigned staff</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

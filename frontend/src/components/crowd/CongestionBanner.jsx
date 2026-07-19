import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Badge from '../ui/Badge';

export default function CongestionBanner({ alerts = [] }) {
  const [dismissed, setDismissed] = useState(new Set());

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && !dismissed.has(a.id));

  if (criticalAlerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-6">
      {criticalAlerts.map(alert => (
        <div key={alert.id} className="relative animate-slide-up overflow-hidden rounded-lg bg-red-900/40 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse-critical"></div>
          <div className="p-4 pl-6 pr-12 flex items-center gap-4">
            <div className="bg-red-500/20 p-2 rounded-full flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-red-100">{alert.zone_id}</span>
                <Badge status="CRITICAL" pulse />
              </div>
              <p className="text-red-200 font-medium">{alert.message}</p>
            </div>
            <button 
              onClick={() => {
                const newSet = new Set(dismissed);
                newSet.add(alert.id);
                setDismissed(newSet);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

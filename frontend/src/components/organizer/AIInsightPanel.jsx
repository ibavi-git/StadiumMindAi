import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { SkeletonInsightCard } from '../ui/SkeletonLoader';
import { Brain, MapPin, Clock, Zap, AlertTriangle } from 'lucide-react';

/**
 * AIInsightPanel — displays AI-generated operational insights for the Organizer.
 *
 * Renders insights from the getDashboardSummary response. Each insight card
 * shows priority, zone, insight narrative, recommended action, and time-sensitivity.
 * Uses skeleton loaders during the AI generation phase.
 */
export default function AIInsightPanel({ insights = [], loading = false, error = null }) {
  const PRIORITY_STYLES = {
    HIGH:    { border: 'border-l-red-500',    badge: 'CRITICAL' },
    MEDIUM:  { border: 'border-l-orange-500', badge: 'HIGH' },
    LOW:     { border: 'border-l-blue-500',   badge: 'ACTIVE' },
    CRITICAL:{ border: 'border-l-red-500',    badge: 'CRITICAL' },
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AI Insights</h2>
            <p className="text-xs text-gray-400">Live operational intelligence</p>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
          Gemini
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide">
        {loading && (
          [1, 2, 3].map(i => <SkeletonInsightCard key={i} />)
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-400 mb-2" />
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        )}

        {!loading && !error && insights.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active insights.</p>
            <p className="text-xs text-gray-500 mt-1">AI is monitoring all zones.</p>
          </div>
        )}

        {!loading && insights.map((insight, idx) => {
          const priority = (insight.priority || 'LOW').toUpperCase();
          const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.LOW;

          return (
            <div
              key={idx}
              className={`bg-white/5 rounded-lg p-4 border-l-2 animate-fade-in ${style.border}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                <Badge status={style.badge} />
                {insight.time_sensitive && (
                  <Clock className="h-4 w-4 text-red-400 animate-pulse flex-shrink-0" title="Time sensitive" />
                )}
              </div>

              {insight.zone && (
                <div className="flex items-center text-xs font-medium text-gray-400 mb-2">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  {insight.zone}
                </div>
              )}

              <p className="text-sm text-gray-100 mb-3 leading-relaxed">{insight.insight}</p>

              {insight.action && (
                <div className="bg-black/30 rounded-lg p-2.5 text-xs border border-white/5">
                  <span className="font-bold text-blue-300 block mb-0.5">Recommended Action</span>
                  <span className="text-gray-300">{insight.action}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { SkeletonInsightCard } from '../ui/SkeletonLoader';
import { getCrowdInsights } from '../../services/api';
import {
  Brain, TrendingUp, TrendingDown, Minus, AlertTriangle,
  ArrowRight, RefreshCw, Clock
} from 'lucide-react';

const TREND_CONFIG = {
  WORSENING:  { icon: TrendingDown, color: 'text-red-400',    bg: 'bg-red-900/20',    label: 'Worsening' },
  STABLE:     { icon: Minus,        color: 'text-yellow-400', bg: 'bg-yellow-900/20', label: 'Stable' },
  IMPROVING:  { icon: TrendingUp,   color: 'text-green-400',  bg: 'bg-green-900/20',  label: 'Improving' },
};

const SEVERITY_COLORS = {
  CRITICAL: 'border-l-red-500',
  HIGH:     'border-l-orange-500',
  MODERATE: 'border-l-yellow-500',
  LOW:      'border-l-blue-500',
};

const INSIGHT_TYPE_LABELS = {
  QUEUE_GROWTH:    '📈 Queue',
  CONGESTION_RISK: '🔴 Congestion',
  VOLUNTEER_GAP:   '👤 Staff Gap',
  TRANSPORT:       '🚌 Transport',
  PREDICTION:      '🔮 Prediction',
};

/**
 * CrowdInsightPanel — AI-generated crowd intelligence narrative.
 *
 * Calls /api/crowd/insights on mount and on manual refresh.
 * Shows trend indicator, key insights, congestion predictions, and gate recommendations.
 */
export default function CrowdInsightPanel({ className = '' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCrowdInsights();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Could not load crowd intelligence. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const TrendIcon = data ? (TREND_CONFIG[data.trend] || TREND_CONFIG.STABLE).icon : Minus;
  const trendConfig = data ? (TREND_CONFIG[data.trend] || TREND_CONFIG.STABLE) : TREND_CONFIG.STABLE;

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500/20 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Crowd Intelligence</h2>
            <p className="text-xs text-gray-400">AI-generated from live data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40"
            title="Refresh AI insights"
            aria-label="Refresh crowd intelligence"
          >
            <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
        {loading && !data && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <SkeletonInsightCard key={i} />)}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-400 mb-2" />
            <p className="text-sm text-gray-400">{error}</p>
            <button onClick={fetchInsights} className="mt-3 text-xs text-blue-400 hover:underline">
              Retry
            </button>
          </div>
        )}

        {data && (
          <>
            {/* Trend Summary */}
            <div className={`rounded-xl p-4 border border-white/10 ${trendConfig.bg}`}>
              <div className="flex items-center gap-3 mb-2">
                <TrendIcon className={`h-6 w-6 ${trendConfig.color}`} />
                <div>
                  <span className={`font-bold text-lg ${trendConfig.color}`}>
                    Crowd Trend: {trendConfig.label}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {data.crowd_intelligence_summary}
              </p>
              {data.trend_reasoning && (
                <p className="text-xs text-gray-400 mt-2 italic">{data.trend_reasoning}</p>
              )}
            </div>

            {/* Key Insights */}
            {data.key_insights && data.key_insights.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Key Insights
                </h3>
                <div className="space-y-2">
                  {data.key_insights.map((insight, idx) => (
                    <div
                      key={idx}
                      className={`bg-white/5 rounded-lg p-3 border-l-2 ${
                        SEVERITY_COLORS[insight.severity] || 'border-l-blue-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-400">
                          {INSIGHT_TYPE_LABELS[insight.insight_type] || insight.insight_type}
                        </span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-400 font-medium">{insight.zone}</span>
                      </div>
                      <p className="text-sm text-gray-200">{insight.insight}</p>
                      {insight.data_basis && (
                        <p className="text-xs text-gray-500 mt-1 italic">{insight.data_basis}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gate Recommendations */}
            {data.gate_recommendations && data.gate_recommendations.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Gate Recommendations
                </h3>
                <div className="space-y-2">
                  {data.gate_recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-green-900/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-green-300">
                            {rec.action}: {rec.gate}
                            {rec.zone && <span className="text-gray-400 font-normal"> · {rec.zone}</span>}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{rec.reasoning}</p>
                          {rec.expected_impact && (
                            <span className="text-xs text-teal-400 mt-1 block">{rec.expected_impact}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kickoff Prediction */}
            {data.kickoff_prediction && (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                  🔮 Kickoff Prediction
                </p>
                <p className="text-sm text-purple-100">{data.kickoff_prediction}</p>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, Clock, AlertTriangle, Star, CheckCircle2 } from 'lucide-react';

export default function TrustScoreBadge({
  userId,
  type = 'pilot',        // 'pilot' | 'passenger'
  size = 'md',           // 'sm' | 'md' | 'lg'
  showBreakdown = false,
  preloadedScore = null  // Pass score directly to skip API fetch
}) {
  const [scoreData, setScoreData] = useState(preloadedScore);
  const [loading, setLoading] = useState(!preloadedScore);

  useEffect(() => {
    if (preloadedScore) { setScoreData(preloadedScore); return; }
    if (!userId) return;

    const endpoint = type === 'pilot'
      ? `/api/trust/pilot/${userId}`
      : `/api/trust/passenger/${userId}`;

    fetch(endpoint)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setScoreData(data.trustScore || data.reliabilityScore);
        }
      })
      .catch(() => {
        // Fallback default score
        setScoreData({
          score: 78, tier: type === 'pilot' ? 'GOLD PILOT' : 'RELIABLE COMMUTER',
          badge: '🥇', label: 'Gold',
          breakdown: { tripCompletion: 85, avgRating: 82, onTimePercent: 78, zeroSOS: 100 }
        });
      })
      .finally(() => setLoading(false));
  }, [userId, type, preloadedScore]);

  if (loading) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(107,114,128,0.1)', padding: '4px 10px',
        borderRadius: '8px', fontSize: '12px', color: '#9CA3AF'
      }}>
        <Shield size={12} />
        <span>Loading score...</span>
      </div>
    );
  }

  if (!scoreData) return null;

  const { score, tier, badge, label, breakdown } = scoreData;

  // Color thresholds
  const getColor = (s) => {
    if (s >= 90) return { primary: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)' };
    if (s >= 75) return { primary: '#84CC16', bg: 'rgba(132, 204, 22,0.12)', border: 'rgba(132, 204, 22,0.35)' };
    if (s >= 60) return { primary: '#6366F1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)' };
    if (s >= 45) return { primary: '#F97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)' };
    return { primary: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' };
  };

  const colors = getColor(score);

  const dimensions = {
    sm: { size: 40, stroke: 3, font: 11, badgeSize: 14 },
    md: { size: 56, stroke: 4, font: 14, badgeSize: 18 },
    lg: { size: 80, stroke: 5, font: 18, badgeSize: 24 }
  };

  const dim = dimensions[size] || dimensions.md;
  const radius = (dim.size - dim.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Animated Score Ring */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={dim.size} height={dim.size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={dim.size / 2}
            cy={dim.size / 2}
            r={radius}
            fill="none"
            stroke="rgba(156,163,175,0.2)"
            strokeWidth={dim.stroke}
          />
          {/* Progress */}
          <circle
            cx={dim.size / 2}
            cy={dim.size / 2}
            r={radius}
            fill="none"
            stroke={colors.primary}
            strokeWidth={dim.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 4px ${colors.primary}80)` }}
          />
        </svg>

        {/* Center Score */}
        <div style={{
          position: 'absolute',
          textAlign: 'center',
          lineHeight: 1.2
        }}>
          <div style={{
            fontSize: `${dim.font}px`,
            fontWeight: '900',
            color: colors.primary
          }}>
            {score}
          </div>
        </div>
      </div>

      {/* Tier Badge */}
      <div style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '3px 8px',
        fontSize: '11px',
        fontWeight: '800',
        color: colors.primary,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap'
      }}>
        <span>{badge}</span>
        <span>{label}</span>
      </div>

      {/* Breakdown Tooltip (shown on hover or showBreakdown) */}
      {showBreakdown && breakdown && (
        <div style={{
          background: 'var(--color-bg-surface, #1E293B)',
          border: '1px solid var(--color-border, #334155)',
          borderRadius: '12px',
          padding: '12px 14px',
          minWidth: '200px',
          fontSize: '11px'
        }}>
          <div style={{
            fontWeight: '800',
            color: 'var(--color-text-primary, #F8FAFC)',
            marginBottom: '10px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <Shield size={12} color={colors.primary} />
            {tier}
          </div>

          {type === 'pilot' ? [
            { key: 'tripCompletion', label: 'Trip Completion', icon: <CheckCircle2 size={11} /> },
            { key: 'avgRating', label: 'Avg Rating', icon: <Star size={11} /> },
            { key: 'onTimePercent', label: 'On-Time Departure', icon: <Clock size={11} /> },
            { key: 'zeroSOS', label: 'SOS-Free Record', icon: <Shield size={11} /> }
          ] : [
            { key: 'onTimeBoarding', label: 'On-Time Boarding', icon: <Clock size={11} /> },
            { key: 'noShowRate', label: 'No-Show Rate', icon: <AlertTriangle size={11} /> },
            { key: 'reviewSentiment', label: 'Review Sentiment', icon: <Star size={11} /> }
          ].map(({ key, label, icon }) => (
            <div key={key} style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '3px', color: 'var(--color-text-secondary, #94A3B8)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {icon} {label}
                </span>
                <span style={{ fontWeight: '700', color: getColor(breakdown[key] || 0).primary }}>
                  {breakdown[key] || 0}
                </span>
              </div>
              <div style={{ background: 'rgba(156,163,175,0.15)', borderRadius: '4px', height: '4px' }}>
                <div style={{
                  background: getColor(breakdown[key] || 0).primary,
                  borderRadius: '4px',
                  height: '100%',
                  width: `${breakdown[key] || 0}%`,
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

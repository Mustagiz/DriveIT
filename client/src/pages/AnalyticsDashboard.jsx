import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, Route, Users, Leaf, DollarSign, Star,
  Award, BarChart2, Car, Clock, Shield, RefreshCw
} from 'lucide-react';

const API_BASE = 'http://localhost:5050';

// Eco color palette
const CHART_COLORS = ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#14B8A6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1E293B',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '12px',
      color: '#F8FAFC'
    }}>
      <div style={{ fontWeight: '700', marginBottom: '4px', color: '#94A3B8' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: '8px' }}>
          <span>{p.name}:</span>
          <strong>{typeof p.value === 'number' && p.name?.includes('₹') ? `₹${p.value.toLocaleString()}` : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsDashboard({ token, userType = 'pilot' }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  const endpoint = userType === 'pilot'
    ? '/api/trust/analytics/pilot'
    : '/api/trust/analytics/passenger';

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (err) {
      // Use fallback demo data
      setAnalytics(generateDemoData(userType));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [token, userType]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
        <div>Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) return null;

  const statCards = userType === 'pilot' ? [
    { label: 'Total Rides', value: analytics.totalRides, icon: <Car size={18} />, color: '#F59E0B', suffix: '' },
    { label: 'Completed', value: analytics.completedRides, icon: <Route size={18} />, color: '#10B981', suffix: '' },
    { label: 'Total Revenue', value: `₹${(analytics.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign size={18} />, color: '#6366F1', suffix: '' },
    { label: 'Avg Rating', value: analytics.avgRating?.toFixed(1), icon: <Star size={18} />, color: '#EC4899', suffix: '/5' },
    { label: 'Total Passengers', value: analytics.totalPassengers, icon: <Users size={18} />, color: '#14B8A6', suffix: '' },
    { label: 'CO₂ Saved', value: `${analytics.co2SavedKg || 0} kg`, icon: <Leaf size={18} />, color: '#10B981', suffix: '' }
  ] : [
    { label: 'Total Trips', value: analytics.totalTrips, icon: <Car size={18} />, color: '#F59E0B', suffix: '' },
    { label: 'Total Spent', value: `₹${(analytics.totalSpent || 0).toLocaleString()}`, icon: <DollarSign size={18} />, color: '#6366F1', suffix: '' },
    { label: 'Saved vs Taxi', value: `₹${(analytics.moneySaved || 0).toLocaleString()}`, icon: <TrendingUp size={18} />, color: '#10B981', suffix: '' },
    { label: 'CO₂ Offset', value: `${analytics.co2SavedKg || 0} kg`, icon: <Leaf size={18} />, color: '#10B981', suffix: '' },
    { label: 'Trees Planted', value: `${analytics.carbonOffsetTrees || 0}`, icon: <Award size={18} />, color: '#059669', suffix: ' equiv.' },
    { label: 'Upcoming Trips', value: analytics.upcomingTrips, icon: <Clock size={18} />, color: '#F59E0B', suffix: '' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', margin: 0 }}>
            {userType === 'pilot' ? '🚗 Pilot Analytics' : '📊 My Travel Stats'}
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
            {userType === 'pilot' ? 'Revenue, trips, and eco-impact' : 'Trips, savings, and carbon footprint'}
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          style={{
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: '10px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#D97706', fontSize: '13px', fontWeight: '700'
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '28px'
      }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: 'var(--color-bg-surface, #1E293B)',
            border: `1px solid ${card.color}33`,
            borderRadius: '14px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: `${card.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px', color: card.color
            }}>
              {card.icon}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: card.color }}>
              {card.value}{card.suffix}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {userType === 'pilot' && analytics.monthlyRevenue && (
        <div style={{
          background: 'var(--color-bg-surface, #1E293B)',
          border: '1px solid var(--color-border, #334155)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', margin: '0 0 16px' }}>
            📈 Monthly Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="₹ Revenue"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Eco Impact Pie */}
      <div style={{
        background: 'var(--color-bg-surface, #1E293B)',
        border: '1px solid var(--color-border, #334155)',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 16px' }}>
          🌿 Eco Impact Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#10B981' }}>
              {analytics.co2SavedKg || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>kg CO₂ Prevented</div>
            <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px' }}>
              = {analytics.carbonOffsetTrees || Math.round((analytics.co2SavedKg || 0) / 21)} trees/yr
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#F59E0B' }}>
              {userType === 'pilot'
                ? `₹${(analytics.totalRevenue || 0).toLocaleString()}`
                : `₹${(analytics.moneySaved || 0).toLocaleString()}`
              }
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {userType === 'pilot' ? 'Total Revenue' : 'Saved vs Taxi'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate realistic demo data when API is unavailable
function generateDemoData(userType) {
  if (userType === 'pilot') {
    return {
      totalRides: 48,
      completedRides: 44,
      cancelledRides: 4,
      totalPassengers: 112,
      totalRevenue: 87400,
      avgRating: 4.8,
      co2SavedKg: 890,
      tripsPerDay: 1.6,
      monthlyRevenue: [
        { month: 'Mar', revenue: 12400 },
        { month: 'Apr', revenue: 14800 },
        { month: 'May', revenue: 13200 },
        { month: 'Jun', revenue: 16500 },
        { month: 'Jul', revenue: 15800 },
        { month: 'Aug', revenue: 14700 }
      ]
    };
  }
  return {
    totalTrips: 18,
    totalSpent: 8100,
    taxiEquivalent: 47880,
    moneySaved: 39780,
    co2SavedKg: 318,
    carbonOffsetTrees: 15,
    avgPricePerTrip: 450,
    upcomingTrips: 2
  };
}

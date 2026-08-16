import React from 'react';
import { MapPin, Navigation, Clock, ShieldCheck, Fuel, Compass, Zap, Building, Car, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function RouteVisualizer({ ride }) {
  const { isDark } = useTheme();
  if (!ride) return null;

  const distance = ride.distanceKm || (ride.distanceMiles ? Math.round(ride.distanceMiles * 1.609) : 148);
  const isEv = ride.vehicle?.electric !== false && (ride.vehicle?.fuelType === 'ELECTRIC' || !ride.vehicle?.fuelType);

  // Normalize stops
  const stops = [
    {
      type: 'ORIGIN',
      title: ride.originCity,
      subtitle: ride.originAddress || `${ride.originCity} Hub`,
      time: ride.departureTime || '07:30 AM',
      km: 0,
      badge: 'DEPARTURE HUB',
      badgeColor: '#10B981'
    },
    ...(ride.waypoints || []).map((wp, idx) => ({
      type: 'WAYPOINT',
      title: wp.split('(')[0].trim(),
      subtitle: wp.includes('(') ? wp.slice(wp.indexOf('(') + 1, -1) : 'Highway Toll / Rest Stop',
      time: `+${Math.round((idx + 1) * 35)}m`,
      km: Math.round(((idx + 1) / ((ride.waypoints?.length || 1) + 1)) * distance),
      badge: wp.toLowerCase().includes('toll') ? 'FASTag Toll' : 'Enroute Rest Stoppage',
      badgeColor: '#F59E0B'
    })),
    {
      type: 'DESTINATION',
      title: ride.destinationCity,
      subtitle: ride.destinationAddress || `${ride.destinationCity} Metro Hub`,
      time: ride.estimatedDurationHours ? `~${ride.estimatedDurationHours}h trip` : '10:00 AM',
      km: distance,
      badge: 'DESTINATION HUB',
      badgeColor: '#EF4444'
    }
  ];

  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Expressway Corridor
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
              Route Timeline & Verified Stoppages
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11.5px',
            fontWeight: '800',
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
            padding: '4px 10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={12} color="#38BDF8" />
            <span>~{ride.estimatedDurationHours || 2.5} hours</span>
          </span>

          <span style={{
            fontSize: '11.5px',
            fontWeight: '800',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10B981',
            padding: '4px 10px',
            borderRadius: '8px'
          }}>
            {distance} km highway
          </span>
        </div>
      </div>

      {/* Modern High-Tech Expressway Corridor Canvas */}
      <div style={{
        background: isDark ? 'linear-gradient(135deg, #0B0F19 0%, #0F172A 100%)' : '#0F172A',
        borderRadius: '18px',
        padding: '20px 24px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Highway grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 0)',
          backgroundSize: '16px 16px',
          opacity: 0.6
        }} />

        {/* Dynamic Route Header on Canvas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 3, marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '13px', fontWeight: '900', color: '#FFFFFF' }}>{ride.originCity.split(',')[0]}</span>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#F59E0B',
            fontSize: '11px',
            fontWeight: '800',
            padding: '2px 10px',
            borderRadius: '999px'
          }}>
            ⚡ National Expressway Corridor
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '900', color: '#FFFFFF' }}>{ride.destinationCity.split(',')[0]}</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
          </div>
        </div>

        {/* Visual Track Line */}
        <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center', zIndex: 3 }}>
          <div style={{
            position: 'absolute',
            left: '8px',
            right: '8px',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '999px'
          }} />
          <div style={{
            position: 'absolute',
            left: '8px',
            right: '8px',
            height: '6px',
            background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #EF4444 100%)',
            borderRadius: '999px'
          }} />

          {/* Stop Nodes on the line */}
          {stops.map((st, i) => {
            const pct = (st.km / distance) * 100;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `calc(${pct}% * 0.94 + 8px)`,
                  transform: 'translateX(-50%)',
                  width: i === 0 || i === stops.length - 1 ? '16px' : '12px',
                  height: i === 0 || i === stops.length - 1 ? '16px' : '12px',
                  borderRadius: '50%',
                  background: i === 0 ? '#10B981' : i === stops.length - 1 ? '#EF4444' : '#F59E0B',
                  border: '2px solid #0F172A',
                  boxShadow: '0 0 10px rgba(0,0,0,0.8)'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Vertical Route Timeline with Stoppages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
        {stops.map((st, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === stops.length - 1;

          return (
            <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
              {/* Timeline Track Pillar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
                <div style={{
                  width: isFirst || isLast ? '18px' : '14px',
                  height: isFirst || isLast ? '18px' : '14px',
                  borderRadius: '50%',
                  background: isFirst ? '#10B981' : isLast ? '#EF4444' : '#F59E0B',
                  border: '3px solid var(--color-bg-surface)',
                  boxShadow: `0 0 10px ${isFirst ? 'rgba(16, 185, 129, 0.5)' : isLast ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.4)'}`,
                  zIndex: 2,
                  marginTop: '4px'
                }} />

                {!isLast && (
                  <div style={{
                    width: '2px',
                    flex: 1,
                    background: 'var(--color-border)',
                    margin: '4px 0',
                    minHeight: '38px'
                  }} />
                )}
              </div>

              {/* Stop Information */}
              <div style={{ flex: 1, paddingBottom: isLast ? '0px' : '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                      {st.title}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      background: `rgba(${st.type === 'ORIGIN' ? '16, 185, 129' : st.type === 'DESTINATION' ? '239, 68, 68' : '245, 158, 11'}, 0.14)`,
                      color: st.badgeColor,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {st.badge}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)' }}>
                    {st.time} • <span style={{ color: 'var(--color-text-tertiary)' }}>{st.km} km</span>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                  {st.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

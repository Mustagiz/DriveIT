import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Navigation, 
  Radio, 
  ChevronDown, 
  Zap, 
  AlertCircle,
  Activity,
  Gauge,
  ShieldCheck,
  Eye,
  Wind,
  Sun,
  BatteryCharging
} from 'lucide-react';

export default function ExpresswayMapVisualizer({ selectedRoute, onSelectCorridor }) {
  const [activeCorridor, setActiveCorridor] = useState('mumbai-pune');

  const corridors = {
    'mumbai-pune': {
      name: 'Mumbai-Pune Expressway',
      origin: 'Mumbai (BKC)',
      destination: 'Pune (Swargate)',
      distance: '148 km',
      eta: '2 hr 15 min',
      speed: '88 km/h',
      traffic: 'Smooth Traffic Flow',
      toll: 'Fastag Active (₹320)',
      range: '280 km EV Range',
      battery: '82%',
      nextWaypoint: 'In 14 km: Lonavala Expressway Food Mall (Fastag Lane 3)'
    },
    'blr-chennai': {
      name: 'Bengaluru-Chennai Highway',
      origin: 'Bengaluru (Silk Board)',
      destination: 'Chennai (Koyambedu)',
      distance: '345 km',
      eta: '5 hr 30 min',
      speed: '92 km/h',
      traffic: 'Moderate at Hosur',
      toll: 'Fastag Active (₹440)',
      range: '310 km Hybrid',
      battery: '100%',
      nextWaypoint: 'In 28 km: Krishnagiri Highway Stop'
    },
    'delhi-jaipur': {
      name: 'Delhi-Jaipur Expressway',
      origin: 'Delhi (Cyber City)',
      destination: 'Jaipur (Sindhi Camp)',
      distance: '270 km',
      eta: '4 hr 15 min',
      speed: '95 km/h',
      traffic: 'Expressway Open',
      toll: 'Fastag Active (₹380)',
      range: '420 km Range',
      battery: '94%',
      nextWaypoint: 'In 35 km: Neemrana Mid-way Zone'
    },
    'pune-goa': {
      name: 'Pune-Goa NH48 Corridor',
      origin: 'Pune (Kothrud)',
      destination: 'Goa (Panaji)',
      distance: '440 km',
      eta: '7 hr 30 min',
      speed: '75 km/h',
      traffic: 'Scenic Ghat Route',
      toll: 'Fastag Active (₹290)',
      range: '260 km EV Range',
      battery: '76%',
      nextWaypoint: 'In 45 km: Satara Highway Oasis'
    }
  };

  const current = corridors[activeCorridor] || corridors['mumbai-pune'];

  return (
    <div style={{
      padding: '24px',
      borderRadius: '24px',
      marginBottom: '28px',
      background: '#FFFFFF',
      border: '1.5px solid #E2E8F0',
      boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.6)'
    }}>
      {/* Header with Title and Corridor Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#FEF08A',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#854D0E',
            boxShadow: '0 2px 8px rgba(234, 179, 8, 0.2)'
          }}>
            <Navigation size={20} />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: '900',
              color: '#0F172A',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              Live Windshield & Highway HUD
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px', fontWeight: '500' }}>
              Real-time telemetry, Fastag toll corridors, and EV cruise HUD
            </div>
          </div>
        </div>

        {/* Corridor Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={activeCorridor}
            onChange={(e) => {
              setActiveCorridor(e.target.value);
              onSelectCorridor && onSelectCorridor(e.target.value);
            }}
            style={{
              padding: '8px 34px 8px 14px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#0F172A',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <option value="mumbai-pune">🛣️ Mumbai-Pune Expressway (148 km)</option>
            <option value="blr-chennai">🛣️ Bengaluru ➔ Chennai (345 km)</option>
            <option value="delhi-jaipur">🛣️ Delhi ➔ Jaipur Expressway (270 km)</option>
            <option value="pune-goa">🛣️ Pune ➔ Goa NH48 (440 km)</option>
          </select>
          <ChevronDown size={15} color="#475569" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* COCKPIT / WINDSHIELD CONTAINER - ULTRA HIGH CONTRAST */}
      <div style={{
        position: 'relative',
        height: '300px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, #1E293B 0%, #090D16 100%)',
        border: '3px solid #0F172A',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.4), inset 0 2px 15px rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '18px 20px'
      }}>
        {/* Windshield Top Glass Tint & Glare Reflection */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to bottom, rgba(56, 189, 248, 0.12) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3
        }} />

        {/* 3D Perspective Highway Road Grid Animation */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: '190px',
          perspective: '250px',
          pointerEvents: 'none',
          zIndex: 2
        }}>
          {/* Tarmac Surface */}
          <div style={{
            position: 'absolute',
            inset: 0,
            transform: 'rotateX(55deg)',
            transformOrigin: 'bottom center',
            background: 'linear-gradient(to bottom, #0F172A 0%, #1E293B 100%)',
            borderLeft: '4px solid #FACC15',
            borderRight: '4px solid #FACC15',
            boxShadow: '0 0 30px rgba(250, 204, 21, 0.2)'
          }}>
            {/* Center Animated Dash Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '4px',
              transform: 'translateX(-50%)',
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF 60%, transparent 40%)',
              backgroundSize: '4px 30px',
              animation: 'dashMove 1.2s linear infinite'
            }} />
          </div>
        </div>

        {/* Mountain Silhouette Horizon */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: 0,
          right: 0,
          height: '60px',
          backgroundImage: `
            radial-gradient(ellipse at 25% 100%, rgba(30, 41, 59, 0.9) 0%, transparent 70%),
            radial-gradient(ellipse at 75% 100%, rgba(30, 41, 59, 0.8) 0%, transparent 70%)
          `,
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* TOP HUD BAR: Real-time traffic, GPS Horizon, Weather */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Traffic Live Alert Pill */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid #EF4444',
            borderRadius: '12px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: '800',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
          }}>
            <span style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#EF4444',
              display: 'inline-block',
              boxShadow: '0 0 10px #EF4444'
            }} />
            <span>{current.traffic}</span>
          </div>

          {/* Center HUD Corridor Pill */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid #FACC15',
            borderRadius: '12px',
            padding: '6px 16px',
            color: '#FEF08A',
            fontSize: '0.85rem',
            fontWeight: '900',
            boxShadow: '0 4px 20px rgba(234, 179, 8, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{current.origin}</span>
            <span style={{ color: '#FACC15' }}>➔</span>
            <span>{current.destination}</span>
          </div>

          {/* Right ETA & Toll Pill */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid #38BDF8',
            borderRadius: '12px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFFFFF',
            fontSize: '0.82rem',
            fontWeight: '800',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
          }}>
            <Clock size={14} color="#38BDF8" />
            <span style={{ color: '#94A3B8' }}>ETA:</span>
            <span style={{ color: '#38BDF8' }}>{current.eta}</span>
          </div>
        </div>

        {/* CENTER WINDSHIELD HUD: Speedometer & Next Waypoint */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 'auto 0'
        }}>
          {/* Left Speed Gauge HUD */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.9rem',
                fontWeight: '900',
                color: '#FACC15',
                lineHeight: 1,
                fontFamily: 'var(--font-heading)'
              }}>
                {current.speed}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700', marginTop: '2px' }}>
                EV Cruise
              </div>
            </div>

            <div style={{ height: '36px', width: '1px', background: 'rgba(255,255,255,0.15)' }} />

            <div>
              <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BatteryCharging size={14} />
                <span>{current.battery} SoC</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#CBD5E1', marginTop: '2px' }}>
                {current.range}
              </div>
            </div>
          </div>

          {/* Right Fastag & Turn-by-Turn Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '16px',
            padding: '12px 18px',
            maxWidth: '340px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#FACC15', fontWeight: '800', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={12} fill="#FACC15" />
              <span>Upcoming Corridor Landmark</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: '700', marginTop: '4px', lineHeight: 1.3 }}>
              {current.nextWaypoint}
            </div>
          </div>
        </div>

        {/* BOTTOM HUD TELEMETRY BAR */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '14px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>CORRIDOR:</span>
            <span style={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: '800' }}>{current.name} ({current.distance})</span>
          </div>

          <div style={{
            flex: 1,
            maxWidth: '260px',
            margin: '0 16px',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, #FACC15 0%, #10B981 100%)',
              borderRadius: '4px'
            }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={15} color="#10B981" />
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '800' }}>{current.toll}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

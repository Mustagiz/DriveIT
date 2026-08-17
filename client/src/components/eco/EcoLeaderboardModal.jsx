import React from 'react';
import { 
  X, 
  Leaf, 
  Zap, 
  Award, 
  TreePine, 
  ShieldCheck, 
  TrendingUp, 
  Medal,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import styles from './EcoLeaderboardModal.module.css';

export default function EcoLeaderboardModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const topPilots = [
    {
      rank: 1,
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      vehicle: 'MG ZS EV Exclusive',
      corridor: 'Mumbai ➔ Pune',
      co2SavedKg: 480,
      evKm: 3840,
      badge: '🥇 National Highway Eco Leader'
    },
    {
      rank: 2,
      name: 'Vikram Joshi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      vehicle: 'MG ZS EV Exclusive',
      corridor: 'Mumbai ➔ Pune Express',
      co2SavedKg: 320,
      evKm: 2560,
      badge: '🥈 Zero-Emission Ace'
    },
    {
      rank: 3,
      name: 'Priya Menon',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      vehicle: 'Tata Nexon EV Max',
      corridor: 'Bengaluru ➔ Chennai',
      co2SavedKg: 290,
      evKm: 2320,
      badge: '🥉 Clean Corridor Pioneer'
    },
    {
      rank: 4,
      name: 'Rohan Kapoor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      vehicle: 'Honda City i-VTEC',
      corridor: 'Delhi ➔ Jaipur',
      co2SavedKg: 185,
      evKm: 1480,
      badge: '🌟 High-Occupancy Carpooler'
    }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Leaf size={24} />
            </div>
            <div>
              <h2 className={styles.headerTitle}>National Highway ESG & Carbon Leaderboard</h2>
              <p className={styles.headerSubtitle}>
                Live tracking of carbon offsets, EV clean energy, and top eco-certified carpooling pilots.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Platform ESG Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{ background: '#dcfce7', color: '#166534' }}>
              <Leaf size={20} />
            </div>
            <div className={styles.statVal}>142 kg</div>
            <div className={styles.statLabel}>CO₂ Prevented This Month</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{ background: '#ecfccb', color: '#166534' }}>
              <Zap size={20} />
            </div>
            <div className={styles.statVal}>2,840 km</div>
            <div className={styles.statLabel}>100% Zero-Emission EV Distance</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{ background: '#e0f2fe', color: '#0369a1' }}>
              <TreePine size={20} />
            </div>
            <div className={styles.statVal}>68 Trees</div>
            <div className={styles.statLabel}>Equiv. Reforestation Carbon Sinks</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className={styles.leaderboardSection}>
          <h3 className={styles.sectionTitle}>
            <Award size={16} color="#84CC16" />
            <span>Top Highway Eco-Pilots (Ranked by Clean Impact)</span>
          </h3>

          <div className={styles.pilotList}>
            {topPilots.map(p => (
              <div key={p.rank} className={styles.pilotCard}>
                <div className={styles.rankPill}>
                  #{p.rank}
                </div>

                <img src={p.avatar} alt={p.name} className={styles.avatar} />

                <div className={styles.pilotInfo}>
                  <div className={styles.nameRow}>
                    <span className={styles.name}>{p.name}</span>
                    <span className={styles.badgePill}>{p.badge}</span>
                  </div>
                  <span className={styles.metaSub}>{p.vehicle} • Corridor: {p.corridor}</span>
                </div>

                <div className={styles.impactCol}>
                  <span className={styles.co2Text}>{p.co2SavedKg} kg CO₂</span>
                  <span className={styles.evSub}>{p.evKm} km Clean EV</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.verifiedBy}>
            <ShieldCheck size={14} color="#059669" />
            <span>Certified by Ministry of Road Transport Green Mobility Standards</span>
          </div>
          <button type="button" onClick={onClose} className={styles.closeActionBtn}>
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

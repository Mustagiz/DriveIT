import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram,
  ArrowRight
} from 'lucide-react';
import { useToast } from './Toast';
import LegalComplianceModal from './LegalComplianceModal';
import styles from './Footer.module.css';

export default function Footer({ onNavigate }) {
  const { addToast } = useToast();
  const [activeModal, setActiveModal] = useState(null);

  const handleRouteClick = (from, to) => {
    if (onNavigate) {
      onNavigate('pilots', {
        queryParams: { origin: from, destination: to }
      });
    }
  };

  const handleCityClick = (city) => {
    if (onNavigate) {
      onNavigate('pilots', {
        queryParams: { origin: city }
      });
    }
  };

  return (
    <footer className={styles.footer} aria-label="BlaBlaCar Footer">
      <div className={styles.container}>
        {/* 3 Main Navigation Columns */}
        <div className={styles.grid}>
          {/* Column 1: Travel with carpool */}
          <div>
            <h3 className={styles.columnTitle}>Travel with carpool</h3>
            <ul className={styles.linkList}>
              {[
                { from: 'Nashik', to: 'Pune' },
                { from: 'Mumbai', to: 'Pune' },
                { from: 'Pune', to: 'Aurangabad' },
                { from: 'Bengaluru', to: 'Chittoor' },
                { from: 'Gurgaon', to: 'Jaipur' },
                { from: 'Meerut', to: 'Gautam Buddha Nagar' }
              ].map((route, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleRouteClick(route.from, route.to)}
                    className={styles.linkButton}
                  >
                    <span>{route.from}</span>
                    <span className={styles.routeArrow}>→</span>
                    <span>{route.to}</span>
                  </button>
                </li>
              ))}
              <li style={{ marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => onNavigate ? onNavigate('pilots') : null}
                  className={styles.linkButton}
                  style={{ color: '#0084F0', fontWeight: 800 }}
                >
                  Popular carpool rides
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular carpool destinations */}
          <div>
            <h3 className={styles.columnTitle}>Popular carpool destinations</h3>
            <ul className={styles.linkList}>
              {[
                'Gurgaon',
                'Dadri',
                'Pune',
                'Chandigarh',
                'Ghaziabad',
                'Meerut'
              ].map((city, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleCityClick(city)}
                    className={styles.linkButton}
                  >
                    {city}
                  </button>
                </li>
              ))}
              <li style={{ marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => onNavigate ? onNavigate('pilots') : null}
                  className={styles.linkButton}
                  style={{ color: '#0084F0', fontWeight: 800 }}
                >
                  More carpool destinations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Find out more */}
          <div>
            <h3 className={styles.columnTitle}>Find out more</h3>
            <ul className={styles.linkList}>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate ? onNavigate('how-it-works') : setActiveModal('help')}
                  className={styles.linkButton}
                >
                  Who we are
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate ? onNavigate('how-it-works') : setActiveModal('help')}
                  className={styles.linkButton}
                >
                  How does BlaBlaCar work?
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('help')}
                  className={styles.linkButton}
                >
                  Help Centre
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => addToast('Press contact: press@blablacar.in', 'info')}
                  className={styles.linkButton}
                >
                  Press
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => addToast('Explore career openings at careers.blablacar.in', 'info')}
                  className={styles.linkButton}
                  style={{ fontWeight: 800 }}
                >
                  We're Hiring!
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links Row */}
        <div className={styles.socialRow}>
          <a
            href="https://facebook.com/blablacar.in"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="Facebook"
          >
            <Facebook size={22} color="#0084F0" fill="#0084F0" />
          </a>
          <a
            href="https://twitter.com/blablacar99"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="Twitter X"
          >
            <Twitter size={22} color="#0084F0" />
          </a>
          <a
            href="https://youtube.com/blablacar"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="YouTube"
          >
            <Youtube size={22} color="#0084F0" />
          </a>
          <a
            href="https://instagram.com/blablacar"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label="Instagram"
          >
            <Instagram size={22} color="#0084F0" />
          </a>
        </div>

        {/* Bottom Copyright & Terms Bar */}
        <div className={styles.bottomBar}>
          <div>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('terms-of-service') : setActiveModal('terms')}
              className={styles.termsButton}
            >
              Terms and Conditions
            </button>
          </div>

          <div className={styles.copyrightRight}>
            {/* BlaBlaCar Speech Bubble Mark */}
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
              <path 
                d="M 22 20 C 12 20, 6 28, 6 42 C 6 56, 14 62, 24 62 L 24 74 L 38 62 C 48 62, 54 54, 54 42 C 54 28, 44 20, 22 20 Z" 
                fill="#0084F0" 
              />
              <path 
                d="M 68 36 C 58 36, 52 44, 52 58 C 52 72, 60 78, 70 78 L 70 90 L 84 78 C 94 78, 98 70, 98 58 C 98 44, 90 36, 68 36 Z" 
                fill="#054752" 
              />
            </svg>
            <span className={styles.copyrightText}>BlaBlaCar, 2026 ©</span>
          </div>
        </div>
      </div>

      {/* Legal & Compliance Modal */}
      {activeModal && (
        <LegalComplianceModal
          type={activeModal}
          isOpen={true}
          onClose={() => setActiveModal(null)}
        />
      )}
    </footer>
  );
}

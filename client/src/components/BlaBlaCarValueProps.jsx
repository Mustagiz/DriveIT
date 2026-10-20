import React from 'react';
import { ShieldCheck, Smartphone, Zap } from 'lucide-react';
import styles from './BlaBlaCarValueProps.module.css';

const VALUE_PROPS = [
  {
    icon: <ShieldCheck size={32} color="#00AFF5" />,
    title: 'Your safety is our priority',
    description: 'At DriveIT, we verify pilots with UIDAI Aadhaar, driver licence checks and community ratings so you always know who you travel with.'
  },
  {
    icon: <Smartphone size={32} color="#00AFF5" />,
    title: 'At your fingertips',
    description: 'Book a seat on your phone in under a minute. Simple search, instant digital boarding pass, and live GPS expressway tracking.'
  },
  {
    icon: <Zap size={32} color="#00AFF5" />,
    title: 'Scroll, click, tap and go!',
    description: 'Intercity carpooling has never been easier. No hidden surge charges, transparent FASTag toll splits, and 100% green EV rides.'
  }
];

export default function BlaBlaCarValueProps() {
  return (
    <section className={styles.section} aria-label="DriveIT Benefits">
      <div className={styles.grid}>
        {VALUE_PROPS.map((prop, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.iconWrapper}>
              {prop.icon}
            </div>
            <h3 className={styles.title}>{prop.title}</h3>
            <p className={styles.desc}>{prop.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

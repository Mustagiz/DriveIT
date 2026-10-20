import React from 'react';
import { Briefcase, Coins, ShieldCheck } from 'lucide-react';
import styles from './BlaBlaCarValueProps.module.css';

const VALUE_PROPS = [
  {
    icon: <Briefcase size={26} color="#054752" strokeWidth={2} />,
    title: 'Travel everywhere',
    description: 'Explore all over India with countless carpool rides.'
  },
  {
    icon: <Coins size={26} color="#054752" strokeWidth={2} />,
    title: 'Prices like nowhere',
    description: 'Benefit from great-value shared costs on your carpool rides.'
  },
  {
    icon: <ShieldCheck size={26} color="#054752" strokeWidth={2} />,
    title: 'Ride with confidence',
    description: "Feel secure, knowing you're riding with carpool members with Verified Profiles."
  }
];

export default function BlaBlaCarValueProps() {
  return (
    <section className={styles.section} aria-label="DriveIT Benefits">
      <div className={styles.grid}>
        {VALUE_PROPS.map((prop, idx) => (
          <div key={idx} className={styles.column}>
            <div className={styles.iconCircle}>
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

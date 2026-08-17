import React from 'react';
import { Quote, Star, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ScrollReveal from './ScrollReveal';
import styles from './CommunityTestimonialsSection.module.css';

const ROW_1_TESTIMONIALS = [
  {
    id: 'r1-1',
    name: 'Bruno Pich',
    route: 'Mumbai ⇄ Pune',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    quote: 'The public highway pickup and drop-off locations make a big difference in safety and punctuality.'
  },
  {
    id: 'r1-2',
    name: 'Prabhaharan',
    route: 'Mumbai ⇄ Pune Expressway',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    quote: 'Driveit makes carpooling easy, affordable, and safe. I use it every single time I commute to Pune.'
  },
  {
    id: 'r1-3',
    name: 'Massoud Ali',
    route: 'Delhi ⇄ Jaipur',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    quote: 'I found a reliable EV ride from Delhi to Jaipur without any hassle. The FASTag split process was smooth.'
  },
  {
    id: 'r1-4',
    name: 'Sneha Kulkarni',
    route: 'Bengaluru ⇄ Mysuru',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    quote: 'As a woman traveling on state expressways, the UIDAI biometric check and women-only filter give 100% peace of mind.'
  },
  {
    id: 'r1-5',
    name: 'Rohan Deshmukh',
    route: 'Mumbai ⇄ Nashik',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    quote: 'Traveling in certified Tata Nexon EVs has become so convenient and pocket-friendly thanks to this platform.'
  },
  {
    id: 'r1-6',
    name: 'Kavita Sundaram',
    route: 'Chennai ⇄ Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    quote: 'Booking a seat on the highway corridor saved me ₹1,400 compared to private taxis. Seamless boarding pass PIN!'
  }
];

const ROW_2_TESTIMONIALS = [
  {
    id: 'r2-1',
    name: 'Md Mamanur Rashid',
    route: 'Ahmedabad ⇄ Vadodara',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    quote: 'This app is a great, comfortable alternative to crowded trains and expensive commercial highway cabs.'
  },
  {
    id: 'r2-2',
    name: 'Mike Davis',
    route: 'Delhi ⇄ Agra Yamuna Expy',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    quote: 'I booked a last-minute ride and everything worked perfectly. Very reliable platform with live GPS radar.'
  },
  {
    id: 'r2-3',
    name: 'Kimberly Sarasin',
    route: 'Bengaluru ⇄ Mysuru',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    quote: 'Traveling across state highways was affordable, smooth, and enjoyable with verified corporate co-passengers.'
  },
  {
    id: 'r2-4',
    name: 'Dr. Ananya Nair',
    route: 'Hyderabad ⇄ Vijayawada',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    quote: 'Zero surge pricing and punctual pilots. The 4-digit PIN verification makes boarding seamless every time.'
  },
  {
    id: 'r2-5',
    name: 'Vikramjit Roy',
    route: 'Gurgaon ⇄ Jaipur',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    quote: 'I host 2 empty seats on my weekly trips. It offsets 100% of my fuel and toll expenses effortlessly.'
  },
  {
    id: 'r2-6',
    name: 'Capt. Manpreet Singh',
    route: 'Chandigarh ⇄ Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    quote: 'Customer support answered instantly, and the verified community of pilots makes every journey safe.'
  }
];

export default function CommunityTestimonialsSection() {
  const { isDark } = useTheme();

  // Duplicate arrays for infinite loop without gap
  const marqueeRow1 = [...ROW_1_TESTIMONIALS, ...ROW_1_TESTIMONIALS];
  const marqueeRow2 = [...ROW_2_TESTIMONIALS, ...ROW_2_TESTIMONIALS];

  return (
    <section className={styles.sectionWrapper}>
      <ScrollReveal>
        {/* Main Heading matching reference image */}
        <div className={styles.headerContainer}>
          <h2 className={styles.mainHeading}>
            <span className={styles.highlightText}>Real stories</span> from our users who ride with us
          </h2>
          <p className={styles.subHeading}>
            See how daily commuters and expressway pilots save money, commute green, and travel safely across India.
          </p>
        </div>

        {/* Continuous Auto-Scrolling Marquee Container */}
        <div className={styles.marqueeContainer}>
          {/* Row 1: Scrolling Left */}
          <div className={styles.marqueeTrack}>
            <div className={styles.marqueeRow}>
              {marqueeRow1.map((item, idx) => (
                <div key={`r1-${idx}`} className={styles.card}>
                  <div className={styles.cardQuoteHeader}>
                    <span className={styles.quoteMark}>“</span>
                    <p className={styles.quoteText}>{item.quote}</p>
                  </div>

                  <div className={styles.cardAuthor}>
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className={styles.avatar} 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=84cc16&color=fff`;
                      }}
                    />
                    <div>
                      <div className={styles.authorName}>{item.name}</div>
                      <div className={styles.authorRoute}>{item.route}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right / Offset */}
          <div className={styles.marqueeTrack}>
            <div className={styles.marqueeRowReverse}>
              {marqueeRow2.map((item, idx) => (
                <div key={`r2-${idx}`} className={styles.card}>
                  <div className={styles.cardQuoteHeader}>
                    <span className={styles.quoteMark}>“</span>
                    <p className={styles.quoteText}>{item.quote}</p>
                  </div>

                  <div className={styles.cardAuthor}>
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className={styles.avatar} 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=84cc16&color=fff`;
                      }}
                    />
                    <div>
                      <div className={styles.authorName}>{item.name}</div>
                      <div className={styles.authorRoute}>{item.route}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Edge Masks for Smooth Edge Fade */}
          <div className={styles.fadeLeft} />
          <div className={styles.fadeRight} />
        </div>
      </ScrollReveal>
    </section>
  );
}

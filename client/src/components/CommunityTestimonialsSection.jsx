import React, { useState, useEffect } from 'react';
import { Quote, Star, ShieldCheck, HeartHandshake, CheckCircle2, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ScrollReveal from './ScrollReveal';
import styles from './CommunityTestimonialsSection.module.css';

export default function CommunityTestimonialsSection() {
  const { isDark } = useTheme();
  const [testimonials, setTestimonials] = useState({ row1: [], row2: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/trust/testimonials');
      if (!res.ok) throw new Error('Failed to load testimonials');
      const data = await res.json();
      if (data.success && data.row1 && data.row2) {
        setTestimonials({
          row1: data.row1,
          row2: data.row2
        });
      }
    } catch (err) {
      console.warn('Testimonials dynamic fetch notice:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Fallback items if API is completely unavailable
  const fallbackRow1 = [
    {
      id: 'r1-1',
      name: 'Ananya Sen',
      route: 'Mumbai ⇄ Pune Expressway',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      quote: 'The public highway pickup and drop-off locations make a big difference in safety and punctuality.'
    },
    {
      id: 'r1-2',
      name: 'Rahul Sharma',
      route: 'Mumbai ⇄ Pune Expressway',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      quote: 'DriveIT makes carpooling easy, affordable, and safe. I use it every single time I commute to Pune.'
    },
    {
      id: 'r1-3',
      name: 'Massoud Ali',
      route: 'Delhi ⇄ Jaipur',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      quote: 'I found a reliable EV ride from Delhi to Jaipur without any hassle. The FASTag split process was smooth.'
    }
  ];

  const fallbackRow2 = [
    {
      id: 'r2-1',
      name: 'Sneha Kulkarni',
      route: 'Bengaluru ⇄ Mysuru',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      quote: 'As a woman traveling on state expressways, the UIDAI biometric check and women-only filter give 100% peace of mind.'
    },
    {
      id: 'r2-2',
      name: 'Kavita Sundaram',
      route: 'Chennai ⇄ Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      quote: 'Booking a seat on the highway corridor saved me ₹1,400 compared to private taxis. Seamless boarding pass PIN!'
    },
    {
      id: 'r2-3',
      name: 'Capt. Manpreet Singh',
      route: 'Chandigarh ⇄ Delhi NCR',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
      quote: 'Customer support answered instantly, and the verified community of pilots makes every journey safe.'
    }
  ];

  const displayRow1 = testimonials.row1.length > 0 ? testimonials.row1 : fallbackRow1;
  const displayRow2 = testimonials.row2.length > 0 ? testimonials.row2 : fallbackRow2;

  // Duplicate arrays for infinite loop without gap
  const marqueeRow1 = [...displayRow1, ...displayRow1];
  const marqueeRow2 = [...displayRow2, ...displayRow2];

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
          {loading ? (
            <div style={{ display: 'flex', gap: '20px', padding: '20px 0', justifyContent: 'center' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{
                  width: '320px',
                  height: '140px',
                  borderRadius: '20px',
                  background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                  animation: 'pulse 1.5s infinite ease-in-out'
                }} />
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}

          {/* Gradient Edge Masks for Smooth Edge Fade */}
          <div className={styles.fadeLeft} />
          <div className={styles.fadeRight} />
        </div>
      </ScrollReveal>
    </section>
  );
}

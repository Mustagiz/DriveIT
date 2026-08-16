import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './InteractiveHighwayBackground.module.css';

/**
 * Interactive Highway & Constellation Particle Background
 * Features:
 * - Dynamic mouse spotlight aura with smooth spring easing
 * - Floating highway telemetry nodes & speed pulse streaks
 * - Interconnected constellation lines responsive to cursor distance
 * - Full Dark & Light mode color adaptation
 * - Lightweight 60fps canvas engine with zero CPU overhead
 */
export default function InteractiveHighwayBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth interpolation
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 180,
      active: false
    };

    // Handle Window Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    // Handle Mouse Move
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    // Particle nodes definition
    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 22000), 65);
    let particles = [];

    // Speed light streaks (Expressway traffic pulses)
    let speedStreaks = [];
    const STREAK_COUNT = 8;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 1,
          colorType: i % 3 === 0 ? 'amber' : i % 3 === 1 ? 'emerald' : 'cyan',
          alpha: Math.random() * 0.5 + 0.25,
          pulse: Math.random() * Math.PI * 2
        });
      }

      speedStreaks = [];
      for (let i = 0; i < STREAK_COUNT; i++) {
        speedStreaks.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 2.5 + 1.2,
          angle: -Math.PI / 6, // 30-degree highway drift
          color: i % 2 === 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.35)',
          width: Math.random() * 1.5 + 0.8
        });
      }
    };

    initParticles();

    // Render Animation Loop
    let lastTime = 0;
    const render = (time) => {
      animationFrameId = requestAnimationFrame(render);

      // Smooth mouse spring interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Interactive Radial Spotlight Glow at Cursor
      if (mouse.active) {
        const spotlightRadius = isDark ? 280 : 220;
        const radialGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, spotlightRadius
        );
        if (isDark) {
          radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.09)');
          radialGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
          radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
          radialGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.05)');
          radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, spotlightRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render & Move Expressway Speed Light Streaks
      speedStreaks.forEach(streak => {
        streak.x += Math.cos(streak.angle) * streak.speed;
        streak.y += Math.sin(streak.angle) * streak.speed;

        // Wrap around borders
        if (streak.x < -150) streak.x = width + 150;
        if (streak.x > width + 150) streak.x = -150;
        if (streak.y < -150) streak.y = height + 150;
        if (streak.y > height + 150) streak.y = -150;

        const endX = streak.x + Math.cos(streak.angle) * streak.length;
        const endY = streak.y + Math.sin(streak.angle) * streak.length;

        const grad = ctx.createLinearGradient(streak.x, streak.y, endX, endY);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        grad.addColorStop(0.5, isDark ? streak.color : 'rgba(217, 119, 6, 0.25)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = streak.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(streak.x, streak.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      // 3. Render Constellation Lines Between Close Particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * (isDark ? 0.15 : 0.1);
            ctx.strokeStyle = isDark
              ? `rgba(245, 158, 11, ${lineAlpha})`
              : `rgba(180, 83, 9, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Draw Interactive Line Connecting Particle to Mouse
        if (mouse.active) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < mouse.radius) {
            const mAlpha = (1 - mDist / mouse.radius) * 0.35;
            ctx.strokeStyle = isDark
              ? `rgba(56, 189, 248, ${mAlpha})`
              : `rgba(2, 132, 199, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // 4. Render Particle Nodes
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        // Bounce from canvas edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Particle Glow & Drawing
        const dynamicAlpha = p.alpha + Math.sin(p.pulse) * 0.15;
        let color = '#F59E0B';
        if (p.colorType === 'emerald') color = '#10B981';
        if (p.colorType === 'cyan') color = '#38BDF8';

        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, dynamicAlpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    render(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className={styles.bgContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      {/* Subtle Ambient Radial Gradients */}
      <div className={styles.ambientTopLeft} />
      <div className={styles.ambientBottomRight} />
    </div>
  );
}

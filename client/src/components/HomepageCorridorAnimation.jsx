import React, { useEffect, useRef, useState } from 'react';
import styles from './HomepageCorridorAnimation.module.css';

/**
 * HomepageCorridorAnimation
 * A high-visibility, 60fps ambient background animation covering the entire HomePage.
 * Features:
 * - Fixed full-viewport canvas tracking screen dimensions smoothly
 * - Interconnected Highway Constellation Nodes with glowing hubs
 * - Cruising EV telemetry pulses traversing corridor links
 * - Ambient floating aurora nebulae (Lime / Emerald / Cyan)
 * - Interactive mouse repulsion / parallax wave
 * - Zero GPU waste (pauses on hidden tab, reduced motion respect)
 */
export default function HomepageCorridorAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      const isDarkMode = 
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.body.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false
    };

    // Node Count scaled nicely with screen width
    const nodeCount = Math.max(35, Math.min(65, Math.floor(width / 24)));
    const maxConnectDistance = 160;
    const maxConnectDistanceSq = maxConnectDistance * maxConnectDistance;

    // Initialize Highway Nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const isHub = Math.random() > 0.65;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: isHub ? (Math.random() * 1.5 + 3.0) : (Math.random() * 1.2 + 1.8),
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        type: isHub ? 'hub' : 'waypoint'
      });
    }

    // Telemetry Energy Pulses
    const pulses = [];
    const maxPulses = 18;

    const createPulse = (n1, n2) => {
      const colors = isDark 
        ? ['#84CC16', '#10B981', '#38BDF8', '#A3E635']
        : ['#15803D', '#059669', '#0284C7', '#65A30D'];
      pulses.push({
        from: n1,
        to: n2,
        progress: 0,
        speed: 0.009 + Math.random() * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    };

    // Handle Window Resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse movement
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();
    let isTabVisible = !document.hidden;

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Main 60fps Render Loop
    const render = (time) => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      }

      // 1. Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          node.x += node.vx * (dt * 60);
          node.y += node.vy * (dt * 60);

          // Wrap edges
          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;

          // Mouse interaction
          if (mouse.active) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 20000 && distSq > 1) {
              const force = (1 - distSq / 20000) * 0.9;
              node.x += (dx / Math.sqrt(distSq)) * force * 3;
              node.y += (dy / Math.sqrt(distSq)) * force * 3;
            }
          }
        }

        // Pulsing radius
        node.pulsePhase += node.pulseSpeed;
        const pulseFactor = 1 + Math.sin(node.pulsePhase) * 0.25;

        const isHub = node.type === 'hub';
        const nodeAlpha = isDark ? (isHub ? 0.9 : 0.6) : (isHub ? 0.7 : 0.4);
        const nodeColor = isHub 
          ? (isDark ? '#84CC16' : '#15803D')
          : (isDark ? '#10B981' : '#16A34A');

        // Outer glow halo for Hubs
        if (isHub) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, (node.radius + 5) * pulseFactor, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(132, 204, 22, 0.2)' : 'rgba(21, 128, 61, 0.12)';
          ctx.fill();
        }

        // Inner solid core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = nodeAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 2. Draw Connecting Highway Vectors
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnectDistanceSq) {
            const dist = Math.sqrt(distSq);
            const alphaRatio = 1 - dist / maxConnectDistance;
            const alpha = alphaRatio * (isDark ? 0.32 : 0.2);

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = isDark 
              ? (n1.type === 'hub' || n2.type === 'hub' ? `rgba(132, 204, 22, ${alpha * 1.4})` : `rgba(16, 185, 129, ${alpha})`)
              : (n1.type === 'hub' || n2.type === 'hub' ? `rgba(21, 128, 61, ${alpha * 1.4})` : `rgba(22, 163, 74, ${alpha})`);
            ctx.lineWidth = n1.type === 'hub' && n2.type === 'hub' ? 1.5 : 0.85;
            ctx.stroke();

            // Spawn dynamic energy packet
            if (pulses.length < maxPulses && Math.random() < 0.003) {
              createPulse(n1, n2);
            }
          }
        }
      }

      // 3. Draw Zipping EV Telemetry Energy Pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
        const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, isDark ? 3.5 : 2.8, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = isDark ? 12 : 6;
        ctx.globalAlpha = isDark ? 1.0 : 0.85;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isDark]);

  return (
    <div ref={containerRef} className={styles.bgWrapper} aria-hidden="true">
      {/* 1. Luminous Ambient Gradient Aurora Nebulae */}
      <div className={styles.nebulaOrbLime} />
      <div className={styles.nebulaOrbEmerald} />
      <div className={styles.nebulaOrbCyan} />

      {/* 2. Moving Velocity Diagonal Flow Grid */}
      <div className={styles.velocityFlowLines} />

      {/* 3. Fullscreen Highway Telemetry Canvas */}
      <canvas ref={canvasRef} className={styles.corridorCanvas} />
    </div>
  );
}

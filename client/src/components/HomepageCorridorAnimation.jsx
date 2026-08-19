import React, { useEffect, useRef, useState } from 'react';
import styles from './HomepageCorridorAnimation.module.css';

/**
 * HomepageCorridorAnimation
 * A dedicated, high-performance ambient background animation for the HomePage.
 * Features:
 * - Dynamic 60fps Highway Constellation Network (waypoint nodes & connecting corridor vectors)
 * - Cruising EV telemetry pulses traversing corridor links
 * - Subtle ambient parallax mouse reactivity
 * - Layered CSS glowing aurora nebulae (Lime / Emerald / Cyan)
 * - Automatic battery/GPU conservation (pauses on hidden tab, reduced motion respect)
 */
export default function HomepageCorridorAnimation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect dark mode from document class or data-theme
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

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false
    };

    // Node Count scaled by screen width
    const nodeCount = Math.max(24, Math.min(50, Math.floor(width / 36)));
    const maxConnectDistance = 145;
    const maxConnectDistanceSq = maxConnectDistance * maxConnectDistance;

    // Initialize Highway Nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 1.2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        type: Math.random() > 0.65 ? 'hub' : 'waypoint' // 35% are prominent hubs
      });
    }

    // Telemetry Pulses (Energy packets travelling between connected nodes)
    const pulses = [];
    const maxPulses = 12;

    const createPulse = (n1, n2) => {
      pulses.push({
        from: n1,
        to: n2,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: Math.random() > 0.5 ? '#84CC16' : '#10B981'
      });
    };

    // Handle Window Resize
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
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

    // Main Render Loop
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

      // Update & Draw Nodes
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

          // Mouse gentle repulsion / interactive float
          if (mouse.active) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 16000 && distSq > 1) {
              const force = (1 - distSq / 16000) * 0.8;
              node.x += (dx / Math.sqrt(distSq)) * force * 3;
              node.y += (dy / Math.sqrt(distSq)) * force * 3;
            }
          }
        }

        // Pulse phase
        node.pulsePhase += node.pulseSpeed;
        const pulseFactor = 1 + Math.sin(node.pulsePhase) * 0.3;

        // Draw Node Halo & Dot
        const isHub = node.type === 'hub';
        const nodeAlpha = isDark ? (isHub ? 0.85 : 0.45) : (isHub ? 0.6 : 0.3);
        const nodeColor = isHub 
          ? (isDark ? '#84CC16' : '#15803D')
          : (isDark ? '#10B981' : '#16A34A');

        // Glowing outer aura for hubs
        if (isHub) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, (node.radius + 3.5) * pulseFactor, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(132, 204, 22, 0.12)' : 'rgba(21, 128, 61, 0.08)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = nodeAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Highway Links (Vectors between nearby nodes)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnectDistanceSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxConnectDistance) * (isDark ? 0.22 : 0.14);

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = isDark 
              ? (n1.type === 'hub' || n2.type === 'hub' ? 'rgba(132, 204, 22, ' + alpha * 1.5 + ')' : 'rgba(16, 185, 129, ' + alpha + ')')
              : (n1.type === 'hub' || n2.type === 'hub' ? 'rgba(21, 128, 61, ' + alpha * 1.5 + ')' : 'rgba(22, 163, 74, ' + alpha + ')');
            ctx.lineWidth = n1.type === 'hub' && n2.type === 'hub' ? 1.2 : 0.75;
            ctx.stroke();

            // Occasionally spawn a telemetry pulse along this active vector
            if (pulses.length < maxPulses && Math.random() < 0.0015) {
              createPulse(n1, n2);
            }
          }
        }
      }

      // Update & Draw Telemetry Energy Pulses
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
        ctx.arc(px, py, isDark ? 2.5 : 2.0, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.globalAlpha = isDark ? 0.95 : 0.75;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
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

      {/* 2. Faint Isometric Highway Velocity Flow Grid */}
      <div className={styles.velocityFlowLines} />

      {/* 3. Interactive Highway Telemetry Vector Canvas */}
      <canvas ref={canvasRef} className={styles.corridorCanvas} />
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './InteractiveHighwayBackground.module.css';

/**
 * Cyber Expressway 3D Perspective Road & Neon Light Beams
 * Features:
 * - 3D forward-scrolling expressway perspective grid with vanishing point
 * - Interactive horizon tilt & parallax road steering responsive to mouse movement
 * - High-speed neon traffic light beams racing toward the camera
 * - Glowing horizon sun aura & interactive nitro particle bursts
 * - High performance 60fps hardware-accelerated canvas engine
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

    // Mouse coordinates for interactive parallax steering
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    // Expressway road parameters
    let roadOffset = 0;
    const roadSpeed = 2.2;

    // Traffic light beams racing along the highway
    let lightBeams = [];
    const BEAM_COUNT = 14;

    // Sky stars
    let stars = [];
    const STAR_COUNT = 55;

    const initElements = () => {
      // Initialize stars
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.45),
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.7 + 0.3,
          pulseSpeed: Math.random() * 0.04 + 0.01,
          pulse: Math.random() * Math.PI * 2
        });
      }

      // Initialize racing light beams
      lightBeams = [];
      const laneOffsets = [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75];
      for (let i = 0; i < BEAM_COUNT; i++) {
        lightBeams.push({
          lane: laneOffsets[Math.floor(Math.random() * laneOffsets.length)],
          z: Math.random() * 1000 + 50,
          speed: Math.random() * 8 + 6,
          length: Math.random() * 140 + 70,
          color: i % 3 === 0 ? '#F59E0B' : i % 3 === 1 ? '#38BDF8' : '#10B981',
          width: Math.random() * 3 + 2
        });
      }
    };

    initElements();

    // Render 3D Perspective Loop
    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      // Smooth mouse steering interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Vanishing point coordinates with mouse parallax steering
      const horizonY = height * 0.42;
      const mouseOffsetX = (mouse.x - width / 2) * 0.25;
      const vanishingX = width / 2 + mouseOffsetX;

      // 1. Draw Horizon Glow & Cyber Sky
      const horizonGradient = ctx.createRadialGradient(
        vanishingX, horizonY, 10,
        vanishingX, horizonY, width * 0.65
      );

      if (isDark) {
        horizonGradient.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
        horizonGradient.addColorStop(0.3, 'rgba(56, 189, 248, 0.06)');
        horizonGradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.02)');
        horizonGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        horizonGradient.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
        horizonGradient.addColorStop(0.4, 'rgba(56, 189, 248, 0.08)');
        horizonGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

      ctx.fillStyle = horizonGradient;
      ctx.beginPath();
      ctx.arc(vanishingX, horizonY, width * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render Sky Stars with Twinkle
      stars.forEach(star => {
        star.pulse += star.pulseSpeed;
        const currentAlpha = star.alpha + Math.sin(star.pulse) * 0.25;

        ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
        ctx.globalAlpha = Math.max(0.1, Math.min(0.9, currentAlpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 3. Render 3D Perspective Grid & Side Terrains
      const roadBottomWidth = width * 1.1;
      const roadTopWidth = 24;

      // Vertical Perspective Grid Lines
      const gridLines = 18;
      for (let i = -gridLines / 2; i <= gridLines / 2; i++) {
        const factor = i / (gridLines / 2);
        const topX = vanishingX + factor * (roadTopWidth / 2);
        const bottomX = width / 2 + factor * (roadBottomWidth / 2) + mouseOffsetX * 1.8;

        const isMainRoad = Math.abs(i) <= 4;
        const isRoadEdge = Math.abs(i) === 4;

        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, height);

        if (isRoadEdge) {
          ctx.strokeStyle = isDark ? '#F59E0B' : '#D97706';
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = 0.55;
        } else if (isMainRoad) {
          ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.25)';
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.35;
        } else {
          // Side landscape grid
          ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.12)';
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.2;
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Horizontal Perspective Grid Lines (Depth moving forward)
      roadOffset = (roadOffset + roadSpeed) % 40;
      const depthSteps = 24;

      for (let j = 1; j <= depthSteps; j++) {
        const p = Math.pow((j * 40 - roadOffset) / (depthSteps * 40), 2.2);
        if (p <= 0 || p > 1) continue;

        const lineY = horizonY + p * (height - horizonY);
        const currentWidth = roadTopWidth + p * (roadBottomWidth - roadTopWidth);
        const leftX = vanishingX + (width / 2 - vanishingX) * p - currentWidth / 2;
        const rightX = leftX + currentWidth;

        const lineAlpha = p * (isDark ? 0.4 : 0.25);
        ctx.strokeStyle = isDark ? `rgba(245, 158, 11, ${lineAlpha})` : `rgba(217, 119, 6, ${lineAlpha})`;
        ctx.lineWidth = 0.8 + p * 1.5;

        ctx.beginPath();
        ctx.moveTo(leftX, lineY);
        ctx.lineTo(rightX, lineY);
        ctx.stroke();
      }

      // 4. Render Racing Neon Light Beams (Highway Speed Traffic)
      lightBeams.forEach(beam => {
        beam.z -= beam.speed;
        if (beam.z < 10) {
          beam.z = 1000 + Math.random() * 200;
          beam.speed = Math.random() * 8 + 6;
        }

        // 3D Perspective Projection
        const pStart = Math.min(1, Math.max(0, 1 - beam.z / 1000));
        const pEnd = Math.min(1, Math.max(0, 1 - (beam.z + beam.length) / 1000));

        if (pStart > 0 && pEnd > 0) {
          const y1 = horizonY + Math.pow(pStart, 2.2) * (height - horizonY);
          const y2 = horizonY + Math.pow(pEnd, 2.2) * (height - horizonY);

          const w1 = roadTopWidth + Math.pow(pStart, 2.2) * (roadBottomWidth - roadTopWidth);
          const w2 = roadTopWidth + Math.pow(pEnd, 2.2) * (roadBottomWidth - roadTopWidth);

          const x1 = vanishingX + (width / 2 - vanishingX) * pStart + beam.lane * (w1 * 0.4);
          const x2 = vanishingX + (width / 2 - vanishingX) * pEnd + beam.lane * (w2 * 0.4);

          const beamGradient = ctx.createLinearGradient(x2, y2, x1, y1);
          beamGradient.addColorStop(0, 'rgba(0,0,0,0)');
          beamGradient.addColorStop(0.5, beam.color);
          beamGradient.addColorStop(1, '#FFFFFF');

          ctx.strokeStyle = beamGradient;
          ctx.lineWidth = beam.width * (0.8 + pStart * 2.5);
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x1, y1);
          ctx.stroke();

          // Front head sparkle
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x1, y1, Math.max(1.5, pStart * 3), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 5. Interactive Mouse Light Aura
      if (mouse.active) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 160
        );
        mouseGlow.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.14)');
        mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    render();

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
      <div className={styles.horizonVignette} />
    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Zap, 
  RotateCw, 
  Sun, 
  Moon, 
  Eye, 
  Activity, 
  Gauge, 
  Compass, 
  Sparkles,
  ShieldCheck,
  Radio,
  Sliders
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThreeDCarStage({ activeStageIndex = 0, onSelectView }) {
  const mountRef = useRef(null);
  const { isDark } = useTheme();

  // Interactive 3D vehicle states
  const [paintColor, setPaintColor] = useState('#84CC16'); // Cyber Amber default
  const [isHeadlightsOn, setIsHeadlightsOn] = useState(true);
  const [isHyperspeed, setIsHyperspeed] = useState(true);
  const [cameraAngle, setCameraAngle] = useState('perspective'); // 'perspective', 'side', 'front', 'top'

  // Refs for animation loop
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const carGroupRef = useRef(null);
  const wheelsRef = useRef([]);
  const particleSystemRef = useRef(null);
  const headlightsGroupRef = useRef(null);
  const underglowLightRef = useRef(null);
  const carBodyMeshRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.15, y: -0.6 });

  // Camera targets based on active narrative stage
  useEffect(() => {
    if (!carGroupRef.current) return;
    const stageRotations = [
      { y: -0.6, x: 0.15 },  // Stage 1: Front 3/4 dilemma
      { y: -0.2, x: 0.1 },   // Stage 2: Front face safety gate
      { y: -1.2, x: 0.2 },   // Stage 3: Dynamic side profile
      { y: -2.8, x: 0.15 },  // Stage 4: Rear taillight green emissions
      { y: -0.8, x: 0.3 },   // Stage 5: Hero 3/4 EV view
      { y: -0.4, x: 0.05 }   // Stage 6: Nationwide expressway speed
    ];

    const target = stageRotations[activeStageIndex % stageRotations.length] || stageRotations[0];
    targetRotationRef.current = target;
  }, [activeStageIndex]);

  // Update car paint material color in real time
  useEffect(() => {
    if (carBodyMeshRef.current) {
      carBodyMeshRef.current.material.color.set(paintColor);
    }
    if (underglowLightRef.current) {
      underglowLightRef.current.color.set(paintColor);
    }
  }, [paintColor]);

  // Update headlights visibility
  useEffect(() => {
    if (headlightsGroupRef.current) {
      headlightsGroupRef.current.visible = isHeadlightsOn;
    }
  }, [isHeadlightsOn]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 380;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.5);
    camera.lookAt(0, 0.4, 0);

    // 3. WebGL Renderer with High-DPI & Anti-aliasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting & Ambience
    const ambientLight = new THREE.AmbientLight(isDark ? 0xffffff : 0xf8fafc, isDark ? 1.4 : 2.0);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfff3d6, 3.2);
    mainKeyLight.position.set(5, 8, 4);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    cyanRimLight.position.set(-6, 4, -4);
    scene.add(cyanRimLight);

    const emeraldFillLight = new THREE.DirectionalLight(0x10b981, 1.8);
    emeraldFillLight.position.set(0, -2, -5);
    scene.add(emeraldFillLight);

    // 5. Build Procedural 3D Executive EV Model
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // Car Body Material (Metallic Car Paint Shader)
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintColor),
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95
    });

    // Dark Trim & Aerodynamic Skirt Material
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.3
    });

    // Glass Material (Panoramic Cockpit)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x050914,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.5,
      transparent: true,
      opacity: 0.88
    });

    // Glowing Headlight Material
    const headlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    // Glowing Taillight Material
    const taillightMaterial = new THREE.MeshBasicMaterial({
      color: 0xef4444
    });

    // Wheel Chrome & Rubber Materials
    const rubberMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.1
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.15
    });

    // A. Main Sculpted Lower Chassis
    const lowerBodyGeo = new THREE.BoxGeometry(1.6, 0.42, 3.4);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMaterial);
    lowerBody.position.y = 0.45;
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    carBodyMeshRef.current = lowerBody;
    carGroup.add(lowerBody);

    // B. Aerodynamic Front Hood Slope
    const hoodGeo = new THREE.BoxGeometry(1.54, 0.22, 1.1);
    const hood = new THREE.Mesh(hoodGeo, bodyMaterial);
    hood.position.set(0, 0.56, 1.05);
    hood.rotation.x = -0.12;
    hood.castShadow = true;
    carGroup.add(hood);

    // C. Cabin / Greenhouse Roof (Fastback Aerodynamics)
    const cabinGeo = new THREE.BoxGeometry(1.36, 0.5, 1.8);
    const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
    cabin.position.set(0, 0.85, -0.15);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // D. Roof Cap
    const roofCapGeo = new THREE.BoxGeometry(1.3, 0.06, 1.4);
    const roofCap = new THREE.Mesh(roofCapGeo, bodyMaterial);
    roofCap.position.set(0, 1.1, -0.2);
    carGroup.add(roofCap);

    // E. Aggressive Front Bumper & Diffuser
    const bumperGeo = new THREE.BoxGeometry(1.58, 0.28, 0.4);
    const bumper = new THREE.Mesh(bumperGeo, trimMaterial);
    bumper.position.set(0, 0.32, 1.7);
    carGroup.add(bumper);

    // F. Rear Aero Diffuser
    const rearDiffuserGeo = new THREE.BoxGeometry(1.56, 0.3, 0.4);
    const rearDiffuser = new THREE.Mesh(rearDiffuserGeo, trimMaterial);
    rearDiffuser.position.set(0, 0.35, -1.7);
    carGroup.add(rearDiffuser);

    // G. Matrix LED Headlights & Projector Beams
    const headlightsGroup = new THREE.Group();
    headlightsGroupRef.current = headlightsGroup;

    // Left & Right LED Strips
    const lightBarGeo = new THREE.BoxGeometry(0.42, 0.08, 0.08);
    const leftLight = new THREE.Mesh(lightBarGeo, headlightMaterial);
    leftLight.position.set(-0.52, 0.52, 1.71);
    headlightsGroup.add(leftLight);

    const rightLight = new THREE.Mesh(lightBarGeo, headlightMaterial);
    rightLight.position.set(0.52, 0.52, 1.71);
    headlightsGroup.add(rightLight);

    // Light Cones (Volumetric Light Beams)
    const beamGeo = new THREE.ConeGeometry(0.7, 3.8, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfff7ed,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });

    const leftBeam = new THREE.Mesh(beamGeo, beamMat);
    leftBeam.position.set(-0.52, 0.5, 3.4);
    leftBeam.rotation.x = Math.PI / 2;
    headlightsGroup.add(leftBeam);

    const rightBeam = new THREE.Mesh(beamGeo, beamMat);
    rightBeam.position.set(0.52, 0.5, 3.4);
    rightBeam.rotation.x = Math.PI / 2;
    headlightsGroup.add(rightBeam);

    carGroup.add(headlightsGroup);

    // H. Full-Width Rear Cyber Taillight Bar
    const rearLightBarGeo = new THREE.BoxGeometry(1.48, 0.08, 0.08);
    const rearLight = new THREE.Mesh(rearLightBarGeo, taillightMaterial);
    rearLight.position.set(0, 0.62, -1.71);
    carGroup.add(rearLight);

    // I. Neon Underglow PointLight
    const underglow = new THREE.PointLight(new THREE.Color(paintColor), 3.5, 4.0);
    underglow.position.set(0, 0.15, 0);
    underglowLightRef.current = underglow;
    carGroup.add(underglow);

    // J. 4 Dynamic Alloy Wheels with Rotating Spokes
    const wheelPositions = [
      { x: -0.84, y: 0.32, z: 1.05 },  // Front Left
      { x: 0.84, y: 0.32, z: 1.05 },   // Front Right
      { x: -0.84, y: 0.32, z: -1.05 }, // Rear Left
      { x: 0.84, y: 0.32, z: -1.05 }   // Rear Right
    ];

    const wheels = [];
    const tireGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 24);
    const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.23, 12);

    wheelPositions.forEach((pos, idx) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(tireGeo, rubberMaterial);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rim = new THREE.Mesh(rimGeo, rimMaterial);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      carGroup.add(wheelGroup);
      wheels.push(wheelGroup);
    });
    wheelsRef.current = wheels;

    // 6. Highway Grid & Hyperspeed Speed-Line Particle Tunnel
    const gridHelper = new THREE.GridHelper(24, 24, isDark ? 0xf59e0b : 0xd97706, isDark ? 0x1e293b : 0xe2e8f0);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Particle Speed Stream
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;      // X
      particlePositions[i + 1] = Math.random() * 3 + 0.1;     // Y
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;  // Z
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    // 7. Mouse Drag Controls (360° Orbit)
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(-0.2, Math.min(0.5, targetRotationRef.current.x + deltaY * 0.006));

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch Support for Mobile
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;

      targetRotationRef.current.y += deltaX * 0.01;
      targetRotationRef.current.x = Math.max(-0.2, Math.min(0.5, targetRotationRef.current.x + deltaY * 0.008));

      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // 8. Main 60 FPS Render Loop with Highway Speed Physics
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Damped smooth rotation toward target
      if (carGroupRef.current) {
        carGroupRef.current.rotation.y += (targetRotationRef.current.y - carGroupRef.current.rotation.y) * 0.08;
        carGroupRef.current.rotation.x += (targetRotationRef.current.x - carGroupRef.current.rotation.x) * 0.08;

        // Subtle vehicle suspension bounce on road
        carGroupRef.current.position.y = Math.sin(elapsed * 8) * 0.012;
      }

      // Rotate wheels at expressway speed
      if (wheelsRef.current.length > 0) {
        const wheelSpeed = isHyperspeed ? 16 : 8;
        wheelsRef.current.forEach((w) => {
          w.children.forEach(mesh => {
            mesh.rotation.x -= wheelSpeed * delta;
          });
        });
      }

      // Move particle speed stream towards camera
      if (particleSystemRef.current && isHyperspeed) {
        const positions = particleSystemRef.current.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] += 12 * delta;
          if (positions[i] > 10) {
            positions[i] = -10;
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Grid scrolling illusion
      gridHelper.position.z = (elapsed * 6) % 2;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth || 600;
      const newHeight = container.clientHeight || 380;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '420px',
      background: isDark 
        ? 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.9) 0%, rgba(9, 13, 22, 0.98) 100%)'
        : 'radial-gradient(ellipse at center, #FFFFFF 0%, #F1F5F9 100%)',
      borderRadius: '24px',
      overflow: 'hidden',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
      boxShadow: isDark ? '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 0 40px rgba(132, 204, 22, 0.1)' : '0 15px 35px -5px rgba(0,0,0,0.08)',
      marginBottom: '32px'
    }}>
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          cursor: 'grab',
          position: 'absolute',
          inset: 0
        }} 
      />

      {/* TOP LEFT: Cockpit Telemetry HUD Badge */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)',
          border: isDark ? '1px solid rgba(132, 204, 22, 0.35)' : '1px solid #84CC16',
          borderRadius: '12px',
          padding: '6px 12px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <span style={{ fontSize: '11px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '0.05em' }}>
            3D COCKPIT TELEMETRY • EV SEDAN
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: isDark ? '#94A3B8' : '#64748B',
          background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.85)',
          padding: '4px 10px',
          borderRadius: '8px',
          backdropFilter: 'blur(8px)',
          width: 'fit-content'
        }}>
          <Gauge size={12} color="#84CC16" />
          <span>Speed: <strong>118 km/h</strong></span>
          <span>•</span>
          <Zap size={12} color="#10B981" />
          <span>Battery: <strong>86% (420 km)</strong></span>
        </div>
      </div>

      {/* TOP RIGHT: Drag 360° Instructions */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
        borderRadius: '12px',
        padding: '6px 12px',
        backdropFilter: 'blur(12px)',
        fontSize: '11px',
        fontWeight: '800',
        color: isDark ? '#F1F5F9' : '#1E293B',
        pointerEvents: 'none'
      }}>
        <RotateCw size={13} color="#84CC16" />
        <span>Drag to Rotate 360° in 3D</span>
      </div>

      {/* BOTTOM CONTROLS BAR: Paint Switcher, Headlights & Speed Toggle */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        pointerEvents: 'auto'
      }}>
        {/* Color Palette Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
          padding: '6px 12px',
          borderRadius: '14px',
          backdropFilter: 'blur(16px)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B' }}>
            EV Paint:
          </span>
          {[
            { color: '#84CC16', label: 'Cyber Amber' },
            { color: '#10B981', label: 'Emerald Green' },
            { color: '#38BDF8', label: 'Electric Cyan' },
            { color: '#EC4899', label: 'Sunset Magenta' },
            { color: '#1E293B', label: 'Obsidian Black' }
          ].map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => setPaintColor(c.color)}
              title={c.label}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: c.color,
                border: paintColor === c.color ? '2.5px solid #FFFFFF' : '1px solid rgba(0,0,0,0.3)',
                boxShadow: paintColor === c.color ? `0 0 10px ${c.color}` : 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            />
          ))}
        </div>

        {/* Quick Toggles */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
          padding: '4px 8px',
          borderRadius: '14px',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Headlights Toggle */}
          <button
            type="button"
            onClick={() => setIsHeadlightsOn(!isHeadlightsOn)}
            style={{
              background: isHeadlightsOn ? 'rgba(132, 204, 22, 0.2)' : 'transparent',
              border: isHeadlightsOn ? '1px solid rgba(132, 204, 22, 0.4)' : 'none',
              color: isHeadlightsOn ? '#84CC16' : (isDark ? '#94A3B8' : '#64748B'),
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 120ms ease'
            }}
          >
            <Sun size={13} />
            <span>LED Beams</span>
          </button>

          {/* Hyperspeed Toggle */}
          <button
            type="button"
            onClick={() => setIsHyperspeed(!isHyperspeed)}
            style={{
              background: isHyperspeed ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              border: isHyperspeed ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
              color: isHyperspeed ? '#10B981' : (isDark ? '#94A3B8' : '#64748B'),
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 120ms ease'
            }}
          >
            <Activity size={13} />
            <span>120 km/h Flow</span>
          </button>
        </div>
      </div>
    </div>
  );
}

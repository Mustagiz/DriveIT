import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Zap, 
  RotateCw, 
  Sun, 
  Activity, 
  Gauge, 
  Sparkles,
  ShieldCheck,
  Radio,
  Sliders,
  Palette,
  Flag,
  Flame,
  Wind
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CinematicCarCanvas({ 
  scrollProgress = 0,
  activeStageIndex = 0,
  paintColor = '#F59E0B',
  onPaintColorChange,
  isHeadlightsOn = true,
  onToggleHeadlights,
  isHyperspeed = true,
  onToggleHyperspeed,
  className = '',
  style = {}
}) {
  const mountRef = useRef(null);
  const { isDark } = useTheme();

  // F1 Car Controls & Telemetry State
  const [isDRSOpen, setIsDRSOpen] = useState(true);
  const [tireCompound, setTireCompound] = useState('SOFT'); // SOFT (Red), MEDIUM (Yellow), HARD (White), INTER (Green)

  // Three.js & Animation Refs
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const f1CarGroupRef = useRef(null);
  const wheelsRef = useRef([]);
  const drsFlapRef = useRef(null);
  const rainLightRef = useRef(null);
  const sparkParticlesRef = useRef(null);
  const vortexTrailsRef = useRef(null);
  const haloMeshRef = useRef(null);
  const liveryMaterialsRef = useRef([]);
  const underglowLightRef = useRef(null);

  // Manual Drag Rotation State
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const manualOffsetRef = useRef({ x: 0, y: 0 });

  // Camera angles tuned specifically for sleek Formula 1 proportions
  const f1StageAngles = [
    { rotY: -0.65, rotX: 0.18, camY: 1.8, camZ: 5.6, drs: true, speed: 320 },  // 01. Front 3/4 Aero Stance
    { rotY: -0.15, rotX: 0.08, camY: 1.2, camZ: 4.8, drs: false, speed: 180 }, // 02. Front Wing & Halo Focus
    { rotY: -1.55, rotX: 0.15, camY: 1.6, camZ: 5.8, drs: true, speed: 345 },  // 03. Sidepod Telemetry & DRS Velocity
    { rotY: -0.85, rotX: 0.48, camY: 3.2, camZ: 4.5, drs: true, speed: 310 },  // 04. Top-Down Cockpit & Halo Ring
    { rotY: -2.85, rotX: 0.15, camY: 1.5, camZ: 5.4, drs: true, speed: 350 },  // 05. Rear Wing, Diffuser & Rain Light
    { rotY: -0.75, rotX: 0.22, camY: 2.2, camZ: 6.2, drs: true, speed: 330 }   // 06. Grand Prix Championship Orbit
  ];

  // Update Livery Paint Color in Real Time
  useEffect(() => {
    liveryMaterialsRef.current.forEach((mat) => {
      if (mat) mat.color.set(paintColor);
    });
    if (underglowLightRef.current) {
      underglowLightRef.current.color.set(paintColor);
    }
  }, [paintColor]);

  // DRS Flap Position
  useEffect(() => {
    if (drsFlapRef.current) {
      drsFlapRef.current.rotation.x = isDRSOpen ? -0.45 : 0;
    }
  }, [isDRSOpen]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup (Low, wide racing FOV)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.6);
    camera.lookAt(0, 0.35, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
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
    renderer.toneMappingExposure = 1.3;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Setup (Dramatic Race Track Studio)
    const ambientLight = new THREE.AmbientLight(isDark ? 0xffffff : 0xf8fafc, isDark ? 1.5 : 2.2);
    scene.add(ambientLight);

    const mainSpotlight = new THREE.SpotLight(0xfff7ed, 4.0, 30, Math.PI / 4, 0.4, 1.2);
    mainSpotlight.position.set(4, 8, 4);
    mainSpotlight.castShadow = true;
    mainSpotlight.shadow.mapSize.width = 1024;
    mainSpotlight.shadow.mapSize.height = 1024;
    scene.add(mainSpotlight);

    const cyanAeroLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    cyanAeroLight.position.set(-6, 3, -4);
    scene.add(cyanAeroLight);

    const goldHaloLight = new THREE.DirectionalLight(0xf59e0b, 2.2);
    goldHaloLight.position.set(0, 5, 0);
    scene.add(goldHaloLight);

    // 5. High-Fidelity Formula 1 Model Construction
    const f1Group = new THREE.Group();
    f1CarGroupRef.current = f1Group;
    scene.add(f1Group);

    // Materials
    liveryMaterialsRef.current = [];

    // Metallic Carbon Livery (Main Body)
    const liveryMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintColor),
      metalness: 0.88,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95
    });
    liveryMaterialsRef.current.push(liveryMat);

    // Exposed Carbon Fiber (Wings, Floor, Diffuser)
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.92,
      roughness: 0.35
    });

    // Titanium Halo & Suspension Wishbones
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.95,
      roughness: 0.15
    });

    // F1 Tire Rubber & Sidewall
    const tireRubberMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.88,
      metalness: 0.1
    });

    const wheelRimMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.98,
      roughness: 0.2
    });

    // Pirelli Sidewall Stripe Material
    const tireStripeColor = tireCompound === 'SOFT' ? 0xef4444 : (tireCompound === 'MEDIUM' ? 0xf59e0b : 0xf8fafc);
    const tireStripeMat = new THREE.MeshBasicMaterial({ color: tireStripeColor });

    // Glowing ERS / Rain Light
    const rainLightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // --- A. Central Monocoque & Aerodynamic Tapered Nose ---
    const noseGeo = new THREE.ConeGeometry(0.24, 2.1, 16);
    const nose = new THREE.Mesh(noseGeo, liveryMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0.26, 1.45);
    nose.scale.set(1.4, 1, 0.45);
    nose.castShadow = true;
    f1Group.add(nose);

    // Central Cockpit Tub
    const cockpitGeo = new THREE.BoxGeometry(0.72, 0.38, 1.8);
    const cockpit = new THREE.Mesh(cockpitGeo, liveryMat);
    cockpit.position.set(0, 0.32, 0.1);
    cockpit.castShadow = true;
    f1Group.add(cockpit);

    // Open Cockpit Cutout
    const driverCutoutGeo = new THREE.BoxGeometry(0.48, 0.2, 0.65);
    const driverCutout = new THREE.Mesh(driverCutoutGeo, carbonMat);
    driverCutout.position.set(0, 0.42, 0.15);
    f1Group.add(driverCutout);

    // --- B. Titanium Halo Safety Structure ---
    const haloGroup = new THREE.Group();
    haloMeshRef.current = haloGroup;

    const haloCenterStrutGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.35, 12);
    const haloCenterStrut = new THREE.Mesh(haloCenterStrutGeo, titaniumMat);
    haloCenterStrut.position.set(0, 0.52, 0.45);
    haloGroup.add(haloCenterStrut);

    const haloLoopGeo = new THREE.TorusGeometry(0.22, 0.025, 12, 24, Math.PI);
    const haloLoop = new THREE.Mesh(haloLoopGeo, titaniumMat);
    haloLoop.rotation.x = Math.PI / 2;
    haloLoop.position.set(0, 0.66, 0.22);
    haloGroup.add(haloLoop);

    f1Group.add(haloGroup);

    // Driver Racing Helmet
    const helmetGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const helmetMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 0.46, -0.05);
    f1Group.add(helmet);

    // --- C. Overhead Airbox & Engine Cover Shark Fin ---
    const airboxGeo = new THREE.BoxGeometry(0.38, 0.36, 1.2);
    const airbox = new THREE.Mesh(airboxGeo, liveryMat);
    airbox.position.set(0, 0.55, -0.5);
    f1Group.add(airbox);

    const sharkFinGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0.72, -0.3,   // Top front
      0, 0.72, -1.3,   // Top rear
      0, 0.4, -1.4,    // Bottom rear
      0, 0.4, -0.3     // Bottom front
    ]);
    const indices = [0, 1, 2, 0, 2, 3];
    sharkFinGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    sharkFinGeo.setIndex(indices);
    sharkFinGeo.computeVertexNormals();
    const sharkFin = new THREE.Mesh(sharkFinGeo, carbonMat);
    f1Group.add(sharkFin);

    // --- D. Undercut Aerodynamic Sidepods & Radiators ---
    const sidepodGeo = new THREE.BoxGeometry(0.42, 0.34, 1.4);
    const leftSidepod = new THREE.Mesh(sidepodGeo, liveryMat);
    leftSidepod.position.set(-0.54, 0.3, -0.2);
    leftSidepod.rotation.y = 0.08;
    f1Group.add(leftSidepod);

    const rightSidepod = new THREE.Mesh(sidepodGeo, liveryMat);
    rightSidepod.position.set(0.54, 0.3, -0.2);
    rightSidepod.rotation.y = -0.08;
    f1Group.add(rightSidepod);

    // Floor & Ground-Effect Venturi Tunnels
    const floorGeo = new THREE.BoxGeometry(1.68, 0.04, 3.2);
    const floor = new THREE.Mesh(floorGeo, carbonMat);
    floor.position.set(0, 0.12, 0);
    floor.receiveShadow = true;
    f1Group.add(floor);

    // --- E. Front Multi-Element Wing & Endplates ---
    const frontWingGroup = new THREE.Group();
    frontWingGroup.position.set(0, 0.14, 2.35);

    const mainPlaneGeo = new THREE.BoxGeometry(1.78, 0.03, 0.35);
    const mainPlane = new THREE.Mesh(mainPlaneGeo, carbonMat);
    frontWingGroup.add(mainPlane);

    // Upper Wing Flaps (Livery Accent)
    const upperFlapGeo = new THREE.BoxGeometry(1.68, 0.02, 0.18);
    const upperFlap = new THREE.Mesh(upperFlapGeo, liveryMat);
    upperFlap.position.set(0, 0.06, -0.06);
    upperFlap.rotation.x = -0.15;
    frontWingGroup.add(upperFlap);

    // Left & Right Front Endplates
    const endplateGeo = new THREE.BoxGeometry(0.03, 0.18, 0.42);
    const leftFrontEndplate = new THREE.Mesh(endplateGeo, liveryMat);
    leftFrontEndplate.position.set(-0.89, 0.08, 0);
    frontWingGroup.add(leftFrontEndplate);

    const rightFrontEndplate = new THREE.Mesh(endplateGeo, liveryMat);
    rightFrontEndplate.position.set(0.89, 0.08, 0);
    frontWingGroup.add(rightFrontEndplate);

    f1Group.add(frontWingGroup);

    // --- F. Rear High-Downforce Wing with Active DRS Flap ---
    const rearWingGroup = new THREE.Group();
    rearWingGroup.position.set(0, 0.72, -1.65);

    // Left & Right Rear Endplates
    const rearEndplateGeo = new THREE.BoxGeometry(0.04, 0.48, 0.38);
    const leftRearEndplate = new THREE.Mesh(rearEndplateGeo, liveryMat);
    leftRearEndplate.position.set(-0.64, 0, 0);
    rearWingGroup.add(leftRearEndplate);

    const rightRearEndplate = new THREE.Mesh(rearEndplateGeo, liveryMat);
    rightRearEndplate.position.set(0.64, 0, 0);
    rearWingGroup.add(rightRearEndplate);

    // Lower Main Plane
    const rearMainPlaneGeo = new THREE.BoxGeometry(1.24, 0.04, 0.28);
    const rearMainPlane = new THREE.Mesh(rearMainPlaneGeo, carbonMat);
    rearMainPlane.position.set(0, -0.1, 0);
    rearWingGroup.add(rearMainPlane);

    // Active DRS Flap (Rotates open)
    const drsFlapGeo = new THREE.BoxGeometry(1.24, 0.03, 0.22);
    const drsFlap = new THREE.Mesh(drsFlapGeo, liveryMat);
    drsFlap.position.set(0, 0.12, 0.02);
    drsFlapRef.current = drsFlap;
    rearWingGroup.add(drsFlap);

    // Rear Pylon Supports
    const pylonGeo = new THREE.BoxGeometry(0.03, 0.5, 0.12);
    const leftPylon = new THREE.Mesh(pylonGeo, carbonMat);
    leftPylon.position.set(-0.16, -0.22, 0);
    rearWingGroup.add(leftPylon);

    const rightPylon = new THREE.Mesh(pylonGeo, carbonMat);
    rightPylon.position.set(0.16, -0.22, 0);
    rearWingGroup.add(rightPylon);

    f1Group.add(rearWingGroup);

    // --- G. Rear Diffuser & Flashing FIA Rain Light ---
    const rainLightGeo = new THREE.BoxGeometry(0.12, 0.08, 0.06);
    const rainLight = new THREE.Mesh(rainLightGeo, rainLightMat);
    rainLight.position.set(0, 0.22, -1.72);
    rainLightRef.current = rainLight;
    f1Group.add(rainLight);

    // Neon Ground-Effect Underglow Light
    const underglow = new THREE.PointLight(new THREE.Color(paintColor), 4.2, 4.0);
    underglow.position.set(0, 0.15, 0);
    underglowLightRef.current = underglow;
    f1Group.add(underglow);

    // --- H. Open-Wheel Suspension Wishbones & 18" Low-Profile F1 Slicks ---
    const wheelPositions = [
      { x: -0.96, y: 0.28, z: 1.45, isFront: true },  // Front Left
      { x: 0.96, y: 0.28, z: 1.45, isFront: true },   // Front Right
      { x: -0.98, y: 0.32, z: -1.35, isFront: false },// Rear Left
      { x: 0.98, y: 0.32, z: -1.35, isFront: false }  // Rear Right
    ];

    const wheels = [];

    wheelPositions.forEach((pos) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(pos.x, pos.y, pos.z);

      const radius = pos.isFront ? 0.32 : 0.35;
      const widthTire = pos.isFront ? 0.28 : 0.36;

      // Tire Cylinder
      const tireGeo = new THREE.CylinderGeometry(radius, radius, widthTire, 28);
      const tire = new THREE.Mesh(tireGeo, tireRubberMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelAssembly.add(tire);

      // Colored Pirelli Compound Sidewall Ring
      const stripeGeo = new THREE.TorusGeometry(radius * 0.72, 0.015, 8, 24);
      const stripe = new THREE.Mesh(stripeGeo, tireStripeMat);
      stripe.position.set(pos.x > 0 ? widthTire / 2 + 0.002 : -widthTire / 2 - 0.002, 0, 0);
      stripe.rotation.y = Math.PI / 2;
      wheelAssembly.add(stripe);

      // Carbon Aero Wheel Cover Rim
      const rimGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, widthTire + 0.01, 16);
      const rim = new THREE.Mesh(rimGeo, wheelRimMat);
      rim.rotation.z = Math.PI / 2;
      wheelAssembly.add(rim);

      f1Group.add(wheelAssembly);
      wheels.push(wheelAssembly);

      // Suspension Wishbones
      const wishboneGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.58, 8);
      const upperWishbone = new THREE.Mesh(wishboneGeo, titaniumMat);
      upperWishbone.position.set(pos.x * 0.55, pos.y + 0.06, pos.z);
      upperWishbone.rotation.z = pos.x > 0 ? 1.25 : -1.25;
      f1Group.add(upperWishbone);

      const lowerWishbone = new THREE.Mesh(wishboneGeo, titaniumMat);
      lowerWishbone.position.set(pos.x * 0.55, pos.y - 0.06, pos.z);
      lowerWishbone.rotation.z = pos.x > 0 ? 1.4 : -1.4;
      f1Group.add(lowerWishbone);
    });
    wheelsRef.current = wheels;

    // --- I. Apex Skid Block Sparks Particle System ---
    const sparkCount = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount * 3; i += 3) {
      sparkPositions[i] = (Math.random() - 0.5) * 0.4;
      sparkPositions[i + 1] = Math.random() * 0.08 + 0.02;
      sparkPositions[i + 2] = -1.2 - Math.random() * 3.5;
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffb703,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    sparkParticlesRef.current = sparks;
    f1Group.add(sparks);

    // --- J. Aerodynamic Wind Tunnel Vortex Particles ---
    const vortexCount = 200;
    const vortexGeo = new THREE.BufferGeometry();
    const vortexPositions = new Float32Array(vortexCount * 3);

    for (let i = 0; i < vortexCount * 3; i += 3) {
      vortexPositions[i] = (Math.random() - 0.5) * 10;
      vortexPositions[i + 1] = Math.random() * 2.8 + 0.1;
      vortexPositions[i + 2] = (Math.random() - 0.5) * 20;
    }

    vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3));
    const vortexMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const vortexTrails = new THREE.Points(vortexGeo, vortexMat);
    vortexTrailsRef.current = vortexTrails;
    scene.add(vortexTrails);

    // --- K. Grand Prix Track Grid ---
    const trackGrid = new THREE.GridHelper(32, 32, isDark ? 0xf59e0b : 0xd97706, isDark ? 0x1e293b : 0xe2e8f0);
    trackGrid.position.y = 0;
    scene.add(trackGrid);

    // --- L. Mouse & Touch Drag Controls ---
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      manualOffsetRef.current.y += deltaX * 0.008;
      manualOffsetRef.current.x = Math.max(-0.25, Math.min(0.5, manualOffsetRef.current.x + deltaY * 0.006));

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch Support
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

      manualOffsetRef.current.y += deltaX * 0.01;
      manualOffsetRef.current.x = Math.max(-0.25, Math.min(0.5, manualOffsetRef.current.x + deltaY * 0.008));

      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // --- M. 60 FPS Racing Physics & Animation Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Current stage orientation + manual offset
      const stageIdx = activeStageIndex % f1StageAngles.length;
      const stageConfig = f1StageAngles[stageIdx] || f1StageAngles[0];

      const targetRotY = stageConfig.rotY + manualOffsetRef.current.y;
      const targetRotX = stageConfig.rotX + manualOffsetRef.current.x;

      if (f1CarGroupRef.current) {
        f1CarGroupRef.current.rotation.y += (targetRotY - f1CarGroupRef.current.rotation.y) * 0.08;
        f1CarGroupRef.current.rotation.x += (targetRotX - f1CarGroupRef.current.rotation.x) * 0.08;

        // F1 high-frequency track vibration & aero squat
        f1CarGroupRef.current.position.y = Math.sin(elapsed * 18) * 0.008;
      }

      // Smooth camera position interpolation
      if (cameraRef.current) {
        cameraRef.current.position.y += (stageConfig.camY - cameraRef.current.position.y) * 0.06;
        cameraRef.current.position.z += (stageConfig.camZ - cameraRef.current.position.z) * 0.06;
        cameraRef.current.lookAt(0, 0.35, 0);
      }

      // High-speed wheel rotation (340 km/h)
      if (wheelsRef.current.length > 0) {
        const wheelSpeed = isHyperspeed ? 34 : 14;
        wheelsRef.current.forEach((w) => {
          w.children.forEach((mesh) => {
            mesh.rotation.x -= wheelSpeed * delta;
          });
        });
      }

      // Pulsing FIA F1 Rain Light (4Hz Flash)
      if (rainLightRef.current) {
        const flash = Math.sin(elapsed * 24) > 0;
        rainLightRef.current.visible = flash;
      }

      // Titanium Skid Block Sparks Animation
      if (sparkParticlesRef.current && isHyperspeed) {
        const positions = sparkParticlesRef.current.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] -= 16 * delta;
          positions[i - 1] += (Math.random() - 0.4) * 0.08 * delta;
          if (positions[i] < -4.5) {
            positions[i] = -1.2;
            positions[i - 1] = Math.random() * 0.08 + 0.02;
          }
        }
        sparkParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Wind Tunnel Vortex Trails
      if (vortexTrailsRef.current && isHyperspeed) {
        const positions = vortexTrailsRef.current.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] += 18 * delta;
          if (positions[i] > 12) {
            positions[i] = -12;
          }
        }
        vortexTrailsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Track Grid Motion
      trackGrid.position.z = (elapsed * 12) % 2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 500;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
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
  }, [isDark, activeStageIndex, tireCompound]);

  return (
    <div 
      className={`cinematic-car-canvas-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '470px',
        background: isDark 
          ? 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.96) 0%, rgba(8, 11, 18, 0.99) 100%)'
          : 'radial-gradient(ellipse at center, #FFFFFF 0%, #F1F5F9 100%)',
        borderRadius: '28px',
        overflow: 'hidden',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1.5px solid #CBD5E1',
        boxShadow: isDark 
          ? '0 30px 60px -15px rgba(0,0,0,0.85), inset 0 0 50px rgba(245, 158, 11, 0.1)' 
          : '0 15px 40px -5px rgba(0,0,0,0.08)',
        ...style
      }}
    >
      {/* Three.js Canvas Mount */}
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

      {/* TOP LEFT: F1 Telemetry & DRS HUD */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.94)',
          border: isDark ? '1px solid rgba(245, 158, 11, 0.4)' : '1.5px solid #F59E0B',
          borderRadius: '14px',
          padding: '6px 14px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 12px #EF4444' }} />
          <span style={{ fontSize: '11px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '0.06em' }}>
            🏁 F1 GRAND PRIX AERODYNAMICS • STAGE 0{activeStageIndex + 1}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '11px',
          color: isDark ? '#CBD5E1' : '#475569',
          background: isDark ? 'rgba(15, 23, 42, 0.78)' : 'rgba(255, 255, 255, 0.9)',
          padding: '5px 12px',
          borderRadius: '10px',
          backdropFilter: 'blur(12px)',
          width: 'fit-content'
        }}>
          <Gauge size={13} color="#F59E0B" />
          <span>Velocity: <strong>{f1StageAngles[activeStageIndex % f1StageAngles.length].speed} km/h</strong></span>
          <span>•</span>
          <Wind size={13} color={isDRSOpen ? '#10B981' : '#EF4444'} />
          <span>DRS: <strong>{isDRSOpen ? 'ACTIVE (OPEN)' : 'CLOSED'}</strong></span>
          <span>•</span>
          <Flame size={13} color="#F59E0B" />
          <span>Sparks: <strong>Titanium Skid</strong></span>
        </div>
      </div>

      {/* TOP RIGHT: 360° Drag Hint */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
        borderRadius: '14px',
        padding: '6px 14px',
        backdropFilter: 'blur(16px)',
        fontSize: '11px',
        fontWeight: '800',
        color: isDark ? '#F1F5F9' : '#1E293B',
        pointerEvents: 'none'
      }}>
        <RotateCw size={13} color="#F59E0B" />
        <span>360° F1 Aero Orbit Controls</span>
      </div>

      {/* BOTTOM CONTROLS BAR: Livery Swatches, DRS Toggle & Hyperspeed */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        pointerEvents: 'auto'
      }}>
        {/* Championship Racing Livery Swatches */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.94)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
          padding: '6px 14px',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)'
        }}>
          <Palette size={13} color="#F59E0B" />
          <span style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B' }}>
            F1 Livery:
          </span>
          {[
            { color: '#F59E0B', label: 'Gold Championship' },
            { color: '#10B981', label: 'Emerald Racing' },
            { color: '#38BDF8', label: 'Electric Grand Prix' },
            { color: '#EF4444', label: 'Scuderia Crimson' },
            { color: '#1E293B', label: 'Stealth Carbon' }
          ].map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => onPaintColorChange ? onPaintColorChange(c.color) : null}
              title={c.label}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: c.color,
                border: paintColor === c.color ? '2.5px solid #FFFFFF' : '1px solid rgba(0,0,0,0.3)',
                boxShadow: paintColor === c.color ? `0 0 12px ${c.color}` : 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            />
          ))}
        </div>

        {/* F1 Interactive Racing Toggles */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.94)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
          padding: '4px 10px',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)'
        }}>
          {/* DRS Wing Toggle */}
          <button
            type="button"
            onClick={() => setIsDRSOpen(!isDRSOpen)}
            style={{
              background: isDRSOpen ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              border: isDRSOpen ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
              color: isDRSOpen ? '#10B981' : (isDark ? '#94A3B8' : '#64748B'),
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 120ms ease'
            }}
          >
            <Wind size={13} />
            <span>DRS {isDRSOpen ? 'ON' : 'OFF'}</span>
          </button>

          {/* Hyperspeed Aero Flow Toggle */}
          <button
            type="button"
            onClick={onToggleHyperspeed}
            style={{
              background: isHyperspeed ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              border: isHyperspeed ? '1px solid rgba(245, 158, 11, 0.4)' : 'none',
              color: isHyperspeed ? '#F59E0B' : (isDark ? '#94A3B8' : '#64748B'),
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 120ms ease'
            }}
          >
            <Activity size={13} />
            <span>340 km/h Vortex</span>
          </button>
        </div>
      </div>
    </div>
  );
}

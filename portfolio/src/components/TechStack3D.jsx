import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import '../styles/TechStack3D.css'

gsap.registerPlugin(ScrollTrigger);

const techs = [
  { name: 'HTML5',      color: '#e34f26', short: 'HT', category: 'Frontend' },
  { name: 'CSS3',       color: '#1572b6', short: 'CS', category: 'Frontend' },
  { name: 'JavaScript', color: '#f7df1e', short: 'JS', category: 'Frontend' },
  { name: 'React.js',   color: '#61dafb', short: 'Re', category: 'Frontend' },
  { name: 'Node.js',    color: '#339933', short: 'No', category: 'Backend'  },
  { name: 'Express.js', color: '#ffffff', short: 'Ex', category: 'Backend'  },
  { name: 'MongoDB',    color: '#47a248', short: 'Mo', category: 'Database' },
  { name: 'SQL',        color: '#4479a1', short: 'SQ', category: 'Database' },
  { name: 'Git',        color: '#f05032', short: 'Gi', category: 'Tools'    },
  { name: 'GitHub',     color: '#b44fff', short: 'GH', category: 'Tools'    },
  { name: 'Vercel',     color: '#ffffff', short: 'Ve', category: 'Deployment' },
  { name: 'Render',     color: '#46e3b7', short: 'Rn', category: 'Deployment' },
  { name: 'Postman',    color: '#ff6c37', short: 'Pm', category: 'Tools'    },
  { name: 'REST API',   color: '#009688', short: 'RA', category: 'Backend'  },
];

/* ── Logo draw functions — bold, high-contrast, fully opaque ── */
const LOGO_SVGS = {
  'HTML5': {
    bg: '#e34f26',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Solid white shield
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(cx * 0.45, s * 0.06);
      ctx.lineTo(cx * 1.55, s * 0.06);
      ctx.lineTo(cx * 1.45, s * 1.82);
      ctx.lineTo(cx,        s * 1.94);
      ctx.lineTo(cx * 0.55, s * 1.82);
      ctx.closePath();
      ctx.fill();
      // Orange inner fill
      ctx.fillStyle = '#e34f26';
      ctx.beginPath();
      ctx.moveTo(cx * 0.58, s * 0.18);
      ctx.lineTo(cx * 1.42, s * 0.18);
      ctx.lineTo(cx * 1.34, s * 1.72);
      ctx.lineTo(cx,        s * 1.82);
      ctx.lineTo(cx * 0.66, s * 1.72);
      ctx.closePath();
      ctx.fill();
      // Bold "HTML" label
      ctx.fillStyle = '#fff';
      ctx.font = `900 ${s * 0.27}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HTML', cx, s * 0.35);
      // Giant "5"
      ctx.font = `900 ${s * 0.54}px Arial Black, Arial`;
      ctx.fillText('5', cx, s * 0.68);
    },
  },

  'CSS3': {
    bg: '#264de4',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Solid white shield
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(cx * 0.45, s * 0.06);
      ctx.lineTo(cx * 1.55, s * 0.06);
      ctx.lineTo(cx * 1.45, s * 1.82);
      ctx.lineTo(cx,        s * 1.94);
      ctx.lineTo(cx * 0.55, s * 1.82);
      ctx.closePath();
      ctx.fill();
      // Blue inner fill
      ctx.fillStyle = '#264de4';
      ctx.beginPath();
      ctx.moveTo(cx * 0.58, s * 0.18);
      ctx.lineTo(cx * 1.42, s * 0.18);
      ctx.lineTo(cx * 1.34, s * 1.72);
      ctx.lineTo(cx,        s * 1.82);
      ctx.lineTo(cx * 0.66, s * 1.72);
      ctx.closePath();
      ctx.fill();
      // Bold "CSS" label
      ctx.fillStyle = '#fff';
      ctx.font = `900 ${s * 0.27}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CSS', cx, s * 0.35);
      // Giant "3"
      ctx.font = `900 ${s * 0.54}px Arial Black, Arial`;
      ctx.fillText('3', cx, s * 0.68);
    },
  },

  'JavaScript': {
    bg: '#f7df1e',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Black border inset
      ctx.strokeStyle = '#000';
      ctx.lineWidth = s * 0.04;
      ctx.strokeRect(s * 0.06, s * 0.06, s * 0.88, s * 0.88);
      // Giant bold "JS"
      ctx.fillStyle = '#000';
      ctx.font = `900 ${s * 0.56}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('JS', cx, cx * 1.02);
      // Bottom label
      ctx.font = `bold ${s * 0.14}px Arial`;
      ctx.fillText('JavaScript', cx, s * 0.89);
    },
  },

  'React.js': {
    bg: '#20232a',
    draw: (ctx, s) => {
      const cx = s / 2, cy = s / 2;
      // Three thick cyan orbits
      ctx.strokeStyle = '#61dafb';
      ctx.lineWidth = s * 0.048;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.42, s * 0.17, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // Big bright nucleus dot
      ctx.fillStyle = '#61dafb';
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.09, 0, Math.PI * 2);
      ctx.fill();
      // Label
      ctx.font = `bold ${s * 0.13}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('React', cx, s * 0.88);
    },
  },

  'Node.js': {
    bg: '#1a1a1a',
    draw: (ctx, s) => {
      const cx = s / 2, cy = s * 0.48;
      // Bright green hexagon
      ctx.fillStyle = '#3c873a';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 6;
        const r = s * 0.43;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      // Hex border
      ctx.strokeStyle = '#8cc84b';
      ctx.lineWidth = s * 0.03;
      ctx.stroke();
      // Bold "NODE" text
      ctx.fillStyle = '#fff';
      ctx.font = `900 ${s * 0.22}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('NODE', cx, cy - s * 0.06);
      // Bright green ".JS"
      ctx.fillStyle = '#8cc84b';
      ctx.font = `900 ${s * 0.19}px Arial Black, Arial`;
      ctx.fillText('.JS', cx, cy + s * 0.15);
    },
  },

  'Express.js': {
    bg: '#000',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Bright white wordmark
      ctx.fillStyle = '#fff';
      ctx.font = `900 ${s * 0.28}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('express', cx, s * 0.38);
      // Thick underline
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = s * 0.042;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s * 0.1, s * 0.53);
      ctx.lineTo(s * 0.9, s * 0.53);
      ctx.stroke();
      // Grey subtitle
      ctx.fillStyle = '#aaa';
      ctx.font = `bold ${s * 0.135}px Arial`;
      ctx.fillText('Node.js framework', cx, s * 0.7);
      // Version pill
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.roundRect(cx - s * 0.18, s * 0.79, s * 0.36, s * 0.14, s * 0.04);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${s * 0.12}px Arial`;
      ctx.fillText('v4.x', cx, s * 0.87);
    },
  },

  'MongoDB': {
    bg: '#001e2b',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Big bright leaf
      ctx.fillStyle = '#00ed64';
      ctx.beginPath();
      ctx.moveTo(cx, s * 0.06);
      ctx.bezierCurveTo(cx + s * 0.33, s * 0.17, cx + s * 0.37, s * 0.6, cx, s * 0.84);
      ctx.bezierCurveTo(cx - s * 0.37, s * 0.6, cx - s * 0.33, s * 0.17, cx, s * 0.06);
      ctx.closePath();
      ctx.fill();
      // Thick bright stem
      ctx.strokeStyle = '#00ed64';
      ctx.lineWidth = s * 0.055;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, s * 0.84);
      ctx.lineTo(cx, s * 0.96);
      ctx.stroke();
      // Bold white highlight stripe
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = s * 0.04;
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.06, s * 0.14);
      ctx.bezierCurveTo(cx + s * 0.12, s * 0.32, cx + s * 0.12, s * 0.54, cx + s * 0.05, s * 0.73);
      ctx.stroke();
    },
  },

  'SQL': {
    bg: '#00618a',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Big bold SQL label
      ctx.fillStyle = '#fff';
      ctx.font = `900 ${s * 0.4}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SQL', cx, s * 0.33);
      // Cylinder — thick white strokes
      const dw = s * 0.38, dh = s * 0.11, dy = s * 0.58;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = s * 0.042;
      ctx.beginPath();
      ctx.ellipse(cx, dy, dw / 2, dh / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - dw / 2, dy);
      ctx.lineTo(cx - dw / 2, dy + dh * 1.6);
      ctx.moveTo(cx + dw / 2, dy);
      ctx.lineTo(cx + dw / 2, dy + dh * 1.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, dy + dh * 1.6, dw / 2, dh / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, dy + dh * 0.8, dw / 2, dh / 2, 0, 0, Math.PI);
      ctx.stroke();
    },
  },

  'Git': {
    bg: '#f05032',
    draw: (ctx, s) => {
      const cx = s / 2, cy = s / 2;
      // White rotated diamond
      ctx.fillStyle = '#fff';
      ctx.save();
      ctx.translate(cx, cy - s * 0.08);
      ctx.rotate(Math.PI / 4);
      const d = s * 0.36;
      ctx.beginPath();
      ctx.roundRect(-d / 2, -d / 2, d, d, s * 0.06);
      ctx.fill();
      ctx.restore();
      // Red "git" text over diamond
      ctx.fillStyle = '#f05032';
      ctx.font = `900 ${s * 0.23}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('git', cx, cy - s * 0.08);
      // Branch lines
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = s * 0.042;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.22);
      ctx.lineTo(cx, cy + s * 0.44);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.28);
      ctx.bezierCurveTo(cx, cy + s * 0.17, cx + s * 0.24, cy + s * 0.17, cx + s * 0.24, cy + s * 0.28);
      ctx.stroke();
      // Commit dots
      [[cx, cy + s * 0.44], [cx + s * 0.24, cy + s * 0.28]].forEach(([x, y]) => {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, s * 0.058, 0, Math.PI * 2);
        ctx.fill();
      });
    },
  },

  'GitHub': {
    bg: '#0d1117',
    draw: (ctx, s) => {
      const cx = s / 2, cy = s * 0.43;
      const r = s * 0.39;
      // Big white head circle
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      // Dark eye sockets
      ctx.fillStyle = '#0d1117';
      ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.15, r * 0.17, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + r * 0.3, cy - r * 0.15, r * 0.17, 0, Math.PI * 2); ctx.fill();
      // White pupils
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx - r * 0.28, cy - r * 0.19, r * 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + r * 0.28, cy - r * 0.19, r * 0.08, 0, Math.PI * 2); ctx.fill();
      // Ear notches
      ctx.fillStyle = '#0d1117';
      ctx.beginPath(); ctx.arc(cx - r * 0.64, cy - r * 0.73, r * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + r * 0.64, cy - r * 0.73, r * 0.22, 0, Math.PI * 2); ctx.fill();
      // Nose
      ctx.beginPath(); ctx.arc(cx, cy + r * 0.14, r * 0.1, 0, Math.PI * 2); ctx.fill();
      // Tentacle body
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy + r * 0.84, r * 0.48, 0, Math.PI * 2);
      ctx.fill();
      // Tentacle gap dividers
      ctx.fillStyle = '#0d1117';
      [[-0.33, 0.84], [0.33, 0.84]].forEach(([ox, oy]) => {
        ctx.beginPath();
        ctx.arc(cx + ox * r, cy + oy * r, r * 0.13, 0, Math.PI * 2);
        ctx.fill();
      });
    },
  },

  /* ── NEW: Vercel ── */
  'Vercel': {
    bg: '#000000',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Classic Vercel triangle logo
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx, s * 0.12);
      ctx.lineTo(s * 0.88, s * 0.78);
      ctx.lineTo(s * 0.12, s * 0.78);
      ctx.closePath();
      ctx.fill();
      // "VERCEL" wordmark below
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${s * 0.19}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VERCEL', cx, s * 0.9);
    },
  },

  /* ── NEW: Render ── */
  'Render': {
    bg: '#0a0a0a',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Render's teal/green hexagonal-ish R mark
      // Draw stylized "R" shape using Render's brand color
      ctx.fillStyle = '#46e3b7';

      // Outer rounded square as badge
      ctx.beginPath();
      ctx.roundRect(s * 0.14, s * 0.1, s * 0.72, s * 0.72, s * 0.14);
      ctx.fill();

      // Dark "R" letter cut into the badge
      ctx.fillStyle = '#0a0a0a';
      ctx.font = `900 ${s * 0.52}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', cx, s * 0.47);

      // "RENDER" wordmark
      ctx.fillStyle = '#46e3b7';
      ctx.font = `800 ${s * 0.16}px Arial Black, Arial`;
      ctx.fillText('RENDER', cx, s * 0.9);
    },
  },

  /* ── NEW: Postman ── */
  'Postman': {
    bg: '#ff6c37',
    draw: (ctx, s) => {
      const cx = s / 2, cy = s * 0.42;
      // White circle background for astronaut icon area
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.34, 0, Math.PI * 2);
      ctx.fill();

      // Postman's iconic paper plane / send arrow icon
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      // Arrow / paper plane pointing top-right
      ctx.moveTo(cx - s * 0.22, cy + s * 0.2);
      ctx.lineTo(cx + s * 0.26, cy - s * 0.22);
      ctx.lineTo(cx + s * 0.12, cy + s * 0.06);
      ctx.lineTo(cx + s * 0.26, cy - s * 0.22);
      ctx.lineTo(cx - s * 0.02, cy - s * 0.04);
      ctx.lineTo(cx - s * 0.22, cy + s * 0.2);
      ctx.fill();

      // Tail of the arrow
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = s * 0.048;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.12, cy + s * 0.06);
      ctx.lineTo(cx - s * 0.1, cy + s * 0.22);
      ctx.stroke();

      // "POSTMAN" wordmark
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${s * 0.16}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('POSTMAN', cx, s * 0.87);
    },
  },

  /* ── NEW: REST API ── */
  'REST API': {
    bg: '#004d40',
    draw: (ctx, s) => {
      const cx = s / 2;
      // Teal accent bar at top
      ctx.fillStyle = '#26a69a';
      ctx.fillRect(0, 0, s, s * 0.08);

      // "REST" big label
      ctx.fillStyle = '#80cbc4';
      ctx.font = `900 ${s * 0.22}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('REST', cx, s * 0.25);

      // Horizontal divider line
      ctx.strokeStyle = '#26a69a';
      ctx.lineWidth = s * 0.03;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s * 0.15, s * 0.37);
      ctx.lineTo(s * 0.85, s * 0.37);
      ctx.stroke();

      // Method badges: GET, POST, PUT, DEL
      const methods = [
        { label: 'GET',  color: '#66bb6a', x: cx - s * 0.27, y: s * 0.5  },
        { label: 'POST', color: '#ffa726', x: cx + s * 0.27, y: s * 0.5  },
        { label: 'PUT',  color: '#42a5f5', x: cx - s * 0.27, y: s * 0.68 },
        { label: 'DEL',  color: '#ef5350', x: cx + s * 0.27, y: s * 0.68 },
      ];
      methods.forEach(({ label, color, x, y }) => {
        // Pill bg
        ctx.fillStyle = color + '33';
        ctx.beginPath();
        ctx.roundRect(x - s * 0.2, y - s * 0.075, s * 0.4, s * 0.15, s * 0.04);
        ctx.fill();
        // Pill border
        ctx.strokeStyle = color;
        ctx.lineWidth = s * 0.025;
        ctx.stroke();
        // Label
        ctx.fillStyle = color;
        ctx.font = `800 ${s * 0.13}px Arial Black, Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y);
      });

      // "API" at bottom
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${s * 0.18}px Arial Black, Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('API', cx, s * 0.89);
    },
  },
};

/* Generate a canvas texture — 512px for crispness */
function makeLogoTexture(techName, color) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const logoData = LOGO_SVGS[techName];
  // Solid full background
  ctx.fillStyle = logoData ? logoData.bg : color;
  ctx.fillRect(0, 0, size, size);

  // Subtle dark inset for depth
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.roundRect(size * 0.04, size * 0.04, size * 0.92, size * 0.92, size * 0.1);
  ctx.fill();

  // Draw logo at full brightness
  if (logoData && logoData.draw) {
    logoData.draw(ctx, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* 3D Floating Cube with logo texture on all 6 faces */
function TechCube({ position, color, techName, isActive, onClick }) {
  const meshRef = useRef();
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const logoTexture = useMemo(() => makeLogoTexture(techName, color), [techName, color]);

  const materials = useMemo(() =>
    Array(6).fill(null).map(() => new THREE.MeshStandardMaterial({
      map: logoTexture,
      emissive: baseColor,
      emissiveIntensity: 0.1,
      roughness: 0.2,
      metalness: 0.25,
      transparent: false,
    })),
  [logoTexture, baseColor]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y += isActive ? 0.025 : 0.006;
    meshRef.current.rotation.x = Math.sin(t * 0.3 + position[0]) * 0.1;

    const targetScale = isActive ? 1.25 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    materials.forEach((mat) => {
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        isActive ? 0.55 : 0.1,
        0.1
      );
    });
  });

  return (
    <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0.1} position={position}>
      <group onClick={onClick}>
        <mesh ref={meshRef} castShadow material={materials}>
          <boxGeometry args={[0.85, 0.85, 0.85]} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.87, 0.87, 0.87]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={isActive ? 0.6 : 0.15}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* Orbit ring decoration */
function OrbitRing() {
  const ringRef = useRef();
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3.8, 0.01, 16, 200]} />
      <meshBasicMaterial color="#b44fff" transparent opacity={0.25} />
    </mesh>
  );
}

/* 3D Scene — now 14 cubes in 5-5-4 layout */
function Scene({ activeIndex, setActiveIndex }) {
  const cols = 5;
  const spacing = 2.0;

  return (
    <>
      {/* Raised ambient light so textures are always bright */}
      <ambientLight intensity={1.4} />
      <pointLight position={[5, 5, 5]}   color="#b44fff" intensity={1.2} />
      <pointLight position={[-5, -5, 5]} color="#00d4ff" intensity={0.8} />
      <OrbitRing />
      {techs.map((tech, i) => {
        const totalRows = Math.ceil(techs.length / cols);
        const row = Math.floor(i / cols);
        const itemsInRow = row === totalRows - 1 ? techs.length - row * cols : cols;
        const col = i % cols;
        // Center the last (partial) row
        const rowOffset = (cols - itemsInRow) / 2;
        const x = (col + rowOffset - (cols - 1) / 2) * spacing;
        const y = -(row * spacing) + spacing / 2;
        return (
          <TechCube
            key={tech.name}
            position={[x, y, 0]}
            color={tech.color}
            techName={tech.name}
            isActive={activeIndex === i}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          />
        );
      })}
    </>
  );
}

export default function TechStack3D() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tech__label, .tech__heading, .tech__desc',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        '.tech__canvas-wrapper',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const active = activeIndex !== null ? techs[activeIndex] : null;

  return (
    <section className="tech" id="stack" ref={sectionRef} aria-label="Tech stack section">
      <div className="tech__bg" aria-hidden="true" />

      <div className="tech__header">
        <p className="section-label tech__label">Arsenal</p>
        <h2 className="tech__heading">
          Tech <span className="tech__heading-accent">Stack</span>
        </h2>
      </div>

      <div
        className={`tech__info-panel ${active ? 'tech__info-panel--visible' : ''}`}
        aria-live="polite"
      >
        {active && (
          <>
            <span className="tech__info-cat" style={{ color: active.color }}>{active.category}</span>
            <span className="tech__info-name" style={{ textShadow: `0 0 20px ${active.color}` }}>
              {active.name}
            </span>
          </>
        )}
        {!active && <span className="tech__info-hint">Click any cube to learn more</span>}
      </div>

      <div className="tech__canvas-wrapper" aria-hidden="true" style={{ opacity: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 9], fov: 58 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
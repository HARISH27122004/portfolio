import { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars, Float, Torus } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import '../styles/Hero.css';

/* ── 3D Scene ─────────────────────────────────────── */
function HolographicOrb() {
  const meshRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.4;
      ringRef.current.rotation.z = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.3;
      ring2Ref.current.rotation.z = -t * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group>
        {/* Core orb */}
        <Sphere ref={meshRef} args={[1.4, 64, 64]}>
          <MeshDistortMaterial
            color="#4a00ff"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.8}
            emissive="#2200aa"
            emissiveIntensity={0.3}
          />
        </Sphere>

        {/* Outer glow shell */}
        <Sphere args={[1.55, 32, 32]}>
          <meshBasicMaterial
            color="#b44fff"
            transparent
            opacity={0.06}
            wireframe
          />
        </Sphere>

        {/* Orbit ring 1 */}
        <Torus ref={ringRef} args={[2.2, 0.015, 16, 120]}>
          <meshBasicMaterial color="#00d4ff" />
        </Torus>

        {/* Orbit ring 2 */}
        <Torus ref={ring2Ref} args={[1.85, 0.01, 16, 100]}>
          <meshBasicMaterial color="#b44fff" />
        </Torus>

        {/* Equator ring */}
        <Torus args={[1.55, 0.008, 16, 80]}>
          <meshBasicMaterial color="#00ff9f" transparent opacity={0.6} />
        </Torus>
      </group>
    </Float>
  );
}

function ParticleField() {
  const pointsRef = useRef();
  const count = 1800;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = 6 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const t = Math.random();
    colors[i * 3] = t < 0.5 ? 0.7 : 0;
    colors[i * 3 + 1] = t < 0.5 ? 0 : 0.83;
    colors[i * 3 + 2] = 1;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function MouseParallax() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.05;
    target.current.y += (mouse.current.y - target.current.y) * 0.05;
    camera.position.x = target.current.x * 1.5;
    camera.position.y = target.current.y * 1.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Hero Component ───────────────────────────────── */
export default function Hero() {
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const roleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(headingRef.current,
      { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.out' }
    )
    .fromTo(subRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4'
    )
    .fromTo(roleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.2'
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }, '-=0.1'
    );

    // Scroll indicator loop
    gsap.to('.hero__scroll-dot', {
      y: 12,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: 'sine.inOut',
      delay: 3.5
    });
  }, []);

  const scrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" ref={containerRef} aria-label="Hero section">
      {/* Three.js Canvas */}
      <div className="hero__canvas-wrapper" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} color="#b44fff" intensity={2} />
            <pointLight position={[-5, -3, -5]} color="#00d4ff" intensity={1.5} />
            <pointLight position={[0, 0, 3]} color="#ffffff" intensity={0.5} />
            <Stars radius={80} depth={60} count={3000} factor={3} saturation={0.8} fade speed={0.5} />
            <ParticleField />
            <HolographicOrb />
            <MouseParallax />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient vignette */}
      <div className="hero__vignette" aria-hidden="true" />

      {/* Scanline overlay */}
      <div className="hero__scanlines" aria-hidden="true" />

      {/* Content */}
      <div className="hero__content">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-line" />
          <span className="hero__eyebrow-text">Portfolio</span>
          <span className="hero__eyebrow-line" />
        </div>

        <h1 className="hero__heading" ref={headingRef}>
          <span className="hero__name-first">Harish</span>
        </h1>

        <p className="hero__sub" ref={subRef}>
          <span className="hero__tag">&lt;</span>
          <span className="hero__role" ref={roleRef}>Full Stack Developer</span>
          <span className="hero__tag"> /&gt;</span>
        </p>

        <p className="hero__desc" ref={subRef}>
          Crafting immersive digital experiences at the intersection of
          <span className="hero__accent"> design</span> &amp;
          <span className="hero__accent"> engineering</span>.
        </p>

        <div className="hero__cta-group" ref={ctaRef}>
          <button
            className="hero__btn hero__btn--primary"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            data-hover
          >
            <span className="hero__btn-bg" />
            <span className="hero__btn-text">View Projects</span>
            <span className="hero__btn-icon">→</span>
          </button>
          <button
            className="hero__btn hero__btn--ghost"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            data-hover
          >
            Get In Touch
          </button>
        </div>

        {/* Status */}
        <div className="hero__status">
          <span className="hero__status-dot" />
          Available for opportunities
        </div>
      </div>

      {/* Scroll indicator */}
      <button className="hero__scroll" ref={scrollRef} onClick={scrollDown} aria-label="Scroll down" data-hover>
        <div className="hero__scroll-track">
          <div className="hero__scroll-dot" />
        </div>
        <span className="hero__scroll-label">Scroll</span>
      </button>
    </section>
  );
}
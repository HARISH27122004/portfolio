import { useState } from 'react';
import Hero from './components/Hero';
import ScrollFilm from './components/ScrollFilm';
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import About from './components/About'
import TechStack3D from './components/TechStack3D'
import Projects from './components/Projects'
import Footer from './components/Footer';
import './styles/Globals.css'
import './styles/Intro.css';


// Vite: eagerly import all frame images from src/images/
const frameModules = import.meta.glob('./images/ezgif-frame-*.jpg', { eager: true });
const frames = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key].default);

// ── Stages: 'intro' → 'film' → 'hero' ────────────────────────────────────────
const App = () => {
  const [stage, setStage] = useState('intro');

  return (
    <>
            <Cursor />
      {/* ── Stage 1: Intro button screen ── */}
      {stage === 'intro' && (
        <div className="intro-screen">

          {/* decorative background rings */}
          <div className="intro-ring intro-ring--1" />
          <div className="intro-ring intro-ring--2" />
          <div className="intro-ring intro-ring--3" />

          <div className="intro-content">
            <p className="intro-label">EXPERIENCE</p>
            <h1 className="intro-title">Step Into<br />A New World</h1>
            <p className="intro-sub">
              An immersive scroll journey awaits.<br />
              Press the button when you're ready.
            </p>
            <button
              className="intro-btn"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                setStage('film');
              }}
            >
              <span className="intro-btn-icon">▶</span>
              Begin Experience
            </button>
          </div>
        </div>
      )}

      {/* ── Stage 2: Scroll film ── */}
      {stage === 'film' && (
        <ScrollFilm
          images={frames}
          onComplete={() => {
            setStage('hero');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
      )}

      {/* ── Stage 3: Hero section ── */}
      {stage === 'hero' && (<>
        <div className="grid-bg" />
        <Nav />
        <main>
          <Hero />
          <About />
          <TechStack3D />
          <Projects />
        </main>
        <Footer/>
      </>)}
    </>
  );
};

export default App;
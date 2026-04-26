import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/About.css';
import resume from '../pdf/HarishFullStackWebDeveloper.pdf';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { num: '10+', label: 'Projects Built' },
  { num: '8+', label: 'Technologies Learned' },
  { num: '100+', label: 'Github Commits' },
  { num: '100%', label: 'Passion for Code' },
];

const codeLines = [
  {
    tokens: [
      { text: 'const ', color: 'keyword' },
      { text: 'harish', color: 'var' },
      { text: ' = {', color: 'plain' },
    ],
  },
  {
    tokens: [
      { text: '  role', color: 'prop' },
      { text: ': ', color: 'plain' },
      { text: '"Full Stack Developer"', color: 'string' },
      { text: ',', color: 'plain' },
    ],
  },
  {
    tokens: [
      { text: '  passion', color: 'prop' },
      { text: ': ', color: 'plain' },
      { text: '"Building Cool Stuff"', color: 'string' },
      { text: ',', color: 'plain' },
    ],
  },
  {
    tokens: [
      { text: '  stack', color: 'prop' },
      { text: ': [', color: 'plain' },
    ],
  },
  {
    tokens: [
      { text: '    ', color: 'plain' },
      { text: '"React"', color: 'string' },
      { text: ', ', color: 'plain' },
      { text: '"Node.js"', color: 'string' },
      { text: ',', color: 'plain' },
    ],
  },
  {
    tokens: [
      { text: '    ', color: 'plain' },
      { text: '"MongoDB"', color: 'string' },
      { text: ', ', color: 'plain' },
      { text: '"Express"', color: 'string' },
    ],
  },
  {
    tokens: [{ text: '  ],', color: 'plain' }],
  },
  {
    tokens: [
      { text: '  status', color: 'prop' },
      { text: ': ', color: 'plain' },
      { text: '"open_to_work"', color: 'green' },
      { text: ',', color: 'plain' },
    ],
  },
  {
    tokens: [
      { text: '  learning', color: 'prop' },
      { text: ': ', color: 'plain' },
      { text: '"everyday"', color: 'string' },
      { text: ',', color: 'plain' },
    ],
  },
  {
    tokens: [{ text: '}', color: 'plain' }],
  },
];

function CodeCard() {
  return (
    <div className="about__code-card">
      {/* Top bar */}
      <div className="about__code-topbar">
        <span className="about__code-dot about__code-dot--red" />
        <span className="about__code-dot about__code-dot--yellow" />
        <span className="about__code-dot about__code-dot--green" />
        <span className="about__code-filename">harish.js</span>
      </div>

      {/* Code body */}
      <div className="about__code-body">
        {codeLines.map((line, i) => (
          <div className="about__code-line" key={i}>
            <span className="about__code-num">{i + 1}</span>

            <span className="about__code-content">
              {line.tokens.map((token, j) => (
                <span
                  key={j}
                  className={`about__token about__token--${token.color}`}
                >
                  {token.text}
                </span>
              ))}
            </span>
          </div>
        ))}

        {/* Blinking cursor */}
        <div className="about__code-line">
          <span className="about__code-num">{codeLines.length + 1}</span>
          <span className="about__code-cursor" />
        </div>
      </div>

      {/* Status bar */}
      <div className="about__code-statusbar">
        <span className="about__code-status-dot" />
        <span>JavaScript</span>
        <span className="about__code-status-sep">·</span>
        <span>UTF-8</span>
        <span className="about__code-status-sep">·</span>
        <span className="about__code-status-ready">Ready</span>
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal
      gsap.fromTo(
        '.about__label, .about__heading, .about__body p',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Card reveal
      gsap.fromTo(
        '.about__visual',
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 70%',
          },
        }
      );

      // Code lines stagger
      gsap.fromTo(
        '.about__code-line',
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 65%',
          },
        }
      );

      // Stats
      gsap.fromTo(
        '.about__stat',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="about"
      id="about"
      ref={sectionRef}
      aria-label="About section"
    >
      <div className="about__bg-glow" aria-hidden="true" />

      <div className="about__container">
        {/* Left — Text */}
        <div className="about__text" ref={textRef}>
          <p className="section-label about__label">Who I Am</p>

          <h2 className="about__heading">
            Building the
            <br />
            <span className="about__heading-accent">Future</span>, One
            <br />
            Pixel at a Time.
          </h2>

          <div className="about__body">
            <p>
              I'm a passionate full-stack developer who loves turning ideas into
              real, impactful web experiences. I specialise in building clean,
              responsive and scalable applications using modern tech stacks like
              React, Node.js and MongoDB.
            </p>

            <p>
              As a fresher, I bring curiosity, consistency and a hunger to keep
              growing. I'm constantly exploring new technologies — from
              generative AI to 3D web experiences — and I'm actively looking for
              opportunities where I can contribute, learn and grow alongside a
              great team.
            </p>
          </div>

          {/* Tags */}
          <div className="about__tags">
            {[
              'Quick Learner',
              'UI/UX Enthusiast',
              'Team Player',
              'Tech Enthusiast',
            ].map((tag) => (
              <span key={tag} className="about__tag">
                {tag}
              </span>
            ))}
          </div>

          <a
            href={resume}
            className="about__resume-btn"
            target="_blank"
            rel="noopener noreferrer"
            download="HarishFullStackWebDeveloper.pdf"
            data-hover
          >
            <span>Download Resume</span>

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 15V3M12 15l-4-4M12 15l4-4M3 21h18" />
            </svg>
          </a>
        </div>

        {/* Right — Code Card */}
        <div className="about__visual" ref={imageRef} aria-hidden="true">
          <div className="about__card-wrapper">
            <CodeCard />

            {/* Floating badges */}
            <div className="about__badge about__badge--1">
              <span className="about__badge-icon">⚡</span>
              <span>Fast Learner</span>
            </div>

            <div className="about__badge about__badge--2">
              <span className="about__badge-icon">🎯</span>
              <span>Clean Code</span>
            </div>

            <div className="about__badge about__badge--3">
              <span className="about__badge-icon">🚀</span>
              <span>10+ Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="about__stats" ref={statsRef}>
        {stats.map(({ num, label }) => (
          <div key={label} className="about__stat">
            <span className="about__stat-num">{num}</span>
            <span className="about__stat-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
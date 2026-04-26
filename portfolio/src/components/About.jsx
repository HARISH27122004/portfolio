import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/About.css';
import resume from '../pdf/HarishFullStackWebDeveloper.pdf'

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { num: '10+', label: 'Projects Built' },
  { num: '8+', label: 'Technologies Learned' },
  { num: '100+', label: 'Github Commits' },
  { num: '100%', label: 'Passion for Code' },
];

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal
      gsap.fromTo('.about__label, .about__heading, .about__text p',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: textRef.current, start: 'top 75%', toggleActions: 'play none none none' }
        }
      );

      // Image parallax
      gsap.fromTo('.about__visual',
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 70%' }
        }
      );

      // Stats counter
      gsap.fromTo('.about__stat',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef} aria-label="About section">
      <div className="about__bg-glow" aria-hidden="true" />

      <div className="about__container">
        {/* Text */}
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
              I'm a full-stack developer passionate about creating seamless digital experiences
              that merge aesthetic beauty with engineering precision. I specialise in building
              scalable web applications with modern tech stacks.
            </p>
            <p>
              When I'm not coding, you'll find me keeping up with the latest
              in AI, taking on new challenges through personal projects, or
              learning something new just for the love of it. I believe the
              best developers never stop being students.
            </p>
          </div>

          {/* Tags */}
          <div className="about__tags">
            {['Problem Solver', 'UI/UX Enthusiast', 'Team Player', 'AI Explorer'].map(tag => (
              <span key={tag} className="about__tag">{tag}</span>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15V3M12 15l-4-4M12 15l4-4M3 21h18" />
            </svg>
          </a>
        </div>

        {/* Visual */}
        <div className="about__visual" ref={imageRef} aria-hidden="true">
          <div className="about__card-stack">
            {/* Main card */}
            <div className="about__card about__card--main">
              <div className="about__card-glow" />
              <div className="about__avatar">
                <div className="about__avatar-ring" />
                <div className="about__avatar-img">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="35" r="20" fill="url(#grad1)" />
                    <ellipse cx="50" cy="85" rx="30" ry="22" fill="url(#grad1)" />
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#b44fff" />
                        <stop offset="1" stopColor="#00d4ff" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="about__card-info">
                <span className="about__card-name">Harish</span>
                <span className="about__card-role">Full Stack Developer</span>
              </div>
              <div className="about__card-code">
                <span className="about__code-line"><span style={{ color: '#b44fff' }}>const</span> me = {'{'}</span>
                <span className="about__code-line">&nbsp;&nbsp;role: <span style={{ color: '#00ff9f' }}>"Dev"</span>,</span>
                <span className="about__code-line">&nbsp;&nbsp;passion: <span style={{ color: '#00ff9f' }}>"∞"</span></span>
                <span className="about__code-line">{'}'}</span>
              </div>
            </div>

            {/* Floating accent cards */}
            <div className="about__card about__card--accent about__card--tl">
              <span className="about__card-icon">⚡</span>
              <span>Fast Delivery</span>
            </div>
            <div className="about__card about__card--accent about__card--br">
              <span className="about__card-icon">🎯</span>
              <span>Clean Code</span>
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
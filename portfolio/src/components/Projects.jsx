import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Projects.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'NeuralChat',
    desc: 'Real-time AI chat platform with WebSocket communication, GPT integration, and multi-room support.',
    tags: ['React', 'Node.js', 'Socket.io', 'GPT-4'],
    category: 'Full Stack',
    color: '#b44fff',
    gradient: 'linear-gradient(135deg, #4a00ff22, #b44fff44)',
    link: '#',
    github: '#',
    year: '2024',
    visual: (
      <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="160" fill="#0a0515"/>
        <rect x="20" y="20" width="160" height="30" rx="6" fill="rgba(180,79,255,0.15)" stroke="rgba(180,79,255,0.3)" strokeWidth="1"/>
        <rect x="28" y="30" width="100" height="10" rx="3" fill="rgba(180,79,255,0.4)"/>
        <rect x="100" y="70" width="160" height="30" rx="6" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.3)" strokeWidth="1"/>
        <rect x="108" y="80" width="80" height="10" rx="3" fill="rgba(0,212,255,0.4)"/>
        <rect x="20" y="115" width="130" height="30" rx="6" fill="rgba(180,79,255,0.15)" stroke="rgba(180,79,255,0.3)" strokeWidth="1"/>
        <rect x="28" y="125" width="70" height="10" rx="3" fill="rgba(180,79,255,0.4)"/>
        <circle cx="248" cy="35" r="16" fill="rgba(180,79,255,0.2)" stroke="rgba(180,79,255,0.5)" strokeWidth="1"/>
        <text x="243" y="40" fill="#b44fff" fontSize="14">AI</text>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'DataForge',
    desc: 'Developer analytics dashboard with real-time metrics, interactive charts and team collaboration.',
    tags: ['React', 'MongoDB', 'Express', 'D3.js'],
    category: 'Dashboard',
    color: '#00d4ff',
    gradient: 'linear-gradient(135deg, #00d4ff22, #0099cc44)',
    link: '#',
    github: '#',
    year: '2024',
    visual: (
      <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="160" fill="#020a12"/>
        {[0,1,2,3,4,5].map(i => (
          <rect key={i} x={20 + i*40} y={140 - (30+i*12+Math.sin(i)*20)} width="24"
            height={30+i*12+Math.sin(i)*20} rx="3"
            fill={`rgba(0,212,255,${0.2 + i*0.08})`} stroke="rgba(0,212,255,0.4)" strokeWidth="0.5"/>
        ))}
        <polyline points="20,90 60,70 100,80 140,50 180,60 220,30 260,40"
          stroke="#00ff9f" strokeWidth="1.5" fill="none"/>
        <circle cx="220" cy="30" r="4" fill="#00ff9f"/>
        <text x="20" y="15" fill="rgba(0,212,255,0.6)" fontSize="8" fontFamily="monospace">ANALYTICS DASHBOARD</text>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'ShopNova',
    desc: 'Full-featured e-commerce platform with Stripe payments, inventory management, and admin panel.',
    tags: ['React', 'Node.js', 'SQL', 'Stripe'],
    category: 'E-Commerce',
    color: '#00ff9f',
    gradient: 'linear-gradient(135deg, #00ff9f15, #00cc7a33)',
    link: '#',
    github: '#',
    year: '2023',
    visual: (
      <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="160" fill="#010a05"/>
        <rect x="20" y="20" width="70" height="80" rx="6" fill="rgba(0,255,159,0.08)" stroke="rgba(0,255,159,0.3)" strokeWidth="0.5"/>
        <rect x="30" y="30" width="50" height="40" rx="3" fill="rgba(0,255,159,0.15)"/>
        <rect x="30" y="78" width="35" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="30" y="88" width="25" height="5" rx="2" fill="rgba(0,255,159,0.5)"/>
        <rect x="105" y="20" width="70" height="80" rx="6" fill="rgba(0,255,159,0.08)" stroke="rgba(0,255,159,0.3)" strokeWidth="0.5"/>
        <rect x="115" y="30" width="50" height="40" rx="3" fill="rgba(0,255,159,0.12)"/>
        <rect x="115" y="78" width="40" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
        <rect x="115" y="88" width="20" height="5" rx="2" fill="rgba(0,255,159,0.5)"/>
        <rect x="190" y="20" width="70" height="80" rx="6" fill="rgba(0,255,159,0.08)" stroke="rgba(0,255,159,0.3)" strokeWidth="0.5"/>
        <rect x="200" y="30" width="50" height="40" rx="3" fill="rgba(0,255,159,0.1)"/>
        <rect x="20" y="115" width="240" height="30" rx="4" fill="rgba(0,255,159,0.06)" stroke="rgba(0,255,159,0.2)" strokeWidth="0.5"/>
        <text x="90" y="135" fill="rgba(0,255,159,0.7)" fontSize="9" fontFamily="monospace">🛒  CHECKOUT  →</text>
      </svg>
    ),
  },
  {
    id: 4,
    title: 'DevCollab',
    desc: 'Real-time collaborative coding environment with syntax highlighting, video chat, and version control.',
    tags: ['React', 'WebRTC', 'MongoDB', 'Express'],
    category: 'Dev Tools',
    color: '#ff006e',
    gradient: 'linear-gradient(135deg, #ff006e18, #cc005533)',
    link: '#',
    github: '#',
    year: '2023',
    visual: (
      <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="160" fill="#0a0008"/>
        <rect x="10" y="10" width="160" height="140" rx="4" fill="rgba(255,0,110,0.05)" stroke="rgba(255,0,110,0.2)" strokeWidth="0.5"/>
        <text x="20" y="35" fill="rgba(255,0,110,0.5)" fontSize="7" fontFamily="monospace">function solve(n) {'{'}</text>
        <text x="20" y="50" fill="rgba(180,79,255,0.6)" fontSize="7" fontFamily="monospace">  if (n === 0) return 0;</text>
        <text x="20" y="65" fill="rgba(0,212,255,0.5)" fontSize="7" fontFamily="monospace">  return n + solve(n-1);</text>
        <text x="20" y="80" fill="rgba(255,0,110,0.5)" fontSize="7" fontFamily="monospace">{'}'}</text>
        <rect x="178" y="10" width="92" height="68" rx="4" fill="rgba(0,0,0,0.5)" stroke="rgba(255,0,110,0.3)" strokeWidth="0.5"/>
        <circle cx="194" cy="44" r="18" fill="rgba(255,0,110,0.12)"/>
        <circle cx="194" cy="44" r="10" fill="rgba(255,0,110,0.2)" stroke="rgba(255,0,110,0.5)" strokeWidth="0.5"/>
        <rect x="178" y="84" width="92" height="66" rx="4" fill="rgba(0,0,0,0.5)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5"/>
        <circle cx="224" cy="117" r="18" fill="rgba(0,212,255,0.12)"/>
        <circle cx="224" cy="117" r="10" fill="rgba(0,212,255,0.2)" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5"/>
      </svg>
    ),
  },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [modal, setModal] = useState(null);

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filtered = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects__header > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.fromTo('.project-card',
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );
  }, [activeFilter]);

  return (
    <section className="projects" id="projects" ref={sectionRef} aria-label="Projects section">
      <div className="projects__bg" aria-hidden="true" />

      <div className="projects__header">
        <p className="section-label">Selected Work</p>
        <h2 className="projects__heading">
          Featured <span className="projects__heading-accent">Projects</span>
        </h2>
        <p className="projects__sub">
          A collection of things I've built and shipped.
        </p>
      </div>

      {/* Filter */}
      <div className="projects__filters" role="tablist" aria-label="Project filters">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeFilter === cat}
            className={`projects__filter ${activeFilter === cat ? 'projects__filter--active' : ''}`}
            onClick={() => setActiveFilter(cat)}
            data-hover
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="projects__grid">
        {filtered.map((project) => (
          <article
            key={project.id}
            className="project-card"
            style={{ '--project-color': project.color, '--project-grad': project.gradient }}
            onClick={() => setModal(project)}
            data-hover
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setModal(project)}
            aria-label={`View ${project.title} project`}
          >
            {/* Visual preview */}
            <div className="project-card__visual">
              {project.visual}
              <div className="project-card__overlay">
                <span className="project-card__view-btn">View Project ↗</span>
              </div>
            </div>

            {/* Content */}
            <div className="project-card__content">
              <div className="project-card__meta">
                <span className="project-card__cat" style={{ color: project.color }}>{project.category}</span>
                <span className="project-card__year">{project.year}</span>
              </div>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">{project.desc}</p>
              <div className="project-card__tags">
                {project.tags.map(tag => (
                  <span key={tag} className="project-card__tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="project-card__glow" aria-hidden="true" />
          </article>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="project-modal" onClick={() => setModal(null)} role="dialog" aria-modal="true" aria-label={modal.title}>
          <div className="project-modal__inner" onClick={e => e.stopPropagation()}>
            <button className="project-modal__close" onClick={() => setModal(null)} aria-label="Close modal" data-hover>✕</button>
            <div className="project-modal__visual">{modal.visual}</div>
            <div className="project-modal__body">
              <span className="project-modal__cat" style={{ color: modal.color }}>{modal.category}</span>
              <h3 className="project-modal__title">{modal.title}</h3>
              <p className="project-modal__desc">{modal.desc}</p>
              <div className="project-modal__tags">
                {modal.tags.map(t => <span key={t} className="project-card__tag">{t}</span>)}
              </div>
              <div className="project-modal__links">
                <a href={modal.link} className="project-modal__btn project-modal__btn--live" data-hover target="_blank" rel="noopener noreferrer">
                  Live Demo ↗
                </a>
                <a href={modal.github} className="project-modal__btn project-modal__btn--code" data-hover target="_blank" rel="noopener noreferrer">
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
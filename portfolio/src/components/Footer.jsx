import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Footer.css';

gsap.registerPlugin(ScrollTrigger);

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer__inner > *',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%' }
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer" ref={footerRef} role="contentinfo">
      {/* Divider glow */}
      <div className="footer__divider" aria-hidden="true" />

      <div className="footer__inner">
        {/* Logo / Brand */}
        <div className="footer__brand">
          <button className="footer__logo" onClick={scrollTop} data-hover aria-label="Back to top">
            <span className="footer__logo-bracket">&lt;</span>
            <span className="footer__logo-name">DEV</span>
            <span className="footer__logo-bracket">/&gt;</span>
          </button>
          <p className="footer__tagline">
            Building tomorrow's web, today.
          </p>
        </div>

        {/* Nav links */}
        <nav className="footer__nav" aria-label="Footer navigation">
          {['About', 'Stack', 'Projects', 'Contact'].map((link, i) => (
            <button
              key={link}
              className="footer__nav-link"
              onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              data-hover
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Socials */}
        <div className="footer__socials">
          {socials.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              className="footer__social"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              data-hover
            >
              {icon}
              <span className="footer__social-tooltip">{name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p className="footer__copy">
          © {new Date().getFullYear()} Harish. Crafted with
          <span className="footer__heart" aria-label="love"> ♥ </span>
          &amp; React + Three.js
        </p>
        <div className="footer__status">
          <span className="footer__status-dot" aria-hidden="true" />
          <span>All systems operational</span>
        </div>
      </div>

      {/* Back to top */}
      <button
        className="footer__back-top"
        onClick={scrollTop}
        aria-label="Back to top"
        data-hover
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </footer>
  );
}
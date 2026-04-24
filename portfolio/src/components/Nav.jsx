import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/Nav.css';

const links = ['About', 'Stack', 'Projects', 'Contact'];

export default function Nav() {
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Entrance animation — GSAP controls initial opacity, not CSS
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 2.5, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const prev = lastScrollY.current;

        setScrolled(currentY > 50);

        if (currentY > 80) {
          if (currentY > prev + 5) {
            setVisible(false);
            setMenuOpen(false);
          } else if (currentY < prev - 5) {
            setVisible(true);
          }
        } else {
          setVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={[
          'nav',
          scrolled ? 'nav--scrolled' : '',
          visible ? '' : 'nav--hidden',
        ].filter(Boolean).join(' ')}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className="nav__logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="nav__logo-bracket">&lt;</span>
          <span className="nav__logo-name">DEV</span>
          <span className="nav__logo-bracket">/&gt;</span>
        </div>

        <div className="nav__links">
          {links.map((link) => (
            <button key={link} className="nav__link" onClick={() => scrollTo(link)}>
              {link}
            </button>
          ))}
          <a
            href="#contact"
            className="nav__cta"
            onClick={(e) => { e.preventDefault(); scrollTo('Contact'); }}
          >
            Hire Me
          </a>
        </div>

        <button
          className={`nav__hamburger ${menuOpen ? 'nav__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile full-screen menu — outside <nav> so nothing clips */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        {/* Close button inside the menu */}
        <button
          className="mobile-menu__close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <span />
          <span />
        </button>

        {links.map((link, i) => (
          <button
            key={link}
            className="mobile-menu__link"
            onClick={() => scrollTo(link)}
            style={{ transitionDelay: menuOpen ? `${0.05 + i * 0.07}s` : '0s' }}
          >
            <span className="mobile-menu__num">0{i + 1}.</span>
            {link}
          </button>
        ))}
        <a
          href="#contact"
          className="mobile-menu__cta"
          onClick={(e) => { e.preventDefault(); scrollTo('Contact'); }}
          style={{ transitionDelay: menuOpen ? '0.35s' : '0s' }}
        >
          Hire Me
        </a>
      </div>
    </>
  );
}
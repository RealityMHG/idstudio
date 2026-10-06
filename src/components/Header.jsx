import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BrandWordmark from './BrandWordmark';
import useReducedMotion from '../hooks/useReducedMotion';

const links = [
  ['#studio', 'Studio'],
  ['#lookbook', 'Lookbook'],
  ['#services', 'Services'],
  ['#booking', 'Book'],
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPresent, setMenuPresent] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 780px)').matches);
  const [pastHero, setPastHero] = useState(false);
  const reducedMotion = useReducedMotion();
  const menuButtonRef = useRef(null);
  const navRef = useRef(null);
  const menuAnimationRef = useRef(null);
  const previousOpenRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 780px)');
    const update = () => {
      setMobile(query.matches);
      if (!query.matches) {
        setMenuOpen(false);
        if (document.activeElement === menuButtonRef.current) {
          document.querySelector('.site-header .brand')?.focus({ preventScroll: true });
        }
      }
    };
    query.addEventListener('change', update);
    update();
    return () => query.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const previousAnimation = menuAnimationRef.current;
    const changed = previousOpenRef.current !== menuOpen;
    previousOpenRef.current = menuOpen;
    // Read a running transition before cancelling so rapid taps reverse smoothly.
    const current = previousAnimation ? getComputedStyle(nav) : null;
    const from = current
      ? { opacity: current.opacity, transform: current.transform }
      : { opacity: menuOpen ? 0 : 1, transform: menuOpen && !reducedMotion ? 'translateY(-6px)' : 'none' };
    previousAnimation?.cancel();
    menuAnimationRef.current = null;

    if (!mobile || !changed || typeof nav.animate !== 'function') {
      if (!menuOpen) setMenuPresent(false);
      return;
    }

    const styles = getComputedStyle(nav);
    const token = reducedMotion ? '--motion-reduced' : menuOpen ? '--motion-menu-open' : '--motion-menu-close';
    const animation = nav.animate(
      [
        { ...from, ...(reducedMotion ? { transform: 'none' } : {}) },
        { opacity: menuOpen ? 1 : 0, transform: !menuOpen && !reducedMotion ? 'translateY(-6px)' : 'none' },
      ],
      {
        duration: parseFloat(styles.getPropertyValue(token)),
        easing: styles.getPropertyValue(menuOpen ? '--ease' : '--ease-exit').trim(),
        fill: 'both',
      },
    );
    menuAnimationRef.current = animation;
    animation.onfinish = () => {
      if (menuAnimationRef.current !== animation) return;
      if (!menuOpen) setMenuPresent(false);
      animation.cancel();
      menuAnimationRef.current = null;
    };
  }, [menuOpen, mobile, reducedMotion]);

  useEffect(() => () => menuAnimationRef.current?.cancel(), []);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    navRef.current?.querySelector('a')?.focus({ preventScroll: true });
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      menuButtonRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`site-header${pastHero ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}${menuPresent ? ' is-menu-visible' : ''}`}>
        <a className="brand" href="#" aria-label="ID HAIR STUDIO home" onClick={closeMenu}>
          <BrandWordmark />
        </a>
        <button
          className="menu-toggle"
          ref={menuButtonRef}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => {
            if (!menuOpen) setMenuPresent(true);
            else menuButtonRef.current?.focus({ preventScroll: true });
            setMenuOpen((open) => !open);
          }}
        >
          {menuOpen ? 'Close' : 'Menu'}
          <span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          ref={navRef}
          inert={mobile && !menuOpen ? '' : undefined}
          aria-hidden={mobile && !menuOpen ? true : undefined}
        >
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={closeMenu}>{label}</a>
          ))}
        </nav>
      </header>
    </>
  );
}

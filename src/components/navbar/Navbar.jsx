'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from '@components/link/Link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '../theme-toggle/ThemeToggle';
import { NAV_ITEMS, ROUTES } from '@config/site';
import './Navbar.scss';

function NavLink({ item, onNavigate, isMobile = false, isHidden = false, activeSection = '' }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e) => {
    if (item.type === 'route') {
      // Already on home and clicking Home: scroll to top
      if (item.href === '/' && pathname === ROUTES.HOME) {
        e.preventDefault();
        if (typeof window !== 'undefined' && window.history.replaceState) {
          window.history.replaceState(null, '', '/');
        }
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      }
      onNavigate?.();
      return;
    }

    // Anchor link
    e.preventDefault();
    onNavigate?.();

    if (pathname !== ROUTES.HOME) {
      router.push(`/${item.href}`);
      return;
    }

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', item.href);
    }

    const target = document.querySelector(item.href);
    if (target) {
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight ?? 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const isActive = item.href === '/blog'
    ? pathname.startsWith('/blog')
    : item.type === 'route' && item.href === '/'
      ? isMobile && pathname === ROUTES.HOME && activeSection === '/'
      : item.type === 'anchor'
        ? isMobile && pathname === ROUTES.HOME && activeSection === item.href
        : false;

  const linkClass = `navbar__link${isMobile && isActive ? ' navbar__link--active' : ''}${isHidden ? ' navbar__link--hidden' : ''}`;

  if (item.type === 'route') {
    return (
      <Link href={item.href} className={linkClass} onClick={handleClick}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} className={linkClass} onClick={handleClick}>
      {item.label}
    </a>
  );
}

function SiteLogo() {
  return (
    <svg
      className="navbar__logo-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="36"
      height="36"
      aria-hidden="true"
    >
      <rect className="navbar__logo-rect" width="32" height="32" rx="8" />
      <text
        className="navbar__logo-letter"
        x="16"
        y="22"
        fontFamily="Poppins, sans-serif"
        fontSize="18"
        fontWeight="700"
        textAnchor="middle"
      >
        S
      </text>
    </svg>
  );
}

export default function Navbar() {
  // scrolled starts false on both server and client to avoid a hydration
  // mismatch. The scroll listener syncs it on the first tick after mount.
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const isInitialLoadRef = useRef(true);
  const mobileMenuRef = useRef(null);

  const isHomePage = pathname === '/';

  // Active-section tracker via IntersectionObserver
  useEffect(() => {
    if (!isHomePage) return undefined;

    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 100) {
          setActiveSection('/');
          return;
        }

        let mostVisible = null;
        let maxRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target;
          }
        });

        if (mostVisible && maxRatio > 0.15) {
          if (mostVisible.id === 'home') {
            setActiveSection('/');
            return;
          }
          setActiveSection(`#${mostVisible.id}`);
        }
      },
      {
        threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-100px 0px -60% 0px',
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, [isHomePage]);

  // Scroll-state for navbar shrink
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        rafId = null;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (!menuOpen) mobileMenuRef.current.setAttribute('inert', '');
      else mobileMenuRef.current.removeAttribute('inert');
    }
  }, [menuOpen]);

  // Initial active section from hash
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      if (typeof window !== 'undefined' && window.location.hash) {
        setActiveSection(window.location.hash);
      } else if (pathname === ROUTES.HOME) {
        setActiveSection('/');
      }
    }
  }, [pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (pathname !== ROUTES.HOME) {
      router.push(ROUTES.HOME);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  return (
    <>
      <nav className={`navbar${scrolled || !isHomePage ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--menu-open' : ''}${isHomePage && !scrolled ? ' navbar--home' : ''}`}>
        <div className="navbar__inner container">
          <Link href={ROUTES.HOME} className="navbar__logo" aria-label="Home" onClick={handleLogoClick}>
            <SiteLogo />
          </Link>

          <ul className="navbar__menu navbar__menu--desktop">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink
                  item={item}
                  isHidden={isHomePage && !scrolled && item.href === '/'}
                  activeSection={activeSection}
                />
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            <ThemeToggle />
            <button
              type="button"
              className="navbar__burger navbar__burger--navbar"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
      >
        <button
          type="button"
          className="navbar__burger navbar__burger--close"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <span /><span /><span />
        </button>

        <ul className="mobile-menu__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <NavLink
                item={item}
                onNavigate={closeMenu}
                isMobile
                isHidden={isHomePage && !scrolled && item.href === '/'}
                activeSection={activeSection}
              />
            </li>
          ))}
        </ul>

        <div className="mobile-menu__aurora" aria-hidden="true">
          <div className="mobile-menu__orb mobile-menu__orb--1" />
          <div className="mobile-menu__orb mobile-menu__orb--2" />
          <div className="mobile-menu__orb mobile-menu__orb--3" />
        </div>
      </div>
    </>
  );
}

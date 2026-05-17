'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LINKS } from '@config/site';
import './SupportSnackbar.scss';

const SHOW_DELAY_MS = 500;

let showSnackbarGlobal = null;

export function triggerSnackbar() {
  if (showSnackbarGlobal && typeof window !== 'undefined' && window.innerWidth > 768) {
    showSnackbarGlobal();
  }
}

export default function SupportSnackbar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    showSnackbarGlobal = () => setVisible(true);
    return () => { showSnackbarGlobal = null; };
  }, []);

  useEffect(() => {
    setDismissed(false);
    setVisible(false);
  }, [pathname]);

  useEffect(() => {
    const hideWidget = () => {
      const widget = document.getElementById('bmc-wbtn');
      if (widget) widget.style.display = 'none';
    };
    hideWidget();
    const interval = setInterval(hideWidget, 100);
    const timeout = setTimeout(() => clearInterval(interval), 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    if (dismissed) return undefined;

    const isHomePage = pathname === '/';
    const isBlogDetailPage = /^\/blog\/[^/]+\/?$/.test(pathname || '');

    if (!isHomePage && !isBlogDetailPage) {
      setVisible(false);
      return undefined;
    }

    setVisible(false);

    let timer = null;
    let triggered = false;

    const onScroll = () => {
      if (triggered) return;

      const targetSection = isHomePage
        ? document.getElementById('contact')
        : document.querySelector('.blog-feedback');

      if (targetSection) {
        const rect = targetSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          triggered = true;
          window.removeEventListener('scroll', onScroll);
          timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [dismissed, pathname]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setVisible(false);
    setDismissed(true);
  };

  const handleSupport = () => {
    const bmcButton = document.querySelector('#bmc-wbtn');
    if (bmcButton) {
      const prev = bmcButton.style.display;
      bmcButton.style.display = '';
      bmcButton.click();
      bmcButton.style.display = prev || 'none';
    } else {
      window.open(LINKS.bmc, '_blank', 'noreferrer,noopener');
    }
  };

  if (dismissed) return null;

  return (
    <div
      className={`support-snackbar${visible ? ' support-snackbar--visible' : ''}`}
      role="complementary"
      aria-label="Support the author"
      onClick={handleSupport}
      style={{ cursor: 'pointer' }}
    >
      <span className="support-snackbar__icon" aria-hidden="true">👏🏻</span>

      <div className="support-snackbar__body">
        <p className="support-snackbar__text">Liked my work?</p>
        <p className="support-snackbar__sub">Support me with a coffee.</p>
      </div>

      <div className="support-snackbar__cta">
        <img
          src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
          alt="Buy me a coffee"
          className="support-snackbar__bmc-logo"
        />
      </div>

      <button
        type="button"
        className="support-snackbar__close"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

'use client';

import { useEffect } from 'react';

// One rAF-throttled mousemove listener for both cursor glow and parallax orbs.
// Skipped on touch-only devices and when the user prefers reduced motion.
export default function CursorGlow() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchOnly = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduceMotion || isTouchOnly) return undefined;

    const root = document.documentElement;
    let pending = false;
    let lastX = 0;
    let lastY = 0;

    const flush = () => {
      pending = false;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      root.style.setProperty('--mouse-x', `${lastX}px`);
      root.style.setProperty('--mouse-y', `${lastY}px`);
      root.style.setProperty('--parallax-x', String((lastX - cx) / cx));
      root.style.setProperty('--parallax-y', String((lastY - cy) / cy));
    };

    const onMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(flush);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return null;
}

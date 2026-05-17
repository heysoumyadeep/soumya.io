'use client';

import { useEffect, useRef } from 'react';
import './ParallaxBackground.scss';

// Animated background orbs. Reads --parallax-x/y from CursorGlow (via CSS vars)
// on every frame rather than adding a second mousemove listener.
export default function ParallaxBackground() {
  const rootRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const isTouchOnly = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    const state = { mouseX: 0, mouseY: 0, scroll: 0 };
    let pending = false;

    const applyTransforms = () => {
      pending = false;
      const root = rootRef.current;
      if (!root) return;

      if (!isTouchOnly) {
        const cs = getComputedStyle(document.documentElement);
        state.mouseX = parseFloat(cs.getPropertyValue('--parallax-x')) || 0;
        state.mouseY = parseFloat(cs.getPropertyValue('--parallax-y')) || 0;
      }

      const elements = root.querySelectorAll('[data-speed]');
      for (let i = 0; i < elements.length; i += 1) {
        const el = elements[i];
        const speed = parseFloat(el.dataset.speed) || 0;
        const mouse = parseFloat(el.dataset.mouse) || 0;
        const tx = state.mouseX * mouse;
        const ty = state.mouseY * mouse + state.scroll * speed;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      rafRef.current = window.requestAnimationFrame(applyTransforms);
    };

    const onScroll = () => {
      state.scroll = window.scrollY;
      schedule();
    };

    // For mouse parallax, poll the shared CSS vars at ~60Hz. Cheaper than
    // adding a second mousemove handler, and stays perfectly in sync with
    // the cursor glow.
    let pollInterval = null;
    if (!isTouchOnly) {
      pollInterval = window.setInterval(schedule, 16);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      if (pollInterval) window.clearInterval(pollInterval);
    };
  }, []);

  return (
    <div className="parallax" ref={rootRef} aria-hidden="true">
      <div className="parallax__orb parallax__orb--1" data-speed="0.25" data-mouse="40" />
      <div className="parallax__orb parallax__orb--2" data-speed="0.4"  data-mouse="-30" />
      <div className="parallax__orb parallax__orb--3" data-speed="0.15" data-mouse="20" />
      <div className="parallax__orb parallax__orb--4" data-speed="0.3"  data-mouse="-50" />
      <div className="parallax__orb parallax__orb--5" data-speed="0.2"  data-mouse="35" />
      <div className="parallax__grid" data-speed="0.05" data-mouse="0" />
    </div>
  );
}

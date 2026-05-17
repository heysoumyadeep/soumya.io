'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import './NavigationLoader.scss';

// Thin progress bar at the top of the page during route changes.
export default function NavigationLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState('idle');
  const previousPathnameRef = useRef(pathname);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    if (pathname === previousPathnameRef.current) return undefined;
    previousPathnameRef.current = pathname;

    clearTimers();
    setPhase('start');

    const rafId = requestAnimationFrame(() => {
      setPhase('filling');
      timersRef.current.push(
        setTimeout(() => {
          setPhase('complete');
          timersRef.current.push(
            setTimeout(() => setPhase('idle'), 400),
          );
        }, 600),
      );
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimers();
    };
  }, [pathname]);

  if (phase === 'idle') return null;

  return (
    <div
      className={`nav-progress nav-progress--${phase}`}
      role="progressbar"
      aria-label="Page loading"
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}

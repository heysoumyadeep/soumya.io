'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Adds `is-visible` to `.reveal` elements as they scroll into view.
// Uses an IntersectionObserver, which is much cheaper than scroll listeners.
export function useScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    const id = window.requestAnimationFrame(() => {
      document
        .querySelectorAll('.reveal:not(.is-visible)')
        .forEach((el) => observer.observe(el));
    });

    return () => {
      window.cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, [pathname]);
}

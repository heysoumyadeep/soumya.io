'use client';

import { useEffect, useState } from 'react';
import { Loader } from '@components';

// Shows the brand loader on initial page load, then self-dismisses
// once the page is ready or after a 1.5s hard cap.
export default function InitialLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (document.readyState === 'complete') {
      const id = window.setTimeout(() => setVisible(false), 150);
      return () => window.clearTimeout(id);
    }

    let timeoutId = null;

    const dismiss = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      setVisible(false);
    };

    window.addEventListener('load', dismiss, { once: true });
    timeoutId = window.setTimeout(dismiss, 800);

    return () => {
      window.removeEventListener('load', dismiss);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className="initial-loader" aria-hidden="true">
      <Loader />
    </div>
  );
}

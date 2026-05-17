'use client';

import { useEffect } from 'react';
import './Loader.scss';

export default function Loader() {
  useEffect(() => {
    const hide = () => {
      const btn = document.getElementById('bmc-wbtn');
      if (btn) btn.style.setProperty('display', 'none', 'important');
    };
    hide();
    const interval = setInterval(hide, 100);
    const timeout = setTimeout(() => clearInterval(interval), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      const btn = document.getElementById('bmc-wbtn');
      if (btn) btn.style.removeProperty('display');
    };
  }, []);

  return (
    <div className="loader" aria-label="Loading" role="status">
      <div className="loader__aurora loader__aurora--1" />
      <div className="loader__aurora loader__aurora--2" />
      <div className="loader__aurora loader__aurora--3" />
      <div className="loader__glow" />
      <div className="loader__mark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="72"
          height="72"
          aria-hidden="true"
        >
          <rect width="32" height="32" rx="8" fill="var(--palette-crimson)" />
          <text
            x="16"
            y="22"
            fontFamily="Poppins, sans-serif"
            fontSize="18"
            fontWeight="700"
            fill="var(--palette-deep)"
            textAnchor="middle"
          >
            S
          </text>
        </svg>
      </div>
    </div>
  );
}

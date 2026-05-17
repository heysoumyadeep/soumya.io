'use client';

import { useTheme } from '@hooks';
import { SunIcon, MoonIcon } from '../icons/Icons';
import './ThemeToggle.scss';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={(e) => toggleTheme(e)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={`theme-toggle__icon ${!isDark ? 'is-hidden' : ''}`}>
        <SunIcon />
      </span>
      <span className={`theme-toggle__icon ${isDark ? 'is-hidden' : ''}`}>
        <MoonIcon />
      </span>
    </button>
  );
}

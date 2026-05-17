'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'portfolio:theme';
const THEME_TRANSITION_CLASS = 'theme-flipping';
const THEME_TRANSITION_MS = 320;
const DEFAULT_THEME = 'dark';

// Only safe on the client.
const readSavedTheme = () => {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* localStorage unavailable */ }
  return DEFAULT_THEME;
};

export function ThemeProvider({ children }) {
  // Server and initial client render both use DEFAULT_THEME so hydration matches.
  // The bootstrap script in layout.jsx sets data-theme on <html> before first
  // paint, so the DOM is correct before React even runs.
  const [theme, setTheme] = useState(DEFAULT_THEME);
  // `mounted` stays false during React StrictMode's double-invoke of effects,
  // so the apply effect below is safely skipped until localStorage is read.
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef(null);

  // Read localStorage and signal that the client has mounted. Batched into one
  // re-render so the apply effect sees both the correct theme and mounted=true.
  useEffect(() => {
    setTheme(readSavedTheme());
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply theme to DOM. Skipped until mounted so the bootstrap script's value
  // isn't overwritten by the initial default. StrictMode-safe: mounted is false
  // during both double-invoke passes, so no premature setAttribute fires.
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const prevTheme = root.getAttribute('data-theme');
    root.setAttribute('data-theme', theme);
    try { window.localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* noop */ }

    // Skip transition animation on initial sync — DOM already has the right value.
    if (prevTheme === theme) return;

    root.classList.add(THEME_TRANSITION_CLASS);
    const id = window.setTimeout(
      () => root.classList.remove(THEME_TRANSITION_CLASS),
      THEME_TRANSITION_MS,
    );
    return () => window.clearTimeout(id);
  }, [theme, mounted]);

  const toggleTheme = useCallback(
    (event) => {
      const nextTheme = theme === 'light' ? 'dark' : 'light';

      if (
        typeof document === 'undefined' ||
        !document.startViewTransition ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        setTheme(nextTheme);
        return;
      }

      const x = event?.clientX ?? window.innerWidth / 2;
      const y = event?.clientY ?? window.innerHeight / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      });
    },
    [theme],
  );

  const value = useMemo(
    () => ({ theme, toggleTheme, isDark: theme === 'dark', toggleRef }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

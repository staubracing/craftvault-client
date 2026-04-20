import { useState, useEffect, useCallback } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'craftvault-theme';
const TRANSITION_CLASS = 'theme-transition';
const TRANSITION_DURATION = 300;

const VALID_PREFERENCES: ThemePreference[] = ['light', 'dark', 'system'];

function isValidPreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && VALID_PREFERENCES.includes(value as ThemePreference);
}

function getSystemPreference(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemPreference() : preference;
}

function applyTheme(resolved: ResolvedTheme): void {
  document.documentElement.setAttribute('data-theme', resolved);
}

function flashTransition(): void {
  const html = document.documentElement;
  html.classList.add(TRANSITION_CLASS);
  setTimeout(() => html.classList.remove(TRANSITION_CLASS), TRANSITION_DURATION);
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isValidPreference(stored) ? stored : 'system';
  });

  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(preference));

  // Apply theme whenever preference changes
  useEffect(() => {
    const next = resolveTheme(preference);
    setResolved(next);
    applyTheme(next);
  }, [preference]);

  // Listen for OS preference changes when in system mode
  useEffect(() => {
    if (preference !== 'system') return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const next: ResolvedTheme = e.matches ? 'dark' : 'light';
      setResolved(next);
      applyTheme(next);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => {
    localStorage.setItem(STORAGE_KEY, next);
    flashTransition();
    setPreference(next);
  }, []);

  return { preference, resolved, setTheme } as const;
}

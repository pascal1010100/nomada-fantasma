'use client';

import { useEffect, type ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('nf-theme');
    document.documentElement.classList.toggle('dark', savedTheme !== 'light');
  }, []);

  return children;
}

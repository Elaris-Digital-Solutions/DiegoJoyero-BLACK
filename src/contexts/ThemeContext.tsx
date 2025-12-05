import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeMode = 'gold' | 'silver';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('gold');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Keep theme for business logic (oro/plata) without overriding the global dark palette
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    if (newTheme === theme) return;

    setIsTransitioning(true);
    setThemeState(newTheme);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const toggleTheme = () => {
    setTheme(theme === 'gold' ? 'silver' : 'gold');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

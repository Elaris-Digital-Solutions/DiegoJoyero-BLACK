import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'gold' | 'silver';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const goldTheme = {
  primary: '#C7A15B',
  secondary: '#EDE8E3',
  accent: '#B58B45',
  background: '#F8F4EC',
  cardBg: '#FDFBF7',
  text: '#111111',
  textSecondary: '#5C5144',
  border: '#DCD2BF',
  shadow: 'rgba(17, 17, 17, 0.05)',
  gradient: 'none',
  glow: 'rgba(199, 161, 91, 0.2)',
};

export const silverTheme = {
  primary: '#B7B7B7',
  secondary: '#F2F2F2',
  accent: '#9AA0A8',
  background: '#FFFFFF',
  cardBg: '#F7F7F7',
  text: '#222222',
  textSecondary: '#4C4C4C',
  border: '#D8D8D8',
  shadow: 'rgba(34, 34, 34, 0.05)',
  gradient: 'none',
  glow: 'rgba(183, 183, 183, 0.25)',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('gold');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const currentTheme = theme === 'gold' ? goldTheme : silverTheme;
    const root = document.documentElement;

    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    root.setAttribute('data-theme', theme);
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

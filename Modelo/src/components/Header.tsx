import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Colecciones', to: '/colecciones' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
];

const SCROLL_THRESHOLD_COMPACT = 20;
const SCROLL_THRESHOLD_EXPANDED = 5;

export function Header() {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const { toggleCart, isOpen, totalItems } = useCart();
  const [isCompact, setIsCompact] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const animationTimeoutRef = useRef<number>();
  const isAnimatingRef = useRef(false);
  const isCompactRef = useRef(false);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const compactContentRef = useRef<HTMLDivElement>(null);
  const compactBarRef = useRef<HTMLDivElement>(null);
  const mobileMenuContentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);
  const handleMobileNavItemClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);
  const measureContentHeight = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      if (isCompact) {
        const baseHeight = compactBarRef.current?.offsetHeight ?? 0;
        const menuHeight = isMobileMenuOpen ? mobileMenuContentRef.current?.scrollHeight ?? 0 : 0;
        const fallbackHeight = compactContentRef.current?.offsetHeight ?? 0;
        const computedHeight = baseHeight + menuHeight;
        setContainerHeight(computedHeight > 0 ? computedHeight : fallbackHeight);
      } else {
        const expandedHeight = expandedContentRef.current?.offsetHeight ?? null;
        setContainerHeight(expandedHeight);
      }
    });
  }, [isCompact, isMobileMenuOpen]);

  const currentModeLabel = useMemo(() => (theme === 'gold' ? 'Catálogo Oro' : 'Catálogo Plata'), [theme]);
  const switchLabel = useMemo(() => (theme === 'gold' ? 'Cambiar a Plata' : 'Cambiar a Oro'), [theme]);

  const startAnimation = useCallback(
    (direction: 'compact' | 'expanded') => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = undefined;
      }

      setIsAnimating(true);
      isAnimatingRef.current = true;
      setIsCompact(direction === 'compact');
      isCompactRef.current = direction === 'compact';

      animationTimeoutRef.current = window.setTimeout(() => {
        animationTimeoutRef.current = undefined;
        setIsAnimating(false);
        isAnimatingRef.current = false;
      }, 800);
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (isAnimatingRef.current) {
        return;
      }

      if (currentScroll > SCROLL_THRESHOLD_COMPACT && !isCompactRef.current) {
        startAnimation('compact');
      } else if (currentScroll <= SCROLL_THRESHOLD_EXPANDED && isCompactRef.current) {
        startAnimation('expanded');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [startAnimation]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    isCompactRef.current = isCompact;
  }, [isCompact]);

  useEffect(() => {
    if (!isCompact) {
      setIsMobileMenuOpen(false);
    }
  }, [isCompact]);

  useLayoutEffect(() => {
    measureContentHeight();
  }, [measureContentHeight]);

  useEffect(() => {
    measureContentHeight();
  }, [measureContentHeight, totalItems]);

  useEffect(() => {
    if (isCompact) {
      measureContentHeight();
    }
  }, [isCompact, isMobileMenuOpen, measureContentHeight]);

  useEffect(() => {
    window.addEventListener('resize', measureContentHeight);

    return () => {
      window.removeEventListener('resize', measureContentHeight);
    };
  }, [measureContentHeight]);

  return (
    <header
      className={`navbar sticky top-0 z-50 border-b ${
        isCompact ? 'backdrop-blur-[6px] shadow-sm' : ''
      }`}
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--background)'
      }}
    >
      <div
        className="relative max-w-6xl mx-auto px-6 overflow-hidden"
        style={{
          height: containerHeight ?? undefined,
          transition: 'height 0.8s ease-in-out'
        }}
      >
        <div
          ref={expandedContentRef}
          aria-hidden={isCompact}
          className={`absolute left-0 right-0 flex flex-col items-center gap-10 pt-12 pb-10 md:pt-16 md:pb-14 transition-all duration-[800ms] ease-in-out ${
            isCompact ? 'pointer-events-none opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex w-full items-center justify-between gap-4 px-4 text-[0.68rem] uppercase tracking-[0.4em] md:px-0">
            <button
              type="button"
              onClick={toggleCart}
              className="flex items-center gap-3 border-b focus:outline-none hover:border-[var(--primary)] transition-colors duration-300"
              style={{
                color: 'var(--text)',
                borderColor: isOpen ? 'var(--primary)' : 'transparent',
              }}
              aria-label="Ver carrito"
              aria-expanded={isOpen}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[0.62rem] uppercase tracking-[0.35em]">Carrito</span>
              {totalItems > 0 ? (
                <span className="text-[0.58rem] uppercase tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                  ({totalItems})
                </span>
              ) : null}
            </button>

            <span className="hidden md:block" style={{ color: 'var(--textSecondary)' }}>
              Casa de Alta Joyería
            </span>

            <div className="flex flex-col items-end text-right">
              <span className="uppercase tracking-[0.4em] text-[0.68rem]" style={{ color: 'var(--textSecondary)' }}>
                {currentModeLabel}
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                disabled={isTransitioning}
                className="uppercase tracking-[0.4em] text-[0.62rem] disabled:opacity-60"
                style={{ color: 'var(--primary)' }}
              >
                {switchLabel}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <Link to="/" className="block">
                <img
                  src="/assets/Asset-1.svg"
                  alt="Logo Diego Joyero"
                  className="w-44 md:w-56 transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                />
            </Link>
            <p className="text-xs uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
              Diego Joyero · Lima 2024
            </p>
          </div>

          <nav className="hidden md:flex flex-wrap justify-center gap-8 text-[0.75rem] uppercase tracking-[0.35em]">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="pb-1 border-b border-transparent hover:border-[var(--primary)]"
                style={{ color: 'var(--text)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          ref={compactContentRef}
          aria-hidden={!isCompact}
          className={`absolute left-0 right-0 transition-all duration-[800ms] ease-in-out ${
            isCompact ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
          }`}
        >
          <div className="md:hidden">
            <div ref={compactBarRef} className="flex items-center justify-between px-4 py-4">
              <Link
                to="/"
                onClick={handleMobileNavItemClick}
                className="block transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              >
                <img
                  src="/assets/Asset-1.svg"
                  alt="Logo Diego Joyero"
                  className="w-28 transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                />
              </Link>

              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 rounded-md border border-transparent hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-colors duration-300"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <div
              ref={mobileMenuContentRef}
              className={`overflow-hidden px-4 transition-[max-height,opacity] duration-500 ease-in-out ${
                isMobileMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <nav className="flex flex-col gap-4 py-3 text-[0.72rem] uppercase tracking-[0.35em]">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleMobileNavItemClick}
                    className="border-b border-transparent pb-2 transition-colors duration-300 hover:border-[var(--primary)]"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleMobileNavItemClick();
                      toggleCart();
                    }}
                    className="flex flex-1 items-center justify-between gap-3 rounded-md border border-transparent px-3 py-3 focus:outline-none hover:border-[var(--primary)] transition-colors duration-300"
                    style={{ color: 'var(--text)' }}
                  >
                    <span className="flex items-center gap-3 uppercase tracking-[0.35em] text-[0.68rem]">
                      <ShoppingBag className="w-4 h-4" />
                      Carrito
                    </span>
                    {totalItems > 0 ? (
                      <span className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                        ({totalItems})
                      </span>
                    ) : null}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleMobileNavItemClick();
                      toggleTheme();
                    }}
                    disabled={isTransitioning}
                    className="flex flex-1 items-center justify-between gap-3 rounded-md border border-transparent px-3 py-3 uppercase tracking-[0.35em] text-[0.64rem] disabled:opacity-60 focus:outline-none hover:border-[var(--primary)] transition-colors duration-300"
                    style={{ color: 'var(--primary)' }}
                  >
                    <span>{currentModeLabel}</span>
                    <span>{switchLabel}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 px-0 py-4">
            <Link to="/" className="shrink-0 block transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]">
              <img
                src="/assets/Asset-1.svg"
                alt="Logo Diego Joyero"
                className="w-32 transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              />
            </Link>

            <nav className="flex-1 flex flex-wrap items-center justify-center gap-6 text-[0.68rem] uppercase tracking-[0.35em]">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="pb-1 border-b border-transparent hover:border-[var(--primary)] transition-colors duration-300"
                  style={{ color: 'var(--text)' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-6 shrink-0">
              <button
                type="button"
                onClick={toggleCart}
                className="flex items-center gap-2 border-b focus:outline-none hover:border-[var(--primary)] transition-colors duration-300"
                style={{
                  color: 'var(--text)',
                  borderColor: isOpen ? 'var(--primary)' : 'transparent',
                }}
                aria-label="Ver carrito"
                aria-expanded={isOpen}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[0.58rem] uppercase tracking-[0.35em]">Carrito</span>
                {totalItems > 0 ? (
                  <span className="text-[0.54rem] uppercase tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                    ({totalItems})
                  </span>
                ) : null}
              </button>

              <div className="flex flex-col items-end text-right leading-none">
                <span className="uppercase tracking-[0.35em] text-[0.6rem]" style={{ color: 'var(--textSecondary)' }}>
                  {currentModeLabel}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  disabled={isTransitioning}
                  className="uppercase tracking-[0.35em] text-[0.58rem] disabled:opacity-60"
                  style={{ color: 'var(--primary)' }}
                >
                  {switchLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState, type ChangeEvent, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  ChevronRight,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  PanelLeftClose,
  PanelRightOpen,
  Settings,
  ShoppingBasket,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  actionSlot?: ReactNode;
  children: ReactNode;
  onAddProduct?: () => void;
  onSearchChange?: (value: string) => void;
  pageTitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  showHeaderSearch?: boolean;
}

type NavigationItem = {
  description: string;
  icon: typeof LayoutDashboard;
  label: string;
  to: string;
};

const navigation: NavigationItem[] = [
  {
    label: 'Resumen',
    description: 'Visión general en tiempo real',
    icon: LayoutDashboard,
    to: '/admin',
  },
  {
    label: 'Catálogo',
    description: 'Gestiona productos y variantes',
    icon: PackageSearch,
    to: '/admin/catalogo',
  },
  {
    label: 'Pedidos',
    description: 'Seguimiento de ventas recientes',
    icon: ShoppingBasket,
    to: '/admin/pedidos',
  },
  {
    label: 'Reportes',
    description: 'Tendencias y desempeño',
    icon: BarChart3,
    to: '/admin/reportes',
  },
  {
    label: 'Ajustes',
    description: 'Equipo, roles y preferencias',
    icon: Settings,
    to: '/admin/ajustes',
  },
];

export function AdminLayout({
  actionSlot,
  children,
  onAddProduct,
  onSearchChange,
  pageTitle = 'Panel de la joyería',
  searchPlaceholder = 'Buscar por nombre, SKU o colección',
  searchValue,
  showHeaderSearch = true,
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(event.target.value);
  };

  const handleToggleDrawer = () => {
    setIsSidebarOpen((previous) => !previous);
  };

  const handleCollapse = () => {
    setIsSidebarCollapsed((previous) => !previous);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-[260px] border-r border-border/70 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out',
          isSidebarCollapsed ? 'lg:w-[88px]' : 'lg:w-[260px]',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col px-4 py-5">
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/70 px-4 py-3 shadow-xs">
            {isSidebarCollapsed ? (
              <span className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground lg:flex">
                DJ
              </span>
            ) : (
              <Link to="/" className="flex flex-col gap-1">
                <span className="text-[0.68rem] uppercase tracking-[0.32em] text-muted-foreground">Diego Joyero</span>
                <span className="font-display text-base tracking-[0.22em]">Administración</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleToggleDrawer}
              className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              aria-label={isSidebarOpen ? 'Cerrar navegación' : 'Abrir navegación'}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-5 flex flex-col gap-1.5">
            {navigation.map(({ description, icon: Icon, label, to }) => (
              <NavLink
                key={label}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center rounded-xl border border-transparent transition-colors duration-300',
                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2.5',
                    isActive
                      ? 'border-border bg-muted/50 text-foreground'
                      : 'text-muted-foreground hover:border-border/80 hover:bg-muted/40'
                  )
                }
                onClick={() => setIsSidebarOpen(false)}
                aria-label={isSidebarCollapsed ? label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-colors',
                        isSidebarCollapsed && 'h-10 w-10',
                        isActive && 'border-foreground/60 bg-foreground text-background'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {isSidebarCollapsed ? null : (
                      <div className="flex flex-1 flex-col text-left">
                        <span className="text-sm font-medium tracking-wide text-foreground">{label}</span>
                        <span className="text-[0.7rem] text-muted-foreground">{description}</span>
                      </div>
                    )}
                    {isSidebarCollapsed ? null : (
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div
            className={cn(
              'mt-3 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground shadow-xs',
              isSidebarCollapsed && 'flex flex-col items-center text-center'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-muted text-xs font-semibold">
                DJ
              </div>
              {isSidebarCollapsed ? null : (
                <div className="flex min-w-0 flex-col text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground">
                  <span className="truncate" title={user?.email ?? undefined}>{user?.email ?? 'Cuenta'}</span>
                  <span className="whitespace-nowrap text-foreground/80">Administrador</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className={cn(
                'mt-2.5 w-full gap-2 border-border/70 text-[0.68rem] uppercase tracking-[0.28em] transition-colors',
                isSidebarCollapsed ? 'justify-center px-0' : 'justify-start'
              )}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              {isSidebarCollapsed ? null : 'Cerrar sesión'}
            </Button>
          </div>
        </div>
      </aside>

      <div
        className={cn(
          'relative flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ease-in-out',
          'lg:pl-[260px]',
          isSidebarCollapsed && 'lg:pl-[88px]'
        )}
      >
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleToggleDrawer}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground transition-colors hover:bg-muted/60 lg:hidden"
              aria-label="Abrir navegación"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex flex-1 flex-col gap-1">
              <span className="text-[0.7rem] uppercase tracking-[0.35em] text-muted-foreground">Administración</span>
              <h1 className="font-display text-lg tracking-[0.25em]">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCollapse}
                className="hidden h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground transition-colors hover:bg-muted/60 lg:inline-flex"
                aria-label={isSidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
              >
                {isSidebarCollapsed ? <PanelRightOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="hidden h-10 items-center gap-2 rounded-lg border border-border/80 px-3 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:bg-muted/50 md:inline-flex"
              >
                {theme === 'gold' ? 'Modo plata' : 'Modo oro'}
              </button>
              {onAddProduct ? (
                <Button size="sm" className="hidden gap-2 font-medium tracking-wide md:inline-flex" onClick={onAddProduct}>
                  <ImagePlus className="h-4 w-4" />
                  Nuevo producto
                </Button>
              ) : null}
            </div>
          </div>

          {showHeaderSearch ? (
            <div className="border-t border-border/60 bg-background/90 px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-3 md:w-auto">
                  <div className="relative w-full md:w-[360px]">
                    <input
                      type="search"
                      placeholder={searchPlaceholder}
                      value={searchValue}
                      onChange={handleSearchChange}
                      className="w-full rounded-lg border border-border/80 bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                </div>
                <div className="flex w-full items-center gap-2 md:w-auto">
                  <Button variant="secondary" className="flex-1 gap-2 text-xs uppercase tracking-[0.3em] md:flex-none">
                    Exportar catálogo
                  </Button>
                  {onAddProduct ? (
                    <Button
                      size="sm"
                      className="flex-1 gap-2 pl-3 pr-3 text-xs uppercase tracking-[0.3em] md:hidden"
                      onClick={onAddProduct}
                    >
                      <ImagePlus className="h-4 w-4" />
                      Cargar producto
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </header>

        <main className="flex-1 min-w-0 px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:gap-10 lg:max-w-full">
            {actionSlot}
            {children}
          </div>
        </main>
      </div>

      {isSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={handleToggleDrawer}
          aria-label="Cerrar menú"
        />
      ) : null}
    </div>
  );
}

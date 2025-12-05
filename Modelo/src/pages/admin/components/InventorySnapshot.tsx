import type { ElementType } from 'react';
import { CalendarClock, Layers3, Power, PowerOff, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export interface InventorySnapshotProps {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  lastProductAdded?: {
    name: string;
    addedAt: string;
  };
}

export function InventorySnapshot({
  totalProducts,
  activeProducts,
  inactiveProducts,
  lowStockProducts,
  lastProductAdded,
}: InventorySnapshotProps) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          Resumen de inventario
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <SnapshotItem
          icon={Layers3}
          label="Total de productos"
          value={totalProducts.toString()}
          helper="Referencias registradas"
        />
        <SnapshotItem
          icon={Power}
          label="Activos"
          value={activeProducts.toString()}
          helper="Mostrándose en el catálogo"
          tone="success"
        />
        <SnapshotItem
          icon={ShieldAlert}
          label="Stock bajo"
          value={lowStockProducts.toString()}
          helper="Menos de 3 piezas disponibles"
          tone="warning"
        />
        <SnapshotItem
          icon={CalendarClock}
          label="Último producto"
          value={lastProductAdded?.name ?? 'Sin registros'}
          helper={lastProductAdded?.addedAt ?? 'Agrega productos para comenzar'}
        />
        <SnapshotItem
          icon={PowerOff}
          label="Inactivos"
          value={inactiveProducts.toString()}
          helper="Ocultos al público"
        />
      </CardContent>
    </Card>
  );
}

function SnapshotItem({
  icon: Icon,
  label,
  value,
  helper,
  tone = 'default',
}: {
  icon: ElementType;
  label: string;
  value: string;
  helper: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/90 p-4 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex flex-col gap-2">
        <span className="text-[0.72rem] uppercase tracking-[0.26em] text-muted-foreground">{label}</span>
        <span
          className={
            tone === 'success'
              ? 'font-display text-2xl tracking-[0.18em] text-emerald-600'
              : tone === 'warning'
              ? 'font-display text-2xl tracking-[0.18em] text-amber-600'
              : 'font-display text-2xl tracking-[0.18em] text-foreground'
          }
        >
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{helper}</span>
      </div>
    </div>
  );
}

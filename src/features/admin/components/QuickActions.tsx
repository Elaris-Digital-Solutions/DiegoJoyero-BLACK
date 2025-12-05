import { FileSpreadsheet, Loader2, PackagePlus, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickActionsProps {
  onCreateProduct?: () => void;
  onImportProducts?: () => void;
  onSyncInventory?: () => void;
  isImporting?: boolean;
  isSyncing?: boolean;
}

export function QuickActions({ onCreateProduct, onImportProducts, onSyncInventory, isImporting, isSyncing }: QuickActionsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <ActionCard
        title="Subir producto nuevo"
        description="Completa datos clave y publícalo en segundos."
        buttonLabel="Subir producto"
        icon={PackagePlus}
        onClick={onCreateProduct}
      />
      <ActionCard
        title="Cargar desde Excel"
        description="Importa precios y stock desde tu archivo XLSX o CSV."
        buttonLabel="Importar lote"
        icon={FileSpreadsheet}
        onClick={onImportProducts}
        variant="secondary"
        isLoading={Boolean(isImporting)}
        loadingLabel="Importando…"
      />
      <ActionCard
        title="Actualizar inventario"
        description="Sincroniza con tienda física o ajusta existencias masivas."
        buttonLabel="Actualizar stock"
        icon={RefreshCcw}
        onClick={onSyncInventory}
        variant="outline"
        isLoading={Boolean(isSyncing)}
        loadingLabel="Sincronizando…"
      />
    </section>
  );
}

function ActionCard({
  title,
  description,
  buttonLabel,
  icon: Icon,
  onClick,
  variant = 'default',
  isLoading = false,
  loadingLabel,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon: typeof PackagePlus;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline';
  isLoading?: boolean;
  loadingLabel?: string;
}) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <CardTitle className="text-base font-semibold tracking-[0.18em] text-foreground">
            {title}
          </CardTitle>
        </div>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full gap-2"
          variant={variant}
          onClick={isLoading ? undefined : onClick}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
          {isLoading ? loadingLabel ?? 'Procesando…' : buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

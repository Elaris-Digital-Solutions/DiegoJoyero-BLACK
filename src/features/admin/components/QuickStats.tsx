import type { ElementType } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface QuickStatItem {
  id: string;
  label: string;
  value: string;
  helper?: string;
  icon: ElementType;
  tone?: 'default' | 'success' | 'warning';
}

interface QuickStatsProps {
  items: QuickStatItem[];
}

export function QuickStats({ items }: QuickStatsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ id, label, value, helper, icon: Icon, tone = 'default' }) => (
        <Card
          key={id}
          className="border border-border/70 bg-card/70 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <span
              className={cn(
                'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary',
                tone === 'success' && 'bg-emerald-50 text-emerald-600',
                tone === 'warning' && 'bg-amber-50 text-amber-600'
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-[0.76rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {label}
              </CardTitle>
              {helper ? (
                <CardDescription className="text-xs text-muted-foreground/80">{helper}</CardDescription>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <span className="font-display text-3xl tracking-[0.14em] text-foreground">{value}</span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

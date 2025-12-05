import type { ElementType } from 'react';
import { Clock3, Download, PackagePlus, PencilLine, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export type ActivityAction = 'create' | 'update' | 'delete' | 'import';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  action: ActivityAction;
}

const actionIcon: Record<ActivityAction, ElementType> = {
  create: PackagePlus,
  update: PencilLine,
  delete: Trash2,
  import: Download,
};

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          Actividad reciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const Icon = actionIcon[item.action] ?? PackagePlus;
          return (
            <article
              key={item.id}
              className="flex gap-3 rounded-xl border border-border/60 bg-background/90 px-4 py-3 shadow-sm"
            >
              <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground/90">{item.description}</p>
                <span className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground/80">
                  <Clock3 className="h-3 w-3" />
                  {item.timestamp}
                </span>
              </div>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}

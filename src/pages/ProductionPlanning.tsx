import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductionPlanning() {
  const { state } = useBrandLaunch();
  const batches = state.productionBatches.filter(b =>
    state.selectedBrandId === 'all' || b.brandId === state.selectedBrandId
  );

  const completed = batches.filter(b => b.status === 'completed').length;
  const inProgress = batches.filter(b => b.status === 'in-progress').length;
  const totalCases = batches.reduce((s, b) => s + b.batchSize, 0);

  // Gantt-like timeline
  const plants = [...new Set(batches.map(b => b.plant))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Production Planning</h1>
        <p className="text-sm text-muted-foreground">Manufacturing scheduling and batch management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Batches" value={batches.length} icon={Factory} />
        <KPICard title="In Production" value={inProgress} icon={Clock} highlight />
        <KPICard title="Completed" value={completed} icon={CheckCircle2} />
        <KPICard title="Total Cases" value={totalCases.toLocaleString()} icon={Factory} subtitle="Planned output" />
      </div>

      {/* Gantt Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Production Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plants.map(plant => (
              <div key={plant}>
                <p className="text-xs font-medium text-muted-foreground mb-2">{plant}</p>
                <div className="space-y-1.5">
                  {batches.filter(b => b.plant === plant).map(batch => (
                    <div key={batch.id} className="flex items-center gap-3">
                      <span className="text-xs w-16 font-mono text-muted-foreground">{batch.batchId}</span>
                      <div className="flex-1 h-8 bg-muted rounded relative overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded flex items-center px-2',
                            batch.status === 'completed' ? 'bg-success/20 text-success' :
                            batch.status === 'in-progress' ? 'bg-gold/20 text-gold' :
                            batch.status === 'delayed' ? 'bg-destructive/20 text-destructive' :
                            'bg-info/20 text-info'
                          )}
                          style={{ width: batch.status === 'completed' ? '100%' : batch.status === 'in-progress' ? '60%' : '30%' }}
                        >
                          <span className="text-[10px] font-medium truncate">{batch.product} · {batch.batchSize.toLocaleString()} cases</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground w-20">{batch.startDate}</span>
                      <StatusBadge status={batch.status} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Production Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b">
              <th className="text-left py-2 text-xs text-muted-foreground">Batch ID</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Plant</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Product</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Size</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Start</th>
              <th className="text-left py-2 text-xs text-muted-foreground">End</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Status</th>
            </tr></thead>
            <tbody>
              {batches.map(b => (
                <tr key={b.id} className="border-b border-border/50">
                  <td className="py-2.5 font-mono text-xs font-medium">{b.batchId}</td>
                  <td className="py-2.5">{b.plant}</td>
                  <td className="py-2.5">{b.product}</td>
                  <td className="py-2.5">{b.batchSize.toLocaleString()} cases</td>
                  <td className="py-2.5 text-muted-foreground">{b.startDate}</td>
                  <td className="py-2.5 text-muted-foreground">{b.endDate}</td>
                  <td className="py-2.5"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import { Factory, Clock, CheckCircle2, AlertTriangle, Send, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const MANUFACTURING_STAGE_KEY = 'manufacturing' as const;

export default function ProductionPlanning() {
  const { state, dispatch } = useBrandLaunch();
  const batches = state.productionBatches.filter(
    (b) => state.selectedBrandId === 'all' || b.brandId === state.selectedBrandId
  );

  const completed = batches.filter((b) => b.status === 'completed').length;
  const inProgress = batches.filter((b) => b.status === 'in-progress').length;
  const totalCases = batches.reduce((s, b) => s + b.batchSize, 0);

  // Gantt-like timeline
  const plants = [...new Set(batches.map((b) => b.plant))];
  const brand = state.selectedBrandId !== 'all'
    ? state.brands.find((b) => b.id === state.selectedBrandId)
    : state.brands[0];
  const mfgGate = brand?.stageGates.find((g) => g.key === MANUFACTURING_STAGE_KEY);
  const canSubmitMfg = mfgGate?.status === 'in-progress' && mfgGate.subTasks.every((t) => t.completed);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Planning"
        description="Manufacturing scheduling and batch management"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Production Planning' }]}
      />

      <BrandBriefCard />

      {brand && mfgGate && (
        <Card className={mfgGate.status === 'pending-approval' ? 'border-gold/50' : ''}>
          <CardContent className="py-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Manufacturing Stage Gate</p>
              <p className="text-sm text-muted-foreground">
                {brand.name} · <StatusBadge status={mfgGate.status} />
                {mfgGate.subTasks.some((t) => !t.completed) && (
                  <span className="ml-2">
                    {mfgGate.subTasks.filter((t) => t.completed).length}/{mfgGate.subTasks.length} sub-tasks complete
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/lifecycle" state={{ brandId: brand.id }}><ExternalLink className="h-3.5 w-3.5 mr-1" />View Lifecycle</Link>
              </Button>
              {canSubmitMfg && (
                <Button size="sm" onClick={() => dispatch({ type: 'SUBMIT_FOR_APPROVAL', brandId: brand.id, stageKey: MANUFACTURING_STAGE_KEY })}>
                  <Send className="h-3.5 w-3.5 mr-1" />Submit for approval
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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

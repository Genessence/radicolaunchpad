import { Link } from 'react-router-dom';
import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import { Megaphone, CheckCircle2, Clock, AlertCircle, Send, ExternalLink } from 'lucide-react';

const MARKETING_STAGE_KEY = 'marketing' as const;

export default function MarketingReadiness() {
  const { state, dispatch } = useBrandLaunch();
  const assets = state.marketingAssets.filter(
    (a) => state.selectedBrandId === 'all' || a.brandId === state.selectedBrandId
  );

  const ready = assets.filter((a) => a.status === 'ready' || a.status === 'completed').length;
  const total = assets.length;
  const readiness = total > 0 ? Math.round((ready / total) * 100) : 0;
  const brand = state.selectedBrandId !== 'all'
    ? state.brands.find((b) => b.id === state.selectedBrandId)
    : state.brands[0];
  const mktGate = brand?.stageGates.find((g) => g.key === MARKETING_STAGE_KEY);
  const canSubmitMkt = mktGate?.status === 'in-progress' && mktGate.subTasks.every((t) => t.completed);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Readiness"
        description="Campaign, POS, and launch asset tracking"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Marketing Readiness' }]}
      />

      <BrandBriefCard />

      {brand && mktGate && (
        <Card className={mktGate.status === 'pending-approval' ? 'border-gold/50' : ''}>
          <CardContent className="py-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Stage Gate</p>
              <p className="text-sm text-muted-foreground">
                {brand.name} · <StatusBadge status={mktGate.status} />
                {mktGate.subTasks.some((t) => !t.completed) && (
                  <span className="ml-2">
                    {mktGate.subTasks.filter((t) => t.completed).length}/{mktGate.subTasks.length} sub-tasks complete
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/lifecycle" state={{ brandId: brand.id }}><ExternalLink className="h-3.5 w-3.5 mr-1" />View Lifecycle</Link>
              </Button>
              {canSubmitMkt && (
                <Button size="sm" onClick={() => dispatch({ type: 'SUBMIT_FOR_APPROVAL', brandId: brand.id, stageKey: MARKETING_STAGE_KEY })}>
                  <Send className="h-3.5 w-3.5 mr-1" />Submit for approval
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Marketing Readiness" value={`${readiness}%`} icon={Megaphone} highlight />
        <KPICard title="Assets Ready" value={`${ready}/${total}`} icon={CheckCircle2} />
        <KPICard title="In Progress" value={assets.filter(a => a.status === 'in-progress').length} icon={Clock} />
        <KPICard title="Pending" value={assets.filter(a => a.status === 'pending').length} icon={AlertCircle} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Marketing Launch Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b">
              <th className="text-left py-2 text-xs text-muted-foreground">Asset</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Status</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Owner</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Due Date</th>
            </tr></thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{a.asset}</td>
                  <td className="py-2.5"><StatusBadge status={a.status} /></td>
                  <td className="py-2.5 text-muted-foreground">{a.owner}</td>
                  <td className="py-2.5 text-muted-foreground">{a.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Overall Marketing Readiness</p>
          <div className="flex items-center gap-4">
            <Progress value={readiness} className="h-4 flex-1" />
            <span className="text-2xl font-bold text-gold">{readiness}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

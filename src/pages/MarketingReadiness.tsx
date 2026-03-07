import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function MarketingReadiness() {
  const { state } = useBrandLaunch();
  const assets = state.marketingAssets.filter(a =>
    state.selectedBrandId === 'all' || a.brandId === state.selectedBrandId
  );

  const ready = assets.filter(a => a.status === 'ready' || a.status === 'completed').length;
  const total = assets.length;
  const readiness = total > 0 ? Math.round((ready / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketing Readiness</h1>
        <p className="text-sm text-muted-foreground">Campaign, POS, and launch asset tracking</p>
      </div>

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

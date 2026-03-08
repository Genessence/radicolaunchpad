import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import { Truck, Users, FileCheck, MapPin } from 'lucide-react';

export default function DistributorReadiness() {
  const { state } = useBrandLaunch();
  const distributors = state.distributors.filter(
    (d) => state.selectedBrandId === 'all' || d.brandId === state.selectedBrandId
  );

  const activeDistributors = distributors.filter((d) => d.licenseStatus === 'approved').length;
  const avgReadiness =
    distributors.length > 0
      ? Math.round(distributors.reduce((s, d) => s + d.readinessScore, 0) / distributors.length)
      : 0;
  const pendingLicenses = distributors.filter((d) => d.licenseStatus === 'pending').length;

  // Group by state for coverage map
  const stateGroups = distributors.reduce((acc, d) => {
    if (!acc[d.state]) acc[d.state] = [];
    acc[d.state].push(d);
    return acc;
  }, {} as Record<string, typeof distributors>);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Distributor Readiness"
        description="Distributor licensing, inventory, and coverage tracking"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Distributor Readiness' }]}
      />

      <BrandBriefCard />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Active Distributors" value={activeDistributors} icon={Users} />
        <KPICard title="Avg Readiness Score" value={`${avgReadiness}%`} icon={Truck} highlight />
        <KPICard title="Pending Licenses" value={pendingLicenses} icon={FileCheck} />
        <KPICard title="Coverage States" value={Object.keys(stateGroups).length} icon={MapPin} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Distributor Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b">
              <th className="text-left py-2 text-xs text-muted-foreground">State</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Distributor</th>
              <th className="text-left py-2 text-xs text-muted-foreground">License</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Inventory</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Coverage</th>
              <th className="text-left py-2 text-xs text-muted-foreground">Readiness</th>
            </tr></thead>
            <tbody>
              {distributors.map(d => (
                <tr key={d.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{d.state}</td>
                  <td className="py-2.5">{d.name}</td>
                  <td className="py-2.5"><StatusBadge status={d.licenseStatus} /></td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={d.inventoryReadiness} className="h-1.5 w-12" />
                      <span className="text-xs">{d.inventoryReadiness}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-muted-foreground text-xs">{d.coverageArea}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={d.readinessScore} className="h-1.5 w-12" />
                      <span className="text-xs font-medium">{d.readinessScore}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Distribution Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stateGroups).map(([stateName, dists]) => {
              const avgScore = Math.round(dists.reduce((s, d) => s + d.readinessScore, 0) / dists.length);
              return (
                <div key={stateName} className="p-3 rounded border text-center">
                  <p className="font-semibold">{stateName}</p>
                  <p className="text-2xl font-bold text-gold">{avgScore}%</p>
                  <p className="text-xs text-muted-foreground">{dists.length} distributor(s)</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { KPICard } from '@/components/KPICard';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import { ShieldCheck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ComplianceTracker() {
  const { state, dispatch } = useBrandLaunch();
  const compliance = state.stateCompliance.filter(
    (c) => state.selectedBrandId === 'all' || c.brandId === state.selectedBrandId
  );

  const totalApproved = compliance.reduce((sum, c) => {
    return sum + (c.labelRegistration === 'approved' ? 1 : 0) + (c.brandRegistration === 'approved' ? 1 : 0) + (c.priceApproval === 'approved' ? 1 : 0);
  }, 0);
  const totalFields = compliance.length * 3;
  const complianceScore = totalFields > 0 ? Math.round((totalApproved / totalFields) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance Tracker"
        description="State-by-state regulatory approval tracking"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Compliance Tracker' }]}
      />

      <BrandBriefCard />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Compliance Score" value={`${complianceScore}%`} icon={ShieldCheck} highlight />
        <KPICard title="Total Approvals" value={`${totalApproved}/${totalFields}`} icon={CheckCircle2} />
        <KPICard title="Pending" value={compliance.filter(c => c.labelRegistration === 'pending' || c.brandRegistration === 'pending' || c.priceApproval === 'pending').length} icon={Clock} />
        <KPICard title="Delayed" value={compliance.filter(c => c.labelRegistration === 'delayed' || c.brandRegistration === 'delayed' || c.priceApproval === 'delayed').length} icon={AlertTriangle} />
      </div>

      {/* Avg State Approval Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg State Approval Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {compliance.map(c => (
              <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded bg-muted border">
                <span className="font-semibold text-sm">{c.state}</span>
                <span className="text-xs text-muted-foreground">→</span>
                <span className="text-sm font-medium text-gold">{c.avgApprovalDays} days</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Excise & State Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-xs text-muted-foreground">State</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Label Registration</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Brand Registration</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Price Approval</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Excise Category</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Renewal</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {compliance.map(c => (
                  <tr key={c.id} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{c.state}</td>
                    <td className="py-2.5"><StatusBadge status={c.labelRegistration} /></td>
                    <td className="py-2.5"><StatusBadge status={c.brandRegistration} /></td>
                    <td className="py-2.5"><StatusBadge status={c.priceApproval} /></td>
                    <td className="py-2.5 text-muted-foreground text-xs">{c.exciseDutyCategory}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">{c.renewalDate}</td>
                    <td className="py-2.5">
                      {(c.labelRegistration === 'pending' || c.priceApproval === 'pending') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => dispatch({ type: 'SIMULATE_APPROVAL', brandId: c.brandId, state: c.state })}
                        >
                          Approve All
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

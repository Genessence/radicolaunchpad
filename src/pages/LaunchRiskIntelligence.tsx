import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from '@/components/KPICard';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import { AlertTriangle, IndianRupee, Clock, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

const delayTrends = [
  { month: 'Oct', days: 22 }, { month: 'Nov', days: 28 }, { month: 'Dec', days: 35 },
  { month: 'Jan', days: 30 }, { month: 'Feb', days: 42 }, { month: 'Mar', days: 38 },
];

const bottleneckData = [
  { name: 'Label', UP: 5, MH: 12, KA: 8 },
  { name: 'Brand', UP: 3, MH: 8, KA: 6 },
  { name: 'Price', UP: 10, MH: 15, KA: 12 },
  { name: 'Excise', UP: 2, MH: 5, KA: 3 },
];

export default function LaunchRiskIntelligence() {
  const { state } = useBrandLaunch();
  const alerts = state.riskAlerts.filter(
    (r) => state.selectedBrandId === 'all' || r.brandId === state.selectedBrandId
  );

  const activeAlerts = alerts.filter((r) => r.status === 'active');
  const totalImpact = activeAlerts.reduce((s, r) => s + r.projectedRevenueImpact, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Launch Risk Intelligence"
        description="AI-driven risk monitoring and bottleneck analysis"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Launch Risk Intelligence' }]}
      />

      <BrandBriefCard />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Active Risks" value={activeAlerts.length} icon={AlertTriangle} highlight />
        <KPICard title="Revenue at Risk" value={`₹${totalImpact} Cr`} icon={IndianRupee} />
        <KPICard title="Max Delay" value={`${Math.max(...activeAlerts.map(a => a.estimatedDelay), 0)} Days`} icon={Clock} />
        <KPICard title="Critical Risks" value={activeAlerts.filter(a => a.severity === 'critical').length} icon={TrendingDown} />
      </div>

      <div className="grid gap-4">
        {activeAlerts.map(alert => {
          const brand = state.brands.find(b => b.id === alert.brandId);
          return (
            <Card key={alert.id} className="border-l-4 border-l-destructive/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <h3 className="font-semibold text-sm">{alert.type}</h3>
                      <StatusBadge status={alert.severity} />
                    </div>
                    {brand && <p className="text-xs text-muted-foreground mb-2">{brand.name}</p>}
                    <p className="text-sm">{alert.recommendedAction}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs text-muted-foreground">Revenue Impact</p>
                    <p className="text-lg font-bold text-destructive">₹{alert.projectedRevenueImpact} Cr</p>
                    <p className="text-xs text-muted-foreground">Est. Delay: {alert.estimatedDelay} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Approval Delay Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={delayTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Line type="monotone" dataKey="days" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bottleneck Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bottleneckData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="UP" fill="hsl(220, 60%, 20%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="MH" fill="hsl(42, 75%, 55%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="KA" fill="hsl(199, 89%, 48%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

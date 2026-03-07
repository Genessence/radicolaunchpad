import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { calculateLaunchReadiness, getTotalProjectedRevenue, LIFECYCLE_STAGES } from '@/data/mockData';
import { KPICard } from '@/components/KPICard';
import { ReadinessGauge } from '@/components/ReadinessGauge';
import { StatusBadge } from '@/components/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, Cell, LabelList, PieChart, Pie, LineChart, Line,
} from 'recharts';
import {
  Briefcase, TrendingUp, IndianRupee, AlertTriangle, Clock, Zap, ArrowRight,
  CheckCircle2, Activity,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CHART_COLORS = ['hsl(220, 60%, 20%)', 'hsl(42, 75%, 55%)', 'hsl(220, 50%, 30%)', 'hsl(42, 65%, 45%)', 'hsl(199, 89%, 48%)'];

export default function Dashboard() {
  const { state, dispatch, getFilteredBrands, getOverallReadiness } = useBrandLaunch();
  const navigate = useNavigate();
  const brands = getFilteredBrands();
  const readiness = getOverallReadiness();
  const totalRevenue = getTotalProjectedRevenue(brands);
  const [delayDays, setDelayDays] = useState([30]);

  const pendingApprovals = state.stateCompliance.filter(c =>
    (state.selectedBrandId === 'all' || c.brandId === state.selectedBrandId) &&
    (c.labelRegistration === 'pending' || c.brandRegistration === 'pending' || c.priceApproval === 'pending')
  ).length;

  // Readiness breakdown (avg across filtered brands)
  const avgReadiness = brands.length > 0 ? {
    compliance: Math.round(brands.reduce((s, b) => s + b.readiness.compliance, 0) / brands.length),
    production: Math.round(brands.reduce((s, b) => s + b.readiness.production, 0) / brands.length),
    distributor: Math.round(brands.reduce((s, b) => s + b.readiness.distributor, 0) / brands.length),
    marketing: Math.round(brands.reduce((s, b) => s + b.readiness.marketing, 0) / brands.length),
  } : { compliance: 0, production: 0, distributor: 0, marketing: 0 };

  // Revenue by state
  const revenueByState = state.stateOpportunities
    .filter(s => s.projectedRevenue > 0)
    .sort((a, b) => b.projectedRevenue - a.projectedRevenue)
    .slice(0, 6)
    .map(s => ({ name: s.stateCode, revenue: s.projectedRevenue }));

  // Funnel data
  const funnelData = LIFECYCLE_STAGES.map(stage => ({
    name: stage.label,
    value: state.brands.filter(b => {
      const stageIdx = LIFECYCLE_STAGES.findIndex(s => s.key === stage.key);
      const brandIdx = LIFECYCLE_STAGES.findIndex(s => s.key === b.currentStage);
      return brandIdx >= stageIdx;
    }).length,
  }));

  // Revenue delay impact
  const delayImpact = Math.round(totalRevenue * (delayDays[0] / 365) * 0.6);

  // Simulate approval targets
  const pendingSimulations = state.stateCompliance.filter(c =>
    c.labelRegistration === 'pending' || c.priceApproval === 'pending'
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time brand launch portfolio overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard title="Brands in Pipeline" value={brands.length} icon={Briefcase} subtitle="Active launches" />
        <KPICard title="Launch Readiness" value={`${readiness}%`} icon={TrendingUp} highlight subtitle="Composite score" />
        <KPICard title="Projected Revenue" value={`₹${totalRevenue} Cr`} icon={IndianRupee} trend={{ value: '+12% QoQ', positive: true }} />
        <KPICard title="Pending Approvals" value={pendingApprovals} icon={AlertTriangle} subtitle="Across states" />
        <KPICard title="Avg Launch Cycle" value="180 Days" icon={Clock} trend={{ value: '-8 days', positive: true }} />
      </div>

      {/* Row 2: Readiness + Funnel + Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ReadinessGauge
          score={readiness}
          breakdown={[
            { label: 'Compliance', value: avgReadiness.compliance, weight: '40%' },
            { label: 'Production', value: avgReadiness.production, weight: '25%' },
            { label: 'Distributor', value: avgReadiness.distributor, weight: '20%' },
            { label: 'Marketing', value: avgReadiness.marketing, weight: '15%' },
          ]}
        />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Launch Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {funnelData.filter(d => d.value > 0).map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 truncate">{d.name}</span>
                  <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-all"
                      style={{
                        width: `${(d.value / state.brands.length) * 100}%`,
                        backgroundColor: i % 2 === 0 ? 'hsl(var(--royal))' : 'hsl(var(--gold))',
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-6 text-right">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold" /> Next Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.nextActions.slice(0, 3).map(action => (
              <div key={action.id} className="p-2.5 rounded-md bg-muted/50 border border-border/50">
                <p className="text-sm font-medium">{action.action}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{action.owner}</span>
                  {action.revenueImpact > 0 && (
                    <span className="text-xs font-medium text-gold">₹{action.revenueImpact} Cr</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Revenue Chart + Simulate + Delay Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Revenue Forecast by State</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByState}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                  formatter={(value: number) => [`₹${value} Cr`, 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {revenueByState.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Simulate Approval */}
          <Card className="border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gold uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4" /> Simulate Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingSimulations.map(c => {
                const brand = state.brands.find(b => b.id === c.brandId);
                return (
                  <Button
                    key={c.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between text-xs border-gold/20 hover:bg-gold/10 hover:text-gold"
                    onClick={() => dispatch({ type: 'SIMULATE_APPROVAL', brandId: c.brandId, state: c.state })}
                  >
                    <span>Approve {c.state}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Delay Calculator */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Delay Cost Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">Launch Delay: <span className="font-semibold text-foreground">{delayDays[0]} Days</span></p>
              <Slider
                value={delayDays}
                onValueChange={setDelayDays}
                min={0}
                max={180}
                step={15}
                className="mb-3"
              />
              <div className="p-3 rounded bg-destructive/10 text-center">
                <p className="text-xs text-muted-foreground">Estimated Revenue Impact</p>
                <p className="text-2xl font-bold text-destructive">₹{delayImpact} Cr</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 4: Brand Pipeline Table + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Brand Launch Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Brand</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Stage</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Launch</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Readiness</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map(brand => {
                    const score = calculateLaunchReadiness(brand.readiness);
                    const stageLabel = LIFECYCLE_STAGES.find(s => s.key === brand.currentStage)?.label || '';
                    return (
                      <tr
                        key={brand.id}
                        className="border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                        onClick={() => navigate('/lifecycle', { state: { brandId: brand.id } })}
                      >
                        <td className="py-2.5 px-2 font-medium">{brand.name}</td>
                        <td className="py-2.5 px-2 text-muted-foreground">{brand.category}</td>
                        <td className="py-2.5 px-2"><StatusBadge status={brand.currentStage === brand.lifecycleStages.find(s => s.status === 'in-progress')?.stage ? 'in-progress' : 'pending'} /></td>
                        <td className="py-2.5 px-2 text-muted-foreground">{brand.targetLaunchDate}</td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-2">
                            <Progress value={score} className="h-1.5 w-16" />
                            <span className="text-xs font-medium">{score}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2"><StatusBadge status={brand.riskLevel} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4" /> Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {state.activities
                .filter(a => state.selectedBrandId === 'all' || a.brandId === state.selectedBrandId)
                .slice(0, 8)
                .map(activity => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="mt-1">
                      <CheckCircle2 className={`h-3.5 w-3.5 ${
                        activity.type === 'approval' ? 'text-success' :
                        activity.type === 'alert' ? 'text-destructive' :
                        'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs">{activity.action}</p>
                      <p className="text-[10px] text-muted-foreground">{activity.user} · {activity.timestamp}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* India State Opportunity Map */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">State Opportunity Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {state.stateOpportunities.map(s => (
              <div
                key={s.stateCode}
                className="rounded-lg border p-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{s.stateCode}</span>
                  <StatusBadge status={s.approvalStatus} />
                </div>
                <p className="text-lg font-bold text-gold">₹{s.projectedRevenue} Cr</p>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Coverage</span>
                    <span>{s.distributorCoverage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Label</span>
                    <StatusBadge status={s.labelApproval} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Price</span>
                    <StatusBadge status={s.priceApproval} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { useAuth, type Role } from '@/contexts/AuthContext';
import { calculateLaunchReadiness, getTotalProjectedRevenue, LIFECYCLE_STAGES } from '@/data/mockData';
import { demoBottleDesigns, demoLabelVersions, demoPackagingSKUs } from '@/data/mockData';
import { KPICard } from '@/components/KPICard';
import { ReadinessGauge } from '@/components/ReadinessGauge';
import { StatusBadge } from '@/components/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Briefcase, TrendingUp, IndianRupee, AlertTriangle, Clock, Zap, ArrowRight,
  CheckCircle2, Activity, FlaskConical, Star, Package, Factory, Megaphone,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CHART_COLORS = ['hsl(220, 60%, 20%)', 'hsl(42, 75%, 55%)', 'hsl(220, 50%, 30%)', 'hsl(42, 65%, 45%)', 'hsl(199, 89%, 48%)'];

function DashboardKPIs({ role }: { role: Role }) {
  const { state, dispatch, getFilteredBrands, getOverallReadiness, getPendingApprovalBrands } = useBrandLaunch();
  const brands = getFilteredBrands();
  const readiness = getOverallReadiness();
  const totalRevenue = getTotalProjectedRevenue(brands);
  const [delayDays, setDelayDays] = useState([30]);

  const pendingApprovals = state.stateCompliance.filter(
    (c) =>
      (state.selectedBrandId === 'all' || c.brandId === state.selectedBrandId) &&
      (c.labelRegistration === 'pending' || c.brandRegistration === 'pending' || c.priceApproval === 'pending')
  ).length;
  const stageGateApprovals = getPendingApprovalBrands().length;

  const trials = state.blendTrials.filter(
    (t) => state.selectedBrandId === 'all' || t.brandId === state.selectedBrandId
  );
  const trialsInProgress = trials.filter((t) => t.status === 'in-progress' || t.status === 'pending-review').length;
  const avgSensory = trials.length > 0 ? Math.round(trials.reduce((s, t) => s + t.sensoryScore, 0) / trials.length) : 0;

  const bottleDesigns = demoBottleDesigns.filter(
    (b) => state.selectedBrandId === 'all' || b.brandId === state.selectedBrandId
  );
  const labelVersions = demoLabelVersions.filter(
    (v) => state.selectedBrandId === 'all' || v.brandId === state.selectedBrandId
  );
  const skus = demoPackagingSKUs.filter(
    (s) => state.selectedBrandId === 'all' || s.brandId === state.selectedBrandId
  );
  const labelsApproved = labelVersions.filter((v) => v.status === 'approved').length;
  const skusActive = skus.filter((s) => s.status === 'active').length;

  const batches = state.productionBatches.filter(
    (b) => state.selectedBrandId === 'all' || b.brandId === state.selectedBrandId
  );
  const distributors = state.distributors.filter(
    (d) => state.selectedBrandId === 'all' || d.brandId === state.selectedBrandId
  );
  const compliance = state.stateCompliance.filter(
    (c) => state.selectedBrandId === 'all' || c.brandId === state.selectedBrandId
  );
  const complianceApproved = compliance.reduce(
    (sum, c) =>
      sum +
      (c.labelRegistration === 'approved' ? 1 : 0) +
      (c.brandRegistration === 'approved' ? 1 : 0) +
      (c.priceApproval === 'approved' ? 1 : 0),
    0
  );
  const avgDistReadiness =
    distributors.length > 0 ? Math.round(distributors.reduce((s, d) => s + d.readinessScore, 0) / distributors.length) : 0;

  const assets = state.marketingAssets.filter(
    (a) => state.selectedBrandId === 'all' || a.brandId === state.selectedBrandId
  );
  const assetsReady = assets.filter((a) => a.status === 'ready' || a.status === 'completed').length;
  const marketingReadiness = assets.length > 0 ? Math.round((assetsReady / assets.length) * 100) : 0;

  if (role === 'rd') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <KPICard title="Blend Trials" value={trials.length} icon={FlaskConical} subtitle="Total trials" />
        <KPICard title="Trials In Progress" value={trialsInProgress} icon={Clock} highlight />
        <KPICard title="Avg Sensory Score" value={avgSensory} icon={Star} subtitle="Across trials" />
        <KPICard title="Approved Trials" value={trials.filter((t) => t.status === 'approved').length} icon={CheckCircle2} />
      </div>
    );
  }
  if (role === 'packing') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <KPICard title="Bottle Designs" value={bottleDesigns.length} icon={Package} subtitle="Total designs" />
        <KPICard title="Labels Approved" value={labelsApproved} icon={CheckCircle2} highlight />
        <KPICard title="Active SKUs" value={skusActive} icon={Package} subtitle={`of ${skus.length} total`} />
        <KPICard title="Packaging Readiness" value={skus.length > 0 ? Math.round((skusActive / skus.length) * 100) : 0} icon={TrendingUp} subtitle="%" />
      </div>
    );
  }
  if (role === 'production') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard title="Production Batches" value={batches.length} icon={Factory} subtitle="Scheduled/active" />
        <KPICard title="Compliance Approvals" value={complianceApproved} icon={CheckCircle2} subtitle={`of ${compliance.length * 3} fields`} />
        <KPICard title="Distributor Readiness" value={`${avgDistReadiness}%`} icon={TrendingUp} highlight />
        <KPICard title="Active Distributors" value={distributors.filter((d) => d.licenseStatus === 'approved').length} icon={Briefcase} />
        <KPICard title="In Production" value={batches.filter((b) => b.status === 'in-progress').length} icon={Clock} />
      </div>
    );
  }
  if (role === 'marketing') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <KPICard title="Marketing Readiness" value={`${marketingReadiness}%`} icon={Megaphone} highlight />
        <KPICard title="Assets Ready" value={`${assetsReady}/${assets.length}`} icon={CheckCircle2} />
        <KPICard title="In Progress" value={assets.filter((a) => a.status === 'in-progress').length} icon={Clock} />
        <KPICard title="Pending" value={assets.filter((a) => a.status === 'pending').length} icon={AlertTriangle} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <KPICard title="Brands in Pipeline" value={brands.length} icon={Briefcase} subtitle="Active launches" />
      <KPICard title="Launch Readiness" value={`${readiness}%`} icon={TrendingUp} highlight subtitle="Composite score" />
      <KPICard title="Projected Revenue" value={`₹${totalRevenue} Cr`} icon={IndianRupee} trend={{ value: '+12% QoQ', positive: true }} />
      <KPICard title="Stage Gate Approvals" value={stageGateApprovals} icon={AlertTriangle} highlight subtitle="Pending admin review" />
      <KPICard title="State Approvals" value={pendingApprovals} icon={AlertTriangle} subtitle="Label/brand/price" />
      <KPICard title="Avg Launch Cycle" value="180 Days" icon={Clock} trend={{ value: '-8 days', positive: true }} />
    </div>
  );
}

export default function Dashboard() {
  const { state, dispatch, getFilteredBrands, getOverallReadiness, getPendingApprovalBrands } = useBrandLaunch();
  const { role } = useAuth();
  const navigate = useNavigate();
  const brands = getFilteredBrands();
  const readiness = getOverallReadiness();
  const totalRevenue = getTotalProjectedRevenue(brands);
  const [delayDays, setDelayDays] = useState([30]);

  const pendingApprovals = state.stateCompliance.filter(
    (c) =>
      (state.selectedBrandId === 'all' || c.brandId === state.selectedBrandId) &&
      (c.labelRegistration === 'pending' || c.brandRegistration === 'pending' || c.priceApproval === 'pending')
  ).length;

  const avgReadiness =
    brands.length > 0
      ? {
          compliance: Math.round(brands.reduce((s, b) => s + b.readiness.compliance, 0) / brands.length),
          production: Math.round(brands.reduce((s, b) => s + b.readiness.production, 0) / brands.length),
          distributor: Math.round(brands.reduce((s, b) => s + b.readiness.distributor, 0) / brands.length),
          marketing: Math.round(brands.reduce((s, b) => s + b.readiness.marketing, 0) / brands.length),
        }
      : { compliance: 0, production: 0, distributor: 0, marketing: 0 };

  const revenueByState = state.stateOpportunities
    .filter((s) => s.projectedRevenue > 0)
    .sort((a, b) => b.projectedRevenue - a.projectedRevenue)
    .slice(0, 6)
    .map((s) => ({ name: s.stateCode, revenue: s.projectedRevenue }));

  const funnelData = LIFECYCLE_STAGES.map((stage) => ({
    name: stage.label,
    value: state.brands.filter((b) => {
      const stageIdx = LIFECYCLE_STAGES.findIndex((s) => s.key === stage.key);
      const brandIdx = LIFECYCLE_STAGES.findIndex((s) => s.key === b.currentStage);
      return brandIdx >= stageIdx;
    }).length,
  }));

  const delayImpact = Math.round(totalRevenue * (delayDays[0] / 365) * 0.6);

  const pendingSimulations = state.stateCompliance
    .filter((c) => c.labelRegistration === 'pending' || c.priceApproval === 'pending')
    .slice(0, 3);

  const showFullDashboard = role === 'admin';

  return (
    <div className="space-y-6">
      <PageHeader
        title={role === 'admin' ? 'Executive Dashboard' : 'Dashboard'}
        description={
          role === 'admin'
            ? 'Real-time brand launch portfolio overview'
            : `Your ${role === 'rd' ? 'R&D' : role === 'packing' ? 'Packaging' : role === 'production' ? 'Production' : 'Marketing'} overview`
        }
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
      />

      <BrandBriefCard />

      <DashboardKPIs role={role ?? 'admin'} />

      {(role === 'admin' && (() => {
        const pending = getPendingApprovalBrands();
        return pending.length > 0;
      })()) && (
        <Card className="border-gold/50 bg-gold/5">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-gold" />
              <span className="font-medium">{getPendingApprovalBrands().length} stage gate(s) pending your approval</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/approvals')}>
              Review Approval Queue
            </Button>
          </CardContent>
        </Card>
      )}

      {!showFullDashboard && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {role === 'rd' && (
                <Button variant="outline" size="sm" onClick={() => navigate('/rd-blending')}>
                  R&D / Blending
                </Button>
              )}
              {role === 'packing' && (
                <Button variant="outline" size="sm" onClick={() => navigate('/packaging')}>
                  Packaging & Labels
                </Button>
              )}
              {(role === 'production' || role === 'admin') && (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/production')}>
                    Production
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/compliance')}>
                    Compliance
                  </Button>
                </>
              )}
              {role === 'marketing' && (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/marketing')}>
                    Marketing Readiness
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/analytics')}>
                    Analytics
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={() => navigate('/pipeline')}>
                Brand Pipeline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showFullDashboard && (
        <>

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
        </>
      )}
    </div>
  );
}

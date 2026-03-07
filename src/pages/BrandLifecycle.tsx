import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { LIFECYCLE_STAGES, calculateLaunchReadiness } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ReadinessGauge } from '@/components/ReadinessGauge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function BrandLifecycle() {
  const { state } = useBrandLaunch();
  const location = useLocation();
  const brandId = (location.state as any)?.brandId || state.brands[0]?.id;
  const brand = state.brands.find(b => b.id === brandId) || state.brands[0];

  if (!brand) return <p>No brand selected</p>;

  const score = calculateLaunchReadiness(brand.readiness);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <p className="text-sm text-muted-foreground">{brand.category} · Target: {brand.targetLaunchDate} · Owner: {brand.owner}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">{brand.targetStates.join(', ')}</Badge>
          <StatusBadge status={brand.riskLevel} />
        </div>
      </div>

      {/* Lifecycle Timeline */}
      <Card>
        <CardContent className="py-6 overflow-x-auto">
          <div className="flex items-center min-w-[900px]">
            {brand.lifecycleStages.map((stage, i) => (
              <div key={stage.stage} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2',
                    stage.status === 'completed' ? 'bg-success/10 border-success text-success' :
                    stage.status === 'in-progress' ? 'bg-gold/10 border-gold text-gold animate-pulse-gold' :
                    'bg-muted border-border text-muted-foreground'
                  )}>
                    {stage.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                     stage.status === 'in-progress' ? <Clock className="h-5 w-5" /> :
                     <Circle className="h-5 w-5" />}
                  </div>
                  <p className={cn('text-[11px] font-medium max-w-[80px]',
                    stage.status === 'in-progress' ? 'text-gold' :
                    stage.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {LIFECYCLE_STAGES.find(s => s.key === stage.stage)?.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stage.deadline}</p>
                  <p className="text-[10px] text-muted-foreground">{stage.owner}</p>
                </div>
                {i < brand.lifecycleStages.length - 1 && (
                  <div className={cn(
                    'h-0.5 w-full min-w-[20px]',
                    stage.status === 'completed' ? 'bg-success' : 'bg-border'
                  )} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground">Category</p><p className="font-medium">{brand.category}</p></div>
                    <div><p className="text-xs text-muted-foreground">Target Launch</p><p className="font-medium">{brand.targetLaunchDate}</p></div>
                    <div><p className="text-xs text-muted-foreground">Owner</p><p className="font-medium">{brand.owner}</p></div>
                    <div><p className="text-xs text-muted-foreground">Projected Revenue</p><p className="font-medium text-gold">₹{brand.projectedRevenue} Cr</p></div>
                    <div><p className="text-xs text-muted-foreground">Target States</p><div className="flex gap-1 mt-1">{brand.targetStates.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div></div>
                    <div><p className="text-xs text-muted-foreground">Current Stage</p><Badge variant="outline">{LIFECYCLE_STAGES.find(s => s.key === brand.currentStage)?.label}</Badge></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tasks" className="mt-4">
              <Card><CardContent className="p-5">
                <div className="space-y-3">
                  {state.nextActions.filter(a => a.brandId === brand.id).map(action => (
                    <div key={action.id} className="flex items-center justify-between p-3 rounded bg-muted/50 border">
                      <div>
                        <p className="text-sm font-medium">{action.action}</p>
                        <p className="text-xs text-muted-foreground">{action.owner}</p>
                      </div>
                      <StatusBadge status={action.priority} />
                    </div>
                  ))}
                  {state.nextActions.filter(a => a.brandId === brand.id).length === 0 && (
                    <p className="text-sm text-muted-foreground">No pending tasks</p>
                  )}
                </div>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="approvals" className="mt-4">
              <Card><CardContent className="p-5">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-2 text-xs text-muted-foreground">State</th><th className="text-left py-2 text-xs text-muted-foreground">Label</th><th className="text-left py-2 text-xs text-muted-foreground">Brand</th><th className="text-left py-2 text-xs text-muted-foreground">Price</th></tr></thead>
                  <tbody>
                    {state.stateCompliance.filter(c => c.brandId === brand.id).map(c => (
                      <tr key={c.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{c.state}</td>
                        <td className="py-2"><StatusBadge status={c.labelRegistration} /></td>
                        <td className="py-2"><StatusBadge status={c.brandRegistration} /></td>
                        <td className="py-2"><StatusBadge status={c.priceApproval} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="documents" className="mt-4">
              <Card><CardContent className="p-5 text-sm text-muted-foreground">Document management — upload label artwork, compliance certificates, production reports.</CardContent></Card>
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <Card><CardContent className="p-5 space-y-3">
                {state.activities.filter(a => a.brandId === brand.id).map(a => (
                  <div key={a.id} className="flex gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div><p>{a.action}</p><p className="text-xs text-muted-foreground">{a.user} · {a.timestamp}</p></div>
                  </div>
                ))}
              </CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>

        <ReadinessGauge
          score={score}
          breakdown={[
            { label: 'Compliance', value: brand.readiness.compliance, weight: '40%' },
            { label: 'Production', value: brand.readiness.production, weight: '25%' },
            { label: 'Distributor', value: brand.readiness.distributor, weight: '20%' },
            { label: 'Marketing', value: brand.readiness.marketing, weight: '15%' },
          ]}
        />
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LIFECYCLE_STAGES,
  calculateLaunchReadiness,
  getStageDelay,
  STAGE_DEFAULT_DURATIONS,
  StageGate,
  StageGateKey,
} from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ReadinessGauge } from '@/components/ReadinessGauge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  Send,
  AlertTriangle,
  IndianRupee,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

function StageGateCard({
  gate,
  brandId,
  dispatch,
  isAdmin,
  expanded,
  onToggle,
}: {
  gate: StageGate;
  brandId: string;
  dispatch: React.Dispatch<any>;
  isAdmin: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const delay = gate.actualEnd && gate.plannedEnd ? getStageDelay(gate.plannedEnd, gate.actualEnd) : null;
  const allSubTasksComplete = gate.subTasks.every((t) => t.completed);
  const canSubmit = gate.status === 'in-progress' && allSubTasksComplete;
  const showApproveReject = isAdmin && gate.status === 'pending-approval';

  const handleCompleteSubTask = (subTaskId: string) => {
    dispatch({ type: 'COMPLETE_SUB_TASK', brandId, stageKey: gate.key, subTaskId });
  };

  const handleSubmitForApproval = () => {
    if (!canSubmit) return;
    dispatch({ type: 'SUBMIT_FOR_APPROVAL', brandId, stageKey: gate.key });
  };

  const handleApprove = () => {
    dispatch({ type: 'APPROVE_STAGE', brandId, stageKey: gate.key, approvedBy: 'Admin' });
  };

  const handleReject = () => {
    const comment = prompt('Rejection reason (optional):') || 'Changes requested';
    dispatch({ type: 'REJECT_STAGE', brandId, stageKey: gate.key, comment });
  };

  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <Card className={cn(
        'overflow-hidden transition-colors',
        gate.status === 'pending-approval' && 'ring-2 ring-gold/50',
        gate.status === 'in-progress' && 'border-gold/30',
      )}>
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="py-4 px-5 flex flex-row items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2 shrink-0">
                {expanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center border-2',
                  gate.status === 'completed' && 'bg-success/10 border-success text-success',
                  gate.status === 'in-progress' && 'bg-gold/10 border-gold text-gold',
                  gate.status === 'pending-approval' && 'bg-gold/20 border-gold text-gold animate-pulse',
                  gate.status === 'not-started' && 'bg-muted border-border text-muted-foreground',
                )}>
                  {gate.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : gate.status === 'in-progress' || gate.status === 'pending-approval' ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{gate.label}</span>
                  <StatusBadge status={gate.status} />
                  {delay != null && delay > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {delay}d delay
                    </Badge>
                  )}
                  {gate.owner && (
                    <span className="text-xs text-muted-foreground">{gate.owner}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  {gate.plannedStart && (
                    <span>Planned: {gate.plannedStart} → {gate.plannedEnd}</span>
                  )}
                  {gate.actualStart && (
                    <span>Actual: {gate.actualStart}{gate.actualEnd ? ` → ${gate.actualEnd}` : ''}</span>
                  )}
                  {(gate.budget != null || gate.actualCost != null) && (
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {gate.budget != null && `Budget: ₹${gate.budget}L`}
                      {gate.actualCost != null && ` · Actual: ₹${gate.actualCost}L`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {showApproveReject && (
                  <>
                    <Button size="sm" variant="default" onClick={(e) => { e.stopPropagation(); handleApprove(); }}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleReject(); }}>
                      Reject
                    </Button>
                  </>
                )}
                {canSubmit && !showApproveReject && (
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleSubmitForApproval(); }}>
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Submit for approval
                  </Button>
                )}
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 px-5 pb-5 border-t">
            <div className="pt-4 space-y-4">
              {gate.rejectionComment && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  Rejection: {gate.rejectionComment}
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Sub-tasks (complete all to submit)</p>
                <div className="space-y-2">
                  {gate.subTasks.map((t) => (
                    <label
                      key={t.id}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors',
                        t.completed ? 'bg-success/5' : 'hover:bg-muted/50',
                        gate.status === 'completed' && 'cursor-default',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => gate.status !== 'completed' && handleCompleteSubTask(t.id)}
                        disabled={gate.status === 'completed'}
                        className="rounded border-border"
                      />
                      <span className={cn('text-sm', t.completed && 'line-through text-muted-foreground')}>
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
                {!allSubTasksComplete && gate.status === 'in-progress' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {gate.subTasks.filter((t) => t.completed).length} / {gate.subTasks.length} complete
                  </p>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Suggested duration: {STAGE_DEFAULT_DURATIONS[gate.key].hint}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function BrandLifecycle() {
  const { state, dispatch } = useBrandLaunch();
  const { role } = useAuth();
  const location = useLocation();
  const brandIdFromState = (location.state as { brandId?: string })?.brandId;
  const resolvedBrandId =
    brandIdFromState ||
    (state.selectedBrandId === 'all' ? state.brands[0]?.id : state.selectedBrandId) ||
    state.brands[0]?.id;
  const brand = state.brands.find((b) => b.id === resolvedBrandId) || state.brands[0];

  const [expandedStage, setExpandedStage] = useState<StageGateKey | null>(null);

  useEffect(() => {
    if (brandIdFromState && brandIdFromState !== state.selectedBrandId) {
      dispatch({ type: 'SELECT_BRAND', brandId: brandIdFromState });
    }
  }, [brandIdFromState, state.selectedBrandId, dispatch]);

  if (!brand) return <p>No brand selected</p>;

  const score = calculateLaunchReadiness(brand.readiness);
  const isAdmin = role === 'admin';

  return (
    <div className="space-y-6">
      <PageHeader
        title={brand.name}
        description={`${brand.category} · Target: ${brand.targetLaunchDate} · Owner: ${brand.owner}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Brand Pipeline', href: '/pipeline' },
          { label: brand.name },
        ]}
        showBack
        backTo="/pipeline"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">{brand.targetStates.join(', ')}</Badge>
            <StatusBadge status={brand.riskLevel} />
          </div>
        }
      />

      <BrandBriefCard />

      {/* 7-Stage Lifecycle View */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Stage Gates</h2>
        <p className="text-sm text-muted-foreground">
          Complete sub-tasks in each stage, then submit for admin approval. Multiple stages can run in parallel.
        </p>
        <div className="space-y-2">
          {brand.stageGates.map((gate) => (
            <StageGateCard
              key={gate.key}
              gate={gate}
              brandId={brand.id}
              dispatch={dispatch}
              isAdmin={isAdmin}
              expanded={expandedStage === gate.key}
              onToggle={() => setExpandedStage((prev) => (prev === gate.key ? null : gate.key))}
            />
          ))}
        </div>
      </div>

      {/* Legacy granular timeline (compact) */}
      <Card>
        <CardContent className="py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Related Sections</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/rd-blending" state={{ brandId: brand.id }}>R&D / Blending</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/packaging" state={{ brandId: brand.id }}>Packaging</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/compliance" state={{ brandId: brand.id }}>Compliance</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/production" state={{ brandId: brand.id }}>Production</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/marketing" state={{ brandId: brand.id }}>Marketing</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/distributors" state={{ brandId: brand.id }}>Distributors</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
          View granular lifecycle stages (10 stages)
        </summary>
        <Card className="mt-2">
          <CardContent className="py-4 overflow-x-auto">
            <div className="flex items-center min-w-[900px]">
              {brand.lifecycleStages.map((stage, i) => (
                <div key={stage.stage} className="flex items-center flex-1">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center mb-1 border-2',
                      stage.status === 'completed' ? 'bg-success/10 border-success text-success' :
                      stage.status === 'in-progress' ? 'bg-gold/10 border-gold text-gold' :
                      'bg-muted border-border text-muted-foreground',
                    )}>
                      {stage.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                       stage.status === 'in-progress' ? <Clock className="h-4 w-4" /> :
                       <Circle className="h-4 w-4" />}
                    </div>
                    <p className="text-[10px] font-medium max-w-[70px] truncate">
                      {LIFECYCLE_STAGES.find((s) => s.key === stage.stage)?.label}
                    </p>
                    <p className="text-[9px] text-muted-foreground">{stage.deadline}</p>
                  </div>
                  {i < brand.lifecycleStages.length - 1 && (
                    <div className={cn(
                      'h-0.5 w-full min-w-[16px]',
                      stage.status === 'completed' ? 'bg-success' : 'bg-border',
                    )} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </details>

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
                    <div><p className="text-xs text-muted-foreground">Target States</p><div className="flex gap-1 mt-1">{brand.targetStates.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div></div>
                    <div><p className="text-xs text-muted-foreground">Current Stage</p><Badge variant="outline">{LIFECYCLE_STAGES.find((s) => s.key === brand.currentStage)?.label}</Badge></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tasks" className="mt-4">
              <Card><CardContent className="p-5">
                <div className="space-y-3">
                  {state.nextActions.filter((a) => a.brandId === brand.id).map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 rounded bg-muted/50 border">
                      <div>
                        <p className="text-sm font-medium">{action.action}</p>
                        <p className="text-xs text-muted-foreground">{action.owner}</p>
                      </div>
                      <StatusBadge status={action.priority} />
                    </div>
                  ))}
                  {state.nextActions.filter((a) => a.brandId === brand.id).length === 0 && (
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
                    {state.stateCompliance.filter((c) => c.brandId === brand.id).map((c) => (
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
                {state.activities.filter((a) => a.brandId === brand.id).map((a) => (
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

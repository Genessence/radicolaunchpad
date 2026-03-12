import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { STAGE_GATE_LABELS } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/PageHeader';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';

export function ApprovalQueue() {
  const { getPendingApprovalBrands, dispatch } = useBrandLaunch();
  const navigate = useNavigate();
  const pending = getPendingApprovalBrands();

  const handleApprove = (brandId: string, stageKey: string) => {
    dispatch({ type: 'APPROVE_STAGE', brandId, stageKey, approvedBy: 'Admin' });
  };

  const handleReject = (brandId: string, stageKey: string) => {
    const comment = prompt('Rejection reason (optional):') || 'Changes requested';
    dispatch({ type: 'REJECT_STAGE', brandId, stageKey, comment });
  };

  const handleViewLifecycle = (brandId: string) => {
    navigate('/lifecycle', { state: { brandId } });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Queue"
        description="Review and approve stage gates submitted by teams"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Approval Queue' }]}
        showBack
        backTo="/admin"
        showBrandSelector={false}
      />

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Pending Approvals ({pending.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success/50" />
              <p className="font-medium">No pending approvals</p>
              <p className="text-sm mt-1">All stage gates are either completed or not yet submitted.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map(({ brand, stageKey }) => {
                const gate = brand.stageGates.find((g) => g.key === stageKey);
                if (!gate || gate.status !== 'pending-approval') return null;
                return (
                  <div
                    key={`${brand.id}-${stageKey}`}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{brand.name}</span>
                        <Badge variant="secondary" className="text-xs">{brand.category}</Badge>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{STAGE_GATE_LABELS[stageKey]}</span>
                        <StatusBadge status="pending-approval" />
                      </div>
                      {gate.owner && (
                        <p className="text-xs text-muted-foreground mt-1">Submitted by: {gate.owner}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleViewLifecycle(brand.id)}>
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="default" onClick={() => handleApprove(brand.id, stageKey)}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(brand.id, stageKey)}>
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

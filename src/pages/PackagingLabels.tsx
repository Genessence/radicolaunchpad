import { Link } from 'react-router-dom';
import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { demoBottleDesigns, demoLabelVersions, demoPackagingSKUs } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { BrandBriefCard } from '@/components/BrandBriefCard';
import { Upload, Package, Send, ExternalLink } from 'lucide-react';

const PACKAGING_STAGE_KEY = 'packaging' as const;

export default function PackagingLabels() {
  const { state, dispatch } = useBrandLaunch();

  const bottleDesigns = demoBottleDesigns.filter(
    (b) => state.selectedBrandId === 'all' || b.brandId === state.selectedBrandId
  );
  const labelVersions = demoLabelVersions.filter(
    (v) => state.selectedBrandId === 'all' || v.brandId === state.selectedBrandId
  );
  const skus = demoPackagingSKUs.filter(
    (s) => state.selectedBrandId === 'all' || s.brandId === state.selectedBrandId
  );
  const brand = state.selectedBrandId !== 'all'
    ? state.brands.find((b) => b.id === state.selectedBrandId)
    : state.brands[0];
  const pkgGate = brand?.stageGates.find((g) => g.key === PACKAGING_STAGE_KEY);
  const canSubmitPkg = pkgGate?.status === 'in-progress' && pkgGate.subTasks.every((t) => t.completed);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Packaging & Labels"
        description="Bottle designs, label artwork, and SKU management"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Packaging & Labels' }]}
      />

      <BrandBriefCard />

      {brand && pkgGate && (
        <Card className={pkgGate.status === 'pending-approval' ? 'border-gold/50' : ''}>
          <CardContent className="py-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Packaging Stage Gate</p>
              <p className="text-sm text-muted-foreground">
                {brand.name} · <StatusBadge status={pkgGate.status} />
                {pkgGate.subTasks.some((t) => !t.completed) && (
                  <span className="ml-2">
                    {pkgGate.subTasks.filter((t) => t.completed).length}/{pkgGate.subTasks.length} sub-tasks complete
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/lifecycle" state={{ brandId: brand.id }}><ExternalLink className="h-3.5 w-3.5 mr-1" />View Lifecycle</Link>
              </Button>
              {canSubmitPkg && (
                <Button size="sm" onClick={() => dispatch({ type: 'SUBMIT_FOR_APPROVAL', brandId: brand.id, stageKey: PACKAGING_STAGE_KEY })}>
                  <Send className="h-3.5 w-3.5 mr-1" />Submit for approval
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bottle Designs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bottleDesigns.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 rounded bg-royal/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-royal" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.volume} · {b.material} · {b.closure}</p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Label Artwork Versions</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2 text-xs text-muted-foreground">Version</th><th className="text-left py-2 text-xs text-muted-foreground">Status</th><th className="text-left py-2 text-xs text-muted-foreground">By</th><th className="text-left py-2 text-xs text-muted-foreground">Date</th></tr></thead>
              <tbody>
                {labelVersions.map((v) => (
                  <tr key={v.id} className="border-b border-border/50">
                    <td className="py-2 font-medium">{v.version}</td>
                    <td className="py-2"><StatusBadge status={v.status} /></td>
                    <td className="py-2 text-muted-foreground">{v.submittedBy}</td>
                    <td className="py-2 text-muted-foreground">{v.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Packaging SKUs</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2 text-xs text-muted-foreground">SKU</th><th className="text-left py-2 text-xs text-muted-foreground">Description</th><th className="text-left py-2 text-xs text-muted-foreground">Pack Size</th><th className="text-left py-2 text-xs text-muted-foreground">Status</th></tr></thead>
            <tbody>
              {skus.map((s) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-2 font-medium font-mono text-xs">{s.sku}</td>
                  <td className="py-2">{s.description}</td>
                  <td className="py-2 text-muted-foreground">{s.packSize}</td>
                  <td className="py-2"><StatusBadge status={s.status === 'active' ? 'approved' : 'pending'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Upload Artwork Files</p>
            <p className="text-xs text-muted-foreground mt-1">Drag and drop label artwork, bottle renders, or packaging specs</p>
            <Button variant="outline" size="sm" className="mt-3">Browse Files</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

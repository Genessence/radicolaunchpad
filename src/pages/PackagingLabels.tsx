import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, Package } from 'lucide-react';

const bottleDesigns = [
  { name: 'Royal Ranthambore Reserve 750ml', volume: '750ml', material: 'Premium Glass', closure: 'Cork Top', status: 'approved' },
  { name: 'Royal Ranthambore Reserve 375ml', volume: '375ml', material: 'Premium Glass', closure: 'Screw Cap', status: 'in-progress' },
];

const labelVersions = [
  { version: 'v3.2', status: 'approved', submittedBy: 'Design Studio', date: 'Feb 2026' },
  { version: 'v3.1', status: 'rejected', submittedBy: 'Design Studio', date: 'Jan 2026' },
  { version: 'v3.0', status: 'rejected', submittedBy: 'Creative Agency', date: 'Dec 2025' },
];

const skus = [
  { sku: 'RRR-750-STD', description: 'Standard 750ml', packSize: '12 units', status: 'active' },
  { sku: 'RRR-375-STD', description: 'Standard 375ml', packSize: '24 units', status: 'pending' },
  { sku: 'RRR-750-GFT', description: 'Gift Box 750ml', packSize: '6 units', status: 'pending' },
];

export default function PackagingLabels() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Packaging & Labels</h1>
        <p className="text-sm text-muted-foreground">Bottle designs, label artwork, and SKU management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bottle Designs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bottleDesigns.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded border">
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
                {labelVersions.map((v, i) => (
                  <tr key={i} className="border-b border-border/50">
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
              {skus.map(s => (
                <tr key={s.sku} className="border-b border-border/50">
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

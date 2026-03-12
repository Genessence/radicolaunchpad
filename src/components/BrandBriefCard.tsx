import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { calculateLaunchReadiness } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/StatusBadge';
import { Package } from 'lucide-react';

export function BrandBriefCard() {
  const { state } = useBrandLaunch();

  if (state.selectedBrandId === 'all') return null;

  const brand = state.brands.find((b) => b.id === state.selectedBrandId);
  if (!brand) return null;

  const readiness = calculateLaunchReadiness(brand.readiness);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-royal/10">
            <Package className="h-6 w-6 text-royal" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{brand.name}</h3>
              <StatusBadge status={brand.riskLevel} />
            </div>
            <p className="text-sm text-muted-foreground">
              {brand.category} · Owner: {brand.owner}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Current stage:</span>
              <span className="font-medium capitalize">
                {brand.currentStage.replace(/-/g, ' ')}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Readiness:</span>
              <span className="font-medium text-gold">{readiness}%</span>
            </div>
            <Progress value={readiness} className="h-1.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

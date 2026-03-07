import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default function RDBlending() {
  const { state } = useBrandLaunch();
  const selectedBrand = state.selectedBrandId === 'all' ? 'b1' : state.selectedBrandId;
  const trials = state.blendTrials.filter(t => state.selectedBrandId === 'all' || t.brandId === state.selectedBrandId);
  const approvedTrial = trials.find(t => t.status === 'approved');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">R&D / Blending</h1>
        <p className="text-sm text-muted-foreground">Blend trial management and sensory tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Blend Trials</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-xs text-muted-foreground">Trial ID</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">ABV %</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Grain</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Malt</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Age</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Status</th>
                  <th className="text-left py-2 text-xs text-muted-foreground">Sensory</th>
                </tr>
              </thead>
              <tbody>
                {trials.map(trial => (
                  <tr key={trial.id} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{trial.trialId}</td>
                    <td className="py-2.5">{trial.abv}%</td>
                    <td className="py-2.5">{trial.grainRatio}%</td>
                    <td className="py-2.5">{trial.maltRatio}%</td>
                    <td className="py-2.5">{trial.ageStatement}</td>
                    <td className="py-2.5"><StatusBadge status={trial.status} /></td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                        <span className="font-medium">{trial.sensoryScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {approvedTrial && (
          <Card className="border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gold uppercase tracking-wider">Final Blend Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Trial</p><p className="font-semibold">{approvedTrial.trialId}</p></div>
                <div><p className="text-xs text-muted-foreground">Target ABV</p><p className="font-semibold">{approvedTrial.abv}%</p></div>
                <div><p className="text-xs text-muted-foreground">Grain Ratio</p><p className="font-semibold">{approvedTrial.grainRatio}%</p></div>
                <div><p className="text-xs text-muted-foreground">Malt Ratio</p><p className="font-semibold">{approvedTrial.maltRatio}%</p></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Flavor Profile</p>
                <div className="space-y-2">
                  {approvedTrial.flavorProfile.map(f => (
                    <div key={f.name}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span>{f.name}</span><span className="font-medium">{f.value}%</span>
                      </div>
                      <Progress value={f.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded bg-success/10 border border-success/20">
                <p className="text-xs text-success font-medium">✓ Master Blender Approved</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

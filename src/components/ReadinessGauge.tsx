import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ReadinessGaugeProps {
  score: number;
  breakdown?: { label: string; value: number; weight: string }[];
  size?: 'sm' | 'lg';
  className?: string;
}

export function ReadinessGauge({ score, breakdown, size = 'lg', className }: ReadinessGaugeProps) {
  const getColor = (v: number) => {
    if (v >= 80) return 'text-success';
    if (v >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className={cn('rounded-lg border bg-card p-5', className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Launch Readiness</p>
      <div className="flex items-center gap-4 mb-4">
        <div className={cn(
          'font-bold',
          size === 'lg' ? 'text-5xl' : 'text-3xl',
          getColor(score)
        )}>
          {score}%
        </div>
        <div className="flex-1">
          <Progress value={score} className="h-3" />
        </div>
      </div>
      {breakdown && (
        <div className="space-y-2.5">
          {breakdown.map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{item.label} <span className="opacity-60">({item.weight})</span></span>
                <span className={cn('font-medium', getColor(item.value))}>{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-1.5" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

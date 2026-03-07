import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
  highlight?: boolean;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, className, highlight }: KPICardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card p-5 transition-all hover:shadow-md",
      highlight && "border-gold/30 bg-gradient-to-br from-card to-gold/5",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className={cn("text-2xl font-bold", highlight && "text-gold")}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn("text-xs font-medium", trend.positive ? "text-success" : "text-destructive")}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          highlight ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { ApprovalStatus, RiskLevel } from '@/data/mockData';

interface StatusBadgeProps {
  status: ApprovalStatus | RiskLevel | string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  approved: { bg: 'bg-success/10', text: 'text-success', label: 'Approved' },
  pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
  delayed: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Delayed' },
  'not-started': { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Not Started' },
  low: { bg: 'bg-success/10', text: 'text-success', label: 'Low' },
  medium: { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium' },
  high: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'High' },
  critical: { bg: 'bg-destructive/20', text: 'text-destructive', label: 'Critical' },
  'in-progress': { bg: 'bg-info/10', text: 'text-info', label: 'In Progress' },
  completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' },
  ready: { bg: 'bg-success/10', text: 'text-success', label: 'Ready' },
  scheduled: { bg: 'bg-info/10', text: 'text-info', label: 'Scheduled' },
  rejected: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Rejected' },
  'pending-review': { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending Review' },
  'pending-approval': { bg: 'bg-gold/10', text: 'text-gold', label: 'Pending Approval' },
  active: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Active' },
  mitigated: { bg: 'bg-warning/10', text: 'text-warning', label: 'Mitigated' },
  resolved: { bg: 'bg-success/10', text: 'text-success', label: 'Resolved' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-muted', text: 'text-muted-foreground', label: status };
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      config.bg, config.text, className
    )}>
      {config.label}
    </span>
  );
}

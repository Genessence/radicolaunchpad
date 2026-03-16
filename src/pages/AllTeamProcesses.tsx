import { useState } from 'react';
import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { TeamProcess, TeamStage, TeamStageStatus } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskConical, Megaphone, Package, Factory, GitBranch } from 'lucide-react';

const STATUS_CONFIG: Record<TeamStageStatus, { label: string; className: string }> = {
  'not-started': { label: 'Not Started', className: 'bg-muted text-muted-foreground border-border' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
};

const TEAM_ICONS = {
  rd: FlaskConical,
  marketing: Megaphone,
  packing: Package,
  production: Factory,
};

const TEAM_COLORS = {
  rd: 'text-violet-600',
  marketing: 'text-pink-600',
  packing: 'text-amber-600',
  production: 'text-blue-600',
};

function ProgressBar({ stages }: { stages: TeamStage[] }) {
  const total = stages.length;
  if (total === 0) return null;
  const completed = stages.filter(s => s.status === 'completed').length;
  const inProgress = stages.filter(s => s.status === 'in-progress').length;
  const completedPct = Math.round((completed / total) * 100);
  const inProgressPct = Math.round((inProgress / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{completed} of {total} completed</span>
        <span>{completedPct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${completedPct}%` }}
        />
        <div
          className="h-full bg-blue-400 transition-all"
          style={{ width: `${inProgressPct}%` }}
        />
      </div>
    </div>
  );
}

function TeamProcessPanel({ process }: { process: TeamProcess }) {
  const sorted = [...process.stages].sort((a, b) => a.order - b.order);
  const Icon = TEAM_ICONS[process.teamRole];
  const colorClass = TEAM_COLORS[process.teamRole];

  return (
    <div className="space-y-4">
      {/* Team summary */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-muted ${colorClass}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{process.teamLabel}</p>
            <p className="text-xs text-muted-foreground">{sorted.length} stage{sorted.length !== 1 ? 's' : ''} defined</p>
          </div>
        </div>
        <ProgressBar stages={sorted} />
      </div>

      {/* Stage list */}
      {sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 py-10 text-center">
          <p className="text-sm text-muted-foreground">No stages defined for this team yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((stage, index) => {
            const statusCfg = STATUS_CONFIG[stage.status];
            return (
              <div
                key={stage.id}
                className="flex items-start gap-3 rounded-lg border bg-card p-4"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[11px] font-bold text-muted-foreground shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="font-medium text-sm text-foreground">{stage.name}</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-5 font-medium border ${statusCfg.className}`}
                    >
                      {statusCfg.label}
                    </Badge>
                  </div>
                  {stage.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{stage.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AllTeamProcesses() {
  const { state } = useBrandLaunch();
  const processes = state.teamProcesses;

  const [activeTab, setActiveTab] = useState(processes[0]?.teamRole ?? 'rd');

  const totalStages = processes.reduce((sum, tp) => sum + tp.stages.length, 0);
  const totalCompleted = processes.reduce(
    (sum, tp) => sum + tp.stages.filter(s => s.status === 'completed').length, 0
  );
  const totalInProgress = processes.reduce(
    (sum, tp) => sum + tp.stages.filter(s => s.status === 'in-progress').length, 0
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 text-gold">
          <GitBranch className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Team Processes</h1>
          <p className="text-sm text-muted-foreground">
            Overview of each team's workflow stages — read-only view
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{totalStages}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Stages</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{totalCompleted}</p>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalInProgress}</p>
          <p className="text-xs text-muted-foreground mt-1">In Progress</p>
        </div>
      </div>

      {/* Per-team overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {processes.map(tp => {
          const Icon = TEAM_ICONS[tp.teamRole];
          const colorClass = TEAM_COLORS[tp.teamRole];
          const done = tp.stages.filter(s => s.status === 'completed').length;
          const pct = tp.stages.length > 0 ? Math.round((done / tp.stages.length) * 100) : 0;
          return (
            <button
              key={tp.teamRole}
              onClick={() => setActiveTab(tp.teamRole)}
              className={`rounded-lg border p-3 text-left transition-all hover:shadow-md ${activeTab === tp.teamRole ? 'ring-2 ring-gold border-gold/30' : 'bg-card'}`}
            >
              <div className={`mb-2 ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground truncate">{tp.teamLabel}</p>
              <p className="text-lg font-bold text-foreground mt-1">{pct}%</p>
              <p className="text-[10px] text-muted-foreground">{done}/{tp.stages.length} done</p>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4 h-10">
          {processes.map(tp => {
            const Icon = TEAM_ICONS[tp.teamRole];
            return (
              <TabsTrigger key={tp.teamRole} value={tp.teamRole} className="gap-1.5 text-xs">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tp.teamLabel.replace(' Team', '')}</span>
                <span className="sm:hidden">{tp.teamLabel.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {processes.map(tp => (
          <TabsContent key={tp.teamRole} value={tp.teamRole} className="mt-4">
            <TeamProcessPanel process={tp} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

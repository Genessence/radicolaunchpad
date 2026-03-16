import { useState } from 'react';
import { useBrandLaunch } from '@/contexts/BrandLaunchContext';
import { useAuth } from '@/contexts/AuthContext';
import { TeamRole, TeamStage, TeamStageStatus } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, Check, X, GitBranch,
} from 'lucide-react';

const STATUS_CONFIG: Record<TeamStageStatus, { label: string; className: string }> = {
  'not-started': { label: 'Not Started', className: 'bg-muted text-muted-foreground border-border' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
};

const TEAM_ROLE_LABELS: Record<TeamRole, string> = {
  rd: 'R&D Team',
  marketing: 'Marketing Team',
  packing: 'Packing Team',
  production: 'Production Team',
};

interface StageFormState {
  name: string;
  description: string;
}

export default function TeamProcess() {
  const { state, dispatch } = useBrandLaunch();
  const { role } = useAuth();

  const teamRole = role as TeamRole;
  const process = state.teamProcesses.find(tp => tp.teamRole === teamRole);
  const stages = process ? [...process.stages].sort((a, b) => a.order - b.order) : [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<StageFormState>({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<StageFormState>({ name: '', description: '' });
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (!process) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No process found for your team.
      </div>
    );
  }

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const inProgressCount = stages.filter(s => s.status === 'in-progress').length;

  function handleAddSubmit() {
    if (!addForm.name.trim()) return;
    dispatch({
      type: 'CREATE_TEAM_STAGE',
      teamRole,
      stage: {
        name: addForm.name.trim(),
        description: addForm.description.trim(),
        status: 'not-started',
        subTasks: [],
      },
    });
    setAddForm({ name: '', description: '' });
    setShowAddForm(false);
  }

  function handleEditStart(stage: TeamStage) {
    setEditingId(stage.id);
    setEditForm({ name: stage.name, description: stage.description });
  }

  function handleEditSave(stageId: string) {
    if (!editForm.name.trim()) return;
    dispatch({
      type: 'UPDATE_TEAM_STAGE',
      teamRole,
      stageId,
      name: editForm.name.trim(),
      description: editForm.description.trim(),
    });
    setEditingId(null);
  }

  function handleEditCancel() {
    setEditingId(null);
  }

  function handleDelete(stageId: string) {
    dispatch({ type: 'DELETE_TEAM_STAGE', teamRole, stageId });
    setDeleteTargetId(null);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const newOrder = [...stages];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    dispatch({ type: 'REORDER_TEAM_STAGES', teamRole, stageIds: newOrder.map(s => s.id) });
  }

  function handleMoveDown(index: number) {
    if (index === stages.length - 1) return;
    const newOrder = [...stages];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    dispatch({ type: 'REORDER_TEAM_STAGES', teamRole, stageIds: newOrder.map(s => s.id) });
  }

  function handleStatusChange(stageId: string, status: TeamStageStatus) {
    dispatch({ type: 'UPDATE_TEAM_STAGE_STATUS', teamRole, stageId, status });
  }

  const deleteTarget = stages.find(s => s.id === deleteTargetId);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 text-gold">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {TEAM_ROLE_LABELS[teamRole]} Process
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your team's workflow stages
            </p>
          </div>
        </div>
        <Button
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
          className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Stage
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stages.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Stages</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
          <p className="text-xs text-muted-foreground mt-1">In Progress</p>
        </div>
      </div>

      {/* Add Stage Form */}
      {showAddForm && (
        <div className="rounded-lg border-2 border-dashed border-gold/50 bg-gold/5 p-5 space-y-4">
          <p className="text-sm font-semibold text-foreground">New Stage</p>
          <div className="space-y-3">
            <Input
              placeholder="Stage name *"
              value={addForm.name}
              onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
              className="bg-background"
              autoFocus
            />
            <Textarea
              placeholder="Description (optional)"
              value={addForm.description}
              onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
              className="bg-background resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setShowAddForm(false); setAddForm({ name: '', description: '' }); }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!addForm.name.trim()}
              onClick={handleAddSubmit}
              className="bg-gold hover:bg-gold/90 text-gold-foreground"
            >
              Add Stage
            </Button>
          </div>
        </div>
      )}

      {/* Stages List */}
      {stages.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 py-16 text-center space-y-3">
          <GitBranch className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground font-medium">No stages defined yet</p>
          <p className="text-sm text-muted-foreground/70">Click "Add Stage" to create your first process stage.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <StageCard
              key={stage.id}
              stage={stage}
              index={index}
              total={stages.length}
              isEditing={editingId === stage.id}
              editForm={editForm}
              onEditFormChange={setEditForm}
              onEditStart={() => handleEditStart(stage)}
              onEditSave={() => handleEditSave(stage.id)}
              onEditCancel={handleEditCancel}
              onDelete={() => setDeleteTargetId(stage.id)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onStatusChange={(status) => handleStatusChange(stage.id, status)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={() => setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stage</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTargetId && handleDelete(deleteTargetId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface StageCardProps {
  stage: TeamStage;
  index: number;
  total: number;
  isEditing: boolean;
  editForm: StageFormState;
  onEditFormChange: (form: StageFormState) => void;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onStatusChange: (status: TeamStageStatus) => void;
}

function StageCard({
  stage, index, total, isEditing, editForm, onEditFormChange,
  onEditStart, onEditSave, onEditCancel, onDelete,
  onMoveUp, onMoveDown, onStatusChange,
}: StageCardProps) {
  const statusCfg = STATUS_CONFIG[stage.status];

  return (
    <div className="group rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3 p-4">
        {/* Order badge + reorder controls */}
        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {index + 1}
          </span>
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Move up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            title="Move down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editForm.name}
                onChange={e => onEditFormChange({ ...editForm, name: e.target.value })}
                className="font-medium"
                autoFocus
              />
              <Textarea
                value={editForm.description}
                onChange={e => onEditFormChange({ ...editForm, description: e.target.value })}
                className="resize-none text-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={!editForm.name.trim()}
                  onClick={onEditSave}
                  className="bg-gold hover:bg-gold/90 text-gold-foreground h-7 px-3 text-xs gap-1"
                >
                  <Check className="h-3 w-3" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEditCancel}
                  className="h-7 px-3 text-xs gap-1"
                >
                  <X className="h-3 w-3" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-semibold text-foreground text-sm leading-tight">{stage.name}</p>
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
              <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                Created {stage.createdAt}
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 shrink-0">
            <Select
              value={stage.status}
              onValueChange={(val) => onStatusChange(val as TeamStageStatus)}
            >
              <SelectTrigger className="h-7 w-[130px] text-xs border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started" className="text-xs">Not Started</SelectItem>
                <SelectItem value="in-progress" className="text-xs">In Progress</SelectItem>
                <SelectItem value="completed" className="text-xs">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onEditStart}
              title="Edit stage"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onDelete}
              title="Delete stage"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

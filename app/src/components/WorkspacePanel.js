'use client';

import { shellCopy } from '../content/copy';
import { KanbanBoard } from './KanbanBoard';
import { TaskCreationCard } from './TaskCreationCard';

export function WorkspacePanel({ mode, taskDraft, tasks, highlightedTaskId, onTaskCreated, onStatusChange }) {
  return (
    <section className="min-h-[30rem] w-full rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm md:w-3/5 md:p-6">
      {mode === 'task-create' ? (
        <TaskCreationCard draft={taskDraft} onCreated={onTaskCreated} />
      ) : mode === 'kanban' ? (
        <KanbanBoard tasks={tasks} highlightedTaskId={highlightedTaskId} onStatusChange={onStatusChange} />
      ) : (
        <h2 className="t-h2 text-fg-1">{shellCopy.workspaceTitle}</h2>
      )}
    </section>
  );
}

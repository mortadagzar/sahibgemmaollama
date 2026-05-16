'use client';

import { shellCopy } from '../content/copy';
import { CoworkerKanban } from './CoworkerKanban';
import { TaskCreationCard } from './TaskCreationCard';

export function StagePanel({ mode, draft, tasks, highlightedTaskId, onTaskCreated, onStatusChange }) {
  return (
    <section className="min-h-[30rem] w-full rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm md:w-3/5 md:p-6">
      {mode === 'task_creation' ? (
        <TaskCreationCard draft={draft} onTaskCreated={onTaskCreated} />
      ) : mode === 'kanban' ? (
        <CoworkerKanban tasks={tasks} highlightedTaskId={highlightedTaskId} onStatusChange={onStatusChange} />
      ) : (
        <h2 className="t-h2 text-fg-1">{shellCopy.workspaceTitle}</h2>
      )}
    </section>
  );
}

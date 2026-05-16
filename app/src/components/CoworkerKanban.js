'use client';

import { shellCopy } from '../content/copy';

const columns = [
  { status: 'todo', label: shellCopy.todoColumn },
  { status: 'in_progress', label: shellCopy.doingColumn },
  { status: 'done', label: shellCopy.doneColumn }
];
const statusFlow = ['todo', 'in_progress', 'done'];

function getStatusTone(task) {
  if (task.status === 'done') return 'bg-success';
  if (!task.due_date) return 'bg-warning';
  const dueTime = new Date(task.due_date).getTime();
  const now = Date.now();
  if (dueTime < now) return 'bg-danger animate-pulse';
  if (dueTime - now <= 24 * 60 * 60 * 1000) return 'bg-warning shadow-sm';
  return 'bg-success';
}

export function CoworkerKanban({ tasks, highlightedTaskId, onStatusChange }) {
  function cycleStatus(task) {
    const nextStatus = statusFlow[(statusFlow.indexOf(task.status) + 1) % statusFlow.length];
    onStatusChange(task.id, nextStatus);
  }

  return (
    <section className="rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm">
      <h2 className="t-h2 mb-4 text-fg-1">{shellCopy.kanbanTitle}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.status);
          return (
            <div key={column.status} className="min-h-64 border-stroke-1 md:border-l md:pl-4 last:border-l-0 last:pl-0">
              <h3 className="text-fg-2 font-naskh text-sm font-bold mb-2">{column.label}</h3>
              <div className="grid gap-3">
                {columnTasks.length === 0 ? <p className="t-caption text-fg-3">{shellCopy.emptyTaskList}</p> : null}
                {columnTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => cycleStatus(task)}
                    className={`rounded-md bg-surface-card border border-stroke-1 p-3 shadow-xs text-fg-1 font-naskh text-sm text-right transition-all hover:bg-white/[0.08] ${highlightedTaskId === task.id ? 'ring-2 ring-darkteal-500 border-darkteal-500' : ''}`}
                  >
                    <span className="mb-2 flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-pill ${getStatusTone(task)}`} />
                      <span>{task.title}</span>
                    </span>
                    <span className="block text-fg-3 text-xs">{shellCopy.dueDateLabel}: {task.due_date || '-'}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

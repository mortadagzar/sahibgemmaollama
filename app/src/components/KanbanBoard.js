'use client';

import { shellCopy } from '../content/copy';
import { getTaskUrgency, nextTaskStatus, taskStatuses } from '../lib/taskState';

const statusCopy = {
  todo: 'todoStatus',
  doing: 'doingStatus',
  done: 'doneStatus'
};

const dotClass = {
  normal: 'bg-info',
  overdue: 'animate-pulse bg-danger',
  soon: 'bg-warning task-dot-soon shadow-sm',
  completed: 'bg-success'
};

export function KanbanBoard({ tasks, highlightedTaskId, onStatusChange }) {
  async function cycleTask(task) {
    const nextStatus = nextTaskStatus(task.status);
    onStatusChange(task.id, nextStatus);

    await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).catch(() => undefined);
  }

  return (
    <div className="animate-slide-up rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm">
      <h2 className="t-h2 mb-4 text-fg-1">{shellCopy.kanbanTitle}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {taskStatuses.map((status, index) => (
          <section key={status} className={`${index > 0 ? 'border-t border-stroke-1 pt-4 md:border-r md:border-t-0 md:pr-4 md:pt-0' : ''}`}>
            <h3 className="mb-2 font-naskh text-sm font-bold text-fg-2">{shellCopy[statusCopy[status]]}</h3>
            <div className="grid gap-3">
              {tasks.filter((task) => task.status === status).map((task) => {
                const urgency = getTaskUrgency(task);
                const isHighlighted = highlightedTaskId === task.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => cycleTask(task)}
                    className={`rounded-md bg-surface-card border border-stroke-1 p-3 shadow-xs text-right text-fg-1 font-naskh text-sm transition-all hover:bg-white/[0.08] ${isHighlighted ? 'ring-2 ring-darkteal-500 border-darkteal-500' : ''}`}
                  >
                    <span className="mb-2 flex items-start gap-2">
                      <span className={`mt-2 h-2 w-2 shrink-0 rounded-pill ${dotClass[urgency]}`} />
                      <span>{task.title}</span>
                    </span>
                    <span dir="ltr" className="block text-left text-xs text-fg-3">{task.dueDate}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

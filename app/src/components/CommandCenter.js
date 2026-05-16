'use client';

import { useState } from 'react';
import { shellCopy } from '../content/copy';
import { ChatPanel } from './ChatPanel';
import { StagePanel } from './StagePanel';

export function CommandCenter() {
  const [stageMode, setStageMode] = useState('workspace');
  const [taskDraft, setTaskDraft] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [highlightedTaskId, setHighlightedTaskId] = useState(null);
  const [systemMessages, setSystemMessages] = useState([]);

  function handleStageAction(action) {
    if (!action?.type) return;
    if (action.type === 'create_task') {
      setTaskDraft(action.task || null);
      setStageMode('task_creation');
    }
    if (action.type === 'open_kanban') {
      setStageMode('kanban');
    }
  }

  function handleTaskCreated(task) {
    setTasks((currentTasks) => [task, ...currentTasks]);
    setHighlightedTaskId(task.id);
    setStageMode('kanban');
    setSystemMessages((currentMessages) => [
      ...currentMessages,
      { id: `task-created-${task.id}`, sender: 'sahibuya', content: shellCopy.taskCreatedReply }
    ]);
  }

  async function updateStatus(taskId, status) {
    setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task)));
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId, status })
    }).catch(() => null);
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
      <ChatPanel onStageAction={handleStageAction} systemMessages={systemMessages} />
      <StagePanel
        mode={stageMode}
        draft={taskDraft}
        tasks={tasks}
        highlightedTaskId={highlightedTaskId}
        onTaskCreated={handleTaskCreated}
        onStatusChange={updateStatus}
      />
    </section>
  );
}

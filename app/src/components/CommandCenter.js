'use client';

import { useState } from 'react';
import { shellCopy } from '../content/copy';
import { ChatPanel } from './ChatPanel';
import { WorkspacePanel } from './WorkspacePanel';

export function CommandCenter() {
  const [workspaceMode, setWorkspaceMode] = useState('empty');
  const [taskDraft, setTaskDraft] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [highlightedTaskId, setHighlightedTaskId] = useState(null);
  const [systemMessages, setSystemMessages] = useState([]);

  function handleAssistantEvent(event) {
    if (event?.action === 'task_create') {
      setTaskDraft(event.task || null);
      setWorkspaceMode('task-create');
    }

    if (event?.action === 'show_kanban') {
      setWorkspaceMode('kanban');
    }
  }

  function handleTaskCreated(task) {
    setTasks((currentTasks) => [task, ...currentTasks]);
    setHighlightedTaskId(task.id);
    setWorkspaceMode('kanban');
    setSystemMessages((currentMessages) => [...currentMessages, shellCopy.taskNotification]);
  }

  function handleStatusChange(taskId, status) {
    setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? { ...task, status, highlighted: false } : task)));
    setSystemMessages((currentMessages) => [...currentMessages, shellCopy.statusUpdatedReply]);
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
      <ChatPanel onAssistantEvent={handleAssistantEvent} systemMessages={systemMessages} />
      <WorkspacePanel
        mode={workspaceMode}
        taskDraft={taskDraft}
        tasks={tasks}
        highlightedTaskId={highlightedTaskId}
        onTaskCreated={handleTaskCreated}
        onStatusChange={handleStatusChange}
      />
    </section>
  );
}

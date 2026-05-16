export const taskStatuses = ['todo', 'doing', 'done'];

export const defaultAssignees = [
  { id: 'coworker-one', labelKey: 'defaultAssignee' },
  { id: 'coworker-two', labelKey: 'companyName' }
];

export function createLocalTask(formValues, selectedFile) {
  return {
    id: `task-${Date.now()}`,
    title: formValues.title,
    description: formValues.description,
    assigneeId: formValues.assigneeId,
    projectId: formValues.projectId || 'default-project',
    status: 'todo',
    dueDate: formValues.dueDate,
    file: selectedFile || null,
    highlighted: true
  };
}

export function nextTaskStatus(status) {
  const index = taskStatuses.indexOf(status);
  return taskStatuses[(index + 1) % taskStatuses.length] || taskStatuses[0];
}

export function getTaskUrgency(task, now = new Date()) {
  if (task.status === 'done') return 'completed';
  if (!task.dueDate) return 'normal';

  const dueDate = new Date(`${task.dueDate}T23:59:59`);
  const hoursRemaining = (dueDate.getTime() - now.getTime()) / 36e5;
  if (hoursRemaining < 0) return 'overdue';
  if (hoursRemaining <= 24) return 'soon';
  return 'normal';
}

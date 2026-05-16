'use client';

import { useState } from 'react';
import { shellCopy } from '../content/copy';
import { FileIcon } from './FileIcon';
import { FilePickerModal } from './FilePickerModal';

const inputClass = 'w-full rounded-md border border-stroke-1 bg-surface-muted px-4 py-2 font-naskh text-sm text-fg-1 outline-none focus:ring-2 focus:ring-blue-300/40 focus:border-blue-500 placeholder:text-fg-4';
const assignees = [
  { id: 'coworker', label: shellCopy.defaultAssignee },
  { id: 'manager', label: shellCopy.secondAssignee }
];

function SelectChevron() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TaskCreationCard({ draft, onTaskCreated }) {
  const [title, setTitle] = useState(draft?.title || '');
  const [description, setDescription] = useState(draft?.description || '');
  const [assigneeId, setAssigneeId] = useState(draft?.assigneeId || assignees[0].id);
  const [dueDate, setDueDate] = useState(draft?.dueDate || '');
  const [selectedFile, setSelectedFile] = useState(draft?.file || null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function submitTask(event) {
    event.preventDefault();
    if (!title.trim() || isSaving) return;
    setIsSaving(true);

    const optimisticTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      assignee_id: assigneeId,
      status: 'todo',
      due_date: dueDate,
      file: selectedFile
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, assigneeId, dueDate, file: selectedFile })
      });
      const payload = await response.json();
      onTaskCreated({ ...optimisticTask, ...(payload.task || {}) });
    } catch {
      onTaskCreated(optimisticTask);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm">
      <h2 className="t-h2 mb-4 text-fg-1">{shellCopy.taskCardTitle}</h2>
      <form onSubmit={submitTask} className="grid gap-4">
        <label className="grid gap-2 text-sm text-fg-2">
          {shellCopy.taskTitleLabel}
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={shellCopy.taskTitlePlaceholder} className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm text-fg-2">
          {shellCopy.taskDescriptionLabel}
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder={shellCopy.taskDescriptionPlaceholder} className={`${inputClass} min-h-24 resize-none`} />
        </label>
        <label className="grid gap-2 text-sm text-fg-2">
          {shellCopy.assigneeLabel}
          <span className="relative block">
            <select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)} className={`${inputClass} appearance-none pl-10`}>
              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>{assignee.label}</option>
              ))}
            </select>
            <SelectChevron />
          </span>
        </label>
        <label className="grid gap-2 text-sm text-fg-2">
          {shellCopy.deadlineLabel}
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={inputClass} />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setIsPickerOpen(true)} className="px-4 py-2 rounded-md border border-stroke-2 text-fg-2 hover:bg-white/[0.08] font-naskh text-sm transition-all">
            {shellCopy.attachFileLabel}
          </button>
          {selectedFile ? (
            <div className="flex items-center gap-2 rounded-md border border-stroke-1 bg-surface-muted p-3 text-fg-2 text-sm">
              <FileIcon />
              <span>{selectedFile.name}</span>
            </div>
          ) : null}
        </div>

        <button type="submit" disabled={!title.trim() || isSaving} className="px-4 py-2 rounded-md bg-darkteal-500 hover:bg-darkteal-700 text-white font-naskh text-sm transition-all focus:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed">
          {shellCopy.createTaskLabel}
        </button>
      </form>

      {isPickerOpen ? (
        <FilePickerModal
          selectedFile={selectedFile}
          onClose={() => setIsPickerOpen(false)}
          onSelect={(file) => {
            setSelectedFile(file);
            setIsPickerOpen(false);
          }}
        />
      ) : null}
    </article>
  );
}

'use client';

import { useState } from 'react';
import { shellCopy } from '../content/copy';
import { createLocalTask, defaultAssignees } from '../lib/taskState';
import { ChevronIcon } from './ChevronIcon';
import { FileIcon } from './FileIcon';
import { FilePickerModal } from './FilePickerModal';

const inputClass = 'w-full rounded-md border border-stroke-1 bg-surface-muted px-4 py-2 font-naskh text-sm text-fg-1 outline-none transition-all focus:ring-2 focus:ring-blue-300/40 focus:border-blue-500 placeholder:text-fg-4';

export function TaskCreationCard({ draft, onCreated }) {
  const [formValues, setFormValues] = useState({
    title: draft?.title || shellCopy.defaultTaskTitle,
    description: draft?.description || shellCopy.defaultDescription,
    assigneeId: draft?.assigneeId || defaultAssignees[0].id,
    projectId: draft?.projectId || 'default-project',
    dueDate: draft?.dueDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  });
  const [selectedFile, setSelectedFile] = useState(draft?.file || null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function updateField(field, value) {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function submitTask(event) {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const localTask = createLocalTask(formValues, selectedFile);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localTask)
      });
      const payload = await response.json();
      onCreated(payload.task || localTask);
    } catch {
      onCreated(localTask);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={submitTask} className="animate-slide-up rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm">
        <h2 className="t-h2 mb-4 text-fg-1">{shellCopy.taskCardTitle}</h2>
        <div className="grid gap-4">
          <label className="grid gap-2 font-naskh text-sm text-fg-2">
            {shellCopy.taskTitleLabel}
            <input className={inputClass} value={formValues.title} onChange={(event) => updateField('title', event.target.value)} />
          </label>

          <label className="grid gap-2 font-naskh text-sm text-fg-2">
            {shellCopy.taskDescriptionLabel}
            <textarea className={inputClass} rows="3" value={formValues.description} onChange={(event) => updateField('description', event.target.value)} />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 font-naskh text-sm text-fg-2">
              {shellCopy.assigneeLabel}
              <span className="relative">
                <select className={`${inputClass} appearance-none pl-10`} value={formValues.assigneeId} onChange={(event) => updateField('assigneeId', event.target.value)}>
                  {defaultAssignees.map((assignee) => (
                    <option key={assignee.id} value={assignee.id}>{shellCopy[assignee.labelKey]}</option>
                  ))}
                </select>
                <ChevronIcon />
              </span>
            </label>

            <label className="grid gap-2 font-naskh text-sm text-fg-2">
              {shellCopy.deadlineLabel}
              <input type="date" className={inputClass} value={formValues.dueDate} onChange={(event) => updateField('dueDate', event.target.value)} />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => setIsPickerOpen(true)} className="px-4 py-2 rounded-md border border-stroke-2 text-fg-2 hover:bg-white/[0.08] font-naskh text-sm transition-all">
              {shellCopy.attachFileLabel}
            </button>

            <div className="min-w-0 rounded-md border border-stroke-1 bg-surface-muted p-3 text-sm text-fg-2">
              {selectedFile ? (
                <span className="flex items-center gap-2">
                  <FileIcon />
                  <span className="truncate">{selectedFile.name}</span>
                </span>
              ) : shellCopy.noFileLabel}
            </div>
          </div>

          <button type="submit" disabled={isSaving || !formValues.title.trim()} className="px-4 py-2 rounded-md bg-darkteal-500 hover:bg-darkteal-700 text-white font-naskh text-sm transition-all focus:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed">
            {shellCopy.createTaskLabel}
          </button>
        </div>
      </form>

      {isPickerOpen ? (
        <FilePickerModal
          selectedFile={selectedFile}
          onSelect={(file) => {
            setSelectedFile(file);
            setIsPickerOpen(false);
          }}
          onClose={() => setIsPickerOpen(false)}
        />
      ) : null}
    </>
  );
}

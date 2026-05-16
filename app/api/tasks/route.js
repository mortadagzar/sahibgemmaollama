import { NextResponse } from 'next/server';
import { insertFileReference, insertTask } from '../../src/lib/databaseClient';

function normalizeTask(payload) {
  return {
    id: payload.id,
    title: payload.title,
    description: payload.description,
    assignee_id: payload.assigneeId,
    project_id: payload.projectId,
    status: payload.status || 'todo',
    due_date: payload.dueDate,
    file_id: payload.file?.storageProviderFileId || null
  };
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const task = normalizeTask(payload);
  await insertTask(task);

  if (payload.file) {
    await insertFileReference({
      id: payload.file.id || payload.file.storageProviderFileId,
      storage_provider_file_id: payload.file.storageProviderFileId,
      name: payload.file.name,
      mime_type: payload.file.mimeType,
      web_view_link: payload.file.webViewLink,
      task_id: task.id
    });
  }

  return NextResponse.json({ task: payload });
}

import { NextResponse } from 'next/server';
import { insertFileReference, insertTask, listTasks, updateTaskStatus } from '../../src/lib/databaseClient';

function normalizeTask(payload) {
  return {
    title: String(payload.title || '').trim(),
    description: String(payload.description || '').trim(),
    assignee_id: payload.assigneeId || payload.assignee_id || null,
    project_id: payload.projectId || payload.project_id || null,
    status: payload.status || 'todo',
    due_date: payload.dueDate || payload.due_date || null,
    file_id: payload.fileId || payload.file_id || null
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const { data, error } = await listTasks(searchParams.get('assigneeId'));
  if (error) return NextResponse.json({ tasks: [] });
  return NextResponse.json({ tasks: data || [] });
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const task = normalizeTask(payload);

  if (!task.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const { data, error } = await insertTask(task);
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  const createdTask = data?.[0] || task;
  const selectedFile = payload.file || null;
  if (selectedFile && createdTask.id) {
    await insertFileReference({
      storage_provider_file_id: selectedFile.id,
      name: selectedFile.name,
      mime_type: selectedFile.mimeType || selectedFile.mime_type || null,
      web_view_link: selectedFile.webViewLink || selectedFile.web_view_link || null,
      task_id: createdTask.id
    });
  }

  return NextResponse.json({ task: createdTask });
}

export async function PATCH(request) {
  const payload = await request.json().catch(() => ({}));
  if (!payload.id || !payload.status) {
    return NextResponse.json({ error: 'Task id and status are required' }, { status: 400 });
  }

  const { data, error } = await updateTaskStatus(payload.id, payload.status);
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  return NextResponse.json({ task: data?.[0] || { id: payload.id, status: payload.status } });
}

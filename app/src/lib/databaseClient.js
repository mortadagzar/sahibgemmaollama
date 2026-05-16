import { getRuntimeConfig } from './runtimeConfig';

function createHeaders(serviceKey, extraHeaders = {}) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...extraHeaders
  };
}

async function requestTable(path, options = {}) {
  const { config, missingKeys } = getRuntimeConfig();
  if (missingKeys.length > 0) {
    return { data: null, error: new Error(`Missing runtime configuration: ${missingKeys.join(', ')}`) };
  }

  const response = await fetch(`${config.databaseRestUrl.replace(/\/$/, '')}/${path}`, {
    ...options,
    headers: createHeaders(config.databaseServiceKey, options.headers)
  });

  if (!response.ok) {
    return { data: null, error: new Error(`Database request failed: ${response.status}`) };
  }

  if (response.status === 204) {
    return { data: null, error: null };
  }

  return { data: await response.json(), error: null };
}

export async function insertChatMessage(message) {
  return requestTable('chat_messages', {
    method: 'POST',
    body: JSON.stringify(message)
  });
}

export async function getActiveProviderSettings(providerType = 'ai_chat') {
  const { config } = getRuntimeConfig();
  const typeFilter = `provider_type=eq.${encodeURIComponent(providerType)}`;
  const query = `provider_settings?select=config&${typeFilter}&${config.activeProviderFilter}&limit=1`;
  const { data, error } = await requestTable(query);
  if (error) return { settings: null, error };
  return { settings: data?.[0]?.config || null, error: null };
}

export async function insertTask(task) {
  return requestTable('tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  });
}

export async function insertFileReference(file) {
  return requestTable('files', {
    method: 'POST',
    body: JSON.stringify(file)
  });
}

export async function listTasks(assigneeId) {
  const assigneeFilter = assigneeId ? `&assignee_id=eq.${encodeURIComponent(assigneeId)}` : '';
  return requestTable(`tasks?select=*,files(*)&order=created_at.desc${assigneeFilter}`);
}

export async function updateTaskStatus(taskId, status) {
  return requestTable(`tasks?id=eq.${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function storeFileStorageTokens(tokenRecord) {
  return requestTable('file_storage_tokens', {
    method: 'POST',
    body: JSON.stringify(tokenRecord)
  });
}

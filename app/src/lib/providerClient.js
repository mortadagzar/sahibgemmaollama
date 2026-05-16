import { sahibuyaSystemPrompt } from '../content/prompts';

function applyTemplate(value, variables) {
  if (Array.isArray(value)) return value.map((item) => applyTemplate(item, variables));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, applyTemplate(item, variables)]));
  }
  if (typeof value !== 'string') return value;
  return value.replace(/\{\{message\}\}/g, variables.message).replace(/\{\{systemPrompt\}\}/g, variables.systemPrompt);
}

function getPathValue(source, path) {
  if (!path) return undefined;
  return path.split('.').reduce((current, segment) => {
    if (current == null) return undefined;
    if (/^\d+$/.test(segment)) return current[Number(segment)];
    return current[segment];
  }, source);
}

export async function requestProviderReply(settings, message) {
  if (!settings?.endpoint) {
    return { reply: null, stageAction: null, error: new Error('Provider endpoint is not configured') };
  }

  const bodyTemplate = settings.bodyTemplate || {
    system: '{{systemPrompt}}',
    message: '{{message}}'
  };

  const response = await fetch(settings.endpoint, {
    method: settings.method || 'POST',
    headers: settings.headers || { 'Content-Type': 'application/json' },
    body: JSON.stringify(applyTemplate(bodyTemplate, { message, systemPrompt: sahibuyaSystemPrompt }))
  });

  if (!response.ok) {
    return { reply: null, stageAction: null, error: new Error(`Provider request failed: ${response.status}`) };
  }

  const payload = await response.json();
  const reply = getPathValue(payload, settings.responsePath) || payload.reply || payload.content || payload.message;
  const stageAction = getPathValue(payload, settings.actionPath) || payload.stageAction || payload.action || null;
  return { reply: typeof reply === 'string' ? reply : null, stageAction, error: null };
}

export async function requestFileStorage(settings, requestData = {}) {
  if (!settings?.endpoint) {
    return { data: null, error: new Error('File storage endpoint is not configured') };
  }

  const response = await fetch(settings.endpoint, {
    method: settings.method || 'POST',
    headers: settings.headers || { 'Content-Type': 'application/json' },
    body: JSON.stringify(applyTemplate(settings.bodyTemplate || requestData, requestData))
  });

  if (!response.ok) {
    return { data: null, error: new Error(`File storage request failed: ${response.status}`) };
  }

  const payload = await response.json();
  return { data: getPathValue(payload, settings.filesPath) || payload.files || payload.items || [], error: null };
}

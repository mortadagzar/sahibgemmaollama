import { decryptJson, encryptJson } from './cryptoBox';
import { getFileStorageProviderSettings, getFileStorageToken, insertFileStorageToken } from './databaseClient';

function applyTemplate(value, variables) {
  if (typeof value !== 'string') return value;
  return Object.entries(variables).reduce((current, [key, item]) => current.replaceAll(`{{${key}}}`, item || ''), value);
}

function mapFile(item, mapping = {}) {
  return {
    storageProviderFileId: item[mapping.id || 'id'],
    name: item[mapping.name || 'name'],
    mimeType: item[mapping.mimeType || 'mimeType'],
    webViewLink: item[mapping.webViewLink || 'webViewLink']
  };
}

export async function buildAuthorizationUrl(callbackUrl) {
  const { settings } = await getFileStorageProviderSettings();
  if (!settings?.authorizationUrl) return null;
  const url = new URL(settings.authorizationUrl);
  const params = settings.authorizationParams || {};
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, applyTemplate(value, { callbackUrl })));
  return url.toString();
}

export async function exchangeAuthorizationCode(code, callbackUrl) {
  const { settings } = await getFileStorageProviderSettings();
  if (!settings?.tokenUrl) return { ok: false };

  const response = await fetch(settings.tokenUrl, {
    method: settings.tokenMethod || 'POST',
    headers: settings.tokenHeaders || { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings.tokenBody || { code, callbackUrl })
  });
  if (!response.ok) return { ok: false };
  const tokens = await response.json();
  await insertFileStorageToken({ encrypted_tokens: encryptJson(tokens), is_active: true });
  return { ok: true };
}

export async function listStorageFiles() {
  const { settings } = await getFileStorageProviderSettings();
  const { encryptedTokens } = await getFileStorageToken();
  if (!settings?.filesUrl || !encryptedTokens) return [];

  const tokens = decryptJson(encryptedTokens);
  const response = await fetch(settings.filesUrl, {
    headers: Object.fromEntries(
      Object.entries(settings.filesHeaders || {}).map(([key, value]) => [key, applyTemplate(value, tokens || {})])
    )
  });
  if (!response.ok) return [];
  const payload = await response.json();
  const items = settings.filesPath ? settings.filesPath.split('.').reduce((value, key) => value?.[key], payload) : payload.files;
  return Array.isArray(items) ? items.map((item) => mapFile(item, settings.fileMapping)) : [];
}

export async function getStorageFileMetadata(fileId) {
  const files = await listStorageFiles();
  return files.find((file) => file.storageProviderFileId === fileId) || null;
}

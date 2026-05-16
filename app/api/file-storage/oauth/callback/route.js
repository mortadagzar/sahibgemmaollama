import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getActiveProviderSettings, storeFileStorageTokens } from '../../../../src/lib/databaseClient';

function encryptToken(token, secret) {
  if (!token) return null;
  const key = createHash('sha256').update(secret).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(String(token), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `\\x${Buffer.concat([iv, tag, encrypted]).toString('hex')}`;
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
  }

  const { settings } = await getActiveProviderSettings('file_storage_provider');
  if (!settings?.tokenEndpoint) {
    return NextResponse.json({ error: 'Token endpoint is not configured' }, { status: 404 });
  }

  const response = await fetch(settings.tokenEndpoint, {
    method: settings.tokenMethod || 'POST',
    headers: settings.tokenHeaders || { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, state })
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 502 });
  }

  const tokenPayload = await response.json();
  const encryptionSecret = settings.encryptionSecret || process.env.APP_TOKEN_ENCRYPTION_KEY;
  if (!encryptionSecret) {
    return NextResponse.json({ error: 'Token encryption key is not configured' }, { status: 500 });
  }

  await storeFileStorageTokens({
    provider_type: 'file_storage_provider',
    encrypted_access_token: encryptToken(tokenPayload.access_token, encryptionSecret),
    encrypted_refresh_token: encryptToken(tokenPayload.refresh_token, encryptionSecret),
    expires_at: tokenPayload.expires_at || null
  });

  return NextResponse.redirect(`${origin}/`);
}

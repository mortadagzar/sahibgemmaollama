import { NextResponse } from 'next/server';
import { buildAuthorizationUrl } from '../../../../src/lib/fileStorageClient';

export async function GET(request) {
  const callbackUrl = new URL('/api/file-storage/oauth/callback', request.url).toString();
  const authorizationUrl = await buildAuthorizationUrl(callbackUrl);
  if (!authorizationUrl) return NextResponse.json({ error: 'File storage provider is not configured' }, { status: 400 });
  return NextResponse.redirect(authorizationUrl);
}

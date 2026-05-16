import { NextResponse } from 'next/server';
import { exchangeAuthorizationCode } from '../../../../src/lib/fileStorageClient';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
  const callbackUrl = new URL('/api/file-storage/oauth/callback', request.url).toString();
  const result = await exchangeAuthorizationCode(code, callbackUrl);
  return NextResponse.json(result);
}

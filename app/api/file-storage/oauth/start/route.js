import { NextResponse } from 'next/server';
import { getActiveProviderSettings } from '../../../../src/lib/databaseClient';

export async function GET() {
  const { settings } = await getActiveProviderSettings('file_storage_provider');
  if (!settings?.authorizationUrl) {
    return NextResponse.json({ error: 'Authorization URL is not configured' }, { status: 404 });
  }

  return NextResponse.redirect(settings.authorizationUrl);
}

import { NextResponse } from 'next/server';
import { getActiveProviderSettings } from '../../../src/lib/databaseClient';
import { requestFileStorage } from '../../../src/lib/providerClient';

const fallbackFiles = [
  {
    id: 'demo-brief',
    name: 'Investor-Brief.pdf',
    mimeType: 'application/pdf',
    webViewLink: '#'
  },
  {
    id: 'demo-roadmap',
    name: 'Roadmap.xlsx',
    mimeType: 'application/vnd.sheet',
    webViewLink: '#'
  }
];

export async function GET() {
  const { settings } = await getActiveProviderSettings('file_storage_provider');
  if (!settings) return NextResponse.json({ files: fallbackFiles });

  const { data, error } = await requestFileStorage(settings, {});
  if (error) return NextResponse.json({ files: fallbackFiles });
  return NextResponse.json({ files: data });
}

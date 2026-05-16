import { NextResponse } from 'next/server';
import { getStorageFileMetadata } from '../../../src/lib/fileStorageClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  if (!fileId) return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
  const file = await getStorageFileMetadata(fileId);
  return NextResponse.json({ file });
}

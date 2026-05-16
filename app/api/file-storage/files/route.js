import { NextResponse } from 'next/server';
import { listStorageFiles } from '../../../src/lib/fileStorageClient';

export async function GET() {
  const files = await listStorageFiles();
  return NextResponse.json({ files });
}

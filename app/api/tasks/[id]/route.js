import { NextResponse } from 'next/server';
import { updateTask } from '../../../src/lib/databaseClient';

export async function PATCH(request, { params }) {
  const payload = await request.json().catch(() => ({}));
  await updateTask(params.id, { status: payload.status });
  return NextResponse.json({ id: params.id, status: payload.status });
}

import { NextResponse } from 'next/server';
import { shellCopy } from '../../src/content/copy';
import { getActiveProviderSettings, insertChatMessage } from '../../src/lib/databaseClient';
import { requestProviderReply } from '../../src/lib/providerClient';

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const message = String(payload.message || '').trim();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  await insertChatMessage({ sender: payload.userId || 'user', content: message });

  const { settings } = await getActiveProviderSettings();
  const providerResult = settings
    ? await requestProviderReply(settings, message)
    : { reply: shellCopy.fallbackReply, action: null, task: null };

  const finalReply = providerResult.reply || shellCopy.fallbackReply;
  await insertChatMessage({ sender: 'sahibuya', content: finalReply });

  return NextResponse.json({ reply: finalReply, action: providerResult.action, task: providerResult.task });
}

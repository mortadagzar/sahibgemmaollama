'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { shellCopy } from '../content/copy';
import { ChatMessage } from './ChatMessage';
import { SahibuyaAvatar } from './SahibuyaAvatar';
import { SendIcon } from './SendIcon';

const initialMessages = [
  {
    id: 'initial-sahibuya-message',
    sender: 'sahibuya',
    content: shellCopy.initialMessage
  }
];

function makeMessage(sender, content) {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sender,
    content
  };
}

export function ChatPanel({ onAssistantEvent, systemMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [avatarState, setAvatarState] = useState('idle');
  const [isSending, setIsSending] = useState(false);
  const celebrationTimer = useRef(null);
  const handledSystemMessages = useRef(0);

  useEffect(() => {
    const nextMessages = systemMessages.slice(handledSystemMessages.current);
    if (nextMessages.length === 0) return;
    handledSystemMessages.current = systemMessages.length;
    setMessages((currentMessages) => [
      ...currentMessages,
      ...nextMessages.map((content) => makeMessage('sahibuya', content))
    ]);
  }, [systemMessages]);

  const isListening = useMemo(() => draft.trim().length > 0 && !isSending, [draft, isSending]);
  const currentAvatarState = isSending ? 'thinking' : isListening ? 'listening' : avatarState;

  async function submitMessage(event) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;

    const userMessage = makeMessage('user', content);
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setDraft('');
    setIsSending(true);
    setAvatarState('thinking');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });
      const payload = await response.json();
      const reply = payload.reply || shellCopy.fallbackReply;
      setMessages((currentMessages) => [...currentMessages, makeMessage('sahibuya', reply)]);
      onAssistantEvent?.(payload);
      setAvatarState('celebrating');
      clearTimeout(celebrationTimer.current);
      celebrationTimer.current = setTimeout(() => setAvatarState('idle'), 1200);
    } catch {
      setMessages((currentMessages) => [...currentMessages, makeMessage('sahibuya', shellCopy.errorReply)]);
      setAvatarState('idle');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <aside className="flex min-h-[30rem] w-full flex-col rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm md:w-2/5 md:p-6">
      <SahibuyaAvatar state={currentAvatarState} />
      <h2 className="t-h2 mb-4 text-fg-1">{shellCopy.chatTitle}</h2>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <form onSubmit={submitMessage} className="relative flex min-h-12 items-center rounded-pill border border-stroke-1 bg-bg-elevated px-4 py-3 shadow-sm focus-within:border-blue-500 focus-within:shadow-focus">
        <label htmlFor="chat-input" className="sr-only">
          {shellCopy.inputLabel}
        </label>
        <input
          id="chat-input"
          type="text"
          dir="rtl"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={shellCopy.inputPlaceholder}
          className="min-w-0 flex-1 border-none bg-transparent pl-12 text-right font-naskh text-sm text-fg-1 outline-none placeholder:text-fg-4"
        />
        <button
          type="submit"
          aria-label={shellCopy.sendLabel}
          disabled={isSending || draft.trim().length === 0}
          className="absolute bottom-0 left-2 flex h-11 w-11 items-center justify-center text-darkteal-500 transition-all hover:text-darkteal-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendIcon />
        </button>
      </form>
    </aside>
  );
}

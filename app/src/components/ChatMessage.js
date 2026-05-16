function SahibIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-fg-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8.5c1.9 1.4 4.1 1.4 6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5.5 6h.01M10.5 6h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ChatMessage({ message }) {
  if (message.sender === 'user') {
    return (
      <div className="ml-auto w-fit max-w-sm animate-fade-in rounded-lg bg-darkteal-50 px-4 py-2 font-naskh text-sm text-fg-1">
        {message.content}
      </div>
    );
  }

  return (
    <div className="mr-auto flex max-w-2xl animate-fade-in items-start gap-2">
      <SahibIcon />
      <div className="w-fit rounded-lg bg-surface-muted px-4 py-2 font-naskh text-sm text-fg-1">
        {message.content}
      </div>
    </div>
  );
}

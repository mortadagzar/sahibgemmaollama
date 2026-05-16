import { shellCopy } from './src/content/copy';

function MicrophoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 14.5c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v5.5c0 1.66 1.34 3 3 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 11.5a6.5 6.5 0 0 1-13 0M12 18v3M9 21h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main dir="rtl" className="flex min-h-screen flex-col bg-bg-page text-right font-naskh text-fg-1">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-stroke-1 bg-surface-card px-4 shadow-xs md:px-6">
        <h1 className="t-h1 text-fg-1">{shellCopy.companyName}</h1>
        <div
          aria-label={shellCopy.userAvatarLabel}
          className="h-10 w-10 rounded-pill border border-stroke-2 bg-bg-elevated shadow-xs"
        />
      </header>

      <section className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
        <aside className="flex min-h-[30rem] w-full flex-col rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm md:w-2/5 md:p-6">
          <h2 className="t-h2 text-fg-1">{shellCopy.chatTitle}</h2>

          <div className="flex-1" aria-hidden="true" />

          <div className="flex min-h-12 items-center gap-4 rounded-pill border border-stroke-1 bg-bg-elevated px-4 py-3 text-fg-3 shadow-sm focus-within:border-blue-500 focus-within:shadow-focus">
            <MicrophoneIcon />
            <label htmlFor="chat-input" className="sr-only">
              {shellCopy.inputLabel}
            </label>
            <input
              id="chat-input"
              type="text"
              dir="rtl"
              placeholder={shellCopy.inputPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-right text-sm text-fg-1 outline-none placeholder:text-fg-4"
            />
          </div>
        </aside>

        <section className="min-h-[30rem] w-full rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm md:w-3/5 md:p-6">
          <h2 className="t-h2 text-fg-1">{shellCopy.workspaceTitle}</h2>
        </section>
      </section>
    </main>
  );
}

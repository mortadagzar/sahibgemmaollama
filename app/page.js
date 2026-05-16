function MicrophoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0 text-white"
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
    <main className="flex min-h-screen flex-col bg-charcoal text-white">
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-8">
        <h1 className="text-2xl font-bold leading-none sm:text-3xl">صحبوية</h1>
        <div
          aria-label="صورة المستخدم"
          className="h-11 w-11 rounded-full border border-white bg-surface"
        />
      </header>

      <section className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
        <aside className="flex min-h-[30rem] w-full flex-col rounded-3xl bg-surface p-5 shadow-2xl md:w-2/5 md:p-6">
          <h2 className="text-3xl font-bold leading-tight">المحادثة</h2>

          <div className="flex-1" aria-hidden="true" />

          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-charcoal px-4 py-3">
            <MicrophoneIcon />
            <label htmlFor="chat-input" className="sr-only">
              اكتب رسالتك
            </label>
            <input
              id="chat-input"
              type="text"
              dir="rtl"
              placeholder="اكتب رسالتك هنا"
              className="min-w-0 flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white"
            />
          </div>
        </aside>

        <section className="min-h-[30rem] w-full rounded-3xl bg-surface p-5 shadow-2xl md:w-3/5 md:p-6">
          <h2 className="text-3xl font-bold leading-tight">لوحة العمل</h2>
        </section>
      </section>
    </main>
  );
}

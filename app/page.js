import { CommandCenter } from './src/components/CommandCenter';
import { shellCopy } from './src/content/copy';

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
      <CommandCenter />
    </main>
  );
}

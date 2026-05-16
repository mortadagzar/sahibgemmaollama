import lottieManifest from '../animations/sahibuya-lottie.json';
import { shellCopy } from '../content/copy';

export function SahibuyaAvatar({ state = 'idle' }) {
  return (
    <div className="mb-4 flex justify-center">
      <div
        aria-label={shellCopy.avatarLabel}
        className="sahibuya-lottie h-32 w-32 text-fg-1"
        data-lottie={lottieManifest.nm}
        data-state={state}
        role="img"
      >
        <svg viewBox="0 0 128 128" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="sahibuya-halo">
            <circle cx="64" cy="64" r="48" stroke="currentColor" strokeOpacity="0.20" strokeWidth="2" strokeDasharray="8 10" />
            <circle cx="64" cy="16" r="4" fill="currentColor" fillOpacity="0.55" />
          </g>
          <g className="sahibuya-body">
            <path d="M32 58C32 37 46 24 64 24S96 37 96 58v18c0 19-14 32-32 32S32 95 32 76V58Z" fill="var(--bg-elevated)" stroke="var(--stroke-2)" strokeWidth="2" />
            <path d="M43 56c6-11 15-17 28-17 8 0 16 3 23 10-4-16-15-25-30-25-18 0-32 13-32 34v6c3-1 7-4 11-8Z" fill="var(--darkteal-500)" fillOpacity="0.34" />
            <circle cx="52" cy="66" r="4" fill="var(--fg-1)" />
            <circle cx="76" cy="66" r="4" fill="var(--fg-1)" />
            <path d="M54 84c7 5 14 5 21 0" stroke="var(--fg-1)" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="sahibuya-sparkles">
            <path d="M102 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="var(--gold-bright)" />
            <path d="M24 35l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="var(--blue-300)" />
            <path d="M102 90l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="var(--fg-2)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

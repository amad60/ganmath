import type { ReactNode } from 'react';

export type HeaderProps = {
  onBack?: () => void;
  backLabel?: string;
  center?: ReactNode;
  right?: ReactNode;
  tone?: 'plain' | 'mastery';
};

/** Header 56px + area aman. `tone="mastery"` membuat Mastery Check terlihat beda dari Practice. */
export function Header({ onBack, backLabel = 'Close', center, right, tone = 'plain' }: HeaderProps) {
  return (
    <header
      className="safe-top sticky top-0 z-10"
      style={{ background: tone === 'mastery' ? 'var(--c-star)' : 'var(--c-bg)' }}
    >
      <div className="flex h-14 items-center gap-3 px-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={backLabel}
            className="text-ink -ml-2 flex h-11 w-11 items-center justify-center rounded-[var(--r-pill)] text-2xl"
          >
            ✕
          </button>
        ) : null}
        <div className="min-w-0 flex-1">{center}</div>
        {right}
      </div>
    </header>
  );
}

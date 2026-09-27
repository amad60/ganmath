import { useState } from 'react';
import { Mascot } from '../mascot/Mascot';
import { Button } from '../ui';
import { UnitAnimation } from './UnitAnimation';
import { getUnitIntro } from './unitIntroData';

export type UnitIntroModalProps = {
  unitId: string | null;
  onClose: () => void;
  onStart?: () => void;
};

export function UnitIntroModal({ unitId, onClose, onStart }: UnitIntroModalProps) {
  const [replayKey, setReplayKey] = useState(0);

  if (!unitId) return null;
  const intro = getUnitIntro(unitId);
  if (!intro) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden
        role="presentation"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={intro.title}
        className="bg-surface safe-bottom relative z-10 flex w-full max-w-[400px] flex-col items-center gap-4 rounded-[var(--r-lg)] px-5 pt-5 shadow-[var(--shadow-card)]"
        style={{ border: '3px solid var(--c-line)' }}
      >
        {/* Top bar with close button */}
        <div className="flex w-full items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-xs font-black tracking-wider uppercase"
            style={{
              background: 'var(--c-primary-soft)',
              color: intro.accentColor,
            }}
          >
            Unit Preview
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-ink-soft hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {/* Mascot + Header */}
        <div className="flex items-center gap-3">
          <Mascot mood={intro.mascotMood} size={76} />
          <div className="flex flex-col">
            <h2 className="text-xl font-black leading-tight text-[var(--c-ink)]">{intro.title}</h2>
            <p className="text-sm font-bold text-[var(--c-ink-soft)]">{intro.subtitle}</p>
          </div>
        </div>

        {/* Interactive Motion Animation */}
        <div className="relative w-full">
          <UnitAnimation unitId={unitId} replayKey={replayKey} />

          {/* Replay button */}
          <button
            type="button"
            aria-label="Replay animation"
            onClick={() => setReplayKey((k) => k + 1)}
            className="absolute right-2 bottom-2 flex h-9 items-center gap-1 rounded-full px-2.5 text-xs font-black shadow-xs"
            style={{
              background: 'var(--c-surface)',
              border: '1.5px solid var(--c-line)',
              color: 'var(--c-ink-soft)',
            }}
          >
            <span>🔁</span>
            <span>Replay</span>
          </button>
        </div>

        {/* Concept description */}
        <p className="text-center text-[16px] font-bold leading-snug text-[var(--c-ink)]">
          {intro.concept}
        </p>

        {/* Action button */}
        <div className="w-full pt-1">
          <Button
            full
            onClick={() => {
              if (onStart) onStart();
              else onClose();
            }}
          >
            Let's Go! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type TenFrameProps = {
  value: number;
  /** 10 = satu frame, 20 = dua frame bersusun (dipakai untuk teen numbers). */
  capacity?: 10 | 20;
  onChange?: (next: number) => void;
  /** Warna titik untuk membedakan dua bilangan yang dijumlahkan. */
  split?: number;
  animate?: boolean;
  /** Titik muncul bersamaan — subitizing, bukan menghitung satu-satu. */
  together?: boolean;
  /** Tampilkan `value` selama ini lalu kosongkan. Mengetuk frame mengulanginya. */
  flashMs?: number;
  onFlashEnd?: () => void;
};

/**
 * Ten-frame: alat subitizing dan "berapa lagi sampai 10".
 * Titik masuk satu per satu 120ms; saat penuh seluruh frame berkilau —
 * itulah cara app mengajarkan bonds of 10 tanpa satu kata pun.
 *
 * `flashMs` membalik itu: titik muncul BERSAMAAN, lalu hilang. Itulah subitizing
 * (docs/curriculum/grade-1.md) — mengenali pola, bukan menghitung.
 */
export function TenFrame({
  value,
  capacity = 10,
  onChange,
  split,
  animate = true,
  together,
  flashMs,
  onFlashEnd,
}: TenFrameProps) {
  const reduced = useReducedMotion();
  const frames = capacity === 20 ? [0, 1] : [0];
  const flashing = flashMs != null && !onChange;
  const [play, setPlay] = useState(0);
  const [hidden, setHidden] = useState(false);
  const shown = flashing && hidden ? 0 : value;
  const full = shown >= capacity;
  const stagger = animate && !together && !flashing;
  const onFlashEndRef = useRef(onFlashEnd);
  onFlashEndRef.current = onFlashEnd;

  useEffect(() => {
    if (!flashing) {
      setHidden(false);
      return;
    }
    setHidden(false);
    const t = window.setTimeout(() => {
      setHidden(true);
      onFlashEndRef.current?.();
    }, teachingDuration(flashMs, reduced));
    return () => window.clearTimeout(t);
  }, [flashing, flashMs, reduced, play]);

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`Ten frame showing ${shown}`}>
      {frames.map((f) => (
        <div
          key={f}
          className="grid grid-cols-5 rounded-[var(--r-sm)] border-2 transition-shadow"
          style={{
            borderColor: 'var(--c-line)',
            boxShadow: full && animate ? '0 0 0 4px var(--c-correct-soft)' : 'none',
            transitionDuration: `${teachingDuration(400, reduced)}ms`,
          }}
        >
          {Array.from({ length: 10 }, (_, i) => {
            const index = f * 10 + i;
            const filled = index < shown;
            const isSecond = split != null && index >= split;
            const replay = flashing && hidden;
            return (
              <button
                key={index}
                type="button"
                aria-label={replay ? `Cell ${index + 1}, look again` : `Cell ${index + 1}`}
                disabled={!onChange && !replay}
                onClick={() => {
                  if (onChange) onChange(index < value ? index : index + 1);
                  else if (replay) setPlay((p) => p + 1);
                }}
                className="flex h-12 w-12 items-center justify-center border border-[var(--c-line)]"
              >
                <span
                  className="block rounded-full"
                  style={{
                    width: 30,
                    height: 30,
                    background: filled
                      ? isSecond
                        ? 'var(--c-unit-3)'
                        : 'var(--c-primary)'
                      : 'transparent',
                    transform: filled ? 'scale(1)' : 'scale(0)',
                    transition: `transform ${teachingDuration(120, reduced)}ms var(--ease-std) ${
                      stagger ? Math.min(index, 12) * teachingDuration(60, reduced) : 0
                    }ms`,
                  }}
                />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

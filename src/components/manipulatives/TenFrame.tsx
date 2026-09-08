import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type TenFrameProps = {
  value: number;
  /** 10 = satu frame, 20 = dua frame bersusun (dipakai untuk teen numbers). */
  capacity?: 10 | 20;
  onChange?: (next: number) => void;
  /** Warna titik untuk membedakan dua bilangan yang dijumlahkan. */
  split?: number;
  animate?: boolean;
};

/**
 * Ten-frame: alat subitizing dan "berapa lagi sampai 10".
 * Titik masuk satu per satu 120ms; saat penuh seluruh frame berkilau —
 * itulah cara app mengajarkan bonds of 10 tanpa satu kata pun.
 */
export function TenFrame({ value, capacity = 10, onChange, split, animate = true }: TenFrameProps) {
  const reduced = useReducedMotion();
  const frames = capacity === 20 ? [0, 1] : [0];
  const full = value >= capacity;

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`Ten frame showing ${value}`}>
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
            const filled = index < value;
            const isSecond = split != null && index >= split;
            return (
              <button
                key={index}
                type="button"
                aria-label={`Cell ${index + 1}`}
                disabled={!onChange}
                onClick={() => onChange?.(index < value ? index : index + 1)}
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
                      animate ? Math.min(index, 12) * teachingDuration(60, reduced) : 0
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

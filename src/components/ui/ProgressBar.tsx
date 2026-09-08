export type ProgressBarProps = {
  value: number;
  max: number;
  label?: string;
  tone?: 'primary' | 'star';
};

/** Dianimasikan dengan scaleX (bukan width) supaya tetap 60fps di HP kelas menengah. */
export function ProgressBar({ value, max, label, tone = 'primary' }: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max));
  const color = tone === 'star' ? 'var(--c-star)' : 'var(--c-primary)';
  return (
    <div className="flex items-center gap-3">
      <div
        className="bg-sunk h-3.5 flex-1 overflow-hidden rounded-[var(--r-pill)]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? 'Progress'}
      >
        <div
          className="h-full origin-left rounded-[var(--r-pill)] transition-transform duration-[400ms] ease-[var(--ease-std)]"
          style={{ transform: `scaleX(${pct})`, background: color, width: '100%' }}
        />
      </div>
      {label ? (
        // Lebar minimum + angka tabular: labelnya tidak menggeser bar saat angkanya
        // berubah dari 9 ke 10.
        <span className="text-ink-soft shrink-0 text-right text-[14px] font-black tabular-nums">
          {label}
        </span>
      ) : null}
    </div>
  );
}

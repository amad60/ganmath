export type BarsProps = {
  /** Panjang relatif 0..1 */
  lengths: number[];
  labels?: string[];
  colors?: string[];
};

/** Batang pembanding panjang — dipakai modul pengukuran (longer / shorter). */
export function Bars({ lengths, labels, colors }: BarsProps) {
  const palette = colors ?? ['var(--c-unit-7)', 'var(--c-unit-3)', 'var(--c-unit-1)'];
  return (
    <div className="flex w-full flex-col gap-3" aria-label="Compare lengths">
      {lengths.map((l, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-6 shrink-0 text-[18px] font-black">{labels?.[i] ?? ''}</span>
          <span
            style={{
              height: 26,
              width: `${Math.max(6, Math.min(100, l * 100))}%`,
              background: palette[i % palette.length],
              borderRadius: 999,
              display: 'block',
            }}
          />
        </div>
      ))}
    </div>
  );
}

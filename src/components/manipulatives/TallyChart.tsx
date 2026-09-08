export type TallyChartProps = {
  count: number;
  size?: number;
};

/** Turus: kelompok lima, empat tegak dan satu miring — cara menghitung yang diajarkan. */
export function TallyChart({ count, size = 1 }: TallyChartProps) {
  const groups = Math.floor(count / 5);
  const rest = count % 5;
  const stroke = 'var(--c-ink)';

  const group = (n: number, key: number, diagonal: boolean) => (
    <svg key={key} viewBox="0 0 40 40" width={44 * size} height={44 * size} aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <line
          key={i}
          x1={6 + i * 7}
          y1="6"
          x2={6 + i * 7}
          y2="34"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      {diagonal ? (
        <line x1="2" y1="32" x2="34" y2="8" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      ) : null}
    </svg>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2" aria-label={`${count} tally`}>
      {Array.from({ length: groups }, (_, i) => group(4, i, true))}
      {rest > 0 ? group(rest, 999, false) : null}
    </div>
  );
}

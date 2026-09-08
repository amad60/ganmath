export type FractionShapeProps = {
  /** Jumlah bagian yang sama besar: 1, 2, 3, atau 4. */
  parts: number;
  /** Berapa bagian yang diarsir. */
  shaded: number;
  shape?: 'circle' | 'square';
  size?: number;
  /** Bagian yang TIDAK sama besar — dipakai untuk mengajarkan arti "equal". */
  unequal?: boolean;
};

/**
 * Bentuk terbagi untuk setengah dan seperempat.
 *
 * Varian `unequal` penting: anak sering mengira "dibagi dua" sama dengan "setengah".
 * Menunjukkan pembagian yang tidak sama besar adalah cara mengajarkan bahwa yang
 * menentukan adalah bagian yang SAMA BESAR.
 */
export function FractionShape({
  parts,
  shaded,
  shape = 'circle',
  size = 120,
  unequal,
}: FractionShapeProps) {
  const cx = 50;
  const cy = 50;
  const r = 44;

  const wedge = (i: number, total: number) => {
    const span = unequal && i === 0 ? 1.6 : unequal ? (2 - 1.6 / total) / (total - 1) : 1;
    const start = unequal
      ? (i === 0 ? 0 : 1.6 + (i - 1) * span) * (Math.PI / (total / 2)) - Math.PI / 2
      : (i * 2 * Math.PI) / total - Math.PI / 2;
    const end = unequal
      ? (i === 0 ? 1.6 : 1.6 + i * span) * (Math.PI / (total / 2)) - Math.PI / 2
      : ((i + 1) * 2 * Math.PI) / total - Math.PI / 2;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`${shaded} of ${parts} parts shaded`}
      style={{ display: 'block' }}
    >
      {shape === 'circle'
        ? Array.from({ length: parts }, (_, i) => (
            <path
              key={i}
              d={wedge(i, parts)}
              fill={i < shaded ? 'var(--c-unit-3)' : 'var(--c-surface)'}
              stroke="var(--c-ink)"
              strokeWidth="2.5"
            />
          ))
        : Array.from({ length: parts }, (_, i) => {
            const w = 88 / parts;
            return (
              <rect
                key={i}
                x={6 + i * w}
                y={16}
                width={w}
                height={68}
                fill={i < shaded ? 'var(--c-unit-3)' : 'var(--c-surface)'}
                stroke="var(--c-ink)"
                strokeWidth="2.5"
              />
            );
          })}
    </svg>
  );
}

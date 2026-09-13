import { useRef, useState, type KeyboardEvent } from 'react';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type FractionShapeProps = {
  /** Jumlah bagian yang sama besar: 1, 2, 3, atau 4. */
  parts: number;
  /** Berapa bagian yang diarsir. */
  shaded: number;
  shape?: 'circle' | 'square';
  size?: number;
  /** Bagian yang TIDAK sama besar — dipakai untuk mengajarkan arti "equal". */
  unequal?: boolean;
  /** Bagian bisa disentuh satu per satu; dipanggil dengan jumlah bagian berbeda yang disentuh. */
  onTap?: (count: number) => void;
};

/** Porsi bagian pertama pada varian `unequal`, dalam satuan "satu bagian sama besar". */
const BIG = 1.6;

/**
 * Sudut awal & akhir bagian ke-`i` (radian, 0 = arah jam 12).
 *
 * Versi sebelumnya membagi sisa lingkaran dengan rumus yang salah: pada 4 bagian
 * tidak sama besar ada celah 72° yang tidak digambar sama sekali, pada 2 bagian
 * potongan kedua menimpa yang pertama. Sekarang satu lingkaran = `total` satuan,
 * bagian pertama `BIG` satuan, sisanya dibagi rata — jumlahnya selalu tepat satu
 * putaran, dan itu diuji.
 */
export function wedgeAngles(i: number, total: number, unequal: boolean): { start: number; end: number } {
  const unit = (2 * Math.PI) / total;
  const rest = (total - BIG) / (total - 1);
  const from = !unequal ? i : i === 0 ? 0 : BIG + (i - 1) * rest;
  const to = !unequal ? i + 1 : i === 0 ? BIG : BIG + i * rest;
  return { start: from * unit - Math.PI / 2, end: to * unit - Math.PI / 2 };
}

/**
 * Bentuk terbagi untuk setengah dan seperempat.
 *
 * Varian `unequal` penting: anak sering mengira "dibagi dua" sama dengan "setengah".
 * Menunjukkan pembagian yang tidak sama besar adalah cara mengajarkan bahwa yang
 * menentukan adalah bagian yang SAMA BESAR.
 *
 * Dengan `onTap` tiap bagian jadi sasaran sentuh dan dinomori seperti Shape2D —
 * anak menghitung BAGIAN bangunnya sendiri, bukan deretan emoji di sebelahnya.
 */
export function FractionShape({
  parts,
  shaded,
  shape = 'circle',
  size = 120,
  unequal,
  onTap,
}: FractionShapeProps) {
  const reduced = useReducedMotion();
  const hitRef = useRef<number[]>([]);
  const [hit, setHit] = useState<number[]>([]);
  const ms = teachingDuration(200, reduced);
  const cx = 50;
  const cy = 50;
  const r = 44;

  const take = (i: number) => {
    if (!onTap || hitRef.current.includes(i)) return;
    hitRef.current = [...hitRef.current, i];
    setHit(hitRef.current);
    onTap(hitRef.current.length);
  };

  const angles = (i: number, total: number) => wedgeAngles(i, total, unequal === true);

  const wedge = (i: number, total: number) => {
    const { start, end } = angles(i, total);
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  /** Titik tengah sebuah bagian — tempat nomor hitungan ditulis. */
  const center = (i: number): [number, number] => {
    if (shape === 'square') return [6 + (i + 0.5) * (88 / parts), 50];
    if (parts === 1) return [cx, cy];
    const { start, end } = angles(i, parts);
    const mid = (start + end) / 2;
    return [cx + r * 0.55 * Math.cos(mid), cy + r * 0.55 * Math.sin(mid)];
  };

  const fillOf = (i: number) =>
    hit.includes(i) ? 'var(--c-correct-soft)' : i < shaded ? 'var(--c-unit-3)' : 'var(--c-surface)';

  const tapProps = (i: number) =>
    onTap
      ? {
          role: 'button',
          tabIndex: 0,
          'aria-label': hit.includes(i) ? `Part ${i + 1}, counted` : `Part ${i + 1}`,
          'data-part': 'tap-target',
          onClick: () => take(i),
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') take(i);
          },
          style: { cursor: 'pointer', outline: 'none', transition: `fill ${ms}ms linear` },
        }
      : {};

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
              fill={fillOf(i)}
              stroke="var(--c-ink)"
              strokeWidth="2.5"
              {...tapProps(i)}
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
                fill={fillOf(i)}
                stroke="var(--c-ink)"
                strokeWidth="2.5"
                {...tapProps(i)}
              />
            );
          })}
      {hit.map((i, n) => {
        const [x, y] = center(i);
        return (
          <g key={`n-${i}`} pointerEvents="none">
            <circle cx={x} cy={y} r="8" fill="var(--c-correct)" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="900" fill="#fff">
              {n + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

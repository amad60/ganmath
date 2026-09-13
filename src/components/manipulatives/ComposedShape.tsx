import { useRef, useState, type KeyboardEvent } from 'react';
import type { ComposedName } from '../../engine/types';
import { COMPOSED, pieceCenter, type Piece } from './composed';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type ComposedShapeProps = {
  name: ComposedName;
  size?: number;
  /** Kalimat lambang di bawah gambar, mis. "2 halves make 1 circle". */
  note?: string;
  /** Dipanggil dengan jumlah potongan berbeda yang sudah disentuh (1, 2, 3, …). */
  onTap?: (count: number) => void;
};

const piecePath = (p: Piece) =>
  'half' in p
    ? `M8,50 A42,42 0 0 ${p.half === 'top' ? 1 : 0} 92,50 Z`
    : `M${p.pts.map((q) => q.join(',')).join(' L')} Z`;

/**
 * Bangun besar dari potongan-potongan kecil.
 *
 * Potongan diberi dua warna berselang dan garis sambungan yang jelas: anak harus bisa
 * melihat POTONGANNYA (untuk dihitung) sekaligus GARIS LUARNYA (untuk dinamai).
 * Kalau warnanya sama, yang terlihat hanya bangun besar; kalau garis luarnya tenggelam,
 * yang terlihat hanya tumpukan segitiga.
 *
 * Seperti Shape2D, potongan yang sudah disentuh dinomori dan tidak terhitung dua kali.
 */
export function ComposedShape({ name, size = 150, note, onTap }: ComposedShapeProps) {
  const reduced = useReducedMotion();
  const hitRef = useRef<number[]>([]);
  const [hit, setHit] = useState<number[]>([]);
  const { pieces } = COMPOSED[name];
  const ms = teachingDuration(200, reduced);

  const take = (i: number) => {
    if (!onTap || hitRef.current.includes(i)) return;
    hitRef.current = [...hitRef.current, i];
    setHit(hitRef.current);
    onTap(hitRef.current.length);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role="img"
        // Nama bangun besarnya TIDAK disebut: di soal, itulah yang ditanyakan.
        aria-label={`${pieces.length} pieces`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {pieces.map((p, i) => {
          const done = hit.includes(i);
          const base = i % 2 === 0 ? 'var(--c-unit-6)' : 'color-mix(in srgb, var(--c-unit-6) 45%, var(--c-surface))';
          return (
            <path
              key={i}
              d={piecePath(p)}
              fill={done ? 'var(--c-correct-soft)' : base}
              stroke="var(--c-ink)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              data-part={onTap ? 'tap-target' : 'piece'}
              {...(onTap
                ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': done ? `Piece ${i + 1}, counted` : `Piece ${i + 1}`,
                    onClick: () => take(i),
                    onKeyDown: (e: KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') take(i);
                    },
                    style: { cursor: 'pointer', outline: 'none', transition: `fill ${ms}ms linear` },
                  }
                : {})}
            />
          );
        })}
        {pieces.map((p, i) => {
          const n = hit.indexOf(i);
          if (n < 0) return null;
          const [cx, cy] = pieceCenter(p);
          return (
            <g key={`n-${i}`} pointerEvents="none">
              <circle cx={cx} cy={cy} r="8" fill="var(--c-correct)" />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="900" fill="#fff">
                {n + 1}
              </text>
            </g>
          );
        })}
      </svg>
      {note ? <p className="text-center text-[18px] font-black">{note}</p> : null}
    </div>
  );
}

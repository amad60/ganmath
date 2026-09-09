import { useRef, useState } from 'react';
import type { ShapeName } from '../../engine/types';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type { ShapeName };

/** Bagian bangun yang bisa dihitung anak dengan menyentuhnya satu per satu. */
export type ShapePart = 'corners' | 'sides';

export type Shape2DProps = {
  name: ShapeName;
  size?: number;
  color?: string;
  /** Tandai sudutnya — dipakai saat modul mengajarkan sisi & sudut. */
  showCorners?: boolean;
  /** Bagian yang bisa disentuh. Tanpa ini bangunnya cuma gambar. */
  tap?: ShapePart;
  /** Dipanggil dengan jumlah bagian berbeda yang sudah disentuh (1, 2, 3, …). */
  onTap?: (count: number) => void;
};

const POINTS: Record<Exclude<ShapeName, 'circle'>, [number, number][]> = {
  triangle: [
    [50, 8],
    [92, 88],
    [8, 88],
  ],
  square: [
    [12, 12],
    [88, 12],
    [88, 88],
    [12, 88],
  ],
  rectangle: [
    [6, 26],
    [94, 26],
    [94, 74],
    [6, 74],
  ],
  pentagon: [
    [50, 6],
    [95, 38],
    [78, 92],
    [22, 92],
    [5, 38],
  ],
  hexagon: [
    [50, 5],
    [92, 28],
    [92, 72],
    [50, 95],
    [8, 72],
    [8, 28],
  ],
};

/**
 * Bangun datar sungguhan, bukan emoji.
 *
 * Emoji tidak bisa dipakai mengajar: 🔺 punya bentuk berbeda di tiap sistem, tidak
 * bisa diberi penanda sudut, dan terlihat seperti stiker. Bentuk SVG bisa diwarnai,
 * diberi titik sudut, dan konsisten di semua HP.
 *
 * Sudut dan sisinya bisa disentuh satu per satu (`tap`). Bagian yang sudah disentuh
 * dinomori seperti CounterObjects — anak melihat apa yang sudah dia hitung, jadi
 * tidak ada yang terhitung dua kali. Menyentuh bagian yang sama lagi tidak menambah.
 */
export function Shape2D({
  name,
  size = 96,
  color = 'var(--c-unit-6)',
  showCorners,
  tap,
  onTap,
}: Shape2DProps) {
  const reduced = useReducedMotion();
  // Ref, bukan hanya state: dua sentuhan yang tiba di tick yang sama dua-duanya
  // membaca `hit` versi lama, jadi yang tercatat cuma yang terakhir — anak menyentuh
  // tiga sudut dan hitungannya berhenti di satu. Ref diperbarui seketika.
  const hitRef = useRef<number[]>([]);
  const [hit, setHit] = useState<number[]>([]);
  const pts = name === 'circle' ? null : POINTS[name];
  // Lingkaran tidak punya sudut maupun sisi untuk dihitung, jadi tidak pernah interaktif.
  const live = pts != null && tap != null && onTap != null;
  const ms = teachingDuration(200, reduced);

  const take = (i: number) => {
    if (!live || hitRef.current.includes(i)) return;
    hitRef.current = [...hitRef.current, i];
    setHit(hitRef.current);
    onTap(hitRef.current.length);
  };

  const parts: { i: number; cx: number; cy: number; label: string }[] = [];
  if (live && pts) {
    if (tap === 'corners') {
      pts.forEach(([x, y], i) => parts.push({ i, cx: x, cy: y, label: `Corner ${i + 1}` }));
    } else {
      pts.forEach(([x, y], i) => {
        const [nx, ny] = pts[(i + 1) % pts.length] as [number, number];
        parts.push({ i, cx: (x + nx) / 2, cy: (y + ny) / 2, label: `Side ${i + 1}` });
      });
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={name}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {pts ? (
        <polygon
          points={pts.map((p) => p.join(',')).join(' ')}
          fill={color}
          stroke="var(--c-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
          opacity="0.9"
        />
      ) : (
        <circle cx="50" cy="50" r="42" fill={color} stroke="var(--c-ink)" strokeWidth="3" opacity="0.9" />
      )}

      {/* Sisi yang sudah disentuh ditebalkan di atas bangunnya, supaya kelihatan
          sisi MANA yang sudah dihitung — bukan sekadar berapa banyak. */}
      {live && pts && tap === 'sides'
        ? pts.map(([x, y], i) => {
            const [nx, ny] = pts[(i + 1) % pts.length] as [number, number];
            return hit.includes(i) ? (
              <line
                key={`done-${i}`}
                x1={x}
                y1={y}
                x2={nx}
                y2={ny}
                stroke="var(--c-correct)"
                strokeWidth="6"
                strokeLinecap="round"
                data-part="side-done"
              />
            ) : null;
          })
        : null}

      {showCorners && pts
        ? pts.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5.5"
              fill={live && tap === 'corners' && hit.includes(i) ? 'var(--c-correct)' : 'var(--c-ink)'}
              data-part="corner"
              style={{ transition: `fill ${ms}ms linear` }}
            />
          ))
        : null}

      {/* Nomor urut hitungan, seperti angka kecil di CounterObjects. */}
      {parts.map((p) => {
        const n = hit.indexOf(p.i);
        if (n < 0) return null;
        return (
          <g key={`n-${p.i}`} pointerEvents="none">
            <circle cx={p.cx} cy={p.cy} r="8" fill="var(--c-correct)" />
            <text
              x={p.cx}
              y={p.cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="900"
              fill="#fff"
            >
              {n + 1}
            </text>
          </g>
        );
      })}

      {/* Sasaran sentuh, digambar terakhir supaya selalu di atas. Radius 14 unit
          pada bangun 200px = sekitar 56px — di atas ambang 44px di CLAUDE.md §2. */}
      {parts.map((p) => (
        <circle
          key={`hit-${p.i}`}
          cx={p.cx}
          cy={p.cy}
          r="14"
          fill="transparent"
          role="button"
          tabIndex={0}
          aria-label={hit.includes(p.i) ? `${p.label}, counted` : p.label}
          data-part="tap-target"
          style={{ cursor: 'pointer', outline: 'none' }}
          onClick={() => take(p.i)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              take(p.i);
            }
          }}
        />
      ))}
    </svg>
  );
}

export const SHAPE_SIDES: Record<ShapeName, number> = {
  circle: 0,
  triangle: 3,
  square: 4,
  rectangle: 4,
  pentagon: 5,
  hexagon: 6,
};

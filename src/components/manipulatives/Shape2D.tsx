import type { ShapeName } from '../../engine/types';

export type { ShapeName };

export type Shape2DProps = {
  name: ShapeName;
  size?: number;
  color?: string;
  /** Tandai sudutnya — dipakai saat modul mengajarkan sisi & sudut. */
  showCorners?: boolean;
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
 */
export function Shape2D({ name, size = 96, color = 'var(--c-unit-6)', showCorners }: Shape2DProps) {
  const pts = name === 'circle' ? null : POINTS[name];
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={name}
      style={{ display: 'block' }}
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
      {showCorners && pts
        ? pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" fill="var(--c-ink)" />)
        : null}
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

import type { ComposedName, ShapeName } from '../../engine/types';

export type { ComposedName };

/** Titik dalam kotak gambar 100×100. */
export type Pt = [number, number];

/** Satu potongan: poligon, atau setengah lingkaran (`half`, sisi datarnya di y = 50). */
export type Piece = { pts: Pt[] } | { half: 'top' | 'bottom' };

/**
 * Bangun besar yang disusun dari potongan — fungsi murni, tanpa React.
 *
 * Nama bangun besar dan jumlah potongan dipakai soal ("What big shape do they make?",
 * "How many pieces?"), bentuk potongannya dipakai gambar. Ditulis di satu tempat supaya
 * soal tidak pernah bilang "4 pieces" di atas gambar yang berisi 3. Bahwa potongannya
 * benar-benar MENUTUP bangun besarnya — tanpa celah, tanpa tumpang tindih — diuji
 * lewat luasnya di `visuals.test.tsx`.
 */
export const COMPOSED: Record<ComposedName, { whole: ShapeName; pieces: Piece[] }> = {
  'square-2-triangles': {
    whole: 'square',
    pieces: [
      { pts: [[15, 15], [85, 15], [15, 85]] },
      { pts: [[85, 15], [85, 85], [15, 85]] },
    ],
  },
  'square-4-triangles': {
    whole: 'square',
    pieces: [
      { pts: [[15, 15], [85, 15], [50, 50]] },
      { pts: [[85, 15], [85, 85], [50, 50]] },
      { pts: [[85, 85], [15, 85], [50, 50]] },
      { pts: [[15, 85], [15, 15], [50, 50]] },
    ],
  },
  'square-4-squares': {
    whole: 'square',
    pieces: [
      { pts: [[15, 15], [50, 15], [50, 50], [15, 50]] },
      { pts: [[50, 15], [85, 15], [85, 50], [50, 50]] },
      { pts: [[15, 50], [50, 50], [50, 85], [15, 85]] },
      { pts: [[50, 50], [85, 50], [85, 85], [50, 85]] },
    ],
  },
  'square-2-rectangles': {
    whole: 'square',
    pieces: [
      { pts: [[15, 15], [50, 15], [50, 85], [15, 85]] },
      { pts: [[50, 15], [85, 15], [85, 85], [50, 85]] },
    ],
  },
  'rectangle-2-squares': {
    whole: 'rectangle',
    pieces: [
      { pts: [[6, 28], [50, 28], [50, 72], [6, 72]] },
      { pts: [[50, 28], [94, 28], [94, 72], [50, 72]] },
    ],
  },
  'rectangle-3-squares': {
    whole: 'rectangle',
    pieces: [
      { pts: [[5, 35], [35, 35], [35, 65], [5, 65]] },
      { pts: [[35, 35], [65, 35], [65, 65], [35, 65]] },
      { pts: [[65, 35], [95, 35], [95, 65], [65, 65]] },
    ],
  },
  'rectangle-2-triangles': {
    whole: 'rectangle',
    pieces: [
      { pts: [[6, 26], [94, 26], [6, 74]] },
      { pts: [[94, 26], [94, 74], [6, 74]] },
    ],
  },
  'triangle-2-triangles': {
    whole: 'triangle',
    pieces: [
      { pts: [[50, 10], [50, 88], [8, 88]] },
      { pts: [[50, 10], [92, 88], [50, 88]] },
    ],
  },
  'hexagon-6-triangles': {
    whole: 'hexagon',
    pieces: (
      [
        [50, 5],
        [92, 28],
        [92, 72],
        [50, 95],
        [8, 72],
        [8, 28],
      ] as Pt[]
    ).map((p, i, all) => ({ pts: [p, all[(i + 1) % all.length]!, [50, 50]] })),
  },
  'circle-2-halves': {
    whole: 'circle',
    pieces: [{ half: 'top' }, { half: 'bottom' }],
  },
};

export const COMPOSED_NAMES = Object.keys(COMPOSED) as ComposedName[];

export function piecesOf(name: ComposedName): number {
  return COMPOSED[name].pieces.length;
}

/** Luas poligon (rumus tali sepatu). Untuk menguji bahwa potongan menutup bangunnya. */
export function polygonArea(pts: Pt[]): number {
  let a = 0;
  pts.forEach(([x, y], i) => {
    const [nx, ny] = pts[(i + 1) % pts.length]!;
    a += x * ny - nx * y;
  });
  return Math.abs(a) / 2;
}

/** Titik tengah potongan — tempat nomor hitungan ditulis. */
export function pieceCenter(p: Piece): Pt {
  if ('half' in p) return [50, p.half === 'top' ? 32 : 68];
  const n = p.pts.length;
  return [p.pts.reduce((s, q) => s + q[0], 0) / n, p.pts.reduce((s, q) => s + q[1], 0) / n];
}

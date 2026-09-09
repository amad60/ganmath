import type { SolidName } from '../../engine/types';

export type { SolidName };

/**
 * Aturan bangun ruang — fungsi murni, tanpa React, bisa diuji tanpa DOM.
 *
 * Sengaja dipisah dari komponennya: data modul butuh NAMA bangun, JUMLAH SISI, dan
 * VOLUME untuk menyusun soal, sedangkan gambar butuh hal yang sama untuk menuliskannya
 * di layar. Kalau keduanya menghitung sendiri-sendiri, cepat atau lambat soal bilang
 * "24" sementara gambarnya berisi 18 kubus dan tidak ada yang menyadarinya.
 */

/** Nama bangun dalam English sederhana — dipakai label gambar dan teks soal. */
export const SOLID_NAMES: Record<SolidName, string> = {
  cube: 'cube',
  'rectangular-prism': 'rectangular prism',
  'triangular-prism': 'triangular prism',
  'square-pyramid': 'square pyramid',
  cylinder: 'cylinder',
};

/** Banyak sisi (faces). Cylinder dihitung 3 seperti di buku SD: dua alas + selimut. */
export const SOLID_FACES: Record<SolidName, number> = {
  cube: 6,
  'rectangular-prism': 6,
  'triangular-prism': 5,
  'square-pyramid': 5,
  cylinder: 3,
};

/** Banyak rusuk (edges). Cylinder: dua lingkaran tepi. */
export const SOLID_EDGES: Record<SolidName, number> = {
  cube: 12,
  'rectangular-prism': 12,
  'triangular-prism': 9,
  'square-pyramid': 8,
  cylinder: 2,
};

/** Banyak titik sudut (vertices). Cylinder tidak punya. */
export const SOLID_VERTICES: Record<SolidName, number> = {
  cube: 8,
  'rectangular-prism': 8,
  'triangular-prism': 6,
  'square-pyramid': 5,
  cylinder: 0,
};

/** Bangun ruang yang punya jaring-jaring sederhana. Bola sengaja tidak ada: bola tidak bisa dibentangkan. */
export const NET_SOLIDS: SolidName[] = [
  'cube',
  'rectangular-prism',
  'triangular-prism',
  'square-pyramid',
  'cylinder',
];

/** Ukuran balok dalam SATUAN (bukan piksel): panjang, lebar/kedalaman, tinggi. */
export type SolidDims = { l: number; w: number; h: number };

/**
 * Nama balok dari ukurannya. Ini aturan yang paling gampang dilanggar diam-diam:
 * modul yang menulis `name: 'cube'` untuk 3×3×2 langsung mengajarkan hal yang salah.
 */
export function solidFromDims(l: number, w: number, h: number): SolidName {
  return l === w && w === h ? 'cube' : 'rectangular-prism';
}

/** Volume balok = panjang × lebar × tinggi. Satu-satunya tempat aturan ini ditulis. */
export function volumeOf(l: number, w: number, h: number): number {
  return l * w * h;
}

/** Banyak kubus satuan dalam SATU lapis — jembatan dari luas alas ke volume. */
export function layerOf(l: number, w: number): number {
  return l * w;
}

/** Luas permukaan balok = 2(pl + pt + lt). */
export function surfaceAreaOf(l: number, w: number, h: number): number {
  return 2 * (l * w + l * h + w * h);
}

/** Satu sisi jaring-jaring. Titik sudut dalam satuan jaring, bukan piksel. */
export type NetFace = {
  points: [number, number][];
  /** Sisi bundar digambar sebagai lingkaran; `points` jadi kotak pembatasnya. */
  circle?: { cx: number; cy: number; r: number };
};

/**
 * Berapa susunan jaring yang tersedia untuk sebuah bangun.
 *
 * Kubus punya sebelas jaring yang sah; yang dipakai di sini tiga yang paling mudah
 * dikenali. Yang penting untuk soal: bangun yang sama bisa terlihat BEDA saat
 * dibentangkan, jadi anak tidak boleh menghafal satu gambar.
 */
export function netLayoutCount(solid: SolidName): number {
  if (solid === 'cube' || solid === 'rectangular-prism') return 3;
  if (solid === 'triangular-prism') return 2;
  return 1;
}

function rect(x: number, y: number, w: number, h: number): NetFace {
  return {
    points: [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
  };
}

function disc(cx: number, cy: number, r: number): NetFace {
  return {
    points: [
      [cx - r, cy - r],
      [cx + r, cy - r],
      [cx + r, cy + r],
      [cx - r, cy + r],
    ],
    circle: { cx, cy, r },
  };
}

/** Tinggi segitiga sama sisi bersisi s. */
function triHeight(s: number): number {
  return (s * Math.sqrt(3)) / 2;
}

function boxNet(l: number, w: number, h: number, layout: number): NetFace[] {
  // Empat sisi tegak berbaris jadi sabuk, alas dan tutup menempel di atas/bawahnya.
  const belt = [rect(0, w, l, h), rect(l, w, w, h), rect(l + w, w, l, h), rect(2 * l + w, w, w, h)];
  // Tutup dan alas boleh menempel di sisi depan ATAU sisi belakang — keduanya melipat
  // jadi balok yang sama. Itu justru yang harus dilihat anak.
  const topX = layout === 2 ? l + w : 0;
  const botX = layout === 1 ? l + w : 0;
  return [...belt, rect(topX, 0, l, w), rect(botX, w + h, l, w)];
}

function triPrismNet(s: number, p: number, layout: number): NetFace[] {
  const th = triHeight(s);
  const belt = [rect(0, th, s, p), rect(s, th, s, p), rect(2 * s, th, s, p)];
  // Segitiga menempel di sisi persegi panjang ke-1 atau ke-2 — dua jaring sah.
  const x0 = layout === 1 ? 0 : s;
  const mid = x0 + s / 2;
  return [
    ...belt,
    { points: [[x0, th], [x0 + s, th], [mid, 0]] },
    { points: [[x0, th + p], [x0 + s, th + p], [mid, th + p + th]] },
  ];
}

function pyramidNet(s: number, slant: number): NetFace[] {
  const a = slant;
  return [
    rect(a, a, s, s),
    { points: [[a, a], [a + s, a], [a + s / 2, 0]] },
    { points: [[a, a + s], [a + s, a + s], [a + s / 2, a + s + a]] },
    { points: [[a, a], [a, a + s], [0, a + s / 2]] },
    { points: [[a + s, a], [a + s, a + s], [a + s + a, a + s / 2]] },
  ];
}

function cylinderNet(r: number, h: number): NetFace[] {
  // Selimut tabung adalah persegi panjang selebar KELILING alas — itu inti pelajarannya.
  const c = 2 * Math.PI * r;
  return [rect(0, 2 * r, c, h), disc(c / 2, r, r), disc(c / 2, 2 * r + h + r, r)];
}

/**
 * Bentangan sebuah bangun ruang. Jumlah sisi yang dikembalikan SELALU sama dengan
 * `SOLID_FACES[solid]` — dijaga test, karena soal "how many faces?" dan gambarnya
 * mengambil angka dari dua tempat berbeda.
 */
export function netFaces(
  solid: SolidName,
  dims: Partial<SolidDims> = {},
  layout = 0,
): NetFace[] {
  const l = Math.max(0.2, dims.l ?? 1);
  const w = Math.max(0.2, dims.w ?? 1);
  const h = Math.max(0.2, dims.h ?? 1);
  const n = netLayoutCount(solid);
  const pick = ((Math.round(layout) % n) + n) % n;

  switch (solid) {
    case 'cube':
      return boxNet(1, 1, 1, pick);
    case 'rectangular-prism':
      // Kubus dan balok memakai jaring yang sama persis kalau ukurannya sama —
      // maka balok diberi ukuran default yang jelas TIDAK sama sisi.
      return boxNet(dims.l ? l : 1.7, dims.w ? w : 1, dims.h ? h : 1.15, pick);
    case 'triangular-prism':
      return triPrismNet(dims.l ? l : 1, dims.h ? h : 1.6, pick);
    case 'square-pyramid':
      return pyramidNet(dims.l ? l : 1, dims.h ? h : 0.95);
    case 'cylinder':
      return cylinderNet((dims.l ? l : 1) / 2, dims.h ? h : 1.6);
  }
}

/** Rusuk jaring: `fold` = garis lipat (dipakai dua sisi), selain itu garis potong. */
export type NetEdge = { a: [number, number]; b: [number, number]; fold: boolean };

function key(a: [number, number], b: [number, number]): string {
  const f = (p: [number, number]) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`;
  const [p, q] = [f(a), f(b)].sort();
  return `${p}|${q}`;
}

/**
 * Rusuk jaring, dipisah antara garis potong (tepi luar) dan garis lipat (dipakai
 * bersama dua sisi). Anak harus bisa melihat MANA yang dilipat: tanpa itu jaring
 * hanya terlihat seperti kumpulan kotak yang berdempetan.
 */
export function netEdges(faces: NetFace[]): NetEdge[] {
  const seen = new Map<string, NetEdge>();
  const count = new Map<string, number>();

  for (const face of faces) {
    if (face.circle) continue;
    const p = face.points;
    for (let i = 0; i < p.length; i++) {
      const a = p[i] as [number, number];
      const b = p[(i + 1) % p.length] as [number, number];
      const k = key(a, b);
      count.set(k, (count.get(k) ?? 0) + 1);
      if (!seen.has(k)) seen.set(k, { a, b, fold: false });
    }
  }

  return [...seen.entries()].map(([k, e]) => ({ ...e, fold: (count.get(k) ?? 0) > 1 }));
}

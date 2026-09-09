import {
  axisDistance,
  formatPoint,
  fourthCorner,
  rectCorners,
  type Coord,
} from '../../../components/manipulatives/coordinates';
import type { ContentModule } from '../../types';

/** Persegi panjang yang dipakai layar Learn: dua sudut berseberangan, empat sudut jadi. */
const LEARN_RECT = rectCorners({ x: -2, y: -1 }, { x: 3, y: 3 });
/**
 * Sudut keempat dan panjang sisi materi dihitung oleh fungsi yang SAMA dengan yang
 * dipakai soal — bukan angka yang diketik ulang. Kalau ditulis tangan, materi dan
 * soal bisa berbeda pendapat tanpa ada yang menyadarinya sampai anak salah.
 */
const LEARN_FOURTH = fourthCorner(LEARN_RECT[0], LEARN_RECT[1], LEARN_RECT[2]) as Coord;
const LEARN_SIDE = axisDistance(LEARN_RECT[0], LEARN_RECT[1]) as number;

/** Batas grid modul ini. Semua sudut harus jatuh di dalam −5..5 supaya tergambar. */
const EDGE = 5;

/** Keempat sudut persegi panjang dari sudut kiri-bawah `(x1, y1)` dan ukurannya. */
function cornersOf(p: Record<string, number>): [Coord, Coord, Coord, Coord] {
  const x1 = p.x1 as number;
  const y1 = p.y1 as number;
  return rectCorners({ x: x1, y: y1 }, { x: x1 + (p.w as number), y: y1 + (p.h as number) });
}

/** Tiga sudut yang DIPERLIHATKAN: yang ke-`drop` disembunyikan, itu yang dicari. */
function givenOf(p: Record<string, number>): [Coord, Coord, Coord] {
  return cornersOf(p).filter((_, i) => i !== (p.drop as number)) as [Coord, Coord, Coord];
}

/**
 * Sudut keempat menurut `fourthCorner` — bukan menurut hitungan sendiri.
 *
 * Boleh `null`: fungsi itu menolak tiga titik yang segaris atau kembar. Di sini
 * bentuknya selalu persegi panjang sejati, tapi `exclude` tetap memagarinya
 * daripada mempercayai bahwa parameternya tidak akan pernah meleset.
 */
function missingOf(p: Record<string, number>): Coord | null {
  const [a, b, c] = givenOf(p);
  return fourthCorner(a, b, c);
}

/** Sudut jatuh di luar grid yang tergambar? Dipakai semua aturan. */
function outsideGrid(p: Record<string, number>): boolean {
  return (
    (p.x1 as number) + (p.w as number) > EDGE || (p.y1 as number) + (p.h as number) > EDGE
  );
}

/**
 * Penutup unit: titik-titiknya berhenti berdiri sendiri dan mulai menjadi BANGUN.
 *
 * Dua pertanyaan yang bisa dijawab tanpa Pythagoras, dan hanya dua itu:
 *
 * - **Sudut keempat.** Tiga sudut sebuah persegi panjang bersisi sejajar sumbu
 *   sudah menentukan yang keempat, dan menemukannya hanya butuh memasangkan x
 *   dari satu sudut dengan y dari sudut lain — persis pelajaran m2 tentang urutan,
 *   dipakai untuk sesuatu. Jawabannya diambil dari `fourthCorner`.
 * - **Panjang sisi.** `axisDistance` mengembalikan `null` untuk pasangan titik yang
 *   miring, dan itu disengaja: jarak miring butuh Pythagoras, yang belum diajarkan.
 *   Setiap sisi yang ditanyakan di sini sejajar sumbu, jadi selalu ada jawabannya.
 *
 * `kind: 'concept'`, bukan `'application'`: yang dipasang masih gagasan barunya
 * (titik-titik menentukan bangun), bukan pemakaiannya di dunia nyata.
 *
 * **Batas yang disadari, dan terasa paling di modul ini:** `CoordinatePlane`
 * read-only. Soal "gambar persegi panjangnya" tidak bisa ditanyakan — anak hanya
 * bisa MEMILIH sudut keempat atau MENGETIK salah satu nilainya, tidak menaruhnya
 * di grid. Aturan `corner-value` memakai `missing-number` supaya jawaban negatif
 * tetap bisa muncul (lint melarangnya pada tipe soal pilihan).
 */
export const shapesOnTheGrid: ContentModule = {
  id: 'g6-u6-m4',
  unitId: 'g6-u6',
  grade: 6,
  title: 'Shapes on the Grid',
  icon: '🔷',
  prereq: ['g6-u6-m3'],
  skills: ['fourth-corner', 'side-length', 'corner-value'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number', 'missing-number'],
  visuals: ['coordinate-grid', 'counter-objects'],
  vocab: ['grid'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four red dots.',
      visual: { kind: 'counter-objects', count: 9, icon: '🔴' },
      action: 'tap-count',
      target: 4,
      hint: 'Four corners make a rectangle.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three corners are on the grid.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [LEARN_RECT[0], LEARN_RECT[1], LEARN_RECT[2]],
        showCoords: true,
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'The fourth corner closes the shape.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [...LEARN_RECT],
        shape: true,
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `The fourth corner is ${formatPoint(LEARN_FOURTH.x, LEARN_FOURTH.y)}.`,
      visual: {
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [...LEARN_RECT],
        shape: true,
        showCoords: true,
      },
      action: 'watch',
    },
    {
      // Satu sisi saja, sebagai ruas garis. Sisi mendatar: y kedua ujungnya sama,
      // jadi panjangnya adalah selisih x — pengurangan, bukan Pythagoras.
      stage: 'abstract',
      prompt: `That side is ${LEARN_SIDE} units long.`,
      visual: {
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [LEARN_RECT[0], LEARN_RECT[1]],
        shape: true,
        showCoords: true,
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Tiga sudut tergambar berikut koordinatnya; yang keempat dipilih dari empat
      // pasangan. Pengecoh utamanya tetap pasangan yang tertukar urutan (m2) —
      // itu sebabnya sudut yang x dan y-nya kebetulan sama dibuang: kembarannya
      // akan sama dengan jawabannya dan pilihannya menyusut jadi tiga.
      type: 'choose-text',
      skill: 'fourth-corner',
      params: { x1: [-5, 3], y1: [-5, 3], w: [2, 5], h: [2, 5], drop: [0, 3] },
      exclude: (p) => {
        if (outsideGrid(p)) return true;
        const m = missingOf(p);
        return m == null || m.x === m.y;
      },
      answer: () => 0,
      text: () => 'Find the fourth corner of the rectangle.',
      visual: (p) => ({
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: givenOf(p),
        showCoords: true,
      }),
      options: (p) => {
        const m = missingOf(p) as Coord;
        return [
          formatPoint(m.x, m.y),
          formatPoint(m.y, m.x),
          formatPoint(m.x + 1, m.y),
          formatPoint(m.x, m.y + 1),
        ];
      },
    },
    {
      // Tanpa gambar: dua sudut ditulis, panjang sisinya dihitung dari selisih.
      // Pengecoh miskonsepsinya adalah UKURAN SISI YANG SATUNYA — kekeliruan
      // paling sering, yaitu mengurangi pasangan angka yang salah.
      type: 'choose-number',
      skill: 'side-length',
      params: { x1: [-5, 3], y1: [-5, 3], w: [2, 5], h: [2, 5], which: [0, 1] },
      exclude: outsideGrid,
      answer: (p) => {
        const c = cornersOf(p);
        const d = (p.which as number) === 0 ? axisDistance(c[0], c[1]) : axisDistance(c[1], c[2]);
        return d ?? 0;
      },
      text: (p) => {
        const c = cornersOf(p);
        const [a, b] = (p.which as number) === 0 ? [c[0], c[1]] : [c[1], c[2]];
        return (
          `A rectangle has corners ${formatPoint((a as Coord).x, (a as Coord).y)} and ` +
          `${formatPoint((b as Coord).x, (b as Coord).y)}. How long is that side?`
        );
      },
      distractors: 'near',
      misconception: (p) => ((p.which as number) === 0 ? (p.h as number) : (p.w as number)),
    },
    {
      // Sudut keempat lagi, tapi diketik dan hanya SATU nilainya. `missing-number`
      // dipilih supaya jawaban negatif tetap mungkin: sudut di kuadran II–IV punya
      // x atau y di bawah nol, dan tipe soal pilihan tidak boleh berjawaban negatif.
      type: 'missing-number',
      skill: 'corner-value',
      params: { x1: [-5, 3], y1: [-5, 3], w: [2, 4], h: [2, 4], drop: [0, 3], axis: [0, 1] },
      exclude: (p) => outsideGrid(p) || missingOf(p) == null,
      answer: (p) => {
        const m = missingOf(p) as Coord;
        return (p.axis as number) === 0 ? m.x : m.y;
      },
      text: (p) => {
        const [a, b, c] = givenOf(p);
        return (
          `A rectangle has corners ${formatPoint(a.x, a.y)}, ${formatPoint(b.x, b.y)} and ` +
          `${formatPoint(c.x, c.y)}. What is the ${(p.axis as number) === 0 ? 'x' : 'y'} ` +
          `value of the fourth corner?`
        );
      },
    },
  ],
};

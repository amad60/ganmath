import { formatPoint } from '../../../components/manipulatives/coordinates';
import type { ContentModule } from '../../types';

/** Nama titik pada aturan `pick-the-point`. Jawabannya adalah INDEKS nama ini. */
const LABELS = ['A', 'B', 'C'];

/**
 * Tiga titik yang digambar aturan `pick-the-point`: yang benar, kembarannya yang
 * tertukar urutan, dan satu titik yang meleset satu langkah. Yang benar diletakkan
 * di posisi `pos` supaya jawabannya tidak selalu jatuh pada huruf yang sama —
 * anak yang menghafal "selalu A" harus tetap membaca gridnya.
 */
function pickPoints(p: Record<string, number>): { x: number; y: number; label: string }[] {
  const px = p.px as number;
  const py = p.py as number;
  const pos = p.pos as number;
  const decoys = [
    { x: py, y: px },
    { x: px + 1, y: py },
  ];
  return LABELS.map((label, i) => {
    if (i === pos) return { x: px, y: py, label };
    const d = decoys[i < pos ? i : i - 1] as { x: number; y: number };
    return { x: d.x, y: d.y, label };
  });
}

/**
 * Notasi pasangan koordinat, dan satu-satunya hal yang membuatnya bermakna:
 * **urutannya**. (3, 5) dan (5, 3) memakai angka yang sama persis dan menunjuk dua
 * tempat berbeda; seluruh modul ini dibangun mengelilingi satu kesalahan itu.
 *
 * Karena itu setiap aturan soal di sini memasang kembaran yang tertukar sebagai
 * pengecoh — sebagai pilihan pada `name-the-point`, dan sebagai titik yang
 * benar-benar terplot di grid pada `pick-the-point`. Anak yang membalik urutannya
 * akan menemukan jawabannya tersedia di layar, dan itu memang yang ingin terlihat.
 *
 * `pick-the-point` juga arah sebaliknya dari membaca: dari pasangan koordinat
 * menuju tempatnya di grid. Itu sedekat-dekatnya app ini bisa membawa anak ke
 * *memplot* titik — `CoordinatePlane` read-only, jadi titiknya sudah tergambar dan
 * anak menunjuk yang mana, bukan menaruhnya sendiri.
 *
 * **Semua pasangan koordinat ditulis `formatPoint`**, termasuk pilihan jawabannya.
 * Kalau modul ini menyusun sendiri "(3, 5)" sementara gambarnya memakai bentuk
 * lain, anak yang benar akan dinyatakan salah oleh selisih satu spasi.
 */
export const sayThePair: ContentModule = {
  id: 'g6-u6-m2',
  unitId: 'g6-u6',
  grade: 6,
  title: 'Say the Pair',
  icon: '📍',
  prereq: ['g6-u6-m1'],
  skills: ['name-the-point', 'read-the-pair', 'pick-the-point'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad'],
  visuals: ['coordinate-grid', 'counter-objects'],
  vocab: ['grid'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three blue blocks.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟦' },
      action: 'tap-count',
      target: 3,
      hint: 'Three steps right on the grid.',
    },
    {
      stage: 'pictorial',
      prompt: 'Point A is 3 right, 2 up.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 6,
        points: [{ x: 3, y: 2, label: 'A' }],
        guides: true,
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'We write it as a pair.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 6,
        points: [{ x: 3, y: 2, label: 'A' }],
        guides: true,
        showCoords: true,
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'x comes first, then y.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 6,
        points: [{ x: 3, y: 2, label: 'A' }],
        showCoords: true,
      },
      action: 'watch',
    },
    {
      // Dua titik, angka yang sama, tempat yang berbeda. Ini gambar yang
      // membuktikan kenapa urutannya penting — dan sekaligus gambar pengecoh
      // yang akan ditemui anak di soal.
      stage: 'abstract',
      prompt: `${formatPoint(2, 3)} is not the same point.`,
      visual: {
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 6,
        points: [
          { x: 3, y: 2, label: 'A' },
          { x: 2, y: 3, label: 'B' },
        ],
        showCoords: true,
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Dari gambar ke tulisan. `px !== py` dipagari supaya kembaran tertukarnya
      // benar-benar pasangan yang lain — kalau px = py, pengecoh utamanya sama
      // dengan jawabannya dan pilihannya menyusut jadi tiga.
      type: 'choose-text',
      skill: 'name-the-point',
      params: { px: [1, 8], py: [1, 8] },
      exclude: (p) => p.px === p.py,
      answer: () => 0,
      text: () => 'Which pair names point A?',
      visual: (p) => ({
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 8,
        points: [{ x: p.px as number, y: p.py as number, label: 'A' }],
        guides: true,
      }),
      options: (p) => {
        const px = p.px as number;
        const py = p.py as number;
        return [
          formatPoint(px, py),
          formatPoint(py, px),
          formatPoint(px + 1, py),
          formatPoint(px, py + 1),
        ];
      },
    },
    {
      // Tanpa gambar sama sekali: yang diuji hanya apakah anak tahu angka mana
      // yang dipanggil x dan mana yang dipanggil y.
      type: 'keypad',
      skill: 'read-the-pair',
      params: { px: [1, 9], py: [1, 9], which: [0, 1] },
      exclude: (p) => p.px === p.py,
      answer: (p) => ((p.which as number) === 0 ? (p.px as number) : (p.py as number)),
      text: (p) =>
        `Point A is at ${formatPoint(p.px as number, p.py as number)}. What is the ` +
        `${(p.which as number) === 0 ? 'x' : 'y'} value?`,
    },
    {
      // Arah sebaliknya: pasangan koordinat diberikan, anak mencari titiknya.
      type: 'choose-text',
      skill: 'pick-the-point',
      params: { px: [1, 7], py: [1, 7], pos: [0, 2] },
      exclude: (p) => p.px === p.py,
      answer: (p) => p.pos as number,
      text: (p) => `Which point is at ${formatPoint(p.px as number, p.py as number)}?`,
      visual: (p) => ({
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 8,
        points: pickPoints(p),
      }),
      options: () => [...LABELS],
    },
  ],
};

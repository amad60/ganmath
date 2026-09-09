import {
  QUADRANT_NAMES,
  formatPoint,
  quadrantName,
  quadrantOf,
} from '../../../components/manipulatives/coordinates';
import type { ContentModule } from '../../types';

/**
 * Grid dibuka penuh: `g6-u1` sudah memasang bilangan bulat negatif pada garis
 * bilangan, dan di sini garis itu dipasangkan dengan pasangannya yang tegak.
 * Yang baru bukan bilangannya, melainkan bahwa sekarang ADA DUA arah yang bisa
 * menembus nol sekaligus — dan tiap gabungan tandanya punya nama.
 *
 * Dua hal dijaga ketat di sini:
 *
 * 1. **Nama kuadran datang dari `QUADRANT_NAMES`/`quadrantName`,** bukan dari
 *    daftar yang ditulis ulang di file ini. Angka Romawi mudah tergelincir
 *    (III vs III, IV vs VI) dan salah satunya akan muncul di pilihan jawaban
 *    sementara yang lain muncul di materi.
 *
 * 2. **Titik DI sumbu ikut ditanyakan.** `quadrantOf` mengembalikan 0 untuknya
 *    dan `QUADRANT_NAMES[0]` berbunyi "on an axis" — jadi pilihan kelima itu
 *    bukan tambahan, melainkan jawaban yang memang benar untuk (0, −4). Anak
 *    yang mengira setiap titik harus masuk salah satu kuadran akan tersandung
 *    di sini, yang justru tujuannya.
 *
 * Aturan `which-quadrant` sengaja TANPA gambar: pasangan koordinatnya ada di
 * teks, dan yang diuji adalah membaca TANDA-nya, bukan membaca grid — itu sudah
 * diuji dua aturan di atasnya. Tanpa gambar, kelima pilihannya juga muat di layar.
 *
 * Jawaban negatif hanya lewat `keypad`: lint `generator` melarang jawaban negatif
 * pada tipe soal non-ketik, karena pengecohnya dibangun di sekitar jawaban dan
 * dipagari ≥0. Kedua aturan ketik di sini rentangnya melintasi nol, jadi munculnya
 * tombol minus tidak membocorkan tanda jawabannya.
 */
export const allFourQuadrants: ContentModule = {
  id: 'g6-u6-m3',
  unitId: 'g6-u6',
  grade: 6,
  title: 'All Four Quadrants',
  icon: '🧭',
  prereq: ['g6-u6-m2'],
  skills: ['read-x-signed', 'read-y-signed', 'which-quadrant'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text'],
  visuals: ['coordinate-grid', 'counter-objects'],
  vocab: ['grid', 'quadrant', 'ii'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five blue blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🟦' },
      action: 'tap-count',
      target: 5,
      hint: 'Five steps left from zero.',
    },
    {
      stage: 'pictorial',
      prompt: 'The grid goes past zero.',
      visual: { kind: 'coordinate-grid', quadrants: 4, range: 6, showOrigin: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `A is at ${formatPoint(-4, 3)}.`,
      visual: {
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [{ x: -4, y: 3, label: 'A' }],
        guides: true,
        showCoords: true,
      },
      action: 'watch',
      hint: 'Four left, then three up.',
    },
    {
      stage: 'abstract',
      prompt: `A is in ${quadrantName(-4, 3)}.`,
      visual: {
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [{ x: -4, y: 3, label: 'A' }],
        showCoords: true,
      },
      action: 'watch',
    },
    {
      // Peta kuadran: label titiknya adalah nomor kuadrannya sendiri, jadi
      // gambarnya memperlihatkan urutan penomorannya tanpa satu kata pun.
      stage: 'abstract',
      prompt: 'Four quadrants around the origin.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [
          { x: 4, y: 3, label: 'I' },
          { x: -4, y: 3, label: 'II' },
          { x: -4, y: -3, label: 'III' },
          { x: 4, y: -3, label: 'IV' },
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Membaca dari grid, kini dengan tanda. Rentangnya melintasi nol supaya
      // tombol minus pada keypad selalu ada — kalau ia hanya muncul saat
      // jawabannya kebetulan negatif, tombolnya yang menjawab soalnya.
      type: 'keypad',
      skill: 'read-x-signed',
      params: { px: [-6, 6], py: [-6, 6] },
      exclude: (p) => p.px === 0 || p.py === 0,
      answer: (p) => p.px as number,
      text: () => 'What is the x value of point A?',
      visual: (p) => ({
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [{ x: p.px as number, y: p.py as number, label: 'A' }],
        guides: true,
      }),
    },
    {
      type: 'keypad',
      skill: 'read-y-signed',
      params: { px: [-6, 6], py: [-6, 6] },
      exclude: (p) => p.px === 0 || p.py === 0,
      answer: (p) => p.py as number,
      text: () => 'What is the y value of point A?',
      visual: (p) => ({
        kind: 'coordinate-grid',
        quadrants: 4,
        range: 6,
        points: [{ x: p.px as number, y: p.py as number, label: 'A' }],
        guides: true,
      }),
    },
    {
      // Titik di sumbu TIDAK dibuang di sini: `quadrantOf` menjawabnya dengan 0,
      // dan QUADRANT_NAMES[0] adalah pilihan yang benar untuknya.
      type: 'choose-text',
      skill: 'which-quadrant',
      params: { px: [-6, 6], py: [-6, 6] },
      answer: (p) => quadrantOf(p.px as number, p.py as number),
      text: (p) => `Where is ${formatPoint(p.px as number, p.py as number)}?`,
      options: () => [...QUADRANT_NAMES],
    },
  ],
};

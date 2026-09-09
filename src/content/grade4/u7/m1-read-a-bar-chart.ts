import type { ContentModule } from '../../types';

/**
 * Empat kategori, bukan tiga. Bar chart di Grade 2 hanya perlu dibandingkan
 * ("mana yang paling tinggi"); di sini anak harus MEMBACA nilainya, dan itu baru
 * terasa sulit kalau matanya punya lebih dari tiga batang untuk dilacak.
 */
const LABELS = ['A', 'B', 'C', 'D'];

const valuesOf = (p: Record<string, number>) => [
  p.a as number,
  p.b as number,
  p.c as number,
  p.d as number,
];

/** Batang dengan nilai kembar membuat "yang paling tinggi" punya dua jawaban benar. */
const hasTie = (p: Record<string, number>) => new Set(valuesOf(p)).size < 4;

/**
 * Gerbang unit data Grade 4. Dua cara membaca satu grafik, sengaja disandingkan:
 *
 * 1. **Membandingkan** — batangnya sendiri yang menjawab. Panjang relatif sudah cukup;
 *    tidak perlu angka.
 * 2. **Membaca nilai berskala** — satu blok mewakili 2 sampai 5, jadi menghitung blok
 *    saja memberi jawaban yang salah. Inilah lompatan dari Grade 2, di mana satu blok
 *    selalu berarti satu, dan miskonsepsinya persis itu: anak menyebut jumlah bloknya.
 *
 * Grafik berskala digambar sebagai BARIS BLOK, bukan batang mulus, karena batang mulus
 * tanpa sumbu berangka tidak bisa dibaca tepat — anak hanya akan menebak tingginya.
 */
export const readABarChart: ContentModule = {
  id: 'g4-u7-m1',
  unitId: 'g4-u7',
  grade: 4,
  title: 'Read a Bar Chart',
  icon: '📊',
  prereq: ['g4-u6-m6'],
  skills: ['bar-chart-read'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad'],
  visuals: ['bar-chart', 'pictogram', 'counter-objects'],
  vocab: ['data'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five blocks.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟦' },
      action: 'tap-count',
      target: 5,
      hint: 'One block stands for five votes.',
    },
    {
      stage: 'pictorial',
      prompt: 'A taller bar means more.',
      visual: { kind: 'bars', lengths: [0.8, 0.35, 0.6, 0.2], labels: LABELS },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Each block stands for five votes.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: 4 },
          { label: 'blue', icon: '🟦', count: 6 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Four blocks means 20 votes.',
      visual: {
        kind: 'pictogram',
        rows: [{ label: 'red', icon: '🟥', count: 4 }],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Teks berganti-ganti antara tertinggi dan terpendek supaya anak tidak bisa
      // lulus dengan selalu menekan batang terpanjang tanpa membaca soalnya.
      type: 'choose-text',
      skill: 'bar-chart-read',
      params: { a: [1, 8], b: [1, 8], c: [1, 8], d: [1, 8], q: [0, 1] },
      answer: (p) => {
        const v = valuesOf(p);
        return v.indexOf((p.q as number) === 0 ? Math.max(...v) : Math.min(...v));
      },
      text: (p) => `Which bar is ${(p.q as number) === 0 ? 'tallest' : 'shortest'}?`,
      visual: (p) => ({
        kind: 'bars',
        lengths: valuesOf(p).map((v) => v / 10),
        labels: LABELS,
      }),
      exclude: hasTie,
      options: () => LABELS,
    },
    {
      // Kuncinya diberi tahu, bloknya harus dihitung, lalu dikalikan. Dua langkah —
      // dan langkah kedua itulah yang dilewatkan anak yang hanya menghitung gambar.
      type: 'keypad',
      skill: 'bar-chart-read',
      params: { k: [2, 5], a: [2, 8], b: [1, 8] },
      answer: (p) => (p.a as number) * (p.k as number),
      text: (p) => `Each block is ${p.k}. How many red?`,
      visual: (p) => ({
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: p.a as number },
          { label: 'blue', icon: '🟦', count: p.b as number },
        ],
      }),
    },
  ],
};

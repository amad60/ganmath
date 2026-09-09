import type { ContentModule } from '../../types';

const LABELS = ['A', 'B', 'C', 'D'];

const valuesOf = (p: Record<string, number>) => [
  p.a as number,
  p.b as number,
  p.c as number,
  p.d as number,
];

const hasTie = (p: Record<string, number>) => new Set(valuesOf(p)).size < 4;

/**
 * Membandingkan antar kategori — pertanyaan yang jawabannya tidak tertulis di grafik
 * mana pun, jadi harus dihitung.
 *
 * Dua langkah, dan langkah pertamanya yang sering hilang: baca dulu NILAI tiap baris
 * (blok × kunci), baru selisihkan. Anak yang mengurangkan jumlah bloknya lebih dulu,
 * lalu lupa mengalikan, mendapat jawaban yang terlalu kecil — dan itu jawaban yang
 * kelihatan masuk akal, jadi tidak akan dia periksa ulang.
 *
 * Aturan kedua memakai "kedua tertinggi"/"kedua terpendek": mengurutkan, bukan sekadar
 * mencari ujungnya. Batang relatif memang bisa menjawab ini tanpa sumbu berangka.
 */
export const compareTheData: ContentModule = {
  id: 'g4-u7-m3',
  unitId: 'g4-u7',
  grade: 4,
  title: 'Compare the Data',
  icon: '📈',
  prereq: ['g4-u7-m2'],
  skills: ['compare-data'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text'],
  visuals: ['pictogram', 'bar-chart', 'counter-objects'],
  vocab: ['data', 'red', 'blue', 'tallest'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three blocks.',
      visual: { kind: 'counter-objects', count: 7, icon: '🟥' },
      action: 'tap-count',
      target: 3,
      hint: 'Red has three more than blue.',
    },
    {
      stage: 'pictorial',
      prompt: 'Red has 6. Blue has 4.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: 6 },
          { label: 'blue', icon: '🟦', count: 4 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'The tallest bar has the most.',
      visual: { kind: 'bars', lengths: [0.5, 0.9, 0.2, 0.7], labels: LABELS },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Take away to find how many more.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: 6 },
          { label: 'blue', icon: '🟦', count: 4 },
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Kuncinya berubah tiap soal, jadi selisih blok TIDAK pernah sama dengan
      // selisih nilainya — pintasan itu ditutup rapat.
      type: 'keypad',
      skill: 'compare-data',
      params: { k: [2, 5], a: [3, 8], b: [1, 6] },
      answer: (p) => ((p.a as number) - (p.b as number)) * (p.k as number),
      text: (p) => `Each block is ${p.k}. How many more red than blue?`,
      visual: (p) => ({
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: p.a as number },
          { label: 'blue', icon: '🟦', count: p.b as number },
        ],
      }),
      exclude: (p) => (p.b as number) >= (p.a as number),
    },
    {
      type: 'choose-text',
      skill: 'compare-data',
      params: { a: [1, 8], b: [1, 8], c: [1, 8], d: [1, 8], q: [0, 1] },
      answer: (p) => {
        const v = valuesOf(p);
        const sorted = [...v].sort((x, y) => y - x);
        return v.indexOf(sorted[(p.q as number) === 0 ? 1 : 2] as number);
      },
      text: (p) => `Which bar is second ${(p.q as number) === 0 ? 'tallest' : 'shortest'}?`,
      visual: (p) => ({
        kind: 'bars',
        lengths: valuesOf(p).map((v) => v / 10),
        labels: LABELS,
      }),
      exclude: hasTie,
      options: () => LABELS,
    },
  ],
};

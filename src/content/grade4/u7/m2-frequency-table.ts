import type { ContentModule } from '../../types';

const ROWS = [
  { label: 'red', icon: '🟥' },
  { label: 'blue', icon: '🟦' },
  { label: 'green', icon: '🟩' },
] as const;

/**
 * Tabel frekuensi: turus dihitung jadi angka, lalu angkanya dijumlahkan jadi total.
 *
 * Dua kekeliruan yang dijaga di sini:
 * - **Turus dibaca satu per satu.** Kelompok lima ada supaya TIDAK dihitung satuan;
 *   karena itu jumlahnya sengaja besar (sampai 29) — cukup besar untuk membuat
 *   menghitung satu-satu terasa mahal, jadi anak beralih ke melompat lima.
 * - **Baris terakhir terlewat.** Total dari tiga baris adalah tempat anak paling
 *   sering berhenti setelah dua baris; itulah pengecoh miskonsepsinya.
 */
export const frequencyTable: ContentModule = {
  id: 'g4-u7-m2',
  unitId: 'g4-u7',
  grade: 4,
  title: 'Frequency Table',
  icon: '🗒️',
  prereq: ['g4-u7-m1'],
  skills: ['frequency-table'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['tally-chart', 'pictogram', 'counter-objects'],
  vocab: ['data', 'rest'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap seven marks.',
      visual: { kind: 'counter-objects', count: 9, icon: '✔️' },
      action: 'tap-count',
      target: 7,
      hint: 'One mark for each vote.',
    },
    {
      stage: 'pictorial',
      prompt: 'Five marks make one group.',
      visual: { kind: 'tally', count: 5 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Count by fives, then count the rest.',
      visual: { kind: 'tally', count: 17 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Add the rows to find the total.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: 4 },
          { label: 'blue', icon: '🟦', count: 6 },
          { label: 'green', icon: '🟩', count: 3 },
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Teks tetap, gambarnya yang berganti — kunci dedupe generator memuat gambar,
      // jadi 24 jumlah turus yang berbeda tetap 24 soal yang berbeda.
      type: 'keypad',
      skill: 'frequency-table',
      params: { n: [6, 29] },
      answer: (p) => p.n as number,
      text: () => 'Count the tally. How many?',
      visual: (p) => ({ kind: 'tally', count: p.n as number }),
    },
    {
      type: 'choose-number',
      skill: 'frequency-table',
      params: { a: [1, 7], b: [1, 7], c: [1, 7] },
      answer: (p) => (p.a as number) + (p.b as number) + (p.c as number),
      text: () => 'How many votes in all?',
      visual: (p) => ({
        kind: 'pictogram',
        rows: ROWS.map((r, i) => ({
          ...r,
          count: [p.a as number, p.b as number, p.c as number][i] ?? 1,
        })),
      }),
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number), // baris terakhir terlewat
    },
  ],
};

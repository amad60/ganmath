import type { ContentModule } from '../../types';

/**
 * Empat nilai berjarak tak sama (b, b+3, b+5, b+8). Jaraknya sengaja berbeda-beda
 * supaya daftarnya tidak berubah jadi pola aritmetika yang bisa dibaca tanpa
 * menghitung berapa kali tiap nilai muncul.
 */
const poolOf = (p: Record<string, number>) => {
  const b = p.b as number;
  return [b, b + 3, b + 5, b + 8];
};

/**
 * Enam nilai: satu nilai muncul TIGA kali, tiga nilai lainnya sekali.
 *
 * Modus dibangun begitu, bukan diacak lalu dihitung, karena data acak gampang
 * melahirkan DUA nilai yang sama-sama paling sering — dan soal "apa modusnya"
 * dengan dua jawaban benar adalah soal rusak yang tidak kelihatan rusak. Di sini
 * modusnya tunggal secara konstruksi, jadi tidak ada yang perlu dipagari `exclude`.
 *
 * `ord` memutar daftarnya supaya modus tidak selalu berada di tempat yang sama;
 * tanpa itu, anak bisa lulus dengan selalu menyebut angka pertama.
 */
const listOf = (p: Record<string, number>) => {
  const pool = poolOf(p);
  const k = p.k as number;
  const arr = [pool[k] as number, pool[0] as number, pool[1] as number, pool[k] as number, pool[2] as number, pool[3] as number];
  const ord = p.ord as number;
  return [...arr.slice(ord), ...arr.slice(0, ord)];
};

const modeOf = (p: Record<string, number>) => poolOf(p)[p.k as number] as number;

const ROWS = [
  { label: 'red', icon: '🟥' },
  { label: 'blue', icon: '🟦' },
  { label: 'green', icon: '🟩' },
] as const;

const rowCounts = (p: Record<string, number>) => [p.ra as number, p.rb as number, p.rc as number];

/** Dua baris tertinggi yang sama tinggi = dua modus = soal berjawaban ganda. */
const rowTie = (p: Record<string, number>) => {
  const v = rowCounts(p);
  const top = Math.max(...v);
  return v.filter((x) => x === top).length > 1;
};

/**
 * Ukuran pemusatan yang ketiga, dan satu-satunya yang tidak perlu dihitung sama
 * sekali — cukup dilihat mana yang paling sering muncul. Justru karena itu modus
 * mudah tertukar dengan dua hal lain, dan dua-duanya dipagari di sini:
 *
 * - **Modus bukan nilai terbesar.** Aturan `choose-number` menjadikannya pengecoh
 *   resmi (`misconception`), dan untuk itu kombinasi yang modusnya KEBETULAN nilai
 *   terbesar dibuang — kalau tidak, pengecohnya berubah jadi jawaban benar.
 * - **Modus bukan berapa kali nilainya muncul.** Tidak ada satu pun aturan di sini
 *   yang berjawaban "3", supaya anak tidak pernah dihadiahi karena menjawab
 *   frekuensinya alih-alih nilainya.
 *
 * Data kategori (piktogram) ikut masuk lewat aturan ketiga: modus bekerja pada
 * warna, ukuran sepatu, dan hal-hal yang bahkan tidak punya rata-rata. Piktogram
 * dipilih, bukan batang: blok bisa dihitung satu per satu, sedangkan `Bars` tidak
 * punya sumbu berangka sehingga baris tertingginya hanya bisa ditebak kalau dua
 * baris berdekatan.
 */
export const mostOften: ContentModule = {
  id: 'g6-u7-m3',
  unitId: 'g6-u7',
  grade: 6,
  title: 'Most Often',
  icon: '🔁',
  prereq: ['g6-u7-m2'],
  skills: ['find-mode', 'mode-not-biggest', 'mode-from-chart'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'choose-text'],
  visuals: ['pictogram', 'counter-objects'],
  vocab: ['mode', 'often', 'most', 'value', 'data', 'times', 'red', 'blue', 'green'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four green blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🟩' },
      action: 'tap-count',
      target: 4,
      hint: 'The same value comes again.',
    },
    {
      stage: 'pictorial',
      prompt: 'Red comes most often here.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: 5 },
          { label: 'blue', icon: '🟦', count: 2 },
          { label: 'green', icon: '🟩', count: 3 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Count how often each one comes.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: 5 },
          { label: 'blue', icon: '🟦', count: 2 },
          { label: 'green', icon: '🟩', count: 3 },
        ],
      },
      action: 'watch',
    },
    {
      // Piktogram frekuensi: label barisnya adalah NILAI-nya, panjang barisnya
      // berapa kali nilai itu muncul. Itu gambar yang persis sama dengan daftar
      // 4, 7, 4, 9 — dan blok-bloknya bisa dihitung satu per satu.
      stage: 'abstract',
      prompt: 'Value 4 comes two times.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: '4', icon: '🔵', count: 2 },
          { label: '7', icon: '🔵', count: 1 },
          { label: '9', icon: '🔵', count: 1 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'So 4 is the mode.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: '4', icon: '🔵', count: 2 },
          { label: '7', icon: '🔵', count: 1 },
          { label: '9', icon: '🔵', count: 1 },
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'find-mode',
      params: { b: [2, 10], k: [0, 3], ord: [0, 3] },
      answer: modeOf,
      text: (p) => `Which number comes most often: ${listOf(p).join(', ')}?`,
    },
    {
      // `k` berhenti di 2: nilai terbesar (indeks 3) tidak boleh jadi modus,
      // karena nilai terbesar itulah pengecoh miskonsepsinya.
      type: 'choose-number',
      skill: 'mode-not-biggest',
      params: { b: [2, 10], k: [0, 2], ord: [0, 3] },
      answer: modeOf,
      text: (p) => `What is the mode: ${listOf(p).join(', ')}?`,
      distractors: 'near',
      misconception: (p) => Math.max(...listOf(p)),
    },
    {
      // Teks tetap, gambarnya yang berganti — kunci dedupe generator memuat
      // gambar, jadi puluhan susunan baris tetap jadi puluhan soal berbeda.
      type: 'choose-text',
      skill: 'mode-from-chart',
      params: { ra: [1, 8], rb: [1, 8], rc: [1, 8] },
      answer: (p) => {
        const v = rowCounts(p);
        return v.indexOf(Math.max(...v));
      },
      text: () => 'Which colour comes most often?',
      visual: (p) => ({
        kind: 'pictogram',
        rows: ROWS.map((r, i) => ({ ...r, count: rowCounts(p)[i] as number })),
      }),
      exclude: rowTie,
      options: () => ROWS.map((r) => r.label),
    },
  ],
};

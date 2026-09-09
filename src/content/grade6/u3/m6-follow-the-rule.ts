import type { ContentModule } from '../../types';

/** Semua pilihan `choose-text` harus berbeda — dua tombol bertulisan sama = soal rusak. */
const allUnique = (o: string[]) => new Set(o).size === o.length;

/** Pilihan "aturan apa yang dipakai deret ini", dipakai `options` dan `exclude`. */
const ruleOptions = (a: number, r: number) => [
  `times ${r}`,
  `add ${r}`,
  `times ${r + 1}`,
  `add ${a}`,
];

/**
 * Penutup unit, dan tempat semua yang sebelumnya bertemu: **sebuah pola bisa
 * ditulis sebagai aturan, dan aturan itu ditulis dengan huruf.**
 *
 * Anak sudah melanjutkan pola sejak Grade 1 dengan cara menebak-lalu-mengecek.
 * Yang baru di sini adalah menyebut aturannya, dan kemudian memakai aturan itu
 * untuk melompat langsung ke bilangan ke-7 tanpa menulis enam bilangan
 * sebelumnya. Itulah gunanya rumus, dan itu alasan aturan terakhir ada.
 *
 * **Polanya ×/÷, bukan +/−.** Itu keputusan yang disengaja, dan yang menentukan
 * bentuk tiap aturan:
 *  - Aturan yang menanyakan ATURANNYA memakai deret kali murni (2, 4, 8, 16).
 *    Deret penjumlahan seperti 3, 6, 9, 12 bisa dibaca sebagai "tambah 3"
 *    MAUPUN "nomor × 3", dan soal yang punya dua jawaban benar tidak
 *    mengajarkan apa pun — ia hanya menghukum anak yang berpikir dengan cara
 *    yang lain. `exclude` membuang kombinasi yang membuat "tambah" ikut benar.
 *  - Aturan yang hanya menanyakan ANGKANYA (lubang di tengah, dan rumus di
 *    aturan terakhir) memakai deret kelipatan `k, 2k, 3k, 4k` — itu justru
 *    tabel perkalian yang dibaca sebagai deret, jadi dua bacaannya menghasilkan
 *    angka yang sama dan tidak ada ambiguitas yang tersisa.
 *
 * Tipe soal `pattern-next` belum bisa dirender layar soal (lihat
 * `RENDERABLE_TYPES`), jadi polanya ditulis sebagai deret angka di dalam teks
 * soal — `2, 4, 8, ?`. Itu sekaligus memenuhi syarat dedupe generator: kunci
 * soal adalah tipe + teks + gambar, dan angkanya memang ada di teks.
 */
export const followTheRule: ContentModule = {
  id: 'g6-u3-m6',
  unitId: 'g6-u3',
  grade: 6,
  title: 'Follow the Rule',
  icon: '🔁',
  prereq: ['g6-u3-m5'],
  skills: ['pattern-rule', 'pattern-formula'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text', 'missing-number', 'choose-number'],
  visuals: ['counter-objects', 'bar-model', 'array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two dots first.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟡' },
      action: 'tap-count',
      target: 2,
      hint: 'Two, then four, then eight dots.',
    },
    {
      stage: 'pictorial',
      prompt: 'Each bar is twice the bar before.',
      visual: { kind: 'bars', lengths: [0.2, 0.4, 0.8], labels: ['2', '4', '8'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'The rule is times 4.',
      visual: { kind: 'array', rows: 3, cols: 4, highlightRow: 2 },
      action: 'watch',
    },
    {
      // Rumusnya. Nomor ke-5 langsung, tanpa menulis empat bilangan sebelumnya —
      // inilah satu-satunya alasan rumus lebih baik daripada melanjutkan deret.
      stage: 'abstract',
      prompt: 'Number 5 is 5 × 4 = 20.',
      visual: { kind: 'array', rows: 5, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The rule tells every number.',
      visual: { kind: 'bars', lengths: [0.25, 0.5, 0.75, 1], labels: ['4', '8', '12', '16'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Deret yang tumbuh: setiap suku dikali r. Batas atasnya 6 × 27 = 162,
      // jadi jawabannya tetap bilangan yang wajar untuk diketik anak.
      type: 'keypad',
      skill: 'pattern-rule',
      params: { a: [1, 6], r: [2, 3] },
      answer: (p) => (p.a as number) * (p.r as number) ** 3,
      text: (p) =>
        `${p.a}, ${(p.a as number) * (p.r as number)}, ` +
        `${(p.a as number) * (p.r as number) ** 2}, ?`,
    },
    {
      // Arah sebaliknya: deret yang MENGECIL, yaitu dibagi r tiap langkah.
      // Tanpa aturan ini "pola" selalu berarti "tumbuh" bagi anak.
      type: 'keypad',
      skill: 'pattern-rule',
      params: { a: [1, 6], r: [2, 3] },
      answer: (p) => p.a as number,
      text: (p) =>
        `${(p.a as number) * (p.r as number) ** 3}, ` +
        `${(p.a as number) * (p.r as number) ** 2}, ${(p.a as number) * (p.r as number)}, ?`,
    },
    {
      // Menyebut aturannya, bukan melanjutkan deretnya. `a === r` dibuang
      // karena 2, 4, 8 dengan pilihan "add 2" membuat pengecohnya nyaris benar
      // di suku kedua — dan pilihan "add a" tidak boleh kembar dengan "add r".
      type: 'choose-text',
      skill: 'pattern-rule',
      params: { a: [1, 6], r: [2, 4] },
      answer: () => 0,
      text: (p) =>
        `${p.a}, ${(p.a as number) * (p.r as number)}, ` +
        `${(p.a as number) * (p.r as number) ** 2}. What is the rule?`,
      options: (p) => ruleOptions(p.a as number, p.r as number),
      exclude: (p) =>
        (p.a as number) === (p.r as number) ||
        !allUnique(ruleOptions(p.a as number, p.r as number)),
    },
    {
      // Lubangnya di TENGAH deret, bukan di ujung. Anak tidak bisa lulus dengan
      // hanya melihat dua angka terakhir; dia harus tahu aturannya lebih dulu.
      type: 'missing-number',
      skill: 'pattern-rule',
      params: { k: [2, 12] },
      answer: (p) => 3 * (p.k as number),
      text: (p) => `${p.k}, ${2 * (p.k as number)}, ?, ${4 * (p.k as number)}`,
    },
    {
      // Rumus dipakai untuk melompat. Pengecoh miskonsepsinya: nomor dan
      // pengalinya DIJUMLAHKAN, bukan dikalikan — kesalahan anak yang membaca
      // "aturan" sebagai "lakukan sesuatu dengan dua angka ini".
      type: 'choose-number',
      skill: 'pattern-formula',
      params: { k: [2, 9], t: [2, 9] },
      answer: (p) => (p.k as number) * (p.t as number),
      text: (p) => `Rule: number × ${p.k}. What is number ${p.t}?`,
      distractors: 'near',
      misconception: (p) => (p.k as number) + (p.t as number),
    },
  ],
};

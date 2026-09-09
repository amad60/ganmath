import type { ContentModule } from '../../types';

/**
 * Akar kuadrat dari kuadrat sempurna — arah balik `m4`.
 *
 * Hanya kuadrat sempurna yang muncul: 4, 9, 16 … 144, dan pola puluhannya
 * (400 … 14400). Akar yang tidak bulat tidak pernah ditanyakan, jadi jawabannya
 * selalu bilangan bulat dan keypad tidak pernah perlu titik desimal. Itu bukan
 * penghindaran teknis melainkan batas materi: menaksir √50 adalah bahan Grade 6
 * ke atas, sedangkan yang harus otomatis di Grade 5 adalah mengenali kuadrat
 * sempurna dari daftar yang baru saja dihafal di `m4`.
 *
 * Sama seperti `m4`, ambang kecepatannya **dibiarkan ketat** (5 detik, default
 * Grade 5). √81 adalah tarikan langsung dari ingatan yang sama dengan 9² — kalau
 * anak harus menghitungnya, yang sebenarnya belum jadi adalah `m4`, dan itulah
 * yang seharusnya terbaca dari datanya. Melonggarkan ambang di sini justru
 * menyembunyikan hal yang ingin diketahui.
 *
 * Empat aturan menanyakan hal yang sama dari empat bentuk yang berbeda —
 * lambang akar, "bilangan apa dikali dirinya sendiri", pola puluhan, dan
 * membandingkan besarnya — supaya yang dihafal adalah pasangannya, bukan
 * tampilan soalnya.
 */
export const squareRoots: ContentModule = {
  id: 'g5-u4-m5',
  unitId: 'g5-u4',
  grade: 5,
  title: 'Square Roots',
  icon: '🌱',
  prereq: ['g5-u4-m4'],
  skills: ['square-roots'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'missing-number', 'keypad', 'compare-symbol'],
  visuals: ['counter-objects', 'array-grid'],
  vocab: ['twenty', 'five', 'square', 'squared', 'root', 'itself', 'times', 'back', 'side'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twenty five dots.',
      visual: { kind: 'counter-objects', count: 25, icon: '🟩' },
      action: 'tap-count',
      target: 25,
      hint: 'Five rows of five.',
    },
    {
      stage: 'pictorial',
      prompt: 'Twenty five dots make five rows.',
      visual: { kind: 'array', rows: 5, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One side is five. That is the root.',
      visual: { kind: 'array', rows: 5, cols: 5, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write √25 = 5.',
      visual: { kind: 'array', rows: 5, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The root takes a square back.',
      visual: { kind: 'array', rows: 8, cols: 8 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Lambang akar. Pengecoh miskonsepsi: akar dikira "dibagi dua" —
      // √144 dijawab 72. Ini aturan yang salah, bukan hitungan yang meleset,
      // jadi jawabannya jauh dari benar dan memang harus terlihat begitu di data.
      type: 'choose-number',
      skill: 'square-roots',
      params: { n: [2, 12] },
      answer: (p) => p.n as number,
      text: (p) => `√${(p.n as number) * (p.n as number)} = ?`,
      distractors: 'near',
      misconception: (p) => Math.round(((p.n as number) * (p.n as number)) / 2),
    },
    {
      // Arti akar, ditulis tanpa lambangnya sama sekali.
      type: 'missing-number',
      skill: 'square-roots',
      params: { n: [2, 12] },
      answer: (p) => p.n as number,
      text: (p) => `? × ? = ${(p.n as number) * (p.n as number)}`,
    },
    {
      // Pola puluhan, pasangan dari aturan ketiga di m4: dua nol di dalam akar
      // menjadi satu nol di luarnya.
      type: 'keypad',
      skill: 'square-roots',
      params: { n: [2, 12] },
      answer: (p) => (p.n as number) * 10,
      text: (p) => `√${(p.n as number) * (p.n as number) * 100} = ?`,
    },
    {
      // Besarnya akar, bukan nilainya persis — ini yang nanti dipakai untuk
      // menaksir. Kasus sama besar ikut muncul supaya `=` bukan pilihan mati.
      type: 'compare-symbol',
      skill: 'square-roots',
      params: { n: [2, 12], k: [2, 12] },
      answer: (p) => Math.sign((p.n as number) - (p.k as number)),
      text: (p) => `√${(p.n as number) * (p.n as number)} ? ${p.k}`,
    },
  ],
};

import type { ContentModule } from '../../types';

/** Tanda minus yang DILIHAT anak: U+2212, sama dengan tombol `−` di keypad. */
const MINUS = '−';
const sgn = (n: number) => (n < 0 ? MINUS + String(-n) : String(n));

/**
 * Satu miskonsepsi, dan seluruh modul ini dibangun untuk menabraknya:
 * **anak membaca −9 sebagai "lebih besar" daripada −3, karena 9 lebih besar
 * daripada 3.** Lima kelas mengajarkan "angka yang lebih besar berarti lebih
 * banyak", dan aturan itu baru sekarang punya pengecualian.
 *
 * Penawarnya bukan aturan hafalan baru, melainkan posisi: yang di sebelah KIRI
 * selalu lebih kecil. Itu aturan yang sama persis dengan yang sudah dipakai anak
 * sejak garis 0–20 di Grade 1, jadi yang dilakukan modul ini adalah memperluas
 * aturan lama, bukan menambah aturan kedua yang bersaing dengannya.
 *
 * `kind: 'fact'` dengan ambang kecepatan default Grade 6 (4 detik, CLAUDE.md §6),
 * tanpa override: membandingkan dua bilangan bulat adalah PENGENALAN, bukan
 * perhitungan bertahap — tidak ada yang perlu dihitung, hanya dilihat mana yang
 * lebih ke kiri. Kalau anak masih perlu berhitung di sini, dia memang belum
 * memasang garisnya, dan Speed Round adalah tawaran yang tepat.
 *
 * Tidak ada aturan `choose-number` di sini — jawabannya adalah salah satu
 * bilangan yang dibandingkan, dan itu sering negatif, sementara pengecoh soal
 * pilihan angka dipagari ≥0 oleh generator. Pengecoh miskonsepsinya karena itu
 * ditanam langsung sebagai pilihan di aturan `choose-text`: bilangan negatif
 * dengan angka TERKECIL selalu ikut ditawarkan, dan anak yang mengabaikan tanda
 * akan memilihnya.
 */
export const colderOrWarmer: ContentModule = {
  id: 'g6-u1-m3',
  unitId: 'g6-u1',
  grade: 6,
  title: 'Colder or Warmer',
  icon: '🧊',
  prereq: ['g6-u1-m2'],
  skills: ['compare-integers', 'order-integers'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['compare-symbol', 'keypad', 'choose-text'],
  visuals: ['counter-objects', 'number-line'],
  vocab: ['coldest'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five ice blocks.',
      visual: { kind: 'counter-objects', count: 8, icon: '🧊' },
      action: 'tap-count',
      target: 5,
      hint: 'More ice makes it colder.',
    },
    {
      stage: 'pictorial',
      prompt: '−7 is left of −3.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -7, marks: [-3], step: 1 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'So −3 is warmer than −7.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -3, marks: [-7], step: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Left on the line is less.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -9, marks: [-1], step: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '−9 is less than −1.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -9, step: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Kedua sisi bebas bertanda apa saja, termasuk sama persis — `=` harus
      // benar-benar pernah jadi jawaban, kalau tidak anak belajar bahwa tombol
      // tengah tidak pernah dipakai.
      type: 'compare-symbol',
      skill: 'compare-integers',
      params: { a: [-9, 9], b: [-9, 9] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `${sgn(p.a as number)} ? ${sgn(p.b as number)}`,
    },
    {
      // Yang lebih kecil DITULIS, bukan ditunjuk. Jawabannya negatif setiap kali
      // bilangan terkecilnya negatif — dan karena aturan yang sama juga bisa
      // berjawaban positif (dua bilangan positif), tombol minus tidak
      // membocorkan apa pun.
      type: 'keypad',
      skill: 'compare-integers',
      params: { a: [-9, 9], b: [-9, 9] },
      answer: (p) => Math.min(p.a as number, p.b as number),
      text: (p) => `Write the smaller one: ${sgn(p.a as number)} or ${sgn(p.b as number)}.`,
      exclude: (p) => (p.a as number) === (p.b as number),
    },
    {
      // Tiga suhu sekaligus: mengurutkan, bukan sekadar membandingkan sepasang.
      // Ketiganya bebas bertanda apa saja, jadi jawaban benarnya jatuh di ketiga
      // posisi secara merata — dan pilihan yang salah adalah bilangan lain yang
      // benar-benar ada di soal, bukan angka karangan.
      type: 'choose-text',
      skill: 'order-integers',
      params: { a: [-9, 9], b: [-9, 9], c: [-9, 9] },
      answer: (p) => {
        const v = [p.a as number, p.b as number, p.c as number];
        return v.indexOf(Math.min(...v));
      },
      text: (p) =>
        `Which is coldest: ${sgn(p.a as number)}, ${sgn(p.b as number)}, ` +
        `or ${sgn(p.c as number)}?`,
      exclude: (p) =>
        (p.a as number) === (p.b as number) ||
        (p.b as number) === (p.c as number) ||
        (p.a as number) === (p.c as number),
      options: (p) => [sgn(p.a as number), sgn(p.b as number), sgn(p.c as number)],
    },
  ],
};

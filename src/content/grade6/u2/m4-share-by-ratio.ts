import type { ContentModule } from '../../types';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

const allUnique = (o: string[]) => new Set(o).size === o.length;

/** Pilihan "kedua bagiannya", dipakai bersama oleh `options` dan `exclude`. */
const shareOptions = (a: number, b: number, u: number) => [
  `${a * u} and ${b * u}`,
  `${b * u} and ${a * u}`,
  `${a} and ${b}`,
  `${u} and ${u}`,
];

/**
 * Puncak benang `bar-model` yang dimulai di Grade 2 sebagai gambar soal cerita:
 * **membagi sebuah jumlah menurut rasio.** Inilah satu-satunya tempat di seluruh
 * app di mana batang benar-benar melakukan pekerjaan berpikirnya, bukan sekadar
 * menemani teksnya.
 *
 * Gambarnya tiga batang: satu batang utuh (jumlah seluruhnya) dan dua batang di
 * bawahnya yang panjangnya sepadan dengan rasionya. Yang harus dilihat anak
 * hanyalah bahwa batang utuh itu terpotong menjadi `a + b` bagian yang SAMA
 * BESAR — dari situ seluruh soalnya tinggal dua langkah:
 *  1. bagi jumlahnya dengan banyak bagian → nilai satu bagian;
 *  2. kalikan dengan bagian tiap orang.
 *
 * Langkah 1 itulah yang punya aturannya sendiri (`How big is one part?`), karena
 * anak yang melompatinya akan membagi dua begitu saja setiap kali — kesalahan
 * yang tidak pernah terlihat kalau yang ditanyakan hanya hasil akhirnya.
 *
 * Banyaknya bagian (`a + b`) sudah dilatih terpisah di `m1`, jadi di sini ia
 * dianggap sudah ada. Rasionya selalu dalam bentuk paling sederhana (`m2`), dan
 * jumlahnya selalu kelipatan `a + b` supaya setiap jawaban bulat — anak tidak
 * pernah bertemu bagian berkoma yang tidak bisa diketik.
 */
export const shareByRatio: ContentModule = {
  id: 'g6-u2-m4',
  unitId: 'g6-u2',
  grade: 6,
  title: 'Share by Ratio',
  icon: '🍰',
  prereq: ['g6-u2-m3'],
  skills: ['share-by-ratio', 'ratio-one-part'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'bar-model', 'number-bond'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four of ten dots.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟡' },
      action: 'tap-count',
      target: 4,
      hint: 'Two parts and three parts make five.',
    },
    {
      // Batang utuh di atas, dua bagiannya di bawah. Angkanya ada di label dan
      // di teks — `Bars` tidak punya sumbu, jadi panjangnya tidak pernah jadi
      // satu-satunya sumber jawaban.
      stage: 'pictorial',
      prompt: 'Ten dots split as 2 : 3.',
      visual: { kind: 'bars', lengths: [1, 0.4, 0.6], labels: ['1', '4', '6'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Four and six make ten.',
      visual: { kind: 'number-bond', whole: 10, parts: [4, 6] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Five parts in all. Each part is two.',
      visual: { kind: 'bars', lengths: [1, 0.4, 0.6], labels: ['1', '2', '3'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide by five parts, then times each.',
      visual: { kind: 'bars', lengths: [1, 0.4, 0.6], labels: ['1', '2', '3'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bagian pertama. Jumlahnya selalu kelipatan (a + b), jadi jawabannya
      // selalu bilangan bulat yang bisa diketik.
      type: 'keypad',
      skill: 'share-by-ratio',
      params: { a: [1, 5], b: [1, 5], u: [2, 12] },
      answer: (p) => (p.a as number) * (p.u as number),
      text: (p) =>
        `Share ${((p.a as number) + (p.b as number)) * (p.u as number)} in ratio ` +
        `${p.a} : ${p.b}. First share?`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
    },
    {
      // Bagian kedua. Dipisahkan dari aturan pertama supaya anak tidak belajar
      // bahwa yang ditanya selalu sisi kiri.
      type: 'missing-number',
      skill: 'share-by-ratio',
      params: { a: [1, 5], b: [1, 5], u: [2, 12] },
      answer: (p) => (p.b as number) * (p.u as number),
      text: (p) =>
        `${((p.a as number) + (p.b as number)) * (p.u as number)} split as ` +
        `${p.a} : ${p.b}. Second part = ?`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
    },
    {
      // Langkah yang paling sering dilompati: nilai SATU bagian. Pengecoh
      // miskonsepsinya adalah bagian pertama — anak yang mengira "satu bagian"
      // berarti "bagian orang pertama".
      type: 'choose-number',
      skill: 'ratio-one-part',
      params: { a: [1, 5], b: [1, 5], u: [2, 12] },
      answer: (p) => p.u as number,
      text: (p) =>
        `${((p.a as number) + (p.b as number)) * (p.u as number)} shared as ` +
        `${p.a} : ${p.b}. How big is one part?`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
      distractors: 'near',
      misconception: (p) => (p.a as number) * (p.u as number),
    },
    {
      // Kedua bagiannya sekaligus. Pengecoh kedua membalik urutannya, ketiga
      // memberikan rasionya mentah-mentah sebagai jawaban (kesalahan paling
      // umum: lupa mengalikan), keempat membagi rata.
      type: 'choose-text',
      skill: 'share-by-ratio',
      params: { a: [1, 5], b: [1, 5], u: [2, 12] },
      answer: () => 0,
      text: (p) =>
        `${((p.a as number) + (p.b as number)) * (p.u as number)} shared as ` +
        `${p.a} : ${p.b}. Which is right?`,
      options: (p) => shareOptions(p.a as number, p.b as number, p.u as number),
      exclude: (p) =>
        gcd(p.a as number, p.b as number) !== 1 ||
        (p.a as number) === (p.b as number) ||
        !allUnique(shareOptions(p.a as number, p.b as number, p.u as number)),
    },
  ],
};

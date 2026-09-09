import type { ContentModule } from '../../types';

const allUnique = (o: string[]) => new Set(o).size === o.length;

/** "1 worker", "6 workers" — supaya bacaannya tetap wajar untuk setiap angka. */
const many = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Pilihan "berapa hari kalau pekerjanya bertambah", dipakai `options` dan `exclude`. */
const inverseOptions = (a: number, b: number, m: number) => [
  many(b, 'day'),
  many(b * m * m, 'day'),
  many(b * m, 'day'),
  many(b * m + a, 'day'),
];

/**
 * Penutup unit, dan satu-satunya modul di sini yang berjalan ke arah berlawanan:
 * **perbandingan berbalik nilai.** Lebih banyak pekerja berarti lebih sedikit
 * hari; lebih banyak anak berarti lebih sedikit kue untuk masing-masing.
 *
 * Modul ini diletakkan terakhir bukan karena paling sulit dihitung — hitungannya
 * justru sederhana — melainkan karena ia hanya masuk akal setelah `m6`. Yang
 * diajarkan sebenarnya adalah **pertanyaan yang harus ditanyakan anak sebelum
 * menghitung apa pun**: kalau yang satu naik, yang lain ikut naik atau justru
 * turun? Enam modul sebelumnya semuanya searah, jadi kebiasaan "kalikan saja"
 * sudah terbentuk kuat — dan itu memang disengaja, supaya modul ini punya
 * sesuatu untuk dipatahkan.
 *
 * Karena itu pengecoh utamanya di mana-mana adalah **jawaban perbandingan
 * senilai**: dua kali pekerja dijawab dua kali hari, bukan setengahnya. Aturan
 * `choose-number` bahkan memakai `q · m · m` — kesalahan yang sama, dilipat dua
 * kali — supaya anak yang menebak arah tidak pernah kebetulan benar.
 *
 * **Parameternya dirancang supaya jawabannya selalu bilangan bulat.** Berbalik
 * nilai adalah pembagian, dan pembagian gampang sekali menghasilkan pecahan yang
 * tidak bisa diketik di keypad. Jalan keluarnya: bilangan yang akan DIBAGI selalu
 * dibangun lebih dulu sebagai hasil kali (`b · m`, `q · n · m`), jadi
 * pembagiannya pasti pas. Tidak ada satu pun soal di modul ini yang berjawaban
 * pecahan.
 */
export const moreMeansLess: ContentModule = {
  id: 'g6-u2-m7',
  unitId: 'g6-u2',
  grade: 6,
  title: 'More Means Less',
  icon: '📉',
  prereq: ['g6-u2-m6'],
  skills: ['inverse-proportion'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'bar-model', 'number-bond'],
  vocab: ['kids'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six of twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🍪' },
      action: 'tap-count',
      target: 6,
      hint: 'Two kids share twelve dots.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two kids, six dots each.',
      visual: { kind: 'bars', lengths: [0.5, 0.5], labels: ['6', '6'] },
      action: 'watch',
    },
    {
      // Batang yang sama panjang seluruhnya, tapi terbagi empat: yang tetap
      // adalah jumlahnya, yang berubah adalah bagian tiap anak.
      stage: 'pictorial',
      prompt: 'Four kids, three dots each.',
      visual: { kind: 'bars', lengths: [0.25, 0.25, 0.25, 0.25], labels: ['3', '3', '3', '3'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'More kids means less for each.',
      visual: { kind: 'number-bond', whole: 12, parts: [6, 6] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Twice the kids, half the dots.',
      visual: { kind: 'bars', lengths: [1, 0.5], labels: ['6', '3'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Pekerja naik `m` kali, hari turun `m` kali. Harinya dibangun sebagai
      // `b · m`, jadi pembagiannya selalu pas dan jawabannya bilangan bulat.
      type: 'keypad',
      skill: 'inverse-proportion',
      params: { a: [1, 9], b: [1, 9], m: [2, 5] },
      answer: (p) => p.b as number,
      text: (p) =>
        `${many(p.a as number, 'worker')} ${(p.a as number) === 1 ? 'needs' : 'need'} ` +
        `${(p.b as number) * (p.m as number)} days. ` +
        `${many((p.a as number) * (p.m as number), 'worker')} need how many days?`,
    },
    {
      // Arah sebaliknya: waktunya diketahui, banyaknya keran yang dicari.
      type: 'missing-number',
      skill: 'inverse-proportion',
      params: { a: [1, 9], b: [1, 9], m: [2, 5] },
      answer: (p) => (p.a as number) * (p.m as number),
      text: (p) =>
        `${many(p.a as number, 'tap')} ${(p.a as number) === 1 ? 'fills' : 'fill'} it in ` +
        `${(p.b as number) * (p.m as number)} minutes. ` +
        `? taps fill it in ${p.b} minutes.`,
    },
    {
      // Berbagi: jumlahnya tetap, yang berubah banyaknya anak. Pengecoh
      // miskonsepsinya `q · m · m` adalah jawaban perbandingan SENILAI —
      // anak yang mengalikan padahal seharusnya membagi.
      type: 'choose-number',
      skill: 'inverse-proportion',
      params: { q: [1, 9], n: [1, 6], m: [2, 4] },
      answer: (p) => p.q as number,
      text: (p) =>
        `${(p.q as number) * (p.n as number) * (p.m as number)} cakes for ` +
        `${many(p.n as number, 'kid')} is ${(p.q as number) * (p.m as number)} each. ` +
        `${many((p.n as number) * (p.m as number), 'kid')} get how many each?`,
      distractors: 'near',
      misconception: (p) => (p.q as number) * (p.m as number) * (p.m as number),
    },
    {
      // Pilihan kedua adalah jawaban senilai (dua kali pekerja, dua kali hari),
      // ketiga membiarkan harinya tetap, keempat menambahkan banyaknya pekerja
      // ke jumlah harinya — berpikir aditif yang sama seperti di m3.
      type: 'choose-text',
      skill: 'inverse-proportion',
      params: { a: [1, 9], b: [1, 9], m: [2, 5] },
      answer: () => 0,
      text: (p) =>
        `${many(p.a as number, 'worker')} ${(p.a as number) === 1 ? 'takes' : 'take'} ` +
        `${(p.b as number) * (p.m as number)} days. ` +
        `What about ${many((p.a as number) * (p.m as number), 'worker')}?`,
      options: (p) => inverseOptions(p.a as number, p.b as number, p.m as number),
      exclude: (p) => !allUnique(inverseOptions(p.a as number, p.b as number, p.m as number)),
    },
  ],
};

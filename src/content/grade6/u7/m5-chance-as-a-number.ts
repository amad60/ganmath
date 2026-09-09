import type { ContentModule } from '../../types';

/** Berapa banyak bola seluruhnya kalau ada `r` merah dan `b` biru. */
const totalOf = (p: Record<string, number>) => (p.r as number) + (p.b as number);

/** 10 atau 20 — dua-duanya membuat peluangnya jadi desimal yang berujung. */
const trialsOf = (p: Record<string, number>) => ((p.tk as number) === 0 ? 10 : 20);

const CHANCE_WORDS = ['impossible', 'even chance', 'certain'] as const;

/**
 * Peluang sebagai ANGKA — dan angka itu punya dua wajah yang harus dikenali
 * dua-duanya: pecahan (3 dari 8) dan desimal (0,4).
 *
 * Pembagian tugasnya ditentukan oleh keypad, bukan oleh selera:
 *
 * - **Pecahan lewat `choose-text`.** Keypad tidak bisa mengetik `3/8`; ia hanya
 *   punya angka, titik, dan minus. Jadi bentuk pecahan ditanyakan sebagai pilihan,
 *   dengan tiga pengecoh yang masing-masing sebuah kekeliruan nyata: peluang
 *   warna yang lain (b/total), membandingkan bagian dengan bagian alih-alih dengan
 *   keseluruhan (r/b), dan membalik pecahannya (total/r).
 * - **Desimal lewat `keypad`.** Anak benar-benar menuliskannya, dan itu bisa terjadi
 *   karena angkanya dirancang: 10 atau 20 percobaan, jadi tiap peluang jatuh di
 *   kelipatan 0,05 dan selalu berujung. Enam percobaan tidak pernah dipakai —
 *   1/6 adalah 0,1666… yang tidak bisa dituliskan siapa pun, dan lint `input-width`
 *   memang akan menolaknya.
 *
 * Aturan ketiga memasang dua paku batas skalanya: yang mustahil bernilai 0, yang
 * pasti bernilai 1, dan yang berimbang di tengah. Tanpa itu peluang cuma prosedur
 * membagi; dengan itu ia jadi angka yang punya ujung.
 */
export const chanceAsANumber: ContentModule = {
  id: 'g6-u7-m5',
  unitId: 'g6-u7',
  grade: 6,
  title: 'Chance as a Number',
  icon: '🎲',
  prereq: ['g6-u7-m4'],
  skills: ['chance-fraction', 'chance-decimal', 'sure-or-not'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad'],
  visuals: ['pictogram', 'number-line', 'counter-objects'],
  vocab: ['chance', 'ball', 'balls', 'bag', 'pick', 'looking', 'red', 'blue'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three red balls.',
      visual: { kind: 'counter-objects', count: 8, icon: '🔴' },
      action: 'tap-count',
      target: 3,
      hint: 'Pick one ball without looking.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four red balls of ten.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🔴', count: 4 },
          { label: 'blue', icon: '🔵', count: 6 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Chance of red is 4 of 10.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🔴', count: 4 },
          { label: 'blue', icon: '🔵', count: 6 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write chance as 4/10.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🔴', count: 4 },
          { label: 'blue', icon: '🔵', count: 6 },
        ],
      },
      action: 'watch',
    },
    {
      // Garis 0–1: gambar yang membuat "mustahil" dan "pasti" jadi tempat, bukan
      // kata. Langkah 0,1 ditulis eksplisit — desimal butuh langkah yang bukan
      // bilangan bulat, dan itu satu-satunya alasan `step` diisi.
      stage: 'abstract',
      prompt: 'Chance goes from 0 to 1.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.4, step: 0.1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'That chance is 0.4.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.4, step: 0.1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // `r === b` dibuang: kalau merah dan biru sama banyak, pilihan r/total dan
      // b/total jadi string yang sama persis — dua tombol berjawaban benar, dan
      // satu tombol terbuang.
      type: 'choose-text',
      skill: 'chance-fraction',
      params: { r: [1, 7], b: [1, 7] },
      answer: () => 0,
      text: (p) => `A bag has ${p.r} red and ${p.b} blue balls. Chance of red?`,
      exclude: (p) => (p.r as number) === (p.b as number),
      options: (p) => {
        const t = totalOf(p);
        return [`${p.r}/${t}`, `${p.b}/${t}`, `${p.r}/${p.b}`, `${t}/${p.r}`];
      },
      visual: (p) => ({
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🔴', count: p.r as number },
          { label: 'blue', icon: '🔵', count: p.b as number },
        ],
      }),
    },
    {
      // Diketik, bukan dipilih. Sepuluh atau dua puluh bola, jadi jawabannya selalu
      // kelipatan 0,05 — dua digit, berujung, dan tombol titik memang muncul karena
      // SELURUH aturan ini berjawaban desimal (`answerCaps` mengambilnya per rule,
      // jadi munculnya tombol tidak membocorkan apa pun).
      type: 'keypad',
      skill: 'chance-decimal',
      params: { tk: [0, 1], k: [1, 9] },
      answer: (p) => (p.k as number) / trialsOf(p),
      text: (p) =>
        `A bag has ${trialsOf(p)} balls. ${p.k} are red. Chance of red as a decimal?`,
    },
    {
      // Nol dan satu. Dua ujung skala itu tidak bisa ditemukan dengan membagi —
      // harus dikenali, jadi ditanyakan dengan kata.
      type: 'choose-text',
      skill: 'sure-or-not',
      params: { r: [2, 9], t: [0, 2] },
      answer: (p) => {
        const t = p.t as number;
        return t === 0 ? 2 : t === 1 ? 0 : 1;
      },
      text: (p) => {
        const t = p.t as number;
        if (t === 0) return `A bag has ${p.r} red balls only. Getting red is?`;
        if (t === 1) return `A bag has ${p.r} red balls only. Getting blue is?`;
        return `A bag has ${p.r} red and ${p.r} blue balls. Getting red is?`;
      },
      options: () => [...CHANCE_WORDS],
    },
  ],
};

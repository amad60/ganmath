import type { ContentModule } from '../../types';

/**
 * Fase A Kurikulum Merdeka: "memahami setengah dan seperempat".
 * Yang menentukan bukan jumlah potongan, tapi potongan yang SAMA BESAR — karena itu
 * ada soal dengan pembagian tidak sama besar sebagai pengecoh miskonsepsi.
 */
export const halvesAndFourths: ContentModule = {
  id: 'g1-u6-m4',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Halves and Fourths',
  icon: '🍕',
  prereq: ['g1-u6-m3'],
  skills: ['halves-fourths'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['fraction-shape'],
  vocab: ['equal', 'fourth', 'fourths', 'quarter', 'whole', 'shaded'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two equal parts.',
      visual: { kind: 'counter-objects', count: 4, icon: '🍕' },
      action: 'tap-count',
      target: 2,
      hint: 'Two equal parts make halves.',
    },
    {
      stage: 'pictorial',
      prompt: 'One of two equal parts is half.',
      visual: { kind: 'fraction', parts: 2, shaded: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One of four equal parts is a fourth.',
      visual: { kind: 'fraction', parts: 4, shaded: 1 },
      action: 'watch',
    },
    {
      // Soal menanyakan 2 dari 4 bagian, jadi materinya harus menunjukkannya dulu.
      // Sebelum ini modulnya menguji hal yang tidak pernah diajarkannya.
      stage: 'abstract',
      prompt: 'Two of four equal parts is half.',
      visual: { kind: 'fraction', parts: 4, shaded: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'halves-fourths',
      params: { p: [2, 4], s: [1, 3] },
      /**
       * Jawaban diturunkan dari NILAI pecahannya, bukan dari pola cabang.
       *
       * Versi sebelumnya bercabang: kalau bukan utuh dan bukan dua bagian, maka
       * "satu bagian = seperempat, selain itu = tiga perempat". Cabang terakhir itu
       * tidak pernah memeriksa berapa yang diarsir, jadi 2 dari 4 bagian dijawab
       * "three fourths" — anak yang menjawab "half" (yang BENAR) dinyatakan salah,
       * lalu diberi tahu bahwa setengah pizza itu tiga perempat. Bug yang mengajarkan
       * matematika yang salah lebih buruk daripada bug yang membuat app jatuh.
       *
       * Dihitung dari shaded/parts, kesalahan seperti itu tidak bisa lahir lagi:
       * tidak ada cabang yang bisa lupa satu kasus.
       */
      answer: (p) => {
        const value = (p.s as number) / (p.p as number);
        if (value === 1) return 3; // whole
        if (value === 0.5) return 0; // half — termasuk 2 dari 4 bagian
        if (value === 0.25) return 1; // one fourth
        return 2; // three fourths
      },
      text: () => 'How much is shaded?',
      visual: (p) => ({ kind: 'fraction', parts: p.p as number, shaded: p.s as number }),
      exclude: (p) => (p.s as number) > (p.p as number) || (p.p as number) === 3,
      options: () => ['half', 'one fourth', 'three fourths', 'whole'],
    },
    {
      type: 'choose-number',
      skill: 'halves-fourths',
      params: { p: [2, 4] },
      answer: (p) => p.p as number,
      text: () => 'How many equal parts?',
      visual: (p) => ({ kind: 'fraction', parts: p.p as number, shaded: 1, shape: 'square' }),
      distractors: 'near',
      misconception: (p) => (p.p as number) + 1,
    },
  ],
};

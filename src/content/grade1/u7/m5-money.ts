import type { ContentModule } from '../../types';

/**
 * Memakai rupiah — pecahan yang benar-benar dipegang anak. Kalau nanti perlu diganti,
 * yang berubah cuma daftar angka di sini, bukan logikanya.
 */
const NOTES = [500, 1000, 2000, 5000, 10000];

const rp = (v: number) => `Rp${v.toLocaleString('id-ID')}`;

/**
 * Nilai uang TIDAK boleh ditanyakan lewat pilihan angka biasa: pengecoh "sekitar
 * jawaban" menghasilkan Rp12.002 vs Rp12.000, dan membedakan keduanya tidak
 * mengajarkan apa pun tentang uang. Pengecohnya harus jumlah yang MASUK AKAL —
 * salah satu lembar saja, atau selisihnya.
 */
function sumOptions(a: number, b: number, correctAt: number): string[] {
  const correct = a + b;
  const candidates = [a, b, Math.abs(a - b) || a * 2, correct + a].filter(
    (v, i, arr) => v !== correct && v > 0 && arr.indexOf(v) === i,
  );
  const out: string[] = [];
  let ci = 0;
  for (let i = 0; i < 4; i++) {
    out.push(i === correctAt ? rp(correct) : rp(candidates[ci++] ?? correct + 1000 * (i + 1)));
  }
  return out;
}

export const money: ContentModule = {
  id: 'g1-u7-m5',
  unitId: 'g1-u7',
  grade: 1,
  title: 'Money',
  icon: '💰',
  prereq: ['g1-u5-m5'],
  skills: ['money-rupiah'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['money'],
  vocab: ['money', 'buy', 'cost', 'coin', 'coins', 'note', 'notes', 'pay', 'thousand'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two coins.',
      visual: { kind: 'counter-objects', count: 4, icon: '🪙' },
      action: 'tap-count',
      target: 2,
      hint: 'Coins are round.',
    },
    {
      stage: 'pictorial',
      prompt: 'This is one thousand.',
      visual: { kind: 'money', items: [1000] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Two notes make more money.',
      visual: { kind: 'money', items: [1000, 500] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Empat pilihan, bukan lima: grid dua kolom membuat pilihan kelima berdiri
      // sendiri dan terpotong di bawah layar.
      type: 'choose-text',
      skill: 'money-rupiah',
      params: { i: [0, 4] },
      answer: (p) => {
        const start = Math.min(Math.max((p.i as number) - 1, 0), NOTES.length - 4);
        return (p.i as number) - start;
      },
      text: () => 'Which one is this?',
      visual: (p) => ({ kind: 'money', items: [NOTES[p.i as number] ?? 0] }),
      options: (p) => {
        const start = Math.min(Math.max((p.i as number) - 1, 0), NOTES.length - 4);
        return NOTES.slice(start, start + 4).map(rp);
      },
    },
    {
      type: 'choose-text',
      skill: 'money-rupiah',
      params: { i: [0, 4], j: [0, 4], k: [0, 3] },
      answer: (p) => p.k as number,
      text: () => 'How much money?',
      visual: (p) => ({
        kind: 'money',
        items: [NOTES[p.i as number] ?? 0, NOTES[p.j as number] ?? 0],
      }),
      exclude: (p) => (p.i as number) > (p.j as number),
      options: (p) =>
        sumOptions(NOTES[p.i as number] ?? 0, NOTES[p.j as number] ?? 0, p.k as number),
    },
    {
      type: 'choose-number',
      skill: 'money-rupiah',
      params: { n: [2, 6] },
      answer: (p) => p.n as number,
      text: () => 'How many notes?',
      visual: (p) => ({
        kind: 'money',
        items: Array.from({ length: p.n as number }, (_, i) => NOTES[i % NOTES.length] ?? 1000),
      }),
      distractors: 'near',
    },
  ],
};

import type { ContentModule } from '../../types';

const rp = (v: number) => `Rp${v.toLocaleString('id-ID')}`;

export const change: ContentModule = {
  id: 'g2-u7-m4',
  unitId: 'g2-u7',
  grade: 2,
  title: 'Change',
  icon: '🧾',
  prereq: ['g2-u7-m3', 'g2-u2-m6'],
  skills: ['money-change'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['money'],
  vocab: ['change', 'pay', 'left'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap one note.',
      visual: { kind: 'counter-objects', count: 3, icon: '💵' },
      action: 'tap-count',
      target: 1,
      hint: 'You pay with this note.',
    },
    {
      stage: 'pictorial',
      prompt: 'You pay ten thousand.',
      visual: { kind: 'money', items: [10000] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      // Kembalian = pengurangan dalam konteks nyata; itulah gunanya meminjam.
      prompt: 'Change is what is left.',
      visual: { kind: 'money', items: [5000, 2000] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'money-change',
      params: { pay: [1, 4], cost: [1, 19], k: [0, 3] },
      answer: (p) => p.k as number,
      text: (p) =>
        `You pay ${rp((p.pay as number) * 5000)}. It costs ${rp((p.cost as number) * 1000)}. Change?`,
      exclude: (p) => (p.cost as number) * 1000 >= (p.pay as number) * 5000,
      options: (p) => {
        const paid = (p.pay as number) * 5000;
        const cost = (p.cost as number) * 1000;
        const correct = paid - cost;
        const cands = [paid + cost, cost, paid].filter((v) => v !== correct);
        const out: string[] = [];
        let ci = 0;
        for (let i = 0; i < 4; i++) {
          out.push(i === (p.k as number) ? rp(correct) : rp(cands[ci++] ?? correct + 1000));
        }
        return out;
      },
    },
    {
      type: 'choose-number',
      distractorUnit: 1000,
      skill: 'money-change',
      params: { pay: [1, 4], cost: [1, 9] },
      answer: (p) => ((p.pay as number) * 5 - (p.cost as number)) * 1000,
      text: (p) =>
        `Pay ${rp((p.pay as number) * 5000)}, cost ${rp((p.cost as number) * 1000)}. Change in rupiah?`,
      exclude: (p) => (p.cost as number) >= (p.pay as number) * 5,
      distractors: 'near',
      misconception: (p) => ((p.pay as number) * 5 + (p.cost as number)) * 1000,
    },
  ],
};

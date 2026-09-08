import type { ContentModule } from '../../types';

export const shareEqually: ContentModule = {
  id: 'g3-u3-m1',
  unitId: 'g3-u3',
  grade: 3,
  title: 'Share Equally',
  icon: '🤝',
  prereq: ['g3-u2-m8'],
  skills: ['share'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['share', 'shared', 'divide', 'equally', 'between'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🍪' },
      action: 'tap-count',
      target: 12,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Share 12 between 3. Each has 4.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 12 ÷ 3 = 4.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'share',
      params: { g: [2, 6], each: [2, 6] },
      answer: (p) => p.each as number,
      text: (p) => `Share ${(p.g as number) * (p.each as number)} between ${p.g}. How many each?`,
      visual: (p) => ({ kind: 'array', rows: p.g as number, cols: p.each as number }),
      distractors: 'near',
      misconception: (p) => p.g as number, // menyebut jumlah kelompok, bukan isi tiap kelompok
    },
    {
      type: 'keypad',
      skill: 'share',
      params: { g: [2, 6], each: [2, 9] },
      answer: (p) => p.each as number,
      text: (p) => `${(p.g as number) * (p.each as number)} ÷ ${p.g} = ?`,
    },
  ],
};

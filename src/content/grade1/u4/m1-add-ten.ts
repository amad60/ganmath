import type { ContentModule } from '../../types';

export const addTen: ContentModule = {
  id: 'g1-u4-m1',
  unitId: 'g1-u4',
  grade: 1,
  title: 'Add Ten',
  icon: '📦',
  prereq: ['g1-u3-m1'],
  skills: ['add-ten'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame'],
  vocab: ['fourteen'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill ten boxes, then four more.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 14,
      hint: 'One full frame first.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten and four make fourteen.',
      visual: { kind: 'ten-frame', value: 14, capacity: 20, split: 10 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Adding ten only changes the tens.',
      visual: { kind: 'ten-frame', value: 17, capacity: 20, split: 10 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-ten',
      params: { n: [1, 10] },
      answer: (p) => 10 + (p.n as number),
      text: (p) => `10 + ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => p.n as number, // lupa menambahkan puluhannya
    },
    {
      type: 'keypad',
      skill: 'add-ten',
      params: { n: [1, 9] },
      answer: (p) => (p.n as number) + 10,
      text: (p) => `${p.n} + 10 = ?`,
    },
    {
      type: 'keypad',
      skill: 'add-ten',
      story: true,
      params: { n: [1, 9] },
      answer: (p) => (p.n as number) + 10,
      text: (p) => `Ana has 10 cards. Budi gives her ${p.n}. How many now?`,
    },
    {
      type: 'keypad',
      skill: 'add-ten',
      story: true,
      params: { n: [1, 9] },
      answer: (p) => (p.n as number) + 10,
      text: (p) => `A box has 10 books. Siti puts in ${p.n}. How many books?`,
    },
  ],
};

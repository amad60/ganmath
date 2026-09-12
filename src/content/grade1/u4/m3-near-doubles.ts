import type { ContentModule } from '../../types';
import { pl } from '../../plural';

export const nearDoubles: ContentModule = {
  id: 'g1-u4-m3',
  unitId: 'g1-u4',
  grade: 1,
  title: 'Near Doubles',
  icon: '🎯',
  prereq: ['g1-u4-m2'],
  skills: ['near-doubles'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame'],
  vocab: ['near', 'one'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill four, then five more.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 9,
      hint: 'Almost a double.',
    },
    {
      stage: 'pictorial',
      prompt: 'Double four is eight.',
      visual: { kind: 'ten-frame', value: 8, capacity: 20, split: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One more makes nine.',
      visual: { kind: 'ten-frame', value: 9, capacity: 20, split: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'near-doubles',
      params: { n: [1, 9] },
      answer: (p) => (p.n as number) * 2 + 1,
      text: (p) => `${p.n} + ${(p.n as number) + 1} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 2, // memakai doubles, lupa satu lagi
    },
    {
      type: 'keypad',
      skill: 'near-doubles',
      params: { n: [2, 9] },
      answer: (p) => (p.n as number) * 2 - 1,
      text: (p) => `${p.n} + ${(p.n as number) - 1} = ?`,
    },
    {
      type: 'keypad',
      skill: 'near-doubles',
      story: true,
      params: { n: [2, 9] },
      answer: (p) => (p.n as number) * 2 - 1,
      text: (p) => `Ana has ${p.n} shells. Budi has ${(p.n as number) - 1}. How many altogether?`,
    },
    {
      type: 'keypad',
      skill: 'near-doubles',
      story: true,
      params: { n: [2, 9] },
      answer: (p) => (p.n as number) * 2 - 1,
      text: (p) => `${p.n} red cards and ${pl((p.n as number) - 1, 'blue card')}. How many cards?`,
    },
  ],
};

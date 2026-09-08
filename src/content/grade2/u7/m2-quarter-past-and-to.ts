import type { ContentModule } from '../../types';

export const quarterPastAndTo: ContentModule = {
  id: 'g2-u7-m2',
  unitId: 'g2-u7',
  grade: 2,
  title: 'Quarter Past and To',
  icon: '🕓',
  prereq: ['g2-u7-m1'],
  skills: ['time-quarter'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['clock', 'fraction-shape'],
  vocab: ['quarter', 'to', 'half'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four equal parts.',
      visual: { kind: 'counter-objects', count: 6, icon: '🍕' },
      action: 'tap-count',
      target: 4,
      hint: 'A quarter is one of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'A quarter of the clock.',
      visual: { kind: 'fraction', parts: 4, shaded: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Quarter past three is 3:15.',
      visual: { kind: 'clock', hour: 3, minute: 15 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'time-quarter',
      params: { h: [1, 12], q: [0, 3] },
      answer: (p) => p.q as number,
      text: () => 'What time is it?',
      visual: (p) => ({
        kind: 'clock',
        hour: p.h as number,
        minute: [0, 15, 30, 45][p.q as number] ?? 0,
      }),
      options: (p) => {
        const h = p.h as number;
        const next = (h % 12) + 1;
        return [`${h} o'clock`, `quarter past ${h}`, `half past ${h}`, `quarter to ${next}`];
      },
    },
    {
      type: 'choose-number',
      distractorUnit: 15,
      skill: 'time-quarter',
      params: { q: [0, 3] },
      answer: (p) => [0, 15, 30, 45][p.q as number] ?? 0,
      text: () => 'How many minutes past?',
      visual: (p) => ({ kind: 'clock', hour: 6, minute: [0, 15, 30, 45][p.q as number] ?? 0 }),
      distractors: 'near',
      misconception: (p) => ([0, 15, 30, 45][p.q as number] ?? 0) + 5,
    },
  ],
};

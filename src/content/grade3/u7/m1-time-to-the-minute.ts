import type { ContentModule } from '../../types';

export const timeToTheMinute: ContentModule = {
  id: 'g3-u7-m1',
  unitId: 'g3-u7',
  grade: 3,
  title: 'Time to the Minute',
  icon: '🕰️',
  prereq: ['g3-u6-m5'],
  skills: ['time-minute'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text'],
  visuals: ['clock'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five minutes.',
      visual: { kind: 'counter-objects', count: 12, icon: '⏱️' },
      action: 'tap-count',
      target: 5,
      hint: 'One mark is one minute.',
    },
    {
      stage: 'pictorial',
      prompt: 'The long hand counts minutes.',
      visual: { kind: 'clock', hour: 3, minute: 17 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'This clock says 3:17.',
      visual: { kind: 'clock', hour: 3, minute: 17 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'time-minute',
      params: { h: [1, 12], m: [1, 59] },
      answer: (p) => p.m as number,
      text: () => 'How many minutes past?',
      visual: (p) => ({ kind: 'clock', hour: p.h as number, minute: p.m as number }),
      distractors: 'near',
      misconception: (p) => Math.round((p.m as number) / 5), // membaca angka, bukan menit
    },
    {
      type: 'choose-text',
      skill: 'time-minute',
      params: { h: [1, 12], m: [1, 59] },
      answer: () => 0,
      text: () => 'What time is it?',
      visual: (p) => ({ kind: 'clock', hour: p.h as number, minute: p.m as number }),
      options: (p) => {
        const h = p.h as number;
        const m = p.m as number;
        const pad = (n: number) => `${n}`.padStart(2, '0');
        return [
          `${h}:${pad(m)}`,
          `${m}:${pad(h)}`,
          `${h}:${pad((m + 5) % 60)}`,
          `${(h % 12) + 1}:${pad(m)}`,
        ];
      },
    },
  ],
};

import type { ContentModule } from '../../types';

export const timeToFive: ContentModule = {
  id: 'g2-u7-m1',
  unitId: 'g2-u7',
  grade: 2,
  title: 'Time to Five Minutes',
  icon: '🕐',
  prereq: ['g2-u4-m4'],
  skills: ['time-five'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['clock'],
  vocab: ['minute', 'minutes', 'clock', 'hour', 'past'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill five boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 5,
      hint: 'Each step is five minutes.',
    },
    {
      stage: 'pictorial',
      // Angka jam dipakai ulang sebagai kelipatan lima — ini jembatan dari
      // perkalian lima ke membaca jam.
      prompt: 'Count the minutes by fives.',
      visual: { kind: 'clock', hour: 2, minute: 20 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Twenty past two is 2:20.',
      visual: { kind: 'clock', hour: 2, minute: 20 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'time-five',
      params: { h: [1, 12], m: [1, 11] },
      answer: (p) => (p.m as number) * 5,
      text: () => 'How many minutes past the hour?',
      visual: (p) => ({ kind: 'clock', hour: p.h as number, minute: (p.m as number) * 5 }),
      distractors: 'near',
      // membaca angka jam sebagai menit, bukan mengalikan lima
      misconception: (p) => p.m as number,
    },
    {
      type: 'choose-text',
      skill: 'time-five',
      params: { h: [1, 12], m: [1, 11] },
      answer: () => 0,
      text: () => 'What time is it?',
      visual: (p) => ({ kind: 'clock', hour: p.h as number, minute: (p.m as number) * 5 }),
      options: (p) => {
        const h = p.h as number;
        const min = (p.m as number) * 5;
        const next = (h % 12) + 1;
        return [
          `${h}:${String(min).padStart(2, '0')}`,
          `${next}:${String(min).padStart(2, '0')}`,
          `${h}:${String(60 - min).padStart(2, '0')}`,
          `${h}:${String(p.m as number).padStart(2, '0')}`,
        ];
      },
    },
  ],
};

import type { ContentModule } from '../../types';

/**
 * Durasi, bukan penunjukan waktu: yang ditanya adalah JARAK antara dua waktu.
 * Anak sering mengurangkan angka jamnya begitu saja (9:50 sampai 10:20 dikira 30
 * karena 50 dan 20 — kebetulan benar) — karena itu soalnya memakai lompatan yang
 * melewati pergantian jam, dan pengecohnya justru hasil pengurangan mentah itu.
 */
export const howLong: ContentModule = {
  id: 'g3-u7-m2',
  unitId: 'g3-u7',
  grade: 3,
  title: 'How Long?',
  icon: '⏳',
  prereq: ['g3-u7-m1'],
  skills: ['duration'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['clock', 'number-line'],
  vocab: ['long', 'later', 'start', 'end'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap ten minutes.',
      visual: { kind: 'counter-objects', count: 12, icon: '⏱️' },
      action: 'tap-count',
      target: 10,
      hint: 'Ten one-minute steps.',
    },
    {
      stage: 'pictorial',
      prompt: 'Start at 2:00.',
      visual: { kind: 'clock', hour: 2, minute: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'End at 2:40. That is 40 minutes.',
      visual: { kind: 'clock', hour: 2, minute: 40 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'duration',
      distractorUnit: 5,
      params: { h: [1, 11], m: [1, 11], d: [1, 11] },
      answer: (p) => (p.d as number) * 5,
      text: (p) => {
        const start = (p.m as number) * 5;
        const end = (start + (p.d as number) * 5) % 60;
        const eh = start + (p.d as number) * 5 >= 60 ? (p.h as number) + 1 : (p.h as number);
        const pad = (n: number) => `${n}`.padStart(2, '0');
        return `${p.h}:${pad(start)} to ${eh}:${pad(end)}. How long?`;
      },
      // Hanya soal yang MELEWATI pergantian jam — di situlah kesulitannya.
      exclude: (p) => (p.m as number) * 5 + (p.d as number) * 5 < 60,
      distractors: 'near',
      misconception: (p) => 60 - (p.d as number) * 5, // mengurangkan angka menitnya mentah
    },
    {
      type: 'keypad',
      skill: 'duration',
      params: { m: [1, 11], d: [1, 11] },
      answer: (p) => ((p.m as number) * 5 + (p.d as number) * 5) % 60,
      text: (p) => `${(p.d as number) * 5} minutes after ${(p.m as number) * 5} past?`,
      exclude: (p) => (p.m as number) * 5 + (p.d as number) * 5 < 60,
    },
  ],
};

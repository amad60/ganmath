import type { ContentModule } from '../../types';

/**
 * Grade 1 hanya sampai jam bulat dan setengah jam (Fase A). Jarum jam sengaja
 * digambar ikut bergeser saat setengah jam — itu yang paling sering keliru dibaca.
 */
export const tellTheTime: ContentModule = {
  id: 'g1-u7-m4',
  unitId: 'g1-u7',
  grade: 1,
  title: 'Tell the Time',
  icon: '🕐',
  prereq: ['g1-u5-m3'],
  skills: ['time-hour-half'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['clock'],
  vocab: ['clock', 'time', 'hour', 'past', 'thirty', 'hand', 'short', 'long', 'means'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'The short hand shows the hour.',
      visual: { kind: 'clock', hour: 3, minute: 0 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'The long hand means half past.',
      visual: { kind: 'clock', hour: 3, minute: 30 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Half past three is 3:30.',
      visual: { kind: 'clock', hour: 3, minute: 30 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'time-hour-half',
      params: { h: [1, 12], m: [0, 1] },
      answer: (p) => (p.m as number),
      text: () => 'What time is it?',
      visual: (p) => ({
        kind: 'clock',
        hour: p.h as number,
        minute: (p.m as number) === 0 ? 0 : 30,
      }),
      // Pengecoh memuat jam berikutnya: saat setengah jam, jarum pendek sudah
      // bergeser mendekati angka berikutnya, dan itu kekeliruan paling umum.
      options: (p) => {
        const next = ((p.h as number) % 12) + 1;
        return [`${p.h} o'clock`, `half past ${p.h}`, `${next} o'clock`, `half past ${next}`];
      },
    },
    {
      type: 'choose-number',
      skill: 'time-hour-half',
      params: { h: [1, 12] },
      answer: (p) => p.h as number,
      text: () => 'Which hour is it?',
      visual: (p) => ({ kind: 'clock', hour: p.h as number, minute: 0 }),
      distractors: 'near',
      misconception: (p) => ((p.h as number) % 12) + 1,
    },
  ],
};

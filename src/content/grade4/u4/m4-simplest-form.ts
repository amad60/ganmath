import type { ContentModule } from '../../types';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

/**
 * Di sinilah U3 dan U4 bertemu: menyederhanakan pecahan = membagi atas dan bawah
 * dengan FAKTOR PERSEKUTUAN TERBESARnya (g4-u3-m5). Karena itu modul ini tidak
 * mengajarkan alat baru, hanya menggabungkan dua yang sudah ada.
 *
 * Pecahan yang ditanyakan selalu dibangun dari pasangan s/p yang sudah paling
 * sederhana lalu dikali g — jadi bentuk paling sederhananya tunggal dan pasti.
 */
export const simplestForm: ContentModule = {
  id: 'g4-u4-m4',
  unitId: 'g4-u4',
  grade: 4,
  title: 'Simplest Form',
  icon: '✨',
  prereq: ['g4-u4-m3'],
  skills: ['simplest-form'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number', 'keypad'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: ['simplest', 'form'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟠' },
      action: 'tap-count',
      target: 12,
      hint: 'Make groups of six.',
    },
    {
      stage: 'pictorial',
      prompt: 'Six of twelve parts are shaded.',
      visual: { kind: 'fraction', parts: 12, shaded: 6, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Divide both by three: 2/4.',
      visual: { kind: 'fraction', parts: 4, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '1/2 is the simplest form.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'simplest-form',
      params: { s: [1, 7], p: [2, 9], g: [2, 5] },
      answer: () => 0,
      text: (p) =>
        `Write ${(p.s as number) * (p.g as number)}/${
          (p.p as number) * (p.g as number)
        } in simplest form.`,
      exclude: (p) =>
        (p.s as number) >= (p.p as number) || gcd(p.s as number, p.p as number) !== 1,
      options: (p) => [
        `${p.s}/${p.p}`,
        `${(p.s as number) * (p.g as number)}/${p.p}`,
        `${p.s}/${(p.p as number) * (p.g as number)}`,
        `${p.p}/${p.s}`,
      ],
    },
    {
      type: 'choose-number',
      skill: 'simplest-form',
      params: { s: [1, 7], p: [2, 9], g: [2, 5] },
      answer: (p) => p.s as number,
      text: (p) =>
        `${(p.s as number) * (p.g as number)}/${(p.p as number) * (p.g as number)} = ?/${p.p}`,
      exclude: (p) =>
        (p.s as number) >= (p.p as number) || gcd(p.s as number, p.p as number) !== 1,
      distractors: 'near',
      // Miskonsepsi khas: bawahnya disederhanakan, atasnya dibiarkan.
      misconception: (p) => (p.s as number) * (p.g as number),
    },
    {
      type: 'keypad',
      skill: 'simplest-form',
      params: { s: [1, 7], p: [2, 9], g: [2, 5] },
      answer: (p) => p.p as number,
      text: (p) =>
        `${(p.s as number) * (p.g as number)}/${(p.p as number) * (p.g as number)} = ${p.s}/?`,
      exclude: (p) =>
        (p.s as number) >= (p.p as number) || gcd(p.s as number, p.p as number) !== 1,
    },
  ],
};

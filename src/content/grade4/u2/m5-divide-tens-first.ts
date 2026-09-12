import type { ContentModule } from '../../types';

/**
 * Sisi pembagian dari strategi nilai tempat m2: 69 ÷ 3 dikerjakan sebagai
 * 60 ÷ 3 lalu 9 ÷ 3. Inilah yang nanti ditulis sebagai pembagian panjang di m7 —
 * jadi anak mengerti ARTI tiap langkahnya sebelum melihat bentuk tulisannya.
 */
export const divideTensFirst: ContentModule = {
  id: 'g4-u2-m5',
  unitId: 'g4-u2',
  grade: 4,
  title: 'Divide the Tens First',
  icon: '➗',
  prereq: ['g4-u2-m4'],
  skills: ['divide-tens-first'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🥕' },
      action: 'tap-count',
      target: 12,
      hint: 'Four rows of three.',
    },
    {
      stage: 'pictorial',
      prompt: 'Split 69 into 60 and 9.',
      visual: { kind: 'base10', tens: 6, ones: 9 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide the tens, then the ones.',
      visual: { kind: 'base10', tens: 6, ones: 9 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'divide-tens-first',
      params: { t: [1, 9], o: [1, 9], d: [2, 9] },
      answer: (p) => (p.t as number) * 10 + (p.o as number),
      text: (p) =>
        `${(p.t as number) * 10 * (p.d as number)} ÷ ${p.d} = ${(p.t as number) * 10}. So ${
          ((p.t as number) * 10 + (p.o as number)) * (p.d as number)
        } ÷ ${p.d} = ?`,
      distractors: 'near',
      // Miskonsepsi khas: berhenti setelah puluhan, satuannya tidak dibagi.
      misconception: (p) => (p.t as number) * 10,
    },
    {
      // Tanpa bantuan langkah pertama.
      type: 'keypad',
      skill: 'divide-tens-first',
      params: { t: [1, 9], o: [1, 9], d: [2, 9] },
      answer: (p) => (p.t as number) * 10 + (p.o as number),
      text: (p) =>
        `${((p.t as number) * 10 + (p.o as number)) * (p.d as number)} ÷ ${p.d} = ?`,
    },
    {
      type: 'keypad',
      skill: 'divide-tens-first',
      story: true,
      params: { t: [1, 9], o: [1, 9], d: [2, 9] },
      answer: (p) => (p.t as number) * 10 + (p.o as number),
      text: (p) => `Ana shares ${((p.t as number) * 10 + (p.o as number)) * (p.d as number)} marbles between ${p.d} friends. How many each?`,
    },
    {
      type: 'keypad',
      skill: 'divide-tens-first',
      story: true,
      params: { t: [1, 9], o: [1, 9], d: [2, 9] },
      answer: (p) => (p.t as number) * 10 + (p.o as number),
      text: (p) => `${((p.t as number) * 10 + (p.o as number)) * (p.d as number)} eggs in ${p.d} equal boxes. How many in each box?`,
    },
  ],
};

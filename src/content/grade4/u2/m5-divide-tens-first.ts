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
      visual: { kind: 'counter-objects', count: 12, icon: '🥕', columns: 3 },
      action: 'tap-count',
      target: 12,
      hint: 'Four rows of three.',
    },
    {
      stage: 'pictorial',
      prompt: 'Split 72 into 60 and 12.',
      visual: { kind: 'base10', tens: 7, ones: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide each part, then add them.',
      visual: { kind: 'base10', tens: 7, ones: 2 },
      action: 'watch',
      caption: '60 ÷ 3 = 20, 12 ÷ 3 = 4',
    },
    {
      stage: 'abstract',
      prompt: 'So 72 ÷ 3 = 24.',
      visual: { kind: 'base10', tens: 2, ones: 4 },
      action: 'watch',
      caption: '20 + 4 = 24',
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

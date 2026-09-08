import type { ContentModule } from '../../types';

export const compareMeasures: ContentModule = {
  id: 'g2-u6-m4',
  unitId: 'g2-u6',
  grade: 2,
  title: 'Compare Measures',
  icon: '⚖️',
  prereq: ['g2-u6-m3'],
  skills: ['compare-measure'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-number'],
  visuals: ['bar-model'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap seven blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🟦' },
      action: 'tap-count',
      target: 7,
      hint: 'Same unit, then compare.',
    },
    {
      stage: 'pictorial',
      prompt: 'Same unit before you compare.',
      visual: { kind: 'bars', lengths: [0.7, 0.4], labels: ['A', 'B'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One metre beats fifty centimetres.',
      visual: { kind: 'bars', lengths: [1, 0.5], labels: ['A', 'B'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'compare-symbol',
      skill: 'compare-measure',
      params: { a: [10, 99], b: [10, 99] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `${p.a} cm ? ${p.b} cm`,
      exclude: (p) => Math.abs((p.a as number) - (p.b as number)) > 30,
    },
    {
      type: 'choose-number',
      distractorUnit: 100,
      skill: 'compare-measure',
      params: { m: [1, 5], c: [10, 90] },
      answer: (p) => (p.m as number) * 100,
      text: (p) => `Which is longer: ${p.m} m or ${p.c} cm? Give it in cm.`,
      exclude: (p) => (p.m as number) * 100 <= (p.c as number),
      distractors: 'near',
      misconception: (p) => p.c as number,
    },
  ],
};

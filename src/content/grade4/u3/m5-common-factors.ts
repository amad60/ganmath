import type { ContentModule } from '../../types';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

/**
 * FPB — sengaja hanya PENGENALAN, sesuai batas Grade 4: yang dicari adalah faktor
 * yang dimiliki dua bilangan sekaligus, dengan cara mendaftar faktornya. Faktorisasi
 * prima penuh (pohon faktor, 2 × 2 × 3) baru masuk di grade berikutnya.
 *
 * Karena itu angkanya dijaga kecil: kedua bilangan dibangun dari satu faktor
 * bersama dikali dua pengali yang saling prima, jadi jawabannya selalu tunggal
 * dan selalu terlihat tanpa alat bantu.
 */
export const commonFactors: ContentModule = {
  id: 'g4-u3-m5',
  unitId: 'g4-u3',
  grade: 4,
  title: 'Common Factors',
  icon: '🤝',
  prereq: ['g4-u3-m4'],
  skills: ['common-factors'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['array-grid', 'number-bond', 'counter-objects'],
  vocab: ['common'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟡' },
      action: 'tap-count',
      target: 12,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: '12 is 2 rows of 6.',
      visual: { kind: 'array', rows: 2, cols: 6 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '18 is 3 rows of 6.',
      visual: { kind: 'array', rows: 3, cols: 6 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '6 is the biggest common factor.',
      visual: { kind: 'number-bond', whole: 18, parts: [3, 6] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Kedua pengali saling prima, jadi faktor persekutuan TERBESARnya persis g.
      type: 'choose-number',
      skill: 'common-factors',
      params: { g: [2, 9], x: [2, 5], y: [2, 5] },
      answer: (p) => p.g as number,
      text: (p) =>
        `What is the biggest common factor of ${(p.g as number) * (p.x as number)} and ${
          (p.g as number) * (p.y as number)
        }?`,
      exclude: (p) => p.x === p.y || gcd(p.x as number, p.y as number) !== 1,
      distractors: 'near',
      // Miskonsepsi khas: menyebut bilangan yang lebih kecil, karena dikira
      // bilangan kecil selalu membagi bilangan besar.
      misconception: (p) => (p.g as number) * Math.min(p.x as number, p.y as number),
    },
    {
      // Bentuk yang menunjukkan ARTI faktor persekutuan: satu bilangan yang sama
      // membagi habis kedua-duanya.
      type: 'missing-number',
      skill: 'common-factors',
      params: { g: [2, 9], x: [2, 5], y: [2, 5] },
      answer: (p) => p.g as number,
      text: (p) =>
        `${(p.g as number) * (p.x as number)} ÷ ? = ${p.x} and ${
          (p.g as number) * (p.y as number)
        } ÷ ? = ${p.y}`,
      exclude: (p) => p.x === p.y || gcd(p.x as number, p.y as number) !== 1,
    },
  ],
};

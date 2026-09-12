import type { ContentModule } from '../../types';

/**
 * Nilai dibangun DARI rata-ratanya, bukan sebaliknya.
 *
 * Kalau angkanya diacak lalu dibagi, hasilnya hampir selalu pecahan — dan keypad
 * tidak punya titik desimal (lint `input-width`). Jadi rata-rata `m` dipilih dulu,
 * lalu nilainya disebar simetris di sekitarnya: (m−d), (m+e), (m+d), (m−e).
 * Jumlahnya pasti 4m, jadi rata-ratanya pasti bilangan bulat.
 *
 * `d ≠ e` dijaga karena dua alasan: supaya nilainya tidak kembar, dan supaya
 * TIDAK ADA nilai yang kebetulan sama dengan rata-ratanya. Kalau ada, anak bisa
 * lulus modul ini dengan menunjuk angka tengah — itu median, materi Grade 6,
 * dan kebiasaan itu akan menyesatkannya di sana.
 */
const fourValues = (p: Record<string, number>) => {
  const m = p.m as number;
  const d = p.d as number;
  const e = p.e as number;
  return [m - d, m + e, m + d, m - e];
};

const threeValues = (p: Record<string, number>) => {
  const m = p.m as number;
  const d = p.d as number;
  const e = p.e as number;
  return [m - d, m + e, m + d - e];
};

/**
 * Modul penutup Grade 4. Rata-rata SEDERHANA saja: jumlahkan, lalu bagi rata.
 * Median dan modus sengaja tidak disebut — itu Grade 6.
 *
 * Gagasannya diajarkan sebagai MERATAKAN: tumpukan yang tinggi memberi ke yang
 * pendek sampai semuanya sama tinggi. Anak yang memahaminya begitu tahu kenapa
 * rata-rata selalu jatuh di antara nilai terkecil dan terbesar — dan itu satu-satunya
 * pemeriksaan mandiri yang dia punya. Karena itu pengecoh utamanya adalah jumlah
 * yang belum dibagi: jawaban yang jelas terlalu besar, dan seharusnya dia sadar.
 */
export const findTheMean: ContentModule = {
  id: 'g4-u7-m4',
  unitId: 'g4-u7',
  grade: 4,
  title: 'Find the Mean',
  icon: '⚖️',
  prereq: ['g4-u7-m3'],
  skills: ['simple-mean'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['bar-chart', 'counter-objects'],
  vocab: ['mean', 'data', 'move'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four blocks.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟦' },
      action: 'tap-count',
      target: 4,
      hint: 'Share them into three equal stacks.',
    },
    {
      stage: 'pictorial',
      prompt: 'These stacks are not equal.',
      visual: { kind: 'bars', lengths: [0.9, 0.3, 0.6], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Move blocks to make them equal.',
      visual: { kind: 'bars', lengths: [0.6, 0.6, 0.6], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Add them all, then share equally.',
      visual: { kind: 'bars', lengths: [0.6, 0.6, 0.6], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The mean of 9, 3 and 6 is 6.',
      visual: { kind: 'bars', lengths: [0.9, 0.3, 0.6], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'simple-mean',
      params: { m: [4, 11], d: [1, 4], e: [1, 5] },
      answer: (p) => p.m as number,
      text: (p) => `Find the mean: ${fourValues(p).join(', ')}.`,
      visual: (p) => {
        const v = fourValues(p);
        const top = Math.max(...v);
        return {
          kind: 'bars',
          lengths: v.map((x) => (x / top) * 0.95),
          labels: ['A', 'B', 'C', 'D'],
        };
      },
      exclude: (p) =>
        (p.d as number) === (p.e as number) ||
        (p.m as number) <= (p.d as number) ||
        (p.m as number) <= (p.e as number),
    },
    {
      type: 'choose-number',
      skill: 'simple-mean',
      params: { m: [4, 12], d: [1, 4], e: [1, 4] },
      answer: (p) => p.m as number,
      text: (p) => `Find the mean: ${threeValues(p).join(', ')}.`,
      exclude: (p) =>
        (p.d as number) === (p.e as number) || (p.m as number) - (p.d as number) < 1,
      distractors: 'near',
      // Dijumlahkan tapi lupa dibagi — kekeliruan rata-rata yang paling sering.
      misconception: (p) => 3 * (p.m as number),
    },
    {
      // Arah sebaliknya: total sudah diketahui, tinggal dibagi rata. Ini yang
      // menghubungkan "meratakan" dengan pembagian yang sudah dikuasai di g4-u2.
      type: 'keypad',
      skill: 'simple-mean',
      params: { n: [3, 6], m: [2, 12] },
      answer: (p) => p.m as number,
      text: (p) =>
        `${(p.n as number) * (p.m as number)} votes shared equally by ${p.n}. How many each?`,
    },
    {
      type: 'keypad',
      skill: 'simple-mean',
      story: true,
      params: { m: [4, 11], d: [1, 4], e: [1, 5] },
      answer: (p) => p.m as number,
      text: (p) => `Four boxes have ${fourValues(p).join(', ')} eggs. What is the mean?`,
      exclude: (p) =>
        (p.d as number) === (p.e as number) ||
        (p.m as number) <= (p.d as number) ||
        (p.m as number) <= (p.e as number),
    },
    {
      type: 'keypad',
      skill: 'simple-mean',
      story: true,
      params: { m: [4, 11], d: [1, 4], e: [1, 5] },
      answer: (p) => p.m as number,
      text: (p) => `Ana reads ${fourValues(p).join(', ')} books in four weeks. What is the mean?`,
      exclude: (p) =>
        (p.d as number) === (p.e as number) ||
        (p.m as number) <= (p.d as number) ||
        (p.m as number) <= (p.e as number),
    },
  ],
};

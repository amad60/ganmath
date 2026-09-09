import type { ContentModule } from '../../types';

/**
 * 2 digit × 1 digit DENGAN menyimpan (`exclude` membuang soal yang satuannya tidak
 * pernah melewati sepuluh). Ini target kelancaran Grade 4 — karena itu `fact` —
 * tetapi ia perhitungan, bukan ingatan: ambang 5 detik untuk soal yang memang
 * butuh dua langkah akan memicu Speed Round terus-menerus pada anak yang sudah
 * benar. Ambangnya dilonggarkan di sini, sesuai izin CLAUDE.md §6
 * ("bisa disetel per modul di data konten").
 */
export const twoDigitsTimesOne: ContentModule = {
  id: 'g4-u2-m3',
  unitId: 'g4-u2',
  grade: 4,
  title: 'Two Digits Times One',
  icon: '✖️',
  prereq: ['g4-u2-m2'],
  skills: ['multiply-2x1'],
  kind: 'fact',
  fluencyTracked: true,
  speedTargetMs: 9000,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eighteen dots.',
      visual: { kind: 'counter-objects', count: 18, icon: '🟠' },
      action: 'tap-count',
      target: 18,
      hint: 'Six rows of three.',
    },
    {
      stage: 'pictorial',
      prompt: 'Sixteen times three makes forty eight.',
      visual: { kind: 'base10', tens: 4, ones: 8 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Ones first, then tens. Carry the ten.',
      visual: { kind: 'base10', tens: 4, ones: 8 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'multiply-2x1',
      params: { t: [1, 9], o: [2, 9], b: [2, 9] },
      answer: (p) => ((p.t as number) * 10 + (p.o as number)) * (p.b as number),
      text: (p) => `${(p.t as number) * 10 + (p.o as number)} × ${p.b} = ?`,
      // Hanya soal yang benar-benar menyimpan: itu isi modul ini.
      exclude: (p) => (p.o as number) * (p.b as number) < 10,
      distractors: 'near',
      // Miskonsepsi khas: simpanan dari satuan tidak pernah ditambahkan ke puluhan.
      misconception: (p) =>
        (p.t as number) * 10 * (p.b as number) + (((p.o as number) * (p.b as number)) % 10),
    },
    {
      // Dibalik urutannya supaya bentuk soal tidak ikut dihafal.
      type: 'keypad',
      skill: 'multiply-2x1',
      params: { t: [1, 9], o: [0, 9], b: [2, 9] },
      answer: (p) => ((p.t as number) * 10 + (p.o as number)) * (p.b as number),
      text: (p) => `${p.b} × ${(p.t as number) * 10 + (p.o as number)} = ?`,
    },
  ],
};

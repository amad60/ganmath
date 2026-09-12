import type { ContentModule } from '../../types';

/**
 * Tangga yang sama seperti `m4`, dipindahkan ke massa dan zat cair: g ↔ kg,
 * ml ↔ L. Keduanya seribu, dan itu bukan kebetulan — sistem metrik memang satu
 * aturan yang dipakai berulang, dan justru itulah yang harus anak lihat. Modul ini
 * sengaja mengulang bentuk soal `m4` hampir persis: kalau anak sudah menguasai
 * panjang, ia seharusnya menyelesaikan modul ini nyaris tanpa materi baru. Rasa
 * "oh, sama saja" itu adalah pelajarannya.
 *
 * Massa dan zat cair digabung dalam satu modul (bukan dua) karena tangganya
 * identik. Memisahkannya akan menghasilkan dua modul yang isinya sama dan
 * membuat unit ini terasa dua kali lebih panjang tanpa mengajarkan apa pun.
 *
 * Seperti `m4`, arah membagi menghasilkan jawaban desimal yang **diketik anak** —
 * keypad memunculkan tombol titiknya karena `answerCaps` melihat seluruh ruang
 * jawaban aturan itu, bukan jawaban soal yang sedang tampil.
 */
export const gramsAndMillilitres: ContentModule = {
  id: 'g5-u5-m5',
  unitId: 'g5-u5',
  grade: 5,
  title: 'Grams and Millilitres',
  icon: '🧪',
  prereq: ['g5-u5-m4'],
  skills: ['mass-units', 'liquid-units', 'compare-amount-units'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'compare-symbol'],
  visuals: ['counter-objects', 'bar-model'],
  vocab: ['millilitre', 'millilitres', 'ml', 'litre', 'litres', 'bottle', 'bottles', 'kg'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five bottles.',
      visual: { kind: 'counter-objects', count: 5, icon: '🍶' },
      action: 'tap-count',
      target: 5,
      hint: 'Each bottle holds one litre.',
    },
    {
      stage: 'pictorial',
      prompt: '500 ml is half a litre.',
      visual: { kind: 'bars', lengths: [1, 0.5], labels: ['litre', 'ml'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '1000 grams make one kilogram.',
      visual: { kind: 'bars', lengths: [1, 0.001], labels: ['kg', 'g'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '1000 millilitres make one litre.',
      visual: { kind: 'bars', lengths: [1, 0.001], labels: ['litre', 'ml'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A smaller unit needs a bigger number.',
      visual: { kind: 'bars', lengths: [1, 0.1], labels: ['kg', 'g'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Besar → kecil: mengalikan seribu. Jawaban selalu bulat.
      type: 'keypad',
      skill: 'mass-units',
      params: { n: [1, 99] },
      answer: (p) => (p.n as number) * 1000,
      text: (p) => `${p.n} kg = ? g`,
    },
    {
      // Kecil → besar: membagi seribu, dan jawabannya desimal yang diketik anak.
      type: 'keypad',
      skill: 'mass-units',
      params: { n: [1, 99] },
      answer: (p) => (p.n as number) / 10,
      text: (p) => `${(p.n as number) * 100} g = ? kg`,
    },
    {
      // Tangga yang sama, zat cair. Ditulis terpisah supaya kedua konteks pernah
      // muncul sendiri-sendiri di Mastery Check (syarat cakupan berlaku per aturan).
      type: 'keypad',
      skill: 'liquid-units',
      params: { n: [1, 99] },
      answer: (p) => (p.n as number) / 10,
      text: (p) => `${(p.n as number) * 100} ml = ? L`,
    },
    {
      // Jawaban selalu kelipatan seribu → `distractorUnit` harus ikut seribu,
      // kalau tidak pengecohnya (1999, 2001) mustahil dan bisa dicoret gratis.
      type: 'choose-number',
      skill: 'liquid-units',
      params: { n: [2, 9] },
      answer: (p) => (p.n as number) * 1000,
      text: (p) => `How many ml are in ${p.n} L?`,
      distractorUnit: 1000,
      distractors: 'near',
      // Miskonsepsi: tangga L → ml dikira seratus, bukan seribu.
      misconception: (p) => (p.n as number) * 100,
    },
    {
      // Selisih paling jauh dua ratus gram: harus benar-benar diubah dulu.
      type: 'compare-symbol',
      skill: 'compare-amount-units',
      params: { a: [1, 9], d: [0, 4] },
      answer: (p) => Math.sign(2 - (p.d as number)),
      text: (p) => `${p.a} kg ? ${(p.a as number) * 1000 + ((p.d as number) - 2) * 100} g`,
    },
    {
      type: 'compare-symbol',
      skill: 'compare-amount-units',
      params: { a: [1, 9], d: [0, 4] },
      answer: (p) => Math.sign(2 - (p.d as number)),
      text: (p) => `${p.a} L ? ${(p.a as number) * 1000 + ((p.d as number) - 2) * 100} ml`,
    },
    {
      type: 'keypad',
      skill: 'mass-units',
      story: true,
      params: { n: [1, 99] },
      answer: (p) => (p.n as number) * 1000,
      text: (p) => `A box of apples is ${p.n} kg. How many grams?`,
    },
    {
      type: 'keypad',
      skill: 'mass-units',
      story: true,
      params: { n: [1, 99] },
      answer: (p) => (p.n as number) * 1000,
      text: (p) => `Ana buys ${p.n} kg of apples. How many grams?`,
    },
  ],
};

import type { ContentModule } from '../../types';

/**
 * Gerbang Grade 5. `prereq: []` — tiap kelas harus bisa dimasuki langsung, tanpa
 * menempuh kelas sebelumnya (CLAUDE.md §5).
 *
 * Seluruh unit ini berdiri di atas satu keterampilan: mengubah sebuah pecahan
 * menjadi pecahan senilai BERPENYEBUT YANG DIMINTA. Grade 4 mengajarkan "kali atas
 * dan bawah dengan angka yang sama"; yang baru di sini adalah arah kerjanya
 * dibalik — penyebut tujuannya sudah ditentukan, anak harus menemukan sendiri
 * pengalinya. Tanpa itu, menjumlah 1/2 + 1/6 tidak akan pernah bisa dimulai.
 *
 * Yang diketik anak selalu SATU bilangan bulat (pengali, pembilang baru), karena
 * keypad tidak bisa menerima pecahan; pecahan utuh selalu lewat `choose-text`.
 */
export const makeBottomsMatch: ContentModule = {
  id: 'g5-u1-m1',
  unitId: 'g5-u1',
  grade: 5,
  title: 'Make Bottoms Match',
  icon: '🧲',
  // Kelas 5 harus bisa dimasuki langsung, tanpa menempuh kelas sebelumnya.
  prereq: [],
  skills: ['common-denominator'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-text'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three parts.',
      visual: { kind: 'counter-objects', count: 6, icon: '🍫' },
      action: 'tap-count',
      target: 3,
      hint: 'Three of six parts.',
    },
    {
      stage: 'pictorial',
      prompt: 'One of two parts is shaded.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Cut each part into three.',
      visual: { kind: 'fraction', parts: 6, shaded: 3, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Multiply top and bottom by three.',
      visual: { kind: 'fraction', parts: 6, shaded: 3, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Now both bottoms are 6.',
      visual: { kind: 'fraction', parts: 6, shaded: 1, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Penyebut tujuannya diberikan; anak mencari pembilang barunya.
      type: 'keypad',
      skill: 'common-denominator',
      params: { b: [2, 6], k: [2, 4], a: [1, 5] },
      answer: (p) => (p.a as number) * (p.k as number),
      text: (p) => `${p.a}/${p.b} = ?/${(p.b as number) * (p.k as number)}`,
      exclude: (p) => (p.a as number) >= (p.b as number),
    },
    {
      // Pengalinya sendiri, dilatih terpisah: inilah yang harus ditemukan anak
      // sebelum dia bisa menjumlah pecahan berpenyebut beda.
      type: 'missing-number',
      skill: 'common-denominator',
      params: { b: [2, 6], k: [2, 4] },
      answer: (p) => p.k as number,
      text: (p) => `${p.b} × ? = ${(p.b as number) * (p.k as number)}`,
    },
    {
      type: 'choose-text',
      skill: 'common-denominator',
      params: { b: [2, 6], k: [2, 4], a: [1, 5] },
      answer: () => 0,
      // Pecahannya ikut ditulis di soal: teks yang konstan akan menyusut jadi satu
      // soal saat generator men-dedupe (kunci = tipe + teks + gambar).
      text: (p) => `Which is the same as ${p.a}/${p.b}?`,
      exclude: (p) => (p.a as number) >= (p.b as number),
      visual: (p) => ({
        kind: 'fraction',
        parts: p.b as number,
        shaded: p.a as number,
        shape: 'square',
      }),
      options: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        const k = p.k as number;
        return [
          `${a * k}/${b * k}`,
          `${a}/${b * k}`,
          `${a * k}/${b}`,
          `${a + k}/${b + k}`,
        ];
      },
    },
  ],
};

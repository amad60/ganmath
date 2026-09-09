import type { ContentModule } from '../../types';

/** Tanda minus yang DILIHAT anak: U+2212, sama dengan tombol `−` di keypad. */
const MINUS = '−';

/**
 * Persamaan satu langkah dengan + dan −. Gagasannya satu kalimat:
 * **untuk menemukan n, lakukan kebalikan dari yang dikerjakan pada n.**
 *
 * Anak sudah mengerjakan ini sejak `g1-u2-m8`, hanya belum pernah diberi
 * namanya dan belum pernah diminta menyebut alasannya. Yang baru di sini
 * bukan hitungannya, melainkan **bagaimana n bisa berada di kedua sisi tanda
 * kurang**: `n − 4 = 9` dan `12 − n = 9` terlihat mirip dan diselesaikan dengan
 * dua cara yang berbeda. Dua bentuk itu punya aturannya masing-masing, dan
 * itulah alasan modul ini punya empat aturan, bukan dua.
 *
 * **Jawabannya boleh negatif.** `n + 9 = 4` berjawaban −5, dan itu memang
 * disengaja: persamaan tidak berhenti bekerja hanya karena hasilnya jatuh di
 * kiri nol, dan `g6-u1` baru saja menyiapkan anak untuk itu. Setiap aturan
 * ketik di sini sengaja bisa berjawaban positif maupun negatif, jadi tombol
 * `−` di keypad selalu ada (`answerCaps` menurunkannya per aturan, bukan per
 * soal) dan tidak pernah membocorkan tanda jawaban soal yang sedang tampil.
 * Aturan pilihan gandanya dipagari tetap positif — pengecoh soal pilihan
 * dibangun di sekitar jawaban dan tidak boleh turun di bawah nol.
 *
 * Persamaan dua langkah (`2n + 3 = 11`) dan pertidaksamaan berada di luar
 * lingkup SD dan sengaja tidak diambil.
 */
export const undoPlusAndMinus: ContentModule = {
  id: 'g6-u3-m4',
  unitId: 'g6-u3',
  grade: 6,
  title: 'Undo Plus and Minus',
  icon: '⚖️',
  prereq: ['g6-u3-m3'],
  skills: ['solve-add-subtract'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['missing-number', 'keypad', 'choose-number'],
  visuals: ['counter-objects', 'bar-model', 'number-bond'],
  vocab: ['undoes'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four red dots.',
      visual: { kind: 'counter-objects', count: 11, icon: '🔴' },
      action: 'tap-count',
      target: 4,
      hint: 'Four and seven make eleven.',
    },
    {
      // Batang utuh di atas, bagian yang diketahui di bawahnya. Angkanya ada di
      // label — `Bars` tidak punya sumbu, jadi panjangnya tidak pernah jadi
      // satu-satunya sumber jawaban.
      stage: 'pictorial',
      prompt: 'The whole bar is 11.',
      visual: { kind: 'bars', lengths: [1, 0.36], labels: ['11', '4'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'n + 4 = 11. Find n.',
      visual: { kind: 'number-bond', whole: 11, parts: [4, null], ask: 'part1' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Take 4 from both sides.',
      visual: { kind: 'number-bond', whole: 11, parts: [4, 7] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Minus undoes plus. n is 7.',
      visual: { kind: 'bars', lengths: [1, 0.36, 0.64], labels: ['11', '4', '7'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bentuk pokok. `c < b` sengaja TIDAK dibuang: n + 9 = 4 berjawaban −5,
      // dan soal itulah yang menyambungkan unit ini ke `g6-u1`.
      type: 'missing-number',
      skill: 'solve-add-subtract',
      params: { b: [2, 9], c: [1, 14] },
      answer: (p) => (p.c as number) - (p.b as number),
      text: (p) => `n + ${p.b} = ${p.c}. n = ?`,
    },
    {
      // n dikurangi sesuatu → n lebih besar dari hasilnya. Anak yang mengurangi
      // lagi (kebiasaan dari aturan pertama) akan langsung terlihat salah.
      type: 'keypad',
      skill: 'solve-add-subtract',
      params: { b: [2, 9], c: [2, 12] },
      answer: (p) => (p.b as number) + (p.c as number),
      text: (p) => `n ${MINUS} ${p.b} = ${p.c}. n = ?`,
    },
    {
      // n berada di BELAKANG tanda kurang. Bentuk yang paling sering keliru:
      // terlihat seperti aturan di atas, tapi diselesaikan terbalik.
      //
      // Di sinilah satu-satunya `exclude` bertanda di modul ini. `12 − n = 14`
      // memang sah dan berjawaban −2, tapi ceritanya menuntut "mengurangi
      // bilangan negatif" (`g6-u1-m5`) — dua gagasan baru sekaligus dalam satu
      // soal. Negatif tetap dilatih, tapi lewat aturan pertama yang bentuknya
      // sudah dikenal anak.
      type: 'keypad',
      skill: 'solve-add-subtract',
      params: { a: [2, 14], c: [1, 12] },
      answer: (p) => (p.a as number) - (p.c as number),
      text: (p) => `${p.a} ${MINUS} n = ${p.c}. n = ?`,
      exclude: (p) => (p.c as number) > (p.a as number),
    },
    {
      // Satu aturan pilihan supaya pengecoh miskonsepsi punya tempat.
      // Miskonsepsinya: kedua angka dijumlahkan begitu saja, bukan dikurangi.
      // Jawabannya dijaga positif — pengecoh soal pilihan dipagari ≥0.
      type: 'choose-number',
      skill: 'solve-add-subtract',
      params: { b: [2, 9], c: [3, 18] },
      answer: (p) => (p.c as number) - (p.b as number),
      text: (p) => `What is n? n + ${p.b} = ${p.c}`,
      exclude: (p) => (p.c as number) <= (p.b as number),
      distractors: 'near',
      misconception: (p) => (p.b as number) + (p.c as number),
    },
  ],
};

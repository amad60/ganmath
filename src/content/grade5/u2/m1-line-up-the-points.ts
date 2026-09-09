import type { ContentModule } from '../../types';

/** 34 → "3.4". Kelipatan sepuluh selalu dibuang `exclude`, jadi selalu satu desimal. */
const t = (n: number) => String(n / 10);
/** 47 → "0.47". Kelipatan sepuluh dibuang juga, jadi selalu dua desimal. */
const h = (n: number) => String(n / 100);

/**
 * Gerbang unit desimal Grade 5, dan modul pertama di seluruh app yang meminta anak
 * MENGETIK SENDIRI jawaban desimalnya.
 *
 * Grade 4 (`g4-u5`) terpaksa menyiasati keypad yang belum punya titik: yang diketik
 * selalu "berapa persepuluhan", pecahan dan desimal utuh lewat soal pilihan. Sejak
 * `dae385c` keypad punya tombol `.` dan kapabilitasnya diturunkan per aturan
 * (`answerCaps`), jadi siasat itu tidak lagi diperlukan — dan memang tidak boleh
 * dipakai di sini, karena menuliskan 3.97 ADALAH keterampilan yang diuji.
 *
 * Inti materinya satu kalimat: titik desimal disejajarkan, bukan angkanya dirapatkan
 * ke kanan. Karena itu satu aturan khusus memasangkan persepuluhan dengan
 * perseratusan (3.4 + 0.57) — anak yang merapatkan ke kanan akan menjawab 3.91,
 * dan pilihan itu memang disediakan di aturan `choose-text`.
 *
 * Catatan sadar tentang penilaian: jawaban dibandingkan sebagai NILAI
 * (`sameAnswer`), jadi "3.9" = "3.90" = "3.9000". Modul ini karena itu tidak pernah
 * menguji angka nol di belakang — itu notasi, bukan desimal, dan tidak akan
 * terbedakan oleh mesin.
 */
export const lineUpThePoints: ContentModule = {
  id: 'g5-u2-m1',
  unitId: 'g5-u2',
  grade: 5,
  title: 'Line Up the Points',
  icon: '➕',
  prereq: ['g5-u1-m8'],
  skills: ['add-decimals', 'subtract-decimals'],
  kind: 'fact',
  fluencyTracked: true,
  // Menjumlah desimal adalah PERHITUNGAN dua langkah (sejajarkan, lalu jumlahkan),
  // bukan fakta yang diingat. Ambang 5 detik Grade 5 akan memicu Speed Round terus
  // menerus pada anak yang jawabannya sudah benar — sama seperti `g4-u2-m3`.
  // CLAUDE.md §6 mengizinkan ambang disetel per modul di data konten.
  speedTargetMs: 8000,
  questionTypes: ['keypad', 'missing-number', 'choose-text'],
  visuals: ['counter-objects', 'base10-blocks', 'number-line'],
  vocab: ['point', 'points'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap seven of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟩' },
      action: 'tap-count',
      target: 7,
      hint: 'Ten equal parts make one.',
    },
    {
      // Benang merah `base10-blocks` di Grade 5 = desimal (grades-2-6.md).
      // Balok yang sama dibaca ulang: satu batang adalah satu persepuluhan,
      // satu kubus kecil adalah satu perseratusan.
      stage: 'pictorial',
      prompt: 'Four tenths and three hundredths.',
      visual: { kind: 'base10', tens: 4, ones: 3 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '0.4 plus 0.3. Show the answer.',
      visual: { kind: 'number-line', min: 0, max: 1, value: null, step: 0.1 },
      action: 'drop-on-line',
      target: 0.7,
      hint: 'Seven jumps from zero.',
    },
    {
      stage: 'abstract',
      prompt: 'Line up the points, then add.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.7, marks: [0.7], step: 0.1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Fill empty places with zero.',
      visual: { kind: 'base10', tens: 7, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Tenths + tenths. Jawabannya diketik anak, dan tombol titik memang muncul
      // karena `answerCaps` melihat aturan ini bisa berjawaban 1.7 maupun 4.
      type: 'keypad',
      skill: 'add-decimals',
      params: { a: [11, 89], b: [11, 89] },
      answer: (p) => ((p.a as number) + (p.b as number)) / 10,
      text: (p) => `${t(p.a as number)} + ${t(p.b as number)} = ?`,
      exclude: (p) => (p.a as number) % 10 === 0 || (p.b as number) % 10 === 0,
    },
    {
      // Persepuluhan + perseratusan — inti modul. Panjang angkanya berbeda, jadi
      // hanya anak yang menyejajarkan titiknya yang bisa benar.
      type: 'keypad',
      skill: 'add-decimals',
      params: { a: [11, 89], b: [11, 89] },
      answer: (p) => (p.a as number) / 10 + (p.b as number) / 100,
      text: (p) => `${t(p.a as number)} + ${h(p.b as number)} = ?`,
      exclude: (p) => (p.a as number) % 10 === 0 || (p.b as number) % 10 === 0,
    },
    {
      type: 'keypad',
      skill: 'subtract-decimals',
      params: { a: [21, 99], b: [11, 89] },
      answer: (p) => ((p.a as number) - (p.b as number)) / 10,
      text: (p) => `${t(p.a as number)} − ${t(p.b as number)} = ?`,
      exclude: (p) =>
        (p.a as number) % 10 === 0 ||
        (p.b as number) % 10 === 0 ||
        (p.a as number) <= (p.b as number),
    },
    {
      // Bagian yang hilang ada di TENGAH, bukan di ujung: anak harus mengurangi
      // untuk menemukannya, dan yang diketik tetap sebuah desimal.
      type: 'missing-number',
      skill: 'subtract-decimals',
      params: { a: [11, 89], b: [11, 89] },
      answer: (p) => (p.b as number) / 10,
      text: (p) => `${t(p.a as number)} + ? = ${t((p.a as number) + (p.b as number))}`,
      exclude: (p) => (p.a as number) % 10 === 0 || (p.b as number) % 10 === 0,
    },
    {
      // Pilihan kedua adalah jawaban anak yang merapatkan angkanya ke kanan
      // (34 + 57 dibaca sebagai perseratusan semua), pilihan ketiga titik yang
      // meleset satu tempat, pilihan keempat 0.57 yang dibaca sebagai 5.7.
      type: 'choose-text',
      skill: 'add-decimals',
      params: { a: [11, 89], b: [11, 89] },
      answer: () => 0,
      text: (p) => `Which is ${t(p.a as number)} + ${h(p.b as number)}?`,
      exclude: (p) => (p.a as number) % 10 === 0 || (p.b as number) % 10 === 0,
      options: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        return [
          String((a * 10 + b) / 100),
          String((a + b) / 100),
          String((a * 10 + b) / 1000),
          String((a + b) / 10),
        ];
      },
    },
  ],
};

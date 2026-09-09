/**
 * Nilai jawaban: menulis, membaca, dan membandingkannya.
 *
 * Dipisahkan dari generator karena tiga tempat memakainya dan ketiganya harus
 * memakai aturan yang PERSIS sama: generator (menurunkan kapabilitas keypad),
 * linter (memutuskan sebuah rule bisa diketik atau tidak), dan layar soal
 * (membaca yang diketik anak lalu membandingkannya dengan jawaban benar).
 *
 * Tidak boleh mengimpor React — lihat `architecture.test.ts`.
 */

/** Tanda minus yang DILIHAT anak: U+2212, bukan hyphen keyboard. */
export const MINUS = '−';

/**
 * Presisi tempat float dianggap "angka yang sama".
 *
 * 0.1 + 0.2 menghasilkan 0.30000000000000004. Itu bukan jawaban 17 digit dan
 * bukan pula angka yang berbeda dari 0.3 — itu hanya cara biner menyimpan
 * pecahan desimal. Membulatkan ke 12 angka penting membuang seluruh galat itu
 * tanpa pernah menyentuh angka yang benar-benar ditulis anak (paling panjang
 * 6 digit).
 */
const SIGNIFICANT = 12;

/** Membuang galat float. `normalize(0.1 + 0.2) === 0.3`. */
export function normalizeAnswer(n: number): number {
  if (!Number.isFinite(n)) return n;
  if (n === 0) return 0; // ikut membereskan -0
  return Number(n.toPrecision(SIGNIFICANT));
}

/**
 * Bentuk tertulis sebuah jawaban, seperti yang muncul di kotak jawaban anak.
 * `null` = angka itu tidak bisa dituliskan dengan keypad sama sekali (tak hingga,
 * atau begitu besar/kecil sampai JavaScript sendiri menuliskannya sebagai 1e+21).
 */
export function answerText(n: number): string | null {
  const v = normalizeAnswer(n);
  if (!Number.isFinite(v)) return null;
  const s = String(Math.abs(v));
  if (s.includes('e') || s.includes('E')) return null;
  return v < 0 ? MINUS + s : s;
}

/** Sama seperti `answerText`, tapi selalu memberi sesuatu untuk ditampilkan. */
export function formatAnswer(n: number): string {
  return answerText(n) ?? String(n);
}

/**
 * Banyak DIGIT sebuah jawaban — tanda minus dan titik desimal tidak dihitung,
 * karena keduanya punya tombolnya sendiri dan tidak memakan jatah lebar input.
 * `0.5` = 2 digit, `−7.25` = 3 digit. `null` = tidak bisa diketik.
 */
export function answerDigitCount(n: number): number | null {
  const s = answerText(n);
  if (s == null) return null;
  return s.replace(MINUS, '').replace('.', '').length;
}

/**
 * Apakah yang diketik anak sudah berupa angka utuh?
 *
 * Menolak masukan setengah jadi: `"5."` (titik tanpa angka di belakangnya),
 * `"−"` sendirian, dan string kosong. Tanpa ini anak bisa menekan ✓ pada
 * "5." lalu dinilai salah karena hal yang sama sekali bukan matematika.
 *
 * `".5"` diterima walau keypad tidak pernah menghasilkannya (menekan titik pada
 * input kosong memberi `"0."`): bentuk itu tetap sebuah angka, dan menolaknya
 * berarti menguji notasi — persis hal yang sengaja tidak diuji di sini.
 */
export function isCompleteInput(text: string): boolean {
  return /^−?(\d+(\.\d+)?|\.\d+)$/.test(text);
}

/** Membaca yang diketik anak jadi angka. `null` kalau belum utuh. */
export function parseTypedAnswer(text: string): number | null {
  if (!isCompleteInput(text)) return null;
  const n = Number(text.replace(MINUS, '-'));
  return Number.isFinite(n) ? normalizeAnswer(n) : null;
}

/**
 * Apakah dua jawaban bernilai sama?
 *
 * Dibandingkan sebagai NILAI, bukan string: `0.5`, `0.50`, dan `.5` adalah angka
 * yang sama, dan menyalahkan salah satunya berarti menguji notasi, bukan desimal.
 * Toleransinya relatif supaya tetap benar untuk jawaban besar maupun kecil.
 */
export function sameAnswer(a: number, b: number): boolean {
  const x = normalizeAnswer(a);
  const y = normalizeAnswer(b);
  if (x === y) return true;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  return Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
}

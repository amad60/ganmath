import { buildChoices, generateSet } from './generator';
import { mulberry32 } from './rng';
import type { ModuleDef, Question } from './types';

export type LearnCheck = {
  question: Question;
  choices: number[];
  /** Label untuk `choose-text`; null berarti pilihan ditulis sebagai angka. */
  options: string[] | null;
};

/**
 * Satu pengecekan pemahaman di akhir mode Learn.
 *
 * Diukur dari kontennya sendiri: dari **252 langkah Learn yang menuntut anak melakukan
 * sesuatu, 240 ada di tahap `concrete`** — dan **nol dari 314 langkah `abstract`**
 * meminta apa pun. Setiap modul punya tepat satu langkah aktif, hampir selalu langkah
 * pertama. Sisanya `watch`, dan untuk langkah `watch` tombol Next aktif seketika: anak
 * bisa mengetuk Next empat kali dalam tiga detik dan sampai di akhir materi tanpa
 * pernah menyentuh idenya.
 *
 * Sebabnya bukan penulis konten yang malas — kosakatanya memang tidak ada.
 * `LearnStep.action` cuma punya tap-count / tap-fill / drop-on-line, ketiganya soal
 * menghitung dan menempatkan, semuanya cocok untuk tahap concrete saja.
 *
 * Soalnya TIDAK ditulis ulang 240 kali. Ia dibuat dari aturan soal modul itu sendiri —
 * aturan yang sama yang dipakai kuis, sudah dilint, sudah punya pengecoh berbasis
 * miskonsepsi. Jadi ia tidak pernah bisa melenceng dari materinya, dan tidak ada 240
 * kunci jawaban tulisan tangan yang bisa salah.
 *
 * Ini BUKAN kuis: tidak dinilai, tidak masuk hitungan apa pun, boleh diulang tanpa
 * batas. Ia cuma pintu — anak melewati materi dengan menerapkan idenya sekali.
 */
export function learnCheck(def: ModuleDef, seed: number): LearnCheck | null {
  const rng = mulberry32(seed);
  let questions: Question[];
  try {
    questions = generateSet(def, 8, rng).questions;
  } catch {
    return null;
  }

  const ready = questions.find((q) => (q.choices?.length ?? 0) >= 2);
  if (ready?.choices) {
    return { question: ready, choices: ready.choices, options: ready.options ?? null };
  }

  // 2 dari 240 modul tidak punya satu pun aturan bertipe pilihan (hanya keypad dan
  // missing-number). Pengecohnya dirakit dengan fungsi yang sama yang dipakai kuis,
  // supaya kualitasnya tidak jatuh hanya karena modulnya kebetulan bertipe ketik.
  const first = questions[0];
  if (!first) return null;
  const rule = def.rules.find((r) => r.type === first.type) ?? def.rules[0];
  if (!rule) return null;
  const choices = buildChoices(rule, {}, first.answer, rng);
  if (!choices.includes(first.answer) || choices.length < 2) return null;
  return { question: first, choices, options: null };
}

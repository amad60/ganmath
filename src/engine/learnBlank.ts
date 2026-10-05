import type { LearnStep } from '../content/types';

/**
 * Kalimat lambang di tahap `abstract` yang angka terakhirnya dikosongkan.
 *
 * Evaluasi 2026-10-05 (docs/design/learn-vs-test-2026-10-05.md): 319 langkah
 * abstract Math, NOL yang meminta apa pun. Tahap ini justru tempat anak belajar
 * menulis gambar sebagai lambang — "We write it as 2 × 4 = 8." — tapi ia hanya
 * membacanya 800ms lalu menekan Next. Sekarang angka terakhirnya kosong, dan anak
 * mengisinya dari gambar di atasnya: satu langkah dari gambar ke lambang, persis
 * gerakan yang diuji kuis.
 *
 * Dibangun dari prompt yang SUDAH ada, bukan ditulis ulang di 240 modul: kalimatnya
 * sudah dilint, dan jawabannya ada di kalimat itu sendiri. Bukan kuis — tidak
 * dinilai; salah hanya mengunci pilihan itu.
 */
export type LearnBlank = {
  before: string;
  answer: string;
  after: string;
  /** Tiga pilihan, posisi jawaban tetap per kalimat (bukan selalu di tengah). */
  choices: string[];
  /** Caption yang memuat jawabannya ("6 > 4") disembunyikan sampai isiannya benar. */
  hideCaption: boolean;
};

/**
 * Angka yang berdiri sendiri: bulat atau desimal. Tidak mengambil potongan dari
 * jam (3:30), pecahan (2/4), atau angka berpemisah (1,000) — mengosongkan "30"
 * dari "3:30" atau "4" dari "2/4" menghasilkan lambang yang setengah jadi.
 */
const NUMBER = /(?<![\w.,/:])\d+(?:\.\d+)?(?![\w/:]|[.,]\d)/g;

/** "100.000" di modul uang adalah seratus ribu (format Indonesia), bukan desimal. */
const GROUPED = /^[1-9]\d{0,2}\.\d{3}$/;

function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * Pengecoh yang mencerminkan salah yang NYATA, bukan angka acak:
 *  - bulat kecil (<20): kurang/lebih satu — salah hitung;
 *  - puluhan bulat (50, 260): ±10;
 *  - ratusan bulat (500, 342000): ±100 — salah nilai tempat;
 *  - lainnya (85, 45): kurang 10 (lupa menyimpan/meminjam) dan lebih satu;
 *  - desimal: bergeser 0,1 — 0.75 jadi 0.65 dan 0.85, bukan 0.74 dan 0.76 yang
 *    membuat jawabannya bisa ditebak sebagai "yang paling rapi".
 */
function distractors(answer: string): string[] {
  const dot = answer.indexOf('.');
  if (dot >= 0) {
    const places = answer.length - dot - 1;
    const v = Number(answer);
    const up = (v + 0.1).toFixed(places);
    const down = v - 0.1 >= 0 ? (v - 0.1).toFixed(places) : (v + 0.2).toFixed(places);
    return [up, down];
  }
  const n = Number(answer);
  if (n < 20) return [String(n + 1), String(n >= 1 ? n - 1 : n + 2)];
  if (n % 100 === 0) return [String(n + 100), String(n - 100)];
  if (n % 10 === 0) return [String(n + 10), String(n - 10)];
  return [String(n - 10), String(n + 1)];
}

export function learnBlank(step: LearnStep): LearnBlank | null {
  if (step.stage !== 'abstract' || step.action !== 'watch') return null;
  if (step.visual.kind === 'science-scene' || step.visual.kind === 'evidence-text') return null;
  // Kalimat tanya bukan lambang yang ditulis; angkanya bagian dari pertanyaannya.
  if (step.prompt.trim().endsWith('?')) return null;
  const matches = [...step.prompt.matchAll(NUMBER)];
  const last = matches.at(-1);
  if (!last || last.index == null) return null;
  const answer = last[0];
  if (GROUPED.test(answer)) return null;

  const others = distractors(answer);
  const slot = hash(step.prompt) % 3;
  const choices = [...others];
  choices.splice(slot, 0, answer);

  return {
    hideCaption: step.caption != null && new RegExp(`(^|[^\\d.])${answer.replace('.', '\\.')}($|[^\\d.])`).test(step.caption),
    before: step.prompt.slice(0, last.index),
    answer,
    after: step.prompt.slice(last.index + answer.length),
    choices,
  };
}

import { MAX_ANSWER_DIGITS, type ModuleDef, type Question, type QuestionRule } from './types';
import { answerDigitCount, normalizeAnswer } from './answer';
import { randInt, shuffle, type Rng } from './rng';

/** Semua kombinasi parameter yang sah untuk satu aturan (sudah lewat exclude). */
export function enumerate(rule: QuestionRule): Record<string, number>[] {
  const keys = Object.keys(rule.params);
  let combos: Record<string, number>[] = [{}];
  for (const k of keys) {
    const range = rule.params[k] as [number, number];
    const next: Record<string, number>[] = [];
    for (const c of combos) {
      for (let v = range[0]; v <= range[1]; v++) next.push({ ...c, [k]: v });
    }
    combos = next;
    // Pagar keamanan: aturan dengan ruang parameter raksasa adalah kesalahan penulisan konten.
    if (combos.length > 20_000) throw new Error('QuestionRule terlalu besar; persempit params');
  }
  return rule.exclude ? combos.filter((c) => !rule.exclude!(c)) : combos;
}

/**
 * Kemampuan input yang dibutuhkan sebuah aturan soal.
 *
 * Diturunkan dari SELURUH ruang parameter aturan, bukan dari satu soal — dan itu
 * bukan detail teknis, itu inti keputusannya. Kalau tombol minus hanya muncul saat
 * jawaban soal yang sedang tampil kebetulan negatif, keberadaan tombolnya sudah
 * menjawab soalnya sebelum anak berpikir. Sama persis dengan alasan `digits`
 * diambil per aturan: panjang kotak input tidak boleh membocorkan panjang jawaban.
 *
 * Tidak dipotong ke `MAX_ANSWER_DIGITS` di sini: linter (`input-width`) perlu tahu
 * kalau sebuah aturan benar-benar minta lebih dari yang bisa diketik anak.
 */
export type AnswerCaps = {
  /** Digit terbanyak yang mungkin diketik (tanda dan titik tidak dihitung). */
  digits: number;
  /** Ada jawaban yang bukan bilangan bulat → keypad butuh tombol titik. */
  decimal: boolean;
  /** Ada jawaban di bawah nol → keypad butuh tombol minus. */
  negative: boolean;
  /** Jawaban pertama yang tidak bisa dituliskan sama sekali (∞, NaN, 1e+21). */
  untypable: number | null;
};

export function answerCaps(rule: QuestionRule, combos = enumerate(rule)): AnswerCaps {
  const caps: AnswerCaps = { digits: 1, decimal: false, negative: false, untypable: null };
  for (const p of combos) {
    // Dinormalkan lebih dulu: 0.1 + 0.2 tersimpan sebagai 0.30000000000000004,
    // dan tanpa normalisasi itu terbaca sebagai jawaban 17 digit — aturan yang
    // sempurna wajar jadi ditolak linter karena galat biner, bukan karena isinya.
    const a = normalizeAnswer(rule.answer(p));
    const n = answerDigitCount(a);
    if (n == null) {
      if (caps.untypable == null) caps.untypable = a;
      continue;
    }
    if (n > caps.digits) caps.digits = n;
    if (!Number.isInteger(a)) caps.decimal = true;
    if (a < 0) caps.negative = true;
  }
  return caps;
}

function nearDistractors(answer: number, rng: Rng, unit: number): number[] {
  // Hanya di sekitar jawaban. Versi sebelumnya menyertakan `answer + 10`, yang untuk
  // jawaban kecil menghasilkan pilihan mustahil (18 untuk jawaban 8) — itu memberi
  // anak eliminasi gratis dan membuat soalnya lebih mudah dari yang dimaksud.
  //
  // `unit` menjaga hal yang sama pada arah sebaliknya: untuk soal yang jawabannya
  // selalu kelipatan seratus, jarak 1 menghasilkan pengecoh yang mustahil juga.
  const u = Math.max(1, Math.trunc(unit));
  const cands = [answer + u, answer - u, answer + 2 * u, answer - 2 * u, answer + 3 * u, answer - 3 * u].filter(
    (n) => n >= 0 && n !== answer,
  );
  return shuffle(rng, cands);
}

function digitSwap(answer: number): number | null {
  if (answer < 10 || answer > 99) return null;
  const swapped = (answer % 10) * 10 + Math.floor(answer / 10);
  return swapped === answer ? null : swapped;
}

/**
 * Tiga pengecoh, unik, tidak negatif, dan masuk akal.
 * Pengecoh yang mustahil (jawaban 3 digit untuk soal dalam 10) memberi jawaban gratis —
 * karena itu semuanya diambil dari sekitar jawaban.
 */
export function buildChoices(
  rule: QuestionRule,
  params: Record<string, number>,
  answer: number,
  rng: Rng,
): number[] {
  const out = new Set<number>([answer]);

  const mis = rule.misconception?.(params);
  if (mis != null && mis >= 0 && mis !== answer) out.add(mis);

  if (rule.distractors === 'digit-swap') {
    const d = digitSwap(answer);
    if (d != null) out.add(d);
  }

  const unit = Math.max(1, Math.trunc(rule.distractorUnit ?? 1));
  for (const n of nearDistractors(answer, rng, unit)) {
    if (out.size >= 4) break;
    out.add(n);
  }
  let extra = answer + 4 * unit;
  while (out.size < 4) {
    out.add(extra);
    extra += unit;
  }

  return shuffle(rng, [...out]).slice(0, 4);
}

export type GeneratedSet = { questions: Question[] };

/**
 * Membuat satu set soal untuk sebuah sesi.
 *
 * - Sampling tanpa pengembalian dari kombinasi yang diacak → distribusi merata.
 *   (Uniform acak murni membuat 7+3 muncul 4× sementara 9+1 tidak sama sekali.)
 * - Tidak ada soal identik dalam satu sesi.
 * - `requireCoverage`: setiap questionType modul wajib muncul minimal sekali (syarat
 *   "cakupan" pada aturan penguasaan) — dipakai untuk Mastery Check.
 */
export function generateSet(
  def: ModuleDef,
  count: number,
  rng: Rng,
  opts: { requireCoverage?: boolean } = {},
): GeneratedSet {
  if (def.rules.length === 0) throw new Error(`Modul ${def.id} tidak punya QuestionRule`);

  const pools = def.rules.map((rule) => {
    const combos = enumerate(rule);
    const caps = answerCaps(rule, combos);
    return {
      rule,
      combos: shuffle(rng, combos),
      // Dihitung sekali per aturan: menghitung ulang per soal berarti meng-enumerate
      // ribuan kombinasi untuk setiap soal yang dibuat.
      maxDigits: Math.min(MAX_ANSWER_DIGITS, Math.max(1, caps.digits)),
      allowDecimal: caps.decimal,
      allowNegative: caps.negative,
    };
  });
  const cursor = new Array(pools.length).fill(0) as number[];
  const questions: Question[] = [];
  const seen = new Set<string>();

  const take = (poolIndex: number): Question | null => {
    const pool = pools[poolIndex];
    if (!pool) return null;
    while ((cursor[poolIndex] as number) < pool.combos.length) {
      const params = pool.combos[cursor[poolIndex] as number] as Record<string, number>;
      cursor[poolIndex] = (cursor[poolIndex] as number) + 1;
      const text = pool.rule.text(params);
      const visual = pool.rule.visual?.(params);
      // Dedupe berdasarkan APA YANG DILIHAT ANAK: teks DAN gambarnya. Memakai
      // tipe+parameter membuang soal berbeda yang kebetulan berparameter sama;
      // memakai teks saja membuang soal yang variasinya ada di gambar
      // ("How many sides?" dengan bangun yang berbeda-beda).
      const key = `${pool.rule.type}:${text}:${visual ? JSON.stringify(visual) : ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const answer = normalizeAnswer(pool.rule.answer(params));
      const q: Question = {
        id: `${def.id}:${questions.length}:${key}`,
        type: pool.rule.type,
        skill: pool.rule.skill,
        text,
        answer,
        maxDigits: pool.maxDigits,
        // Kapabilitas keypad ikut ATURAN, bukan soal ini. Lihat `answerCaps`.
        allowDecimal: pool.allowDecimal,
        allowNegative: pool.allowNegative,
        params,
        ...(pool.rule.range ? { range: pool.rule.range } : {}),
        ...(pool.rule.step != null ? { step: pool.rule.step } : {}),
        ...(visual ? { visual } : {}),
      };
      if (pool.rule.type === 'choose-text') {
        const labels = pool.rule.options?.(params) ?? [];
        q.options = labels;
        // Urutan tombol DIACAK. Sebelumnya pilihan tampil persis seperti ditulis,
        // sehingga aturan yang jawabannya selalu indeks yang sama menaruh jawaban
        // benar di tombol yang sama terus — anak bisa lulus tanpa membaca soal.
        q.choices = shuffle(rng, labels.map((_, i) => i));
      } else if (pool.rule.type === 'compare-symbol') {
        // Jawaban dikodekan -1 / 0 / 1 dan dirender sebagai < = > oleh layar soal.
        // Pengecoh "di sekitar jawaban" tidak berlaku di sini — pilihannya memang cuma tiga.
        q.choices = [-1, 0, 1];
      } else if (pool.rule.type === 'choose-number') {
        q.choices = buildChoices(pool.rule, params, answer, rng);
      }
      return q;
    }
    return null;
  };

  // 1. Cakupan dulu: satu soal dari setiap aturan (= setiap questionType modul).
  if (opts.requireCoverage) {
    for (let i = 0; i < pools.length && questions.length < count; i++) {
      const q = take(i);
      if (q) questions.push(q);
    }
  }

  // 2. Sisanya diambil bergiliran antar aturan supaya proporsinya seimbang.
  let guard = 0;
  while (questions.length < count && guard++ < count * 50) {
    const i = randInt(rng, 0, pools.length - 1);
    const q = take(i);
    if (q) questions.push(q);
    else if (cursor.every((c, idx) => c >= (pools[idx] as { combos: unknown[] }).combos.length)) {
      break; // seluruh ruang soal habis — modul terlalu kecil untuk `count`
    }
  }

  return { questions };
}

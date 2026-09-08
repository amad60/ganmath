import type { ModuleDef, Question, QuestionRule } from './types';
import { randInt, shuffle, type Rng } from './rng';

/** Semua kombinasi parameter yang sah untuk satu aturan (sudah lewat exclude). */
function enumerate(rule: QuestionRule): Record<string, number>[] {
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

function nearDistractors(answer: number, rng: Rng): number[] {
  const cands = [answer + 1, answer - 1, answer + 2, answer - 2, answer + 10].filter(
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

  for (const n of nearDistractors(answer, rng)) {
    if (out.size >= 4) break;
    out.add(n);
  }
  let extra = answer + 3;
  while (out.size < 4) out.add(extra++);

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

  const pools = def.rules.map((rule) => ({ rule, combos: shuffle(rng, enumerate(rule)) }));
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
      // Dedupe berdasarkan APA YANG DILIHAT ANAK, bukan tipe+parameter. Dua aturan
      // bisa memakai parameter yang sama untuk soal yang berbeda ("How many sides?"
      // vs "How many corners?") — versi sebelumnya membuang yang kedua.
      const key = `${pool.rule.type}:${text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const answer = pool.rule.answer(params);
      const q: Question = {
        id: `${def.id}:${questions.length}:${key}`,
        type: pool.rule.type,
        skill: pool.rule.skill,
        text,
        answer,
        params,
        ...(pool.rule.range ? { range: pool.rule.range } : {}),
      };
      if (pool.rule.type === 'choose-text') {
        const labels = pool.rule.options?.(params) ?? [];
        q.options = labels;
        q.choices = labels.map((_, i) => i);
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

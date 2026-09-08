import { generateSet } from './generator';
import { mulberry32 } from './rng';
import type { ModuleDef, Question, QuestionResult, SessionKind, SessionResult } from './types';

export type SessionLimits = { min: number; max: number; minSeconds: number };

/** Aturan user: satu sesi minimal 5 menit. Review sengaja pendek (5 soal). */
export const SESSION_LIMITS: Record<SessionKind, SessionLimits> = {
  practice: { min: 8, max: 12, minSeconds: 300 },
  quiz: { min: 8, max: 12, minSeconds: 300 },
  review: { min: 5, max: 5, minSeconds: 0 },
  master: { min: 10, max: 10, minSeconds: 0 },
  speed: { min: 8, max: 8, minSeconds: 0 },
  testout: { min: 10, max: 10, minSeconds: 0 },
};

/** Median thinkMs di bawah ini + semua benar = anak sudah jelas bisa; jangan dipanjang-panjangkan. */
export const FAST_ENOUGH_MS = 4_000;

export type PendingQuestion = { question: Question; retried: boolean };

export type SessionState = {
  sessionId: string;
  moduleId: string;
  kind: SessionKind;
  seed: number;
  startedAtMs: number;
  pending: PendingQuestion[];
  results: QuestionResult[];
  /** Soal salah menunggu dimunculkan lagi setelah ≥2 soal lain. */
  requeue: { question: Question; readyAfter: number }[];
};

export function createSession(
  def: ModuleDef,
  kind: SessionKind,
  seed: number,
  nowMs: number,
): SessionState {
  const limits = SESSION_LIMITS[kind];
  const { questions } = generateSet(def, limits.max, mulberry32(seed), {
    requireCoverage: kind === 'quiz' || kind === 'master' || kind === 'testout',
  });
  return {
    sessionId: `${def.id}-${kind}-${seed}`,
    moduleId: def.id,
    kind,
    seed,
    startedAtMs: nowMs,
    pending: questions.map((question) => ({ question, retried: false })),
    results: [],
    requeue: [],
  };
}

export function currentQuestion(state: SessionState): Question | null {
  return state.pending[0]?.question ?? null;
}

export type AnswerInput = {
  correct: boolean;
  thinkMs: number;
  totalMs: number;
  hintUsed: boolean;
  nowMs: number;
};

export function submitAnswer(state: SessionState, input: AnswerInput): SessionState {
  const head = state.pending[0];
  if (!head) return state;

  const result: QuestionResult = {
    questionId: head.question.id,
    type: head.question.type,
    skill: head.question.skill,
    correct: input.correct,
    thinkMs: input.thinkMs,
    totalMs: input.totalMs,
    retried: head.retried,
    hintUsed: input.hintUsed,
  };

  const answered = state.results.length + 1;
  const requeue = [...state.requeue];
  // Soal yang salah muncul lagi di sesi yang sama, tapi tidak langsung —
  // beri jarak ≥2 soal supaya anak benar-benar mengingat, bukan menyalin.
  if (!input.correct && !head.retried && state.kind !== 'master') {
    requeue.push({ question: head.question, readyAfter: answered + 2 });
  }

  let pending = state.pending.slice(1);
  const ready = requeue.filter((r) => r.readyAfter <= answered);
  if (ready.length) {
    pending = [...pending, ...ready.map((r) => ({ question: r.question, retried: true }))];
  }

  return {
    ...state,
    pending,
    results: [...state.results, result],
    requeue: requeue.filter((r) => r.readyAfter > answered),
  };
}

function medianThink(results: QuestionResult[]): number {
  const values = results.filter((r) => !r.retried).map((r) => r.thinkMs).sort((a, b) => a - b);
  if (values.length === 0) return Infinity;
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? (values[mid] as number) : (((values[mid - 1] as number) + (values[mid] as number)) / 2);
}

/**
 * Kapan sesi berhenti. Tiga aturan, diperiksa berurutan:
 *  1. batas atas soal tercapai — sesi tidak pernah berlarut-larut;
 *  2. sudah cukup soal DAN semuanya benar DAN cepat → berhenti lebih awal.
 *     Ini yang memenuhi janji "modul awal harus bisa cepat selesai" (CLAUDE.md §7);
 *  3. sudah cukup soal DAN sudah 5 menit.
 * Sesi tidak pernah berhenti di tengah soal — pemeriksaan hanya terjadi setelah menjawab.
 */
export function isFinished(state: SessionState, nowMs: number): boolean {
  const limits = SESSION_LIMITS[state.kind];
  const answered = state.results.length;
  if (state.pending.length === 0) return true;
  if (answered >= limits.max) return true;
  if (answered < limits.min) return false;

  const allCorrect = state.results.every((r) => r.correct);
  if (allCorrect && medianThink(state.results) <= FAST_ENOUGH_MS) return true;

  return nowMs - state.startedAtMs >= limits.minSeconds * 1000;
}

/**
 * Berapa soal yang sudah dikerjakan dan berapa targetnya. Target dipakai untuk
 * memberi tahu anak "sisa berapa lagi" — pertanyaan pertama anak dalam sesi apa pun.
 */
export function progressOf(state: SessionState): { done: number; total: number } {
  const limits = SESSION_LIMITS[state.kind];
  const done = state.results.length;
  const available = done + state.pending.length;
  return { done, total: Math.min(limits.max, Math.max(limits.min, available)) };
}

export function toSessionResult(state: SessionState, date: string): SessionResult {
  return {
    sessionId: state.sessionId,
    moduleId: state.moduleId,
    kind: state.kind,
    date,
    questions: state.results,
  };
}

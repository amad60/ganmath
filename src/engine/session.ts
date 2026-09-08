import { generateSet } from './generator';
import { mulberry32 } from './rng';
import type { ModuleDef, Question, QuestionResult, SessionKind, SessionResult } from './types';

export type SessionLimits = { length: number };

/**
 * Panjang sesi TETAP dan diketahui sejak awal.
 *
 * Versi sebelumnya memakai rentang (8–12 soal) yang bisa memanjang sampai 5 menit,
 * sehingga bar kemajuan tumbuh saat dikerjakan: anak melihat 9/9 lalu berubah jadi
 * 10/10, 11/11 — garis finis yang terus mundur. Itu lebih buruk daripada tidak ada
 * indikator sama sekali.
 *
 * "Sesi minimal 5 menit" dari user dipahami ulang sebagai satu DUDUKAN belajar
 * (materi + latihan + kuis), bukan tiap kuis dipanjangkan sampai 5 menit.
 */
export const SESSION_LIMITS: Record<SessionKind, SessionLimits> = {
  practice: { length: 8 },
  quiz: { length: 10 },
  review: { length: 5 },
  master: { length: 10 },
  speed: { length: 8 },
  testout: { length: 10 },
};

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
  const { questions } = generateSet(def, limits.length, mulberry32(seed), {
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

/**
 * Sesi berhenti saat jumlah soalnya habis — titik. Soal ulangan (jawaban salah yang
 * dimunculkan lagi) menambah antrean, jadi anak tetap mengulang yang belum bisa,
 * tapi hitungan yang DILIHAT anak tidak pernah berubah.
 */
export function isFinished(state: SessionState, nowMs: number): boolean {
  void nowMs;
  return state.pending.length === 0;
}

/**
 * Berapa soal yang sudah dikerjakan dan berapa targetnya. Target dipakai untuk
 * memberi tahu anak "sisa berapa lagi" — pertanyaan pertama anak dalam sesi apa pun.
 */
/**
 * Kemajuan sesi. `total` TETAP sejak soal pertama: itu janji yang dilihat anak,
 * dan janji itu tidak boleh berubah di tengah jalan.
 */
export function progressOf(state: SessionState): { done: number; total: number } {
  return { done: state.results.length, total: SESSION_LIMITS[state.kind].length };
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

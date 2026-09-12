import { generateSet } from './generator';
import { mulberry32 } from './rng';
import type { ModuleDef, Question, QuestionResult, SessionKind, SessionResult } from './types';

export type SessionLimits = {
  length: number;
  /**
   * Berapa soal cerita yang DIJAMIN ada di sesi ini — dan sekaligus berapa soal
   * TAMBAHAN yang dipasang di atas `length`. Lihat `lengthFor`.
   */
  story?: number;
};

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
  // 8 soal hitung + 4 soal cerita, tapi hanya di modul yang PUNYA soal cerita.
  practice: { length: 8, story: 4 },
  quiz: { length: 10 },
  review: { length: 5 },
  // Speed Round sengaja tanpa cerita: yang diukur di sini kecepatan mengingat,
  // dan waktu membaca kalimat akan tercatat sebagai waktu berpikir. Menambahkan
  // soal cerita ke sini bukan menambah penerapan, tapi merusak alat ukurnya.
  master: { length: 10 },
  speed: { length: 8 },
  testout: { length: 10 },
};

/**
 * Panjang sesi untuk SATU modul — tetap dan diketahui sejak soal pertama, tapi
 * tidak sama untuk semua modul.
 *
 * Latihan jadi 12 soal hanya di modul yang benar-benar punya aturan bercerita;
 * modul yang belum digarap tetap 8 persis seperti sebelumnya. Alternatifnya —
 * menaikkan semua modul jadi 12 sekaligus — akan memanjangkan latihan 50% di
 * ratusan modul demi soal cerita yang belum ada isinya.
 *
 * Prinsip "panjangnya PASTI" tetap utuh: yang dijanjikan adalah garis finis tidak
 * bergerak SELAMA sesi berjalan, dan anak melihat "1 / 12" sejak soal pertama.
 */
export function lengthFor(def: ModuleDef, kind: SessionKind): number {
  const limits = SESSION_LIMITS[kind];
  const hasStory = def.rules.some((r) => r.story);
  return hasStory && limits.story ? limits.length + limits.story : limits.length;
}

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
  /**
   * Garis finis sesi ini, dipatok saat sesi dibuat.
   *
   * Disimpan DI SESI, bukan dibaca ulang dari `SESSION_LIMITS`, karena panjangnya
   * sekarang tergantung modul (latihan 12 di modul bersoal cerita, 8 di modul lain).
   * Menghitungnya dari `pending.length + results.length` juga tidak bisa: soal yang
   * salah dimasukkan lagi ke antrean, jadi totalnya akan tumbuh saat anak salah —
   * persis bug "garis finis mundur" yang dulu membuat panjang sesi dipatok.
   */
  total: number;
};

export function createSession(
  def: ModuleDef,
  kind: SessionKind,
  seed: number,
  nowMs: number,
): SessionState {
  const limits = SESSION_LIMITS[kind];
  const { questions } = generateSet(def, lengthFor(def, kind), mulberry32(seed), {
    requireCoverage: kind === 'quiz' || kind === 'master' || kind === 'testout',
    ...(limits.story ? { story: limits.story } : {}),
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
    // Dipatok dari soal yang BENAR-BENAR jadi, bukan dari angka yang diminta:
    // modul kecil bisa kehabisan ruang soal, dan menjanjikan 12 lalu berhenti di 9
    // lebih buruk daripada menjanjikan 9.
    total: questions.length,
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
  // `?? SESSION_LIMITS[...]`: sesi yang tersimpan SEBELUM field ini ada akan
  // dipulihkan tanpa `total` — anak yang HP-nya terkunci di tengah kuis tidak
  // boleh kehilangan sesinya hanya karena app-nya diperbarui.
  return { done: state.results.length, total: state.total ?? SESSION_LIMITS[state.kind].length };
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

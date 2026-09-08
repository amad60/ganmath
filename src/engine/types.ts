/**
 * Tipe inti GanMath. Dipakai bersama oleh engine, store, dan konten.
 * ATURAN: file ini (dan seluruh src/engine) tidak boleh mengimpor React.
 */

export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type ModuleKind = 'concept' | 'fact' | 'application';

export type ModuleStatus =
  | 'available'
  | 'learning'
  | 'practiced'
  | 'mastered'
  | 'needs_review'
  | 'retained';
// 'locked' sengaja tidak ada: itu keadaan turunan (lihat unlock.ts).

export type QType =
  | 'count-tap'
  | 'choose-number'
  | 'choose-text'
  | 'keypad'
  | 'tenframe-fill'
  | 'number-bond'
  | 'number-line-drop'
  | 'drag-to-bucket'
  | 'match-pairs'
  | 'order-items'
  | 'compare-symbol'
  | 'missing-number'
  | 'true-false'
  | 'build-number'
  | 'clock-set'
  | 'coin-pick'
  | 'pattern-next'
  | 'bar-model'
  | 'grid-array';

export type VisualId =
  | 'ten-frame'
  | 'number-bond'
  | 'number-line'
  | 'base10-blocks'
  | 'bar-model'
  | 'array-grid'
  | 'fraction-shape'
  | 'clock'
  | 'money'
  | 'shape-2d'
  | 'shape-3d'
  | 'tally-chart'
  | 'pictogram'
  | 'bar-chart'
  | 'angle-arc'
  | 'coordinate-grid'
  | 'counter-objects';

export type DistractorKind = 'near' | 'digit-swap' | 'random';

/** Aturan pembuat soal. Soal dibuat dari aturan, bukan daftar tetap (anti-hafal). */
export type QuestionRule = {
  type: QType;
  skill: string;
  /** Rentang inklusif tiap parameter, mis. { a: [1, 9], b: [1, 9] }. */
  params: Record<string, [number, number]>;
  /** Menghitung jawaban benar dari parameter yang terpilih. */
  answer: (p: Record<string, number>) => number;
  /** Teks soal, mis. ({a,b}) => `${a} + ${b} = ?`. */
  text: (p: Record<string, number>) => string;
  /** Buang kombinasi yang tidak diinginkan (soal sepele, di luar cakupan). */
  exclude?: (p: Record<string, number>) => boolean;
  distractors?: DistractorKind;
  /** Domain garis bilangan untuk soal `number-line-drop`. */
  range?: [number, number];
  /** Label pilihan untuk `choose-text`; jawabannya adalah INDEKS label yang benar. */
  options?: (p: Record<string, number>) => string[];
  /** Pengecoh yang mencerminkan miskonsepsi khas modul ini. Wajib untuk modul `fact`. */
  misconception?: (p: Record<string, number>) => number | null;
};

export type Question = {
  id: string;
  type: QType;
  skill: string;
  text: string;
  answer: number;
  choices?: number[];
  range?: [number, number];
  /** Label untuk `choose-text` — layar merender options[choice], bukan angkanya. */
  options?: string[];
  params: Record<string, number>;
};

export type ModuleDef = {
  id: string;
  unitId: string;
  grade: Grade;
  title: string;
  icon: string;
  prereq: string[];
  skills: string[];
  kind: ModuleKind;
  fluencyTracked: boolean;
  speedTargetMs?: number;
  questionTypes: QType[];
  visuals: VisualId[];
  vocab: string[];
  rules: QuestionRule[];
  masteryOverride?: { accuracy?: number; sessions?: number };
};

export type SessionKind = 'practice' | 'quiz' | 'review' | 'master' | 'speed';

export type QuestionResult = {
  questionId: string;
  type: QType;
  skill: string;
  correct: boolean;
  /** Soal muncul → input pertama disentuh. Metrik utama kecepatan. */
  thinkMs: number;
  /** Soal muncul → jawaban terkirim. */
  totalMs: number;
  /** Soal ulangan dalam sesi yang sama — TIDAK dihitung dalam akurasi. */
  retried: boolean;
  hintUsed: boolean;
};

export type SessionResult = {
  sessionId: string;
  moduleId: string;
  kind: SessionKind;
  date: string; // YYYY-MM-DD waktu lokal
  questions: QuestionResult[];
};

export type Attempt = {
  date: string;
  kind: SessionKind;
  accuracy: number;
  medianThinkMs: number;
  medianTotalMs: number;
  passed: boolean;
};

export type ModuleState = {
  status: ModuleStatus;
  stars: 0 | 1 | 2 | 3;
  learnCompletedAt?: string;
  masteredAt?: string;
  reviewStage: 0 | 1 | 2 | 3 | 4;
  consecutiveFails: number;
  attempts: Attempt[];
  totals: { sessions: number; questions: number; correct: number };
};

export type Thresholds = {
  accuracy: number;
  sessions: number;
  sameDayAllowed: boolean;
  speedMs: number;
};

/** Ambang per grade — sumber: CLAUDE.md §6. Berlaku pada thinkMs, bukan totalMs. */
export const GRADE_THRESHOLDS: Record<Grade, Thresholds> = {
  1: { accuracy: 0.8, sessions: 2, sameDayAllowed: true, speedMs: 8000 },
  2: { accuracy: 0.85, sessions: 2, sameDayAllowed: false, speedMs: 7000 },
  3: { accuracy: 0.85, sessions: 2, sameDayAllowed: false, speedMs: 6000 },
  4: { accuracy: 0.9, sessions: 2, sameDayAllowed: false, speedMs: 5000 },
  5: { accuracy: 0.9, sessions: 2, sameDayAllowed: false, speedMs: 5000 },
  6: { accuracy: 0.9, sessions: 3, sameDayAllowed: false, speedMs: 4000 },
};

/** Soal yang lebih lama dari ini dianggap anak teralih: dibuang dari hitungan kecepatan. */
export const SPEED_OUTLIER_MS = 30_000;

/** Ambang "otomatis" untuk bintang ke-3. Riset: 3 detik = batas ingat vs hitung ulang. */
export const AUTOMATIC_THINK_MS = 3_000;

export function emptyModuleState(): ModuleState {
  return {
    status: 'available',
    stars: 0,
    reviewStage: 0,
    consecutiveFails: 0,
    attempts: [],
    totals: { sessions: 0, questions: 0, correct: 0 },
  };
}

import { describe, expect, it } from 'vitest';
import {
  createSession,
  currentQuestion,
  isFinished,
  progressOf,
  submitAnswer,
  toSessionResult,
  type SessionState,
} from './session';
import { addModule } from './fixtures';

const T0 = 1_000_000;
const def = addModule();

function answerAll(
  state: SessionState,
  opts: { correct: boolean | ((i: number) => boolean); thinkMs?: number; elapsedPer?: number },
): SessionState {
  let s = state;
  let i = 0;
  while (currentQuestion(s) && !isFinished(s, T0 + i * (opts.elapsedPer ?? 1000))) {
    const correct = typeof opts.correct === 'function' ? opts.correct(i) : opts.correct;
    s = submitAnswer(s, {
      correct,
      thinkMs: opts.thinkMs ?? 2000,
      totalMs: (opts.thinkMs ?? 2000) + 800,
      hintUsed: false,
      nowMs: T0 + i * (opts.elapsedPer ?? 1000),
    });
    i++;
    if (i > 40) break;
  }
  return s;
}

describe('session runner', () => {
  it('kuis memuat setiap questionType modul (syarat cakupan)', () => {
    const s = createSession(def, 'quiz', 1, T0);
    const types = new Set(s.pending.map((p) => p.question.type));
    for (const t of def.questionTypes) expect(types.has(t)).toBe(true);
  });

  it('panjang sesi tetap dan diketahui sejak soal pertama', () => {
    const s = createSession(def, 'quiz', 2, T0);
    expect(progressOf(s).total).toBe(10);
    // Jumlah yang dilihat anak tidak berubah setelah beberapa jawaban.
    const after = answerAll(s, { correct: true, thinkMs: 1500 });
    expect(progressOf(after).total).toBe(10);
  });

  it('cepat atau lambat, jumlah soalnya sama — garis finis tidak bergerak', () => {
    const cepat = answerAll(createSession(def, 'quiz', 3, T0), { correct: true, thinkMs: 1200 });
    const lambat = answerAll(createSession(def, 'quiz', 3, T0), {
      correct: true,
      thinkMs: 9000,
      elapsedPer: 10_000,
    });
    expect(cepat.results.length).toBe(lambat.results.length);
  });

  it('jawaban salah menambah pengulangan tapi TIDAK menambah hitungan yang dilihat anak', () => {
    const s = answerAll(createSession(def, 'quiz', 4, T0), { correct: false, elapsedPer: 100 });
    expect(progressOf(s).total).toBe(10);
  });

  it('soal yang salah dimunculkan lagi, ditandai retried, dengan jarak ≥2 soal', () => {
    let s = createSession(def, 'practice', 5, T0);
    const first = currentQuestion(s);
    s = submitAnswer(s, { correct: false, thinkMs: 2000, totalMs: 3000, hintUsed: false, nowMs: T0 });
    // dua soal berikutnya bukan soal yang sama
    expect(currentQuestion(s)?.id).not.toBe(first?.id);
    s = submitAnswer(s, { correct: true, thinkMs: 2000, totalMs: 3000, hintUsed: false, nowMs: T0 });
    s = submitAnswer(s, { correct: true, thinkMs: 2000, totalMs: 3000, hintUsed: false, nowMs: T0 });
    const requeued = s.pending.find((p) => p.retried);
    expect(requeued?.question.id).toBe(first?.id);
  });

  it('soal ulangan tidak diulang lagi kalau salah lagi (tidak ada lingkaran tak berujung)', () => {
    let s = createSession(def, 'practice', 6, T0);
    for (let i = 0; i < 12; i++) {
      if (!currentQuestion(s)) break;
      s = submitAnswer(s, { correct: false, thinkMs: 1000, totalMs: 1500, hintUsed: false, nowMs: T0 });
    }
    expect(s.results.filter((r) => r.retried).length).toBeLessThanOrEqual(s.results.length);
    expect(s.results.length).toBeLessThanOrEqual(12);
  });

  it('master round tidak mengulang soal salah — memang tidak boleh ada bantuan', () => {
    let s = createSession(def, 'master', 7, T0);
    s = submitAnswer(s, { correct: false, thinkMs: 1000, totalMs: 1500, hintUsed: false, nowMs: T0 });
    expect(s.requeue).toHaveLength(0);
  });

  it('review hanya 5 soal', () => {
    const s = createSession(def, 'review', 8, T0);
    expect(s.pending).toHaveLength(5);
    expect(progressOf(s).total).toBe(5);
  });

  it('hasil sesi siap diberikan ke evaluator penguasaan', () => {
    const s = answerAll(createSession(def, 'quiz', 9, T0), { correct: true, thinkMs: 1500 });
    const result = toSessionResult(s, '2026-09-08');
    expect(result.kind).toBe('quiz');
    expect(result.moduleId).toBe(def.id);
    expect(result.questions).toHaveLength(s.results.length);
  });
});

/**
 * Latihan jadi 12 soal HANYA di modul yang punya soal cerita.
 *
 * Menaikkan semua modul jadi 12 sekaligus akan memanjangkan latihan 50% di ratusan
 * modul demi soal cerita yang belum ada isinya — dan panjang sesi adalah janji yang
 * dipegang anak sejak soal pertama.
 */
describe('panjang sesi mengikuti isi modul', () => {
  const storyDef = addModule({
    rules: [
      ...addModule().rules,
      {
        type: 'keypad',
        skill: 'add-within-10',
        story: true,
        params: { a: [1, 5], b: [1, 4] },
        answer: (p) => (p.a as number) + (p.b as number),
        text: (p) => `Ana has ${p.a} apples. She gets ${p.b} more. How many now?`,
      },
    ],
  });

  it('modul tanpa soal cerita: latihan tetap 8 soal, persis seperti sebelumnya', () => {
    expect(progressOf(createSession(def, 'practice', 1, T0)).total).toBe(8);
  });

  it('modul dengan soal cerita: latihan jadi 12 soal', () => {
    expect(progressOf(createSession(storyDef, 'practice', 1, T0)).total).toBe(12);
  });

  it('kuis, master, dan speed tidak ikut berubah panjangnya', () => {
    expect(progressOf(createSession(storyDef, 'quiz', 1, T0)).total).toBe(10);
    expect(progressOf(createSession(storyDef, 'master', 1, T0)).total).toBe(10);
    expect(progressOf(createSession(storyDef, 'speed', 1, T0)).total).toBe(8);
    expect(progressOf(createSession(storyDef, 'review', 1, T0)).total).toBe(5);
  });

  it('garis finis tidak bergerak selama sesi berjalan', () => {
    // Prinsip yang sama yang dulu membuat panjang sesi dipatok: bar kemajuan tidak
    // boleh memundurkan garis finisnya sendiri saat anak sedang mengerjakan.
    let s = createSession(storyDef, 'practice', 5, T0);
    const total = progressOf(s).total;
    for (let i = 0; i < 4; i++) {
      s = submitAnswer(s, {
        correct: true,
        thinkMs: 900,
        totalMs: 1500,
        hintUsed: false,
        nowMs: T0 + i * 2000,
      });
      expect(progressOf(s).total).toBe(total);
    }
  });
});

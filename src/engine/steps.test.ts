import { describe, expect, it } from 'vitest';
import { nextStepFor } from './steps';
import { evaluate } from './mastery';
import { addModule, session, state } from './fixtures';
import { emptyModuleState, type ModuleState } from './types';

const def = addModule();

describe('langkah berikutnya', () => {
  it('modul baru dimulai dari materi', () => {
    expect(nextStepFor(def, emptyModuleState())).toBe('learn');
  });

  it('setelah materi selesai, anak berlatih', () => {
    expect(nextStepFor(def, state({ learnCompletedAt: '2026-09-08' }))).toBe('practice');
  });

  it('setelah berlatih, anak diuji — INI yang dulu tidak pernah terjadi', () => {
    const s = evaluate(def, state({ learnCompletedAt: '2026-09-08' }), session({ kind: 'practice' })).next;
    expect(nextStepFor(def, s)).toBe('quiz');
  });

  it('gagal kuis mengembalikan ke latihan, bukan mengulang kuis', () => {
    let s = state({ learnCompletedAt: '2026-09-08' });
    s = evaluate(def, s, session({ kind: 'practice' })).next;
    s = evaluate(def, s, session({ kind: 'quiz', correct: 3 })).next;
    expect(nextStepFor(def, s)).toBe('practice');
  });

  it('gagal tiga kali mengembalikan ke MATERI, bukan latihan', () => {
    let s = state({ learnCompletedAt: '2026-09-08' });
    for (let i = 0; i < 3; i++) s = evaluate(def, s, session({ kind: 'quiz', correct: 3 })).next;
    expect(nextStepFor(def, s)).toBe('learn');
  });

  it('paham tapi lambat diarahkan ke Speed Round', () => {
    expect(nextStepFor(def, state({ status: 'practiced' }))).toBe('speed');
  });

  it('modul yang dikuasai tidak menuntut apa pun', () => {
    expect(nextStepFor(def, state({ status: 'mastered', masteredAt: '2026-09-08' }))).toBe('done');
  });

  it('modul yang dikuasai memunculkan review saat jatuh tempo', () => {
    const s = state({ status: 'mastered', masteredAt: '2026-09-01', reviewStage: 1 });
    expect(nextStepFor(def, s, '2026-09-20')).toBe('review');
  });
});

describe('modul benar-benar bisa dituntaskan lewat langkah yang diberikan app', () => {
  it('mengikuti nextStepFor terus-menerus berujung pada mastered', () => {
    let s: ModuleState = emptyModuleState();
    const trail: string[] = [];

    for (let i = 0; i < 12; i++) {
      const step = nextStepFor(def, s, '2026-09-08');
      trail.push(step);
      if (step === 'done') break;
      if (step === 'learn') {
        s = { ...s, learnCompletedAt: '2026-09-08', consecutiveFails: 0 };
        continue;
      }
      s = evaluate(def, s, session({ kind: step, correct: 10, thinkMs: 1800 })).next;
    }

    expect(s.status).toBe('mastered');
    expect(trail).toContain('quiz');
    expect(trail.at(-1)).toBe('done');
    // Tidak boleh berputar di latihan
    expect(trail.filter((t) => t === 'practice').length).toBeLessThanOrEqual(2);
  });

  it('anak yang selalu salah tidak pernah terjebak di langkah yang sama', () => {
    let s: ModuleState = emptyModuleState();
    const trail: string[] = [];
    for (let i = 0; i < 10; i++) {
      const step = nextStepFor(def, s, '2026-09-08');
      trail.push(step);
      if (step === 'done') break;
      if (step === 'learn') {
        s = { ...s, learnCompletedAt: '2026-09-08', consecutiveFails: 0 };
        continue;
      }
      s = evaluate(def, s, session({ kind: step, correct: 2 })).next;
    }
    // Jalurnya berganti-ganti: latihan, kuis, lalu diajar ulang — bukan satu langkah terus.
    expect(new Set(trail).size).toBeGreaterThan(1);
    expect(trail).toContain('learn');
  });
});

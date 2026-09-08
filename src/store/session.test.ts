import { describe, expect, it } from 'vitest';
import { clearSession, loadSession, saveSession } from './session';
import { createSession, submitAnswer } from '../engine/session';
import { addModule } from '../engine/fixtures';

describe('sesi yang sedang berjalan', () => {
  it('bertahan saat app ditutup di tengah kuis', () => {
    const def = addModule();
    let s = createSession(def, 'quiz', 3, 0);
    s = submitAnswer(s, { correct: true, thinkMs: 1200, totalMs: 1600, hintUsed: false, nowMs: 0 });
    s = submitAnswer(s, { correct: false, thinkMs: 2200, totalMs: 2600, hintUsed: false, nowMs: 1 });
    saveSession(s);

    const restored = loadSession();
    expect(restored?.moduleId).toBe(def.id);
    expect(restored?.results).toHaveLength(2);
    // Soal yang belum dikerjakan ikut utuh, termasuk pilihan jawabannya.
    expect(restored?.pending[0]?.question.text).toBe(s.pending[0]?.question.text);
    expect(restored?.pending[0]?.question.choices).toEqual(s.pending[0]?.question.choices);
  });

  it('dibersihkan setelah sesi selesai', () => {
    saveSession(createSession(addModule(), 'quiz', 1, 0));
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it('data rusak diabaikan, tidak menjatuhkan app', () => {
    localStorage.setItem('ganmath.v1.session', '{"bukan":"sesi"}');
    expect(loadSession()).toBeNull();
    localStorage.setItem('ganmath.v1.session', 'bukan json');
    expect(loadSession()).toBeNull();
  });
});

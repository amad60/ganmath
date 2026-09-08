import { describe, expect, it } from 'vitest';
import {
  isoWeek,
  levelForXp,
  newBadges,
  updateStreak,
  xpForSession,
  type StreakInput,
} from './gamification';
import { session, state } from './fixtures';

describe('XP & level', () => {
  it('XP lahir dari jawaban benar dan penguasaan, bukan dari waktu di app', () => {
    const r = session({ n: 10, correct: 8 });
    expect(xpForSession(r, { passed: false, mastered: false, thirdStar: false })).toBe(40);
    expect(xpForSession(r, { passed: true, mastered: false, thirdStar: false })).toBe(60);
    expect(xpForSession(r, { passed: true, mastered: true, thirdStar: false })).toBe(110);
  });

  it('soal ulangan tidak memberi XP tambahan', () => {
    const r = session({ n: 0 });
    r.questions = [
      { questionId: 'a', type: 'choose-number', skill: 's', correct: true, thinkMs: 1, totalMs: 1, retried: false, hintUsed: false },
      { questionId: 'a', type: 'choose-number', skill: 's', correct: true, thinkMs: 1, totalMs: 1, retried: true, hintUsed: false },
    ];
    expect(xpForSession(r, { passed: false, mastered: false, thirdStar: false })).toBe(5);
  });

  it('level naik tiap 100 XP', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
  });
});

describe('streak ramah anak', () => {
  const base: StreakInput = { current: 3, best: 5, lastActiveDate: '2026-09-07', freezes: 2, freezesWeek: isoWeek('2026-09-07') };

  it('hari berturut-turut menambah streak', () => {
    expect(updateStreak(base, '2026-09-08').current).toBe(4);
  });

  it('main dua kali sehari tidak menambah streak', () => {
    const once = updateStreak(base, '2026-09-08');
    expect(updateStreak(once, '2026-09-08').current).toBe(4);
  });

  it('bolong satu hari dipakaikan freeze diam-diam', () => {
    const r = updateStreak(base, '2026-09-09');
    expect(r.current).toBe(4);
    expect(r.freezes).toBe(1);
  });

  it('bolong lebih lama daripada jatah freeze mengulang dari 1, tanpa menghapus rekor', () => {
    const r = updateStreak({ ...base, freezes: 1 }, '2026-09-12');
    expect(r.current).toBe(1);
    expect(r.best).toBe(5);
  });

  it('freeze diisi ulang saat minggu berganti', () => {
    const used = { ...base, freezes: 0, freezesWeek: isoWeek('2026-09-07') };
    const r = updateStreak(used, '2026-09-14'); // minggu berikutnya
    expect(r.freezes).toBeGreaterThan(0);
  });

  it('jam HP yang dimundurkan tidak merusak data', () => {
    const r = updateStreak(base, '2026-09-01');
    expect(r.current).toBe(3);
  });

  it('anak baru langsung punya streak 1', () => {
    const r = updateStreak({ current: 0, best: 0, lastActiveDate: null, freezes: 2 }, '2026-09-08');
    expect(r.current).toBe(1);
  });
});

describe('badge', () => {
  const ctx = (over: Partial<Parameters<typeof newBadges>[0]> = {}) => ({
    owned: [] as string[],
    result: session(),
    before: state(),
    after: state({ status: 'mastered' as const, stars: 1, totals: { sessions: 2, questions: 20, correct: 20 } }),
    accuracy: 1,
    medianThinkMs: 2000,
    streakCurrent: 1,
    unitComplete: false,
    ...over,
  });

  it('memberi badge pertama dan badge penguasaan', () => {
    const ids = newBadges(ctx());
    expect(ids).toContain('first-step');
    expect(ids).toContain('module-master');
  });

  it('tidak memberi badge yang sudah dimiliki', () => {
    expect(newBadges(ctx({ owned: ['first-step', 'module-master'] }))).not.toContain('first-step');
  });

  it('Comeback dihargai: lulus setelah beberapa kali gagal', () => {
    const ids = newBadges(ctx({ before: state({ consecutiveFails: 3 }) }));
    expect(ids).toContain('comeback');
  });

  it('modul yang bertahan dua bulan memberi Memory Keeper', () => {
    expect(newBadges(ctx({ after: state({ status: 'retained' }) }))).toContain('memory-keeper');
  });

  it('hanya badge streak tertinggi yang diberikan sekaligus', () => {
    const ids = newBadges(ctx({ streakCurrent: 30 }));
    expect(ids).toContain('steady-30');
    expect(ids).not.toContain('steady-7');
  });

  it('cepat tapi banyak salah tidak dapat Fast Thinker', () => {
    expect(newBadges(ctx({ medianThinkMs: 1000, accuracy: 0.5 }))).not.toContain('fast-thinker');
  });
});

import { describe, expect, it } from 'vitest';
import {
  BADGES,
  GRADES,
  MODULE_TIERS,
  UNIT_TIERS,
  depthBadges,
  isoWeek,
  levelForXp,
  newBadges,
  summarizeDepth,
  updateStreak,
  xpForSession,
  xpIntoLevel,
  type BadgeId,
  type CurriculumIndex,
  type StreakInput,
} from './gamification';
import { session, state } from './fixtures';
import type { ModuleState } from './types';

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
    depth: { modulesCleared: 0, unitsCleared: 0, gradesCleared: [] as number[], thirdStars: 0, retained: 0 },
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

/**
 * Sebelas badge pertama semuanya bertipe "pertama kali" dan semuanya bisa didapat di
 * Grade 1 — badge terakhir jatuh sekitar modul ke-30 dari 240, lalu rak hadiahnya
 * tidak berubah lagi selama 210 modul. Anak yang bertahan paling lama justru yang
 * paling lama tidak diberi apa-apa. Tes di bawah menjaga sumbu kedua: KEDALAMAN.
 */
describe('badge kedalaman', () => {
  const mod = (over: Partial<ModuleState> = {}): ModuleState =>
    state({ status: 'mastered', stars: 1, ...over });

  const index: CurriculumIndex = {
    units: [
      ['a1', 'a2'],
      ['b1', 'b2'],
    ],
    grades: [
      { grade: 1, moduleIds: ['a1', 'a2'] },
      { grade: 2, moduleIds: ['b1', 'b2'] },
    ],
  };

  it('menghitung kedalaman dari state, bukan dari sesi yang barusan', () => {
    const d = summarizeDepth(
      {
        a1: mod(),
        a2: mod({ stars: 3 }),
        b1: mod({ status: 'retained', stars: 3 }),
        b2: mod({ status: 'learning' }),
      },
      index,
    );
    expect(d.modulesCleared).toBe(3);
    expect(d.unitsCleared).toBe(1); // unit b belum utuh
    expect(d.gradesCleared).toEqual([1]);
    expect(d.thirdStars).toBe(2);
    expect(d.retained).toBe(1);
  });

  it('modul practiced ikut dihitung lewat — kecepatan tidak menahan kemajuan', () => {
    const d = summarizeDepth({ a1: mod({ status: 'practiced' }), a2: mod() }, index);
    expect(d.unitsCleared).toBe(1);
    expect(d.gradesCleared).toEqual([1]);
  });

  it('tamat satu grade memberi Grade Graduate grade ITU, bukan yang lain', () => {
    const ids = depthBadges([], {
      modulesCleared: 2,
      unitsCleared: 1,
      gradesCleared: [3],
      thirdStars: 0,
      retained: 0,
    });
    expect(ids).toContain('graduate-3');
    expect(ids).not.toContain('graduate-2');
    expect(ids).not.toContain('graduate-4');
  });

  it('setiap grade punya Grade Graduate-nya sendiri, satu sampai enam', () => {
    for (const g of GRADES) {
      expect(BADGES[`graduate-${g}` as BadgeId]).toBeDefined();
    }
  });

  /**
   * Ambang dibaca `>=`, bukan sama dengan. Anak yang libur lalu kembali dan menuntaskan
   * dua tingkat dalam satu sesi harus mendapat keduanya — kalau tidak, tonggak yang
   * terlewat hilang selamanya dan tidak ada cara memperbaikinya.
   */
  it('melompati dua tingkat sekaligus memberi kedua badge', () => {
    const ids = depthBadges([], {
      modulesCleared: 80,
      unitsCleared: 16,
      gradesCleared: [],
      thirdStars: 0,
      retained: 0,
    });
    expect(ids).toContain('unit-champion-5');
    expect(ids).toContain('unit-champion-15');
    expect(ids).toContain('modules-25');
    expect(ids).toContain('modules-75');
  });

  it('badge yang sudah dipegang tidak diberikan dua kali', () => {
    const depth = {
      modulesCleared: 30,
      unitsCleared: 6,
      gradesCleared: [1],
      thirdStars: 0,
      retained: 0,
    };
    expect(depthBadges(['unit-champion-5', 'graduate-1'], depth)).toEqual(['modules-25']);
  });

  it('tonggak tersebar sampai Grade 6, tidak menumpuk di Grade 1', () => {
    // 240 modul, 43 unit: ambang tertinggi tiap tingkatan harus JAUH di atas Grade 1
    // (43 modul, 8 unit), kalau tidak sumbu kedalamannya percuma.
    expect(Math.max(...MODULE_TIERS)).toBeGreaterThan(43);
    expect(Math.max(...UNIT_TIERS)).toBeGreaterThan(8);
  });
});

describe('kurva level', () => {
  it('sepuluh level pertama TIDAK berubah — tidak ada anak yang turun level', () => {
    for (const xp of [0, 99, 100, 250, 400, 899]) {
      expect(levelForXp(xp)).toBe(Math.floor(xp / 100) + 1);
    }
  });

  it('melambat setelah level 10, supaya angkanya tetap berarti', () => {
    // Tamat seluruh kurikulum dulu mendarat di level 432 — angka yang tidak berarti
    // bagi siapa pun, dan ia dipajang di peta sepanjang waktu.
    expect(levelForXp(43_135)).toBeLessThan(100);
    expect(levelForXp(43_135)).toBeGreaterThan(20);
  });

  it('sisa XP yang ditampilkan selalu di dalam level yang sedang berjalan', () => {
    for (const xp of [0, 150, 900, 5000, 43_135]) {
      const { into, needed } = xpIntoLevel(xp);
      expect(into).toBeGreaterThanOrEqual(0);
      expect(into).toBeLessThan(needed);
    }
  });
});

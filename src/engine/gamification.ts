import { daysBetween } from './review';
import type { ModuleState, SessionResult } from './types';

/* ---------------------------------------------------------------- XP & level */

export const XP_PER_CORRECT = 5;
export const XP_SESSION_PASSED = 20;
export const XP_MASTERED = 50;
export const XP_THIRD_STAR = 30;
export const XP_PER_LEVEL = 100;

/**
 * XP HANYA lahir dari soal dan penguasaan — tidak pernah dari "membuka app" atau
 * "bermain lama". Ini penawar langsung untuk kegagalan Prodigy: hadiah untuk waktu
 * di app, bukan untuk belajar (docs/research/04-app-mechanics.md §4.2).
 */
export function xpForSession(
  result: SessionResult,
  opts: { passed: boolean; mastered: boolean; thirdStar: boolean },
): number {
  const correct = result.questions.filter((q) => !q.retried && q.correct).length;
  return (
    correct * XP_PER_CORRECT +
    (opts.passed ? XP_SESSION_PASSED : 0) +
    (opts.mastered ? XP_MASTERED : 0) +
    (opts.thirdStar ? XP_THIRD_STAR : 0)
  );
}

export function levelForXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): { into: number; needed: number } {
  return { into: xp % XP_PER_LEVEL, needed: XP_PER_LEVEL };
}

/* ------------------------------------------------------------------- streak */

export type StreakInput = {
  current: number;
  best: number;
  lastActiveDate: string | null;
  freezes: number;
  freezesWeek?: string | null;
};

export type StreakState = Omit<StreakInput, 'freezesWeek'> & { freezesWeek: string | null };

export const MAX_FREEZES = 2;

/** Tahun-minggu ISO, dipakai untuk mengisi ulang freeze tiap minggu. */
export function isoWeek(date: string): string {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const dt = new Date(Date.UTC(y, m - 1, d));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((dt.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${dt.getUTCFullYear()}-W${`${week}`.padStart(2, '0')}`;
}

/**
 * Streak versi ramah anak. Freeze dipakai DIAM-DIAM — anak tidak pernah diberi tahu
 * bahwa streaknya nyaris putus, dan tidak ada peringatan "streakmu akan hilang".
 * Anak 6 tahun tidak mengendalikan jadwalnya sendiri; menghukumnya karena sekolah,
 * sakit, atau HP dipegang orang tua adalah salah sasaran
 * (docs/research/04-app-mechanics.md §4.3).
 */
export function updateStreak(streak: StreakInput, today: string): StreakState {
  const normalized: StreakState = { ...streak, freezesWeek: streak.freezesWeek ?? null };
  const refilled: StreakState =
    normalized.freezesWeek === isoWeek(today)
      ? normalized
      : { ...normalized, freezes: MAX_FREEZES, freezesWeek: isoWeek(today) };

  if (refilled.lastActiveDate === today) return refilled;

  if (!refilled.lastActiveDate) {
    return { ...refilled, current: 1, best: Math.max(1, refilled.best), lastActiveDate: today };
  }

  const gap = daysBetween(refilled.lastActiveDate, today);
  if (gap <= 0) return refilled; // jam HP mundur — jangan rusak data

  let current: number;
  let freezes = refilled.freezes;

  if (gap === 1) {
    current = refilled.current + 1;
  } else {
    const missed = gap - 1;
    if (freezes >= missed) {
      current = refilled.current + 1;
      freezes -= missed;
    } else {
      current = 1;
    }
  }

  return {
    ...refilled,
    current,
    freezes,
    best: Math.max(refilled.best, current),
    lastActiveDate: today,
  };
}

/* ------------------------------------------------------------------- badges */

export type BadgeId =
  | 'first-step'
  | 'module-master'
  | 'gold-brain'
  | 'unit-champion'
  | 'perfect-round'
  | 'fast-thinker'
  | 'comeback'
  | 'steady-7'
  | 'steady-14'
  | 'steady-30'
  | 'memory-keeper';

export const BADGES: Record<BadgeId, { icon: string; title: string; hint: string }> = {
  'first-step': { icon: '👣', title: 'First Step', hint: 'Finish your first lesson' },
  'module-master': { icon: '🏅', title: 'Module Master', hint: 'Master your first module' },
  'gold-brain': { icon: '🧠', title: 'Gold Brain', hint: 'Earn 3 stars' },
  'unit-champion': { icon: '🏆', title: 'Unit Champion', hint: 'Finish a whole unit' },
  'perfect-round': { icon: '💯', title: 'Perfect Round', hint: 'A round with no mistakes' },
  'fast-thinker': { icon: '⚡', title: 'Fast Thinker', hint: 'Answer fast for a whole round' },
  'comeback': { icon: '🔥', title: 'Comeback', hint: 'Pass after a hard start' },
  'steady-7': { icon: '📅', title: 'Steady 7', hint: '7 days in a row' },
  'steady-14': { icon: '📆', title: 'Steady 14', hint: '14 days in a row' },
  'steady-30': { icon: '🗓️', title: 'Steady 30', hint: '30 days in a row' },
  'memory-keeper': { icon: '💎', title: 'Memory Keeper', hint: 'Remember it two months later' },
};

export type BadgeContext = {
  owned: string[];
  result: SessionResult;
  before: ModuleState;
  after: ModuleState;
  accuracy: number;
  medianThinkMs: number;
  streakCurrent: number;
  /** true kalau seluruh modul di unit yang sama sudah lewat. */
  unitComplete: boolean;
};

export function newBadges(ctx: BadgeContext): BadgeId[] {
  const out: BadgeId[] = [];
  const add = (id: BadgeId) => {
    if (!ctx.owned.includes(id) && !out.includes(id)) out.push(id);
  };

  if (ctx.after.totals.sessions >= 1) add('first-step');

  const mastered = ctx.after.status === 'mastered' || ctx.after.status === 'retained';
  const wasMastered = ctx.before.status === 'mastered' || ctx.before.status === 'retained';
  if (mastered && !wasMastered) add('module-master');
  if (ctx.after.stars === 3) add('gold-brain');
  if (ctx.after.status === 'retained') add('memory-keeper');
  if (ctx.unitComplete) add('unit-champion');

  if (ctx.accuracy === 1 && ctx.result.questions.length > 0) add('perfect-round');
  if (ctx.medianThinkMs <= 3000 && ctx.accuracy >= 0.9) add('fast-thinker');

  // Comeback sengaja ada: penyeimbang langsung untuk gating ketat — ketekunan
  // setelah gagal dihargai, bukan cuma kecepatan.
  if (mastered && !wasMastered && ctx.before.consecutiveFails >= 2) add('comeback');

  if (ctx.streakCurrent >= 30) add('steady-30');
  else if (ctx.streakCurrent >= 14) add('steady-14');
  else if (ctx.streakCurrent >= 7) add('steady-7');

  return out;
}

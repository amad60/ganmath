import { daysBetween } from './review';
import type { ModuleState, SessionResult } from './types';

/* ---------------------------------------------------------------- XP & level */

export const XP_PER_CORRECT = 5;
export const XP_SESSION_PASSED = 20;
export const XP_MASTERED = 50;
export const XP_THIRD_STAR = 30;
export const XP_PER_LEVEL = 100;

/**
 * Kurva level melambat setelah level 10.
 *
 * Versi pertama memakai 100 XP rata untuk SETIAP level. Anak yang menempuh seluruh
 * kurikulum sampai Grade 6 mendarat di 43.135 XP — **level 432**. Angka itu tidak
 * berarti apa-apa bagi siapa pun, dan ia dipajang di peta sepanjang waktu.
 *
 * Sepuluh level pertama sengaja DIBIARKAN persis seperti dulu (100 XP rata). Anak
 * yang sudah berjalan tidak boleh membuka app besok dan menemukan levelnya turun —
 * itu kehilangan yang tidak pernah bisa dijelaskan kepadanya.
 */
export const FLAT_LEVELS = 10;
export const XP_LEVEL_STEP = 60;
export const XP_LEVEL_MAX = 1200;

/** XP yang dibutuhkan untuk naik DARI `level` ke level berikutnya. */
export function xpToNextLevel(level: number): number {
  if (level < FLAT_LEVELS) return XP_PER_LEVEL;
  return Math.min(XP_PER_LEVEL + XP_LEVEL_STEP * (level - FLAT_LEVELS + 1), XP_LEVEL_MAX);
}

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
  let level = 1;
  let left = Math.max(0, xp);
  while (left >= xpToNextLevel(level)) {
    left -= xpToNextLevel(level);
    level += 1;
  }
  return level;
}

export function xpIntoLevel(xp: number): { into: number; needed: number } {
  let level = 1;
  let left = Math.max(0, xp);
  while (left >= xpToNextLevel(level)) {
    left -= xpToNextLevel(level);
    level += 1;
  }
  return { into: left, needed: xpToNextLevel(level) };
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

/**
 * Badge punya DUA sumbu, dan versi pertama hanya punya satu.
 *
 * Sebelas badge awal semuanya bertipe "pertama kali": lesson pertama, modul pertama,
 * unit pertama, streak 30 hari. Semuanya bisa didapat di Grade 1 — badge terakhir
 * jatuh sekitar modul ke-30 dari 240, lalu rak hadiahnya **tidak pernah berubah lagi
 * selama 210 modul berikutnya**. Anak yang bertahan sampai Grade 6 justru yang paling
 * lama tidak diberi apa-apa, padahal dialah yang paling pantas.
 *
 * Sumbu kedua adalah KEDALAMAN: badge yang menghitung seberapa jauh anak sudah
 * berjalan, tersebar sampai ujung kurikulum. `Grade Graduate` sebetulnya sudah ada di
 * rancangan awal (docs/research/04-app-mechanics.md §4.4) tapi tidak pernah dibuat —
 * justru satu-satunya badge di draft itu yang punya sumbu grade.
 *
 * Badge lama TIDAK diubah dan tidak dihapus: koleksi yang sudah dipegang anak tetap
 * utuh, dan tingkatannya ditambahkan sebagai badge tersendiri.
 */
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
  | 'memory-keeper'
  // --- kedalaman: bertingkat, tersebar sampai Grade 6
  | 'unit-champion-5'
  | 'unit-champion-15'
  | 'unit-champion-30'
  | 'gold-brain-10'
  | 'gold-brain-50'
  | 'modules-25'
  | 'modules-75'
  | 'modules-150'
  | 'memory-keeper-10'
  | 'memory-keeper-30'
  | 'graduate-1'
  | 'graduate-2'
  | 'graduate-3'
  | 'graduate-4'
  | 'graduate-5'
  | 'graduate-6';

/** Ambang tingkat, sengaja satu tempat supaya badge dan teks petunjuk tidak bisa berbeda. */
export const UNIT_TIERS = [5, 15, 30] as const;
export const GOLD_TIERS = [10, 50] as const;
export const KEEPER_TIERS = [10, 30] as const;
/** Tonggak jumlah modul — pengisi jarak antar-grade, supaya tidak ada grade yang
 *  dilalui tanpa satu pun hadiah baru. Dari 240 modul: ±Grade 1, 3, dan 4. */
export const MODULE_TIERS = [25, 75, 150] as const;
export const GRADES = [1, 2, 3, 4, 5, 6] as const;

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

  'unit-champion-5': { icon: '🎖️', title: 'Five Units', hint: 'Finish 5 whole units' },
  'unit-champion-15': { icon: '🏵️', title: 'Fifteen Units', hint: 'Finish 15 whole units' },
  'unit-champion-30': { icon: '👑', title: 'Thirty Units', hint: 'Finish 30 whole units' },
  'gold-brain-10': { icon: '✨', title: 'Ten Gold Brains', hint: 'Earn 3 stars on 10 modules' },
  'gold-brain-50': { icon: '🌟', title: 'Fifty Gold Brains', hint: 'Earn 3 stars on 50 modules' },
  'modules-25': { icon: '🧭', title: 'Twenty-Five Done', hint: 'Finish 25 modules' },
  'modules-75': { icon: '🗺️', title: 'Seventy-Five Done', hint: 'Finish 75 modules' },
  'modules-150': { icon: '⛰️', title: 'One Fifty Done', hint: 'Finish 150 modules' },
  'memory-keeper-10': { icon: '💠', title: 'Ten Kept', hint: 'Keep 10 modules two months later' },
  'memory-keeper-30': { icon: '🔮', title: 'Thirty Kept', hint: 'Keep 30 modules two months later' },
  'graduate-1': { icon: '🎓', title: 'Grade 1 Graduate', hint: 'Finish the whole of Grade 1' },
  'graduate-2': { icon: '🎓', title: 'Grade 2 Graduate', hint: 'Finish the whole of Grade 2' },
  'graduate-3': { icon: '🎓', title: 'Grade 3 Graduate', hint: 'Finish the whole of Grade 3' },
  'graduate-4': { icon: '🎓', title: 'Grade 4 Graduate', hint: 'Finish the whole of Grade 4' },
  'graduate-5': { icon: '🎓', title: 'Grade 5 Graduate', hint: 'Finish the whole of Grade 5' },
  'graduate-6': { icon: '🎓', title: 'Grade 6 Graduate', hint: 'Finish the whole of Grade 6' },
};

/**
 * Peta kurikulum yang dibutuhkan badge kedalaman.
 *
 * Dikirim dari luar, TIDAK diimpor: engine tidak pernah bergantung pada konten —
 * pola yang sama dipakai `unlock.ts` lewat `Registry`. Kalau engine mengimpor
 * konten, seluruh mesin ikut terikat pada kurikulum yang kebetulan ada hari ini.
 */
export type CurriculumIndex = {
  /** Daftar id modul untuk setiap unit. */
  units: string[][];
  /** Daftar id modul untuk setiap grade. */
  grades: { grade: number; moduleIds: string[] }[];
};

export type DepthSummary = {
  modulesCleared: number;
  unitsCleared: number;
  gradesCleared: number[];
  thirdStars: number;
  retained: number;
};

const isCleared = (m: ModuleState | undefined): boolean =>
  m?.status === 'mastered' || m?.status === 'retained' || m?.status === 'practiced';

/** Seberapa jauh anak sudah berjalan — fungsi murni, dihitung ulang dari state. */
export function summarizeDepth(
  modules: Record<string, ModuleState>,
  index: CurriculumIndex,
): DepthSummary {
  const values = Object.values(modules);
  return {
    modulesCleared: values.filter(isCleared).length,
    unitsCleared: index.units.filter((ids) => ids.length > 0 && ids.every((id) => isCleared(modules[id])))
      .length,
    gradesCleared: index.grades
      .filter((g) => g.moduleIds.length > 0 && g.moduleIds.every((id) => isCleared(modules[id])))
      .map((g) => g.grade),
    thirdStars: values.filter((m) => m.stars === 3).length,
    retained: values.filter((m) => m.status === 'retained').length,
  };
}

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
  /** Seberapa jauh anak sudah berjalan. Tanpa ini badge hanya bisa bertanya
   *  "pertama kali?" dan kurikulum setelah Grade 1 tidak punya hadiah apa pun. */
  depth: DepthSummary;
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

  for (const id of depthBadges(ctx.owned, ctx.depth)) add(id);

  return out;
}

/**
 * Badge kedalaman — dipisah karena ada DUA jalur yang bisa memajukan anak, dan versi
 * pertama hanya memberi badge lewat salah satunya. "Lompati satu unit" menandai
 * seluruh modul unit itu dikuasai tanpa pernah melewati `recordSession`, jadi anak
 * yang membuktikan dia menguasai satu unit penuh tidak diberi Unit Champion sama
 * sekali — dan anak yang melompati unit TERAKHIR sebuah grade tidak akan pernah
 * mendapat Grade Graduate-nya, karena tidak ada sesi berikutnya yang menyusul.
 *
 * Ambang dibaca `>=`, bukan sama dengan: anak yang maju dua tingkat sekaligus tetap
 * mendapat keduanya, dan tonggak yang telat selalu menyusul di aksi berikutnya.
 */
export function depthBadges(owned: string[], depth: DepthSummary): BadgeId[] {
  const out: BadgeId[] = [];
  const add = (id: BadgeId) => {
    if (!owned.includes(id) && !out.includes(id)) out.push(id);
  };

  if (depth.unitsCleared >= UNIT_TIERS[0]) add('unit-champion-5');
  if (depth.unitsCleared >= UNIT_TIERS[1]) add('unit-champion-15');
  if (depth.unitsCleared >= UNIT_TIERS[2]) add('unit-champion-30');

  if (depth.modulesCleared >= MODULE_TIERS[0]) add('modules-25');
  if (depth.modulesCleared >= MODULE_TIERS[1]) add('modules-75');
  if (depth.modulesCleared >= MODULE_TIERS[2]) add('modules-150');

  if (depth.thirdStars >= GOLD_TIERS[0]) add('gold-brain-10');
  if (depth.thirdStars >= GOLD_TIERS[1]) add('gold-brain-50');

  if (depth.retained >= KEEPER_TIERS[0]) add('memory-keeper-10');
  if (depth.retained >= KEEPER_TIERS[1]) add('memory-keeper-30');

  for (const g of GRADES) {
    if (depth.gradesCleared.includes(g)) add(`graduate-${g}` as BadgeId);
  }

  return out;
}

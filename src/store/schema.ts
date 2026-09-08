import type { ModuleState } from '../engine/types';

export const CURRENT_SCHEMA_VERSION = 1;

export const STORAGE_KEY = 'ganmath.v1.progress';
export const SESSION_KEY = 'ganmath.v1.session';
/** Sengaja TIDAK pernah dimigrasi — dipakai untuk mendeteksi data yang terhapus browser. */
export const META_KEY = 'ganmath.meta';

// 'fox' dipertahankan supaya profil lama tetap sah, meski tidak lagi ditawarkan
// (rubah kini dipakai maskot).
export type Avatar = 'cat' | 'panda' | 'tiger' | 'koala' | 'bunny' | 'fox';

export type Settings = {
  sound: boolean;
  /** null = ikut setelan sistem */
  reducedMotion: boolean | null;
  theme: 'system' | 'light' | 'dark';
  /** Diatur orang tua; null = pakai ambang grade */
  masteryAccuracyOverride: number | null;
  dailyReminder: boolean;
};

export type Streak = {
  current: number;
  best: number;
  lastActiveDate: string | null;
  freezes: number;
  /** Minggu ISO terakhir freeze diisi ulang. */
  freezesWeek: string | null;
};

export type ProgressState = {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  profile: { name: string; avatar: Avatar };
  xp: number;
  level: number;
  badges: string[];
  streak: Streak;
  modules: Record<string, ModuleState>;
  settings: Settings;
};

export function createInitialState(now = new Date().toISOString()): ProgressState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    profile: { name: '', avatar: 'cat' },
    xp: 0,
    level: 1,
    badges: [],
    streak: { current: 0, best: 0, lastActiveDate: null, freezes: 2, freezesWeek: null },
    modules: {},
    settings: {
      sound: true,
      reducedMotion: null,
      theme: 'system',
      masteryAccuracyOverride: null,
      dailyReminder: false,
    },
  };
}

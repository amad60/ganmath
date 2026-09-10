import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { evaluate, type Evaluation } from '../engine/mastery';
import {
  depthBadges,
  levelForXp,
  newBadges,
  summarizeDepth,
  updateStreak,
  xpForSession,
  type CurriculumIndex,
} from '../engine/gamification';
import type { ModuleDef, ModuleState, SessionResult } from '../engine/types';
import { emptyModuleState } from '../engine/types';
import { migrate } from './migrations';
import {
  CURRENT_SCHEMA_VERSION,
  STORAGE_KEY,
  createInitialState,
  type Avatar,
  type ProgressState,
  type Settings,
} from './schema';
import { safeStorage, writeMeta } from './meta';

export type ProgressStore = {
  data: ProgressState;
  moduleState: (id: string) => ModuleState;
  setProfile: (name: string, avatar: Avatar) => void;
  setGrade: (grade: number) => void;
  masterModules: (ids: string[], date: string, curriculum?: CurriculumIndex) => string[];
  markLearnComplete: (moduleId: string, date: string) => void;
  recordSession: (
    def: ModuleDef,
    result: SessionResult,
    /** `curriculum` dikirim App: store dan engine tidak pernah mengimpor konten. */
    ctx?: { unitModuleIds?: string[]; curriculum?: CurriculumIndex },
  ) => Evaluation & { xpGained: number; earnedBadges: string[] };
  updateSettings: (patch: Partial<Settings>) => void;
  replaceAll: (state: ProgressState) => void;
  reset: () => void;
};

/** Penyimpanan di memori — dipakai test, dan sebagai jaring pengaman kalau
 *  browser memblokir localStorage (mode privat). App tetap jalan, hanya tidak tersimpan. */
export function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, v),
  } as Storage;
}

/**
 * Membungkus Storage supaya kegagalan tulis/baca tidak pernah menjatuhkan app.
 * Safari mode privat melempar error pada setItem, dan storage bisa penuh.
 * Kalau itu terjadi, app tetap jalan penuh — hanya tidak tersimpan, dan
 * Parent Area bisa memberi tahu supaya orang tua menyimpan backup ke file.
 */
export function resilientStorage(storage: Storage): Storage {
  const fallback = memoryStorage();
  let broken = false;
  const mark = () => {
    broken = true;
  };
  return {
    get length() {
      return broken ? fallback.length : storage.length;
    },
    clear: () => {
      try {
        if (!broken) storage.clear();
      } catch {
        mark();
      }
      fallback.clear();
    },
    getItem: (k) => {
      if (broken) return fallback.getItem(k);
      try {
        return storage.getItem(k);
      } catch {
        mark();
        return fallback.getItem(k);
      }
    },
    key: (i) => (broken ? fallback.key(i) : storage.key(i)),
    removeItem: (k) => {
      try {
        if (!broken) storage.removeItem(k);
      } catch {
        mark();
      }
      fallback.removeItem(k);
    },
    setItem: (k, v) => {
      fallback.setItem(k, v);
      if (broken) return;
      try {
        storage.setItem(k, v);
      } catch {
        mark();
      }
    },
  } as Storage;
}

/** True kalau penyimpanan browser tidak bisa dipakai — dipakai Parent Area untuk memperingatkan. */
export function storageIsAvailable(storage: Storage = safeStorage() ?? memoryStorage()): boolean {
  try {
    const probe = '__ganmath_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function createProgressStore(
  rawStorage: Storage = safeStorage() ?? memoryStorage(),
): UseBoundStore<StoreApi<ProgressStore>> {
  const storage = resilientStorage(rawStorage);
  return create<ProgressStore>()(
    persist(
      (set, get) => ({
        data: createInitialState(),

        moduleState: (id) => get().data.modules[id] ?? emptyModuleState(),

        setProfile: (name, avatar) =>
          set((s) => ({
            data: touch({ ...s.data, profile: { ...s.data.profile, name, avatar } }),
          })),

        setGrade: (grade) =>
          set((s) => ({ data: touch({ ...s.data, profile: { ...s.data.profile, grade } }) })),

        /** Dipakai saat anak lolos tes satu unit: seluruh modulnya ditandai dikuasai. */
        masterModules: (ids, date, curriculum) => {
          const s = get().data;
          const modules = { ...s.modules };
          for (const id of ids) {
            const prev = modules[id] ?? emptyModuleState();
            if (prev.status === 'mastered' || prev.status === 'retained') continue;
            modules[id] = {
              ...prev,
              status: 'mastered',
              stars: prev.stars || 1,
              masteredAt: date,
              learnCompletedAt: prev.learnCompletedAt ?? date,
              reviewStage: Math.max(1, prev.reviewStage) as typeof prev.reviewStage,
              consecutiveFails: 0,
            };
          }
          // Melompati satu unit adalah bukti penguasaan, jadi ia berhak atas tonggak
          // yang sama dengan menempuhnya modul demi modul.
          const earned = curriculum
            ? depthBadges(s.badges, summarizeDepth(modules, curriculum))
            : [];
          set({
            data: touch({ ...s, modules, badges: [...s.badges, ...earned] }),
          });
          return earned;
        },

        markLearnComplete: (moduleId, date) =>
          set((s) => {
            const prev = s.data.modules[moduleId] ?? emptyModuleState();
            const next: ModuleState = {
              ...prev,
              learnCompletedAt: prev.learnCompletedAt ?? date,
              status: prev.status === 'available' ? 'learning' : prev.status,
              // Anak baru saja diajar ulang: hitungan gagal beruntun dimulai dari
              // nol, kalau tidak dia akan dikirim ke materi terus-menerus.
              consecutiveFails: 0,
            };
            return { data: touch({ ...s.data, modules: { ...s.data.modules, [moduleId]: next } }) };
          }),

        recordSession: (def, result, ctx) => {
          const s = get().data;
          const prev = s.modules[def.id] ?? emptyModuleState();
          const evaluation = evaluate(def, prev, result, {
            parentAccuracy: s.settings.masteryAccuracyOverride,
          });
          const modules = { ...s.modules, [def.id]: evaluation.next };

          const streak = updateStreak(s.streak, result.date);

          const mastered =
            evaluation.next.status === 'mastered' || evaluation.next.status === 'retained';
          const wasMastered = prev.status === 'mastered' || prev.status === 'retained';
          const xpGained = xpForSession(result, {
            passed: evaluation.detail.accuracyPass,
            mastered: mastered && !wasMastered,
            thirdStar: evaluation.next.stars === 3 && prev.stars < 3,
          });
          const xp = s.xp + xpGained;

          const cleared = (id: string) => {
            const st = modules[id]?.status;
            return st === 'mastered' || st === 'retained' || st === 'practiced';
          };
          const earnedBadges = newBadges({
            owned: s.badges,
            result,
            before: prev,
            after: evaluation.next,
            accuracy: evaluation.detail.accuracy,
            medianThinkMs: evaluation.detail.medianThinkMs,
            streakCurrent: streak.current,
            unitComplete: (ctx?.unitModuleIds ?? []).length > 0
              && (ctx?.unitModuleIds ?? []).every(cleared),
            // Dihitung dari `modules` YANG SUDAH memuat hasil sesi ini — kalau dari
            // state lama, tonggak terakhir selalu telat satu sesi.
            depth: summarizeDepth(modules, ctx?.curriculum ?? { units: [], grades: [] }),
          });

          set({
            data: touch({
              ...s,
              modules,
              streak,
              xp,
              level: levelForXp(xp),
              badges: [...s.badges, ...earnedBadges],
            }),
          });
          writeMeta({ everUsed: true }, storage);
          // Dikembalikan utuh supaya layar hasil memakai evaluasi YANG SAMA dengan
          // yang disimpan — bukan menghitung ulang dan berisiko berbeda.
          return { ...evaluation, xpGained, earnedBadges };
        },

        updateSettings: (patch) =>
          set((s) => ({ data: touch({ ...s.data, settings: { ...s.data.settings, ...patch } }) })),

        replaceAll: (state) => set({ data: touch(state) }),

        reset: () => set({ data: createInitialState() }),
      }),
      {
        name: STORAGE_KEY,
        version: CURRENT_SCHEMA_VERSION,
        storage: createJSONStorage(() => storage),
        partialize: (s) => ({ data: s.data }),
        migrate: (persisted) => {
          const result = migrate((persisted as { data?: unknown } | undefined)?.data);
          return { data: result.ok ? result.state : createInitialState() };
        },
      },
    ),
  );
}

function touch(s: ProgressState): ProgressState {
  return { ...s, updatedAt: new Date().toISOString() };
}

export const useProgress = createProgressStore();

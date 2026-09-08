import type { ModuleDef, ModuleState } from './types';
import { isCleared } from './mastery';

export type Registry = {
  modules: Record<string, ModuleDef>;
  /** Urutan yang dilihat anak di peta. Gating ketat: urutan ini mengikat. */
  pathOrder: string[];
};

/**
 * Terkunci adalah keadaan TURUNAN, tidak pernah disimpan — kalau disimpan, datanya
 * jadi kadaluwarsa setiap kali kurikulum bertambah (docs/tech/storage.md §2).
 *
 * Dua syarat sekaligus:
 *  - semua `prereq` sudah lewat  → menjaga kebenaran saat kurikulum digeser/ditambah
 *  - semua modul sebelumnya di `pathOrder` sudah lewat → keputusan user: gating ketat linear
 */
export function isUnlocked(
  moduleId: string,
  states: Record<string, ModuleState>,
  registry: Registry,
): boolean {
  const def = registry.modules[moduleId];
  if (!def) return false;

  for (const p of def.prereq) {
    if (!isCleared(states[p])) return false;
  }

  const idx = registry.pathOrder.indexOf(moduleId);
  if (idx < 0) return false;
  for (let i = 0; i < idx; i++) {
    if (!isCleared(states[registry.pathOrder[i] as string])) return false;
  }
  return true;
}

/** Modul berikutnya yang harus dikerjakan anak — tombol lengket di peta. */
export function nextModule(
  states: Record<string, ModuleState>,
  registry: Registry,
): string | null {
  for (const id of registry.pathOrder) {
    if (!isCleared(states[id])) return isUnlocked(id, states, registry) ? id : null;
  }
  return null;
}

export type RegistryProblem = { moduleId: string; problem: string };

/** Dijalankan linter konten saat build. Prasyarat melingkar = kurikulum tidak bisa ditempuh. */
export function validateRegistry(registry: Registry): RegistryProblem[] {
  const problems: RegistryProblem[] = [];
  const { modules, pathOrder } = registry;

  for (const id of pathOrder) {
    if (!modules[id]) problems.push({ moduleId: id, problem: 'ada di pathOrder tapi tidak terdaftar' });
  }
  for (const id of Object.keys(modules)) {
    if (!pathOrder.includes(id)) problems.push({ moduleId: id, problem: 'tidak ada di pathOrder' });
  }

  for (const def of Object.values(modules)) {
    for (const p of def.prereq) {
      const target = modules[p];
      if (!target) {
        problems.push({ moduleId: def.id, problem: `prereq tidak ada: ${p}` });
        continue;
      }
      if (target.grade > def.grade) {
        problems.push({ moduleId: def.id, problem: `prereq dari grade lebih tinggi: ${p}` });
      }
      if (pathOrder.indexOf(p) > pathOrder.indexOf(def.id)) {
        problems.push({ moduleId: def.id, problem: `prereq muncul setelahnya di pathOrder: ${p}` });
      }
    }
    if (def.fluencyTracked && def.kind !== 'fact') {
      problems.push({ moduleId: def.id, problem: 'fluencyTracked hanya untuk kind "fact"' });
    }
    if (def.questionTypes.length < 2) {
      problems.push({ moduleId: def.id, problem: 'butuh minimal 2 questionTypes (anti-hafal)' });
    }
  }

  // Prasyarat melingkar (DFS berwarna).
  const state = new Map<string, 0 | 1 | 2>();
  const visit = (id: string, trail: string[]): void => {
    const c = state.get(id) ?? 0;
    if (c === 2) return;
    if (c === 1) {
      problems.push({ moduleId: id, problem: `prasyarat melingkar: ${[...trail, id].join(' → ')}` });
      return;
    }
    state.set(id, 1);
    for (const p of modules[id]?.prereq ?? []) visit(p, [...trail, id]);
    state.set(id, 2);
  };
  for (const id of Object.keys(modules)) visit(id, []);

  return problems;
}

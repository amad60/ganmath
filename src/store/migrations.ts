import { CURRENT_SCHEMA_VERSION, createInitialState, type ProgressState } from './schema';

/**
 * Migrasi HANYA menambah — tidak pernah menghapus data anak.
 *
 * Catatan penting: bertambahnya kurikulum BUKAN perubahan skema. Modul baru muncul
 * sendiri sebagai `available` tanpa migrasi apa pun, karena status `locked` tidak
 * pernah disimpan (docs/tech/storage.md §2).
 */
type Migration = (s: Record<string, unknown>) => Record<string, unknown>;

export const migrations: Record<number, Migration> = {
  // 2: (s) => ({ ...s, schemaVersion: 2, fieldBaru: nilaiAman }),
};

export type LoadResult =
  | { ok: true; state: ProgressState; migratedFrom?: number }
  | { ok: false; reason: 'corrupt' | 'not-ganmath' | 'from-future'; detail: string };

export function migrate(raw: unknown): LoadResult {
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, reason: 'corrupt', detail: 'bukan objek' };
  }
  const obj = raw as Record<string, unknown>;
  const version = obj.schemaVersion;

  if (typeof version !== 'number') {
    return { ok: false, reason: 'not-ganmath', detail: 'schemaVersion tidak ada' };
  }
  if (version > CURRENT_SCHEMA_VERSION) {
    // File dari versi app yang lebih baru. Menebak isinya berisiko menghapus progress —
    // lebih baik menolak dan minta app diperbarui.
    return {
      ok: false,
      reason: 'from-future',
      detail: `file versi ${version}, app hanya paham ${CURRENT_SCHEMA_VERSION}`,
    };
  }

  let s = obj;
  const from = version;
  while ((s.schemaVersion as number) < CURRENT_SCHEMA_VERSION) {
    const next = (s.schemaVersion as number) + 1;
    const fn = migrations[next];
    if (!fn) return { ok: false, reason: 'corrupt', detail: `migrasi ke v${next} tidak ada` };
    s = fn(s);
  }

  const merged = { ...createInitialState(), ...s } as ProgressState;
  if (typeof merged.modules !== 'object' || merged.modules === null) {
    return { ok: false, reason: 'corrupt', detail: 'modules bukan objek' };
  }
  return from === CURRENT_SCHEMA_VERSION
    ? { ok: true, state: merged }
    : { ok: true, state: merged, migratedFrom: from };
}

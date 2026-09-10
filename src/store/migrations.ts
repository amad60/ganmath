import { CURRENT_SCHEMA_VERSION, createInitialState, type ProgressState } from './schema';
import { starsFor } from '../engine/mastery';
import { levelForXp } from '../engine/gamification';
import type { ModuleState } from '../engine/types';

/**
 * Migrasi HANYA menambah — tidak pernah menghapus data anak.
 *
 * Catatan penting: bertambahnya kurikulum BUKAN perubahan skema. Modul baru muncul
 * sendiri sebagai `available` tanpa migrasi apa pun, karena status `locked` tidak
 * pernah disimpan (docs/tech/storage.md §2).
 */
type Migration = (s: Record<string, unknown>) => Record<string, unknown>;

/** Akurasi terbaik yang PERNAH dibuktikan anak di modul ini. */
function bestAccuracy(m: ModuleState): number | null {
  const passed = (m.attempts ?? []).filter((a) => a.passed).map((a) => a.accuracy);
  if (passed.length > 0) return Math.max(...passed);
  const { questions, correct } = m.totals ?? { questions: 0, correct: 0 };
  return questions > 0 ? correct / questions : null;
}

const CLEARED_STATUSES = ['practiced', 'mastered', 'retained'];

export const migrations: Record<number, Migration> = {
  // 4: (s) => ({ ...s, schemaVersion: 4, fieldBaru: nilaiAman }),

  /**
   * v3 — level dihitung ulang mengikuti kurva baru.
   *
   * `level` disimpan, dan hanya ditulis ulang saat sesi berikutnya selesai. Tanpa
   * migrasi ini anak akan melihat level lama di peta sampai dia bermain lagi, lalu
   * angkanya melompat tanpa sebab yang bisa dilihat. Sepuluh level pertama biayanya
   * tidak berubah, jadi bagi anak yang masih di bawah level 10 ini tidak menggeser
   * apa pun — ia hanya menyamakan angka yang tersimpan dengan XP yang dia punya.
   */
  3: (s) => ({
    ...s,
    schemaVersion: 3,
    level: levelForXp(typeof s.xp === 'number' ? s.xp : 0),
  }),

  /**
   * v2 — bintang dibayarkan surut.
   *
   * Sampai v1 bintang terikat pada ambang kecepatan, jadi anak yang menjawab 100%
   * benar tapi berpikir lama menyelesaikan modul dengan NOL bintang. Aturannya sudah
   * diperbaiki (bintang ← akurasi), tapi evaluator hanya berjalan pada sesi BARU —
   * tanpa migrasi ini anak harus mengulang modul yang sudah dia lewati hanya untuk
   * mendapat pengakuan yang sebenarnya sudah dia hasilkan. Itu persis hukuman yang
   * sedang kita cabut.
   *
   * Sekalian menambal kerusakan dari bug lama: sesi review pernah bisa meluluskan
   * modul `practiced` menjadi `mastered` TANPA `masteredAt`, dan modul seperti itu
   * hilang selamanya dari antrean ulangan karena `nextReviewDate()` tidak punya
   * titik jangkar. Di sini jangkarnya dikembalikan.
   *
   * Hanya MENAMBAH: tidak ada bintang yang diturunkan dan tidak ada status yang
   * diubah.
   */
  2: (s) => {
    const modules = (s.modules ?? {}) as Record<string, ModuleState>;
    const healed = Object.fromEntries(
      Object.entries(modules).map(([id, m]) => {
        if (!m || typeof m !== 'object' || !CLEARED_STATUSES.includes(m.status)) return [id, m];

        let next = m;
        if (!(m.stars > 0)) {
          const acc = bestAccuracy(m);
          if (acc != null) next = { ...next, stars: starsFor(acc) };
        }
        if (m.status !== 'practiced' && !m.masteredAt) {
          const anchor = (m.attempts ?? []).filter((a) => a.passed).at(-1)?.date;
          if (anchor) next = { ...next, masteredAt: anchor };
        }
        return [id, next];
      }),
    );
    return { ...s, schemaVersion: 2, modules: healed };
  },
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

import { migrate } from './migrations';
import type { ProgressState } from './schema';

export const BACKUP_FILE_VERSION = 1;

export type BackupFile = {
  app: 'ganmath';
  fileVersion: number;
  exportedAt: string;
  appVersion: string;
  profileName: string;
  progress: ProgressState;
};

export type BackupSummary = {
  profileName: string;
  exportedAt: string;
  mastered: number;
  totalModules: number;
  xp: number;
};

export function buildBackup(
  state: ProgressState,
  appVersion: string,
  now = new Date().toISOString(),
): BackupFile {
  return {
    app: 'ganmath',
    fileVersion: BACKUP_FILE_VERSION,
    exportedAt: now,
    appVersion,
    profileName: state.profile.name,
    progress: state,
  };
}

export function backupFileName(state: ProgressState, date = new Date()): string {
  const slug = (state.profile.name || 'kid').toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'kid';
  const d = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
  return `ganmath-progress-${slug}-${d}.json`;
}

export function summarize(file: BackupFile): BackupSummary {
  const modules = Object.values(file.progress.modules ?? {});
  return {
    profileName: file.profileName,
    exportedAt: file.exportedAt,
    mastered: modules.filter((m) => m.status === 'mastered' || m.status === 'retained').length,
    totalModules: modules.length,
    xp: file.progress.xp ?? 0,
  };
}

export type ParseResult =
  | { ok: true; state: ProgressState; summary: BackupSummary; migratedFrom?: number }
  | { ok: false; error: string };

/**
 * Impor TIDAK PERNAH menggabungkan. Menggabungkan dua riwayat penguasaan menghasilkan
 * data yang tidak bisa dipercaya — impor = ganti total, setelah konfirmasi yang
 * menampilkan perbandingan (docs/tech/storage.md §6).
 */
export function parseBackup(json: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { ok: false, error: 'File ini bukan JSON yang sah.' };
  }
  if (typeof raw !== 'object' || raw === null) return { ok: false, error: 'Isi file tidak dikenali.' };

  const file = raw as Partial<BackupFile>;
  if (file.app !== 'ganmath') return { ok: false, error: 'File ini bukan backup GanMath.' };
  if (typeof file.fileVersion !== 'number' || file.fileVersion > BACKUP_FILE_VERSION) {
    return { ok: false, error: 'File dibuat oleh GanMath versi lebih baru. Perbarui app dulu.' };
  }
  if (!file.progress) return { ok: false, error: 'File tidak memuat progress.' };

  const migrated = migrate(file.progress);
  if (!migrated.ok) {
    const map = {
      corrupt: 'Isi file rusak.',
      'not-ganmath': 'File ini bukan backup GanMath.',
      'from-future': 'File dibuat oleh GanMath versi lebih baru. Perbarui app dulu.',
    } as const;
    return { ok: false, error: map[migrated.reason] };
  }

  const complete: BackupFile = {
    app: 'ganmath',
    fileVersion: file.fileVersion,
    exportedAt: file.exportedAt ?? '',
    appVersion: file.appVersion ?? '',
    profileName: file.profileName ?? migrated.state.profile.name,
    progress: migrated.state,
  };

  return migrated.migratedFrom === undefined
    ? { ok: true, state: migrated.state, summary: summarize(complete) }
    : {
        ok: true,
        state: migrated.state,
        summary: summarize(complete),
        migratedFrom: migrated.migratedFrom,
      };
}

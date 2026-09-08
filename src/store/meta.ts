import { META_KEY } from './schema';

/**
 * Meta sengaja disimpan terpisah dan tidak pernah dimigrasi. Kalau progress hilang
 * tapi meta masih ada (atau sebaliknya), kita tahu browser menghapus data —
 * bukan anak yang baru pertama kali membuka app. Risiko nyata di iOS Safari,
 * yang menghapus storage situs yang tidak dibuka ±7 hari.
 */
export type Meta = {
  lastBackupAt: string | null;
  installPromptShown: boolean;
  everUsed: boolean;
};

const EMPTY: Meta = { lastBackupAt: null, installPromptShown: false, everUsed: false };

export function readMeta(storage: Storage | undefined = safeStorage()): Meta {
  if (!storage) return EMPTY;
  try {
    const raw = storage.getItem(META_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Meta>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function writeMeta(patch: Partial<Meta>, storage: Storage | undefined = safeStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(META_KEY, JSON.stringify({ ...readMeta(storage), ...patch }));
  } catch {
    /* storage penuh atau diblokir — app harus tetap jalan */
  }
}

export function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

/** Anak pernah memakai app tapi progressnya hilang → tawarkan pulihkan dari file. */
export function looksWiped(hasProgress: boolean, meta: Meta): boolean {
  return meta.everUsed && !hasProgress;
}

export const BACKUP_REMINDER_DAYS = 14;

export function shouldRemindBackup(
  meta: Meta,
  masteredSinceBackup: number,
  now: Date = new Date(),
): boolean {
  if (masteredSinceBackup >= 5 && !meta.lastBackupAt) return true;
  if (!meta.lastBackupAt) return false;
  const days = (now.getTime() - new Date(meta.lastBackupAt).getTime()) / 86_400_000;
  return days >= BACKUP_REMINDER_DAYS && masteredSinceBackup >= 5;
}

import { buildBackup, backupFileName, parseBackup, type ParseResult } from '../store/backup';
import type { ProgressState } from '../store/schema';

export const APP_VERSION = '0.1.0';

/**
 * Menyimpan progress ke file. Di iOS Safari ini membuka lembar Share — cukup:
 * orang tua bisa menyimpannya ke Files atau mengirimnya ke dirinya sendiri.
 */
export function saveProgressToFile(state: ProgressState): void {
  const blob = new Blob([JSON.stringify(buildBackup(state, APP_VERSION), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFileName(state);
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Beri waktu Safari membaca blob sebelum dilepas.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function readProgressFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve({ ok: false, error: 'File tidak bisa dibaca.' });
    reader.onload = () => resolve(parseBackup(String(reader.result ?? '')));
    reader.readAsText(file);
  });
}

import type { SessionState } from '../engine/session';
import { SESSION_KEY } from './schema';
import { safeStorage } from './meta';

/**
 * Menyimpan sesi yang sedang berjalan.
 *
 * Tanpa ini, HP yang terkunci, app yang dibunuh sistem, atau orang tua yang
 * mengambil HP di tengah kuis membuat SELURUH jawaban anak hilang dan dia harus
 * memulai dari soal pertama. Untuk anak 6 tahun itu bukan gangguan kecil —
 * itu alasan berhenti.
 *
 * SessionState sepenuhnya berupa data biasa (tidak ada fungsi di dalamnya),
 * jadi aman di-JSON-kan apa adanya.
 */
export function saveSession(state: SessionState): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    /* storage penuh atau diblokir — sesi tetap jalan, hanya tidak bisa dipulihkan */
  }
}

export function loadSession(): SessionState | null {
  const storage = safeStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionState;
    // Bentuk minimal yang harus ada; kalau tidak cocok, lebih baik dibuang daripada
    // membuat app jatuh saat dibuka.
    if (!parsed?.moduleId || !Array.isArray(parsed.pending) || !Array.isArray(parsed.results)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  const storage = safeStorage();
  try {
    storage?.removeItem(SESSION_KEY);
  } catch {
    /* diabaikan */
  }
}

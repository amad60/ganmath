import type { ModuleState } from './types';

/** R1..R4. Riset: yang menentukan retensi adalah jumlah sesi terdistribusi (±4), bukan polanya. */
export const REVIEW_OFFSETS_DAYS = [3, 7, 30, 60] as const;

/** Maks 2 modul review per hari — supaya sesi tetap 5–10 menit dan tidak menumpuk jadi hukuman. */
export const MAX_REVIEWS_PER_DAY = 2;

export const REVIEW_QUESTIONS = 5;

export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toDateString(dt);
}

export function daysBetween(from: string, to: string): number {
  const [y1, m1, d1] = from.split('-').map(Number) as [number, number, number];
  const [y2, m2, d2] = to.split('-').map(Number) as [number, number, number];
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  return Math.round((b - a) / 86_400_000);
}

/** Kapan review berikutnya jatuh tempo. `null` = sudah `retained`, keluar dari antrean. */
export function nextReviewDate(state: ModuleState): string | null {
  if (state.status === 'retained') return null;
  if (!state.masteredAt) return null;
  const stage = Math.max(1, state.reviewStage);
  const offset = REVIEW_OFFSETS_DAYS[stage - 1];
  if (offset == null) return null;

  const last = state.attempts.filter((a) => a.kind === 'review' && a.passed).at(-1);
  const anchor = last?.date ?? state.masteredAt;
  return addDays(anchor, offset);
}

export type DueReview = { moduleId: string; dueAt: string; overdueDays: number; accuracy: number };

/**
 * Modul yang jatuh tempo hari ini, sudah diprioritaskan dan dibatasi.
 * Prioritas: akurasi terendah dulu, lalu yang paling lama terlambat.
 */
export function dueReviews(
  modules: Record<string, ModuleState>,
  today: string,
  limit: number = MAX_REVIEWS_PER_DAY,
): DueReview[] {
  const due: DueReview[] = [];

  for (const [moduleId, state] of Object.entries(modules)) {
    if (state.status === 'needs_review') {
      due.push({ moduleId, dueAt: today, overdueDays: 999, accuracy: accuracyOf(state) });
      continue;
    }
    const dueAt = nextReviewDate(state);
    if (!dueAt) continue;
    const overdueDays = daysBetween(dueAt, today);
    if (overdueDays >= 0) due.push({ moduleId, dueAt, overdueDays, accuracy: accuracyOf(state) });
  }

  due.sort((a, b) => a.accuracy - b.accuracy || b.overdueDays - a.overdueDays);
  return due.slice(0, limit);
}

/** Grade dari ID modul (`g2-u1-m1` → 2). Konvensi ID tidak pernah berubah. */
export function gradeOfModuleId(id: string): number | null {
  const m = /^g(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

/**
 * Ulangan untuk peta kelas aktif, dengan satu slot disisakan untuk kelas sebelumnya.
 *
 * Tanpa ini, naik ke Grade 2 membuat seluruh fakta Grade 1 hilang dari kartu
 * "Time to remember" — `dueReviews` masih menghitungnya, tapi app membuangnya
 * karena tidak ada di registry kelas aktif. Anak yang baru tamat Grade 1 justru
 * kehilangan retensi di saat paling dibutuhkan.
 *
 * Maksimal tetap 2 per hari. Kalau ada yang jatuh tempo di kelas lama, satu
 * diambil dari situ; sisanya dari kelas aktif. Kalau tidak ada, keduanya dari
 * kelas aktif — perilaku Grade 1 tidak berubah.
 */
export function dueReviewsForGrade(
  modules: Record<string, ModuleState>,
  today: string,
  grade: number,
  limit: number = MAX_REVIEWS_PER_DAY,
): DueReview[] {
  const due = dueReviews(modules, today, 50);
  const prior: DueReview[] = [];
  const current: DueReview[] = [];
  for (const r of due) {
    const g = gradeOfModuleId(r.moduleId);
    if (g == null) continue;
    if (g === grade) current.push(r);
    else if (g < grade) prior.push(r);
  }
  const picked: DueReview[] = [];
  if (prior[0]) picked.push(prior[0]);
  for (const r of current) {
    if (picked.length >= limit) break;
    picked.push(r);
  }
  for (const r of prior) {
    if (picked.length >= limit) break;
    if (!picked.includes(r)) picked.push(r);
  }
  return picked;
}

function accuracyOf(state: ModuleState): number {
  const { questions, correct } = state.totals;
  return questions === 0 ? 0 : correct / questions;
}

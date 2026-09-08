import type { ModuleDef, ModuleState } from './types';
import { nextReviewDate } from './review';

export type ModuleStep = 'learn' | 'practice' | 'quiz' | 'speed' | 'review' | 'done';

/** Setelah gagal sebanyak ini, anak dikembalikan ke materi — bukan disuruh mengulang kuis. */
export const RETEACH_AFTER_FAILS = 3;

/**
 * Langkah berikutnya untuk sebuah modul. Ini satu-satunya sumber kebenaran untuk
 * "anak harus ngapain sekarang", dipakai layar peta maupun layar hasil.
 *
 * Versi pertama tidak punya fungsi ini: layar peta menebak sendiri dengan
 * `status === 'learning' ? 'practice' : 'quiz'`. Karena sesi latihan memang tidak
 * pernah menaikkan status, anak terjebak berlatih selamanya dan TIDAK ADA modul
 * yang bisa dikuasai lewat permainan normal. Bug itu lolos karena test integrasi
 * memanggil sesi kuis langsung — menguji engine, tapi tidak menguji navigasinya.
 */
export function nextStepFor(def: ModuleDef, state: ModuleState, today?: string): ModuleStep {
  void def;

  if (state.status === 'needs_review') return 'review';

  if (state.status === 'mastered' || state.status === 'retained') {
    if (today) {
      const due = nextReviewDate(state);
      if (due && due <= today) return 'review';
    }
    return 'done';
  }

  // Paham tapi belum cepat: yang kurang cuma kecepatan.
  if (state.status === 'practiced') return 'speed';

  if (!state.learnCompletedAt) return 'learn';

  // Terlalu sering gagal: mengulang kuis yang sama tidak akan menolong.
  if (state.consecutiveFails >= RETEACH_AFTER_FAILS) return 'learn';

  const last = state.attempts.at(-1);
  if (!last) return 'practice';

  // Baru gagal kuis → berlatih dulu, jangan langsung diuji ulang.
  if (last.kind === 'quiz' && !last.passed) return 'practice';

  // Baru berlatih, atau baru lulus satu kuis dan masih butuh satu lagi.
  return last.kind === 'practice' ? 'quiz' : 'quiz';
}

/** Apakah modul ini sudah tidak menuntut apa pun lagi hari ini. */
export function isModuleDone(step: ModuleStep): boolean {
  return step === 'done';
}

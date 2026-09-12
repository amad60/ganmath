import {
  AUTOMATIC_THINK_MS,
  GRADE_THRESHOLDS,
  SPEED_OUTLIER_MS,
  TESTOUT_ACCURACY,
  type Attempt,
  type ModuleDef,
  type ModuleState,
  type SessionResult,
  type Thresholds,
} from './types';
import { median } from './rng';

export type MasteryEvent =
  | { type: 'mastered'; moduleId: string }
  | { type: 'tested-out'; moduleId: string }
  | { type: 'testout-failed'; moduleId: string }
  | { type: 'star'; moduleId: string; stars: 1 | 2 | 3 }
  | { type: 'speed-round-offered'; moduleId: string }
  | { type: 'needs-reteach'; moduleId: string }
  | { type: 'review-passed'; moduleId: string }
  | { type: 'review-failed'; moduleId: string }
  | { type: 'retained'; moduleId: string };

export type Evaluation = {
  next: ModuleState;
  events: MasteryEvent[];
  detail: {
    accuracy: number;
    accuracyPass: boolean;
    coveragePass: boolean;
    speedPass: boolean;
    sessionsPass: boolean;
    medianThinkMs: number;
    medianTotalMs: number;
    passingSessions: number;
  };
};

/** Akurasi hanya dari soal yang bukan ulangan — satu kesalahan tidak dihukum dua kali. */
export function accuracyOf(result: SessionResult): number {
  const scored = result.questions.filter((q) => !q.retried);
  if (scored.length === 0) return 0;
  return scored.filter((q) => q.correct).length / scored.length;
}

/**
 * Median thinkMs, membuang soal yang tertunda >30 detik (anak teralih) DAN membuang
 * soal cerita.
 *
 * `thinkMs` diukur dari soal muncul sampai sentuhan pertama, jadi untuk soal cerita
 * ia ikut menghitung waktu MEMBACA. Dibiarkan masuk, ambang kecepatan berhenti
 * mengukur kelancaran berhitung dan mulai mengukur kelancaran membaca: anak yang
 * paham tapi membaca pelan akan tercatat belum menguasai — karena membacanya.
 *
 * Inilah yang dulu memaksa soal cerita dijauhkan sama sekali dari sesi yang
 * mengukur kecepatan. Dengan pengecualian di sini, soal cerita boleh ikut menguji
 * PENERAPAN di kuis tanpa merusak alat ukur kecepatan, dan ambang lama tetap
 * berarti persis sama seperti sebelumnya.
 */
export function speedOf(result: SessionResult): { thinkMs: number; totalMs: number } {
  const usable = result.questions.filter((q) => !q.retried && q.totalMs <= SPEED_OUTLIER_MS);
  const timed = usable.filter((q) => !q.story);
  // `median([])` mengembalikan 0, dan 0 LOLOS ambang kecepatan apa pun. Jadi setiap
  // penyaringan di sini butuh jaring di bawahnya, kalau tidak sesi yang kebetulan
  // tersaring habis justru memberi kelulusan gratis — sesi yang SELURUH soalnya
  // tertunda >30 detik pun begitu, dan itu sudah begini sejak sebelum soal cerita
  // ada. Turun bertahap: soal hitung → apa pun yang terukur → apa adanya. Ukuran
  // yang buruk masih lebih jujur daripada nol yang meluluskan.
  const base =
    timed.length > 0 ? timed : usable.length > 0 ? usable : result.questions.filter((x) => !x.retried);
  return {
    thinkMs: median(base.map((q) => q.thinkMs)),
    totalMs: median(base.map((q) => q.totalMs)),
  };
}

/** Setiap questionType modul muncul DAN minimal satu di antaranya dijawab benar. */
export function coverageOf(def: ModuleDef, result: SessionResult): boolean {
  return def.questionTypes.every((t) =>
    result.questions.some((q) => q.type === t && q.correct && !q.retried),
  );
}

function thresholdsFor(def: ModuleDef, parentAccuracy?: number | null): Thresholds {
  const base = GRADE_THRESHOLDS[def.grade];
  return {
    ...base,
    accuracy: def.masteryOverride?.accuracy ?? parentAccuracy ?? base.accuracy,
    sessions: def.masteryOverride?.sessions ?? base.sessions,
    speedMs: def.speedTargetMs ?? base.speedMs,
  };
}

/** Sesi lulus yang memenuhi aturan konsistensi (hari berbeda kalau grade menuntutnya). */
function countPassingSessions(attempts: Attempt[], sameDayAllowed: boolean): number {
  const passed = attempts.filter((a) => a.passed && (a.kind === 'quiz' || a.kind === 'master'));
  if (sameDayAllowed) return passed.length;
  return new Set(passed.map((a) => a.date)).size;
}

/**
 * Bintang mengukur KEBENARAN, bukan kecepatan.
 *
 * Versi pertama mengikat bintang ke ambang kecepatan: anak yang menjawab 100% benar
 * tapi berpikir lama mendapat NOL bintang — berkali-kali, di modul yang sama. Dari
 * tempat duduknya itu tidak terbaca sebagai "belum otomatis"; itu terbaca sebagai
 * "aku salah", padahal tidak satu pun jawabannya salah. Anak yang teliti dihukum
 * karena teliti, lalu berhenti mencoba. Itu kegagalan produk, bukan kegagalan anak.
 *
 * Sekarang pembagian tugasnya tegas:
 *  - **bintang ← akurasi.** ★ = kamu bisa, ★★ = mulus, ★★★ = hafal di luar kepala.
 *  - **status ← akurasi + konsistensi + cakupan + kecepatan** (`practiced` vs `mastered`).
 *
 * Kecepatan tetap dituntut dan tetap punya arti — ia menentukan status, jadwal
 * retensi, dan bintang ke-3 lewat Master Round. Yang dicabut hanya kuasanya untuk
 * menghapus pengakuan atas jawaban yang benar.
 */
export function starsFor(accuracy: number): 1 | 2 {
  return accuracy >= 0.95 ? 2 : 1;
}

/**
 * Evaluator penguasaan — fungsi murni, satu-satunya tempat keputusan
 * "lulus / bintang / perlu diajar ulang" dibuat.
 */
export function evaluate(
  def: ModuleDef,
  state: ModuleState,
  result: SessionResult,
  opts: { parentAccuracy?: number | null } = {},
): Evaluation {
  const th = thresholdsFor(def, opts.parentAccuracy);
  const accuracy = accuracyOf(result);
  const { thinkMs, totalMs } = speedOf(result);

  const accuracyPass = accuracy >= th.accuracy;
  const coveragePass =
    result.kind === 'quiz' || result.kind === 'master' || result.kind === 'testout'
      ? coverageOf(def, result)
      : true;
  const speedPass = !def.fluencyTracked || thinkMs <= th.speedMs;
  const sessionPassed = accuracyPass && coveragePass;

  const attempt: Attempt = {
    date: result.date,
    kind: result.kind,
    accuracy,
    medianThinkMs: thinkMs,
    medianTotalMs: totalMs,
    passed: sessionPassed,
  };

  const attempts = [...state.attempts, attempt].slice(-10); // batas ukuran localStorage
  const passingSessions = countPassingSessions(attempts, th.sameDayAllowed);
  const sessionsPass = passingSessions >= th.sessions;

  const scored = result.questions.filter((q) => !q.retried);
  const next: ModuleState = {
    ...state,
    attempts,
    totals: {
      sessions: state.totals.sessions + 1,
      questions: state.totals.questions + scored.length,
      correct: state.totals.correct + scored.filter((q) => q.correct).length,
    },
    consecutiveFails: sessionPassed ? 0 : state.consecutiveFails + 1,
  };

  const events: MasteryEvent[] = [];
  const detail = {
    accuracy,
    accuracyPass,
    coveragePass,
    speedPass,
    sessionsPass,
    medianThinkMs: thinkMs,
    medianTotalMs: totalMs,
    passingSessions,
  };

  // --- Tes-lewat: pintu "aku sudah bisa ini", untuk anak yang levelnya di atas modul.
  //     Lulus = langsung mastered tanpa harus dua sesi. Gagal TIDAK menghukum apa pun:
  //     anak cuma kembali ke jalur normal dan mempelajarinya.
  if (result.kind === 'testout') {
    const strongEnough = accuracy >= TESTOUT_ACCURACY && coveragePass;
    if (strongEnough) {
      next.stars = starsFor(accuracy);
      next.consecutiveFails = 0;
      events.push({ type: 'tested-out', moduleId: def.id });
      events.push({ type: 'star', moduleId: def.id, stars: next.stars });
      // Tahu isinya tapi belum cepat tetap LEWAT. Menyuruhnya mengulang seluruh
      // modul yang barusan dia buktikan dikuasai hanya membuang waktunya; yang
      // tersisa cuma kecepatan, dan itu urusan Speed Round.
      if (speedPass) {
        next.status = 'mastered';
        next.masteredAt = result.date;
        next.reviewStage = 1;
        events.push({ type: 'mastered', moduleId: def.id });
      } else {
        next.status = 'practiced';
        events.push({ type: 'speed-round-offered', moduleId: def.id });
      }
    } else {
      next.status = state.status === 'available' ? 'available' : state.status;
      next.consecutiveFails = state.consecutiveFails; // tidak dihitung sebagai kegagalan
      events.push({ type: 'testout-failed', moduleId: def.id });
    }
    return { next, events, detail };
  }

  // --- Sesi review: jalur terpisah, tidak pernah mengunci ulang modul berikutnya.
  if (result.kind === 'review') {
    // Review menaikkan TAHAP RETENSI modul yang sudah dikuasai — ia bukan pintu
    // kelulusan. Modul `practiced` belum pernah melewati ambang kecepatan, dan
    // membiarkan review meluluskannya memberi anak `mastered` tanpa `masteredAt`:
    // nol bintang, lalu `nextReviewDate()` mengembalikan null sehingga modul itu
    // hilang selamanya dari antrean ulangan. Satu-satunya pintu keluar dari
    // `practiced` adalah Speed Round.
    if (!state.masteredAt) return { next, events, detail };

    if (sessionPassed) {
      const stage = Math.min(4, state.reviewStage + 1) as ModuleState['reviewStage'];
      next.reviewStage = stage;
      next.status = stage >= 4 ? 'retained' : 'mastered';
      events.push({ type: 'review-passed', moduleId: def.id });
      if (stage >= 4) events.push({ type: 'retained', moduleId: def.id });
    } else {
      next.status = 'needs_review';
      next.reviewStage = 1;
      events.push({ type: 'review-failed', moduleId: def.id });
    }
    return { next, events, detail };
  }

  // --- Sesi latihan: tidak pernah menaikkan status, hanya mencatat.
  if (result.kind === 'practice') {
    if (state.status === 'available') next.status = 'learning';
    if (next.consecutiveFails >= 3) events.push({ type: 'needs-reteach', moduleId: def.id });
    return { next, events, detail };
  }

  // --- Master Round: hanya menentukan bintang ke-3, tidak mengubah status.
  if (result.kind === 'master') {
    const mistakes = scored.filter((q) => !q.correct).length;
    const noHints = result.questions.every((q) => !q.hintUsed);
    if (mistakes <= 1 && noHints && thinkMs <= AUTOMATIC_THINK_MS) {
      next.stars = 3;
      events.push({ type: 'star', moduleId: def.id, stars: 3 });
    }
    return { next, events, detail };
  }

  // --- Speed Round: hanya bisa menaikkan practiced → mastered.
  if (result.kind === 'speed') {
    if (state.status === 'practiced' && speedPass && accuracyPass) {
      next.status = 'mastered';
      next.masteredAt = result.date;
      next.reviewStage = Math.max(1, state.reviewStage) as ModuleState['reviewStage'];
      next.stars = Math.max(state.stars, starsFor(accuracy)) as ModuleState['stars'];
      events.push({ type: 'mastered', moduleId: def.id });
    }
    return { next, events, detail };
  }

  // --- Mastery Check.
  //
  // Nilai sempurna melewati aturan konsistensi. Menyuruh anak mengulang kuis yang
  // baru saja dia jawab 100% benar tidak mengajarkan apa pun — itu cuma membosankan,
  // dan kebosanan adalah cara tercepat kehilangan dia. Modul yang memang menuntut
  // lebih dari satu sesi harus menyatakannya lewat `masteryOverride.sessions`.
  const perfect = accuracy === 1 && coveragePass;
  const requiresRepeats = def.masteryOverride?.sessions != null;
  if (perfect && !requiresRepeats) {
    next.stars = 2;
    if (speedPass) {
      next.status = 'mastered';
      next.masteredAt = result.date;
      next.reviewStage = Math.max(1, state.reviewStage) as ModuleState['reviewStage'];
      events.push({ type: 'mastered', moduleId: def.id });
      events.push({ type: 'star', moduleId: def.id, stars: 2 });
    } else {
      // Sempurna tapi belum cepat: dua bintang tetap DIDAPAT, dan alasan melewati
      // aturan konsistensi persis sama seperti pada anak yang cepat — mengulang
      // kuis yang baru saja dijawab 100% benar tidak mengajarkan apa pun.
      next.status = 'practiced';
      events.push({ type: 'star', moduleId: def.id, stars: 2 });
      events.push({ type: 'speed-round-offered', moduleId: def.id });
    }
    return { next, events, detail };
  }

  if (!sessionPassed || !sessionsPass) {
    next.status = 'learning';
    if (next.consecutiveFails >= 3) events.push({ type: 'needs-reteach', moduleId: def.id });
    return { next, events, detail };
  }

  if (!speedPass) {
    // Paham tapi belum cepat: modul berikutnya TETAP terbuka, dan bintangnya tetap
    // didapat. Kecepatan tidak pernah mengunci kemajuan — lihat CLAUDE.md §6.
    next.status = 'practiced';
    next.stars = Math.max(state.stars, starsFor(accuracy)) as ModuleState['stars'];
    events.push({ type: 'star', moduleId: def.id, stars: next.stars as 1 | 2 | 3 });
    events.push({ type: 'speed-round-offered', moduleId: def.id });
    return { next, events, detail };
  }

  next.status = 'mastered';
  next.masteredAt = result.date;
  next.reviewStage = Math.max(1, state.reviewStage) as ModuleState['reviewStage'];
  // Math.max: mengulang kuis yang sudah berbintang dua dengan nilai lebih rendah
  // tidak boleh MENCABUT bintang yang sudah didapat.
  next.stars = Math.max(state.stars, starsFor(accuracy)) as ModuleState['stars'];
  events.push({ type: 'mastered', moduleId: def.id });
  events.push({ type: 'star', moduleId: def.id, stars: next.stars as 1 | 2 | 3 });
  return { next, events, detail };
}

/** Modul terbuka untuk modul berikutnya? mastered / retained / practiced semuanya "lewat". */
export function isCleared(state: ModuleState | undefined): boolean {
  return (
    state?.status === 'mastered' ||
    state?.status === 'retained' ||
    state?.status === 'practiced' ||
    state?.status === 'needs_review'
  );
}

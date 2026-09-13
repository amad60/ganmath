import { addDays, daysBetween, nextReviewDate } from './review';
import type { ModuleState } from './types';

/**
 * Laporan kemajuan per grade untuk orang tua — fungsi murni, tanpa React.
 *
 * Parent Area dulu hanya tahu grade yang SEDANG aktif: begitu anak naik ke Grade 2,
 * seluruh cerita Grade 1 (berapa hari, mana yang langsung bisa, mana yang butuh
 * diulang) hilang dari layar walau datanya masih tersimpan utuh per modul. Semua
 * angka di sini diturunkan dari `ModuleState` yang sudah ada; tidak ada data baru
 * yang dicatat, jadi riwayat lama langsung terbaca.
 *
 * Batas jujurnya ditulis di tempat angkanya dipakai:
 * - Tanggal hanya per HARI (`YYYY-MM-DD`) — tidak ada jam, jadi "berapa hari", bukan
 *   "berapa jam".
 * - Waktu adalah PERKIRAAN waktu menjawab soal (median per sesi × jumlah soal);
 *   waktu membaca materi tidak tercatat.
 * - `attempts` dipotong 10 terakhir per modul; modul yang dicoba lebih dari itu
 *   kehilangan percobaan paling awal.
 */

export type ModuleRef = { id: string; title: string; unitId: string };

export type ModuleOutcome =
  /** Belum pernah disentuh. */
  | 'not-started'
  | 'in-progress'
  /** Lulus akurasi, kecepatan belum — Speed Round masih terbuka. */
  | 'speed-open'
  | 'mastered'
  | 'needs-review'
  | 'retained';

export type ModuleReport = {
  id: string;
  title: string;
  outcome: ModuleOutcome;
  stars: 0 | 1 | 2 | 3;
  startedOn: string | null;
  masteredOn: string | null;
  /** Hari kalender dari mulai sampai dikuasai, inklusif (hari yang sama = 1). */
  days: number | null;
  accuracy: number | null;
  sessions: number;
  questions: number;
  /** Kuis sampai lulus pertama (termasuk yang lulus). null = belum/bukan lewat kuis. */
  quizTries: number | null;
  /** Dikuasai lewat "lompati" (tes modul atau tes unit), bukan dipelajari. */
  skipped: boolean;
  /** 0 = belum ada ulangan lulus, 4 = keempat ulangan berjarak lulus. */
  reviewsPassed: number;
  nextReview: string | null;
};

export type UnitReport = {
  id: string;
  title: string;
  total: number;
  cleared: number;
  stars: number;
  days: number | null;
  modules: ModuleReport[];
};

export type GradeReport = {
  grade: number;
  total: number;
  /** Dikuasai, termasuk yang Speed Round-nya masih terbuka (modul berikutnya sudah dibuka). */
  cleared: number;
  complete: boolean;
  startedOn: string | null;
  /** Tanggal modul terakhir dikuasai — hanya diisi kalau grade-nya tuntas. */
  completedOn: string | null;
  lastActiveOn: string | null;
  days: number | null;
  activeDays: number;
  stars: number;
  maxStars: number;
  accuracy: number | null;
  sessions: number;
  questions: number;
  /** Perkiraan menit menjawab soal. Lihat catatan di atas. */
  approxMinutes: number;
  firstTry: number;
  extraTries: ModuleReport[];
  speedOpen: number;
  skipped: number;
  /** `checked` = modul yang sudah lulus minimal satu ulangan berjarak. */
  reviews: { checked: number; retained: number; needsReview: number; nextDue: string | null };
  /** Modul dikuasai per hari, dari hari pertama sampai terakhir — hari kosong ikut (0). */
  perDay: { date: string; count: number }[];
  units: UnitReport[];
};

const day = (s: string | undefined | null) => (s ? s.slice(0, 10) : null);

const CLEARED: ModuleOutcome[] = ['speed-open', 'mastered', 'needs-review', 'retained'];

function outcomeOf(s: ModuleState | undefined): ModuleOutcome {
  if (!s) return 'not-started';
  switch (s.status) {
    case 'available':
      return s.learnCompletedAt || s.attempts.length > 0 ? 'in-progress' : 'not-started';
    case 'learning':
      return 'in-progress';
    case 'practiced':
      return 'speed-open';
    case 'needs_review':
      return 'needs-review';
    default:
      return s.status;
  }
}

export function moduleReport(ref: ModuleRef, s: ModuleState | undefined): ModuleReport {
  const outcome = outcomeOf(s);
  const attempts = s?.attempts ?? [];
  const masteredOn = day(s?.masteredAt);
  const dates = [day(s?.learnCompletedAt), ...attempts.map((a) => a.date)].filter(
    (d): d is string => d != null,
  );
  const startedOn = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : null;

  const quizzes = attempts.filter((a) => a.kind === 'quiz' || a.kind === 'master');
  const firstPass = quizzes.findIndex((a) => a.passed);
  // Tes satu unit menandai modulnya dikuasai tanpa satu sesi pun di modul itu.
  const skipped =
    CLEARED.includes(outcome) &&
    (attempts.some((a) => a.kind === 'testout' && a.passed) || (s?.totals.sessions ?? 0) === 0);

  return {
    id: ref.id,
    title: ref.title,
    outcome,
    stars: s?.stars ?? 0,
    startedOn,
    masteredOn,
    days: startedOn && masteredOn ? daysBetween(startedOn, masteredOn) + 1 : null,
    accuracy: s && s.totals.questions > 0 ? s.totals.correct / s.totals.questions : null,
    sessions: s?.totals.sessions ?? 0,
    questions: s?.totals.questions ?? 0,
    quizTries: firstPass >= 0 ? firstPass + 1 : null,
    skipped,
    // `reviewStage` = ulangan berikutnya (1 = R1); `retained` = keempatnya lulus.
    reviewsPassed: outcome === 'retained' ? 4 : Math.max(0, (s?.reviewStage ?? 0) - 1),
    nextReview: s && CLEARED.includes(outcome) ? nextReviewDate(s) : null,
  };
}

function span(dates: (string | null)[]): { from: string; to: string } | null {
  const ds = dates.filter((d): d is string => d != null).sort();
  return ds.length ? { from: ds[0]!, to: ds.at(-1)! } : null;
}

export function gradeReport(
  grade: number,
  refs: ModuleRef[],
  states: Record<string, ModuleState>,
  unitTitle: (unitId: string) => string,
): GradeReport {
  const modules = refs.map((r) => moduleReport(r, states[r.id]));
  const cleared = modules.filter((m) => CLEARED.includes(m.outcome));
  const complete = modules.length > 0 && cleared.length === modules.length;

  const activity = modules.flatMap((m) => {
    const s = states[m.id];
    return [day(s?.learnCompletedAt), ...(s?.attempts ?? []).map((a) => a.date)];
  });
  const whole = span([...activity, ...modules.map((m) => m.masteredOn)]);
  const lastMastered = span(cleared.map((m) => m.masteredOn));
  const completedOn = complete ? (lastMastered?.to ?? null) : null;

  const perDay: GradeReport['perDay'] = [];
  const firstDay = span(modules.map((m) => m.startedOn).concat(cleared.map((m) => m.masteredOn)));
  const lastDay = completedOn ?? whole?.to ?? null;
  if (firstDay && lastDay) {
    const count = new Map<string, number>();
    for (const m of cleared) if (m.masteredOn) count.set(m.masteredOn, (count.get(m.masteredOn) ?? 0) + 1);
    // Maksimal 60 batang: grade yang ditempuh berbulan-bulan tidak jadi grafik selebar layar.
    const n = Math.min(60, daysBetween(firstDay.from, lastDay) + 1);
    const start = daysBetween(firstDay.from, lastDay) + 1 > 60 ? addDays(lastDay, -59) : firstDay.from;
    for (let i = 0; i < n; i++) {
      const d = addDays(start, i);
      perDay.push({ date: d, count: count.get(d) ?? 0 });
    }
  }

  let answered = 0;
  let correct = 0;
  let minutes = 0;
  for (const m of modules) {
    const s = states[m.id];
    if (!s) continue;
    answered += s.totals.questions;
    correct += s.totals.correct;
    const timed = s.attempts.filter((a) => a.medianTotalMs > 0);
    if (timed.length && s.totals.questions) {
      const mean = timed.reduce((t, a) => t + a.medianTotalMs, 0) / timed.length;
      minutes += (mean * s.totals.questions) / 60_000;
    }
  }

  // Urut NOMOR unit, bukan urutan jalur belajar: jalurnya sengaja menyelang-nyeling
  // unit (bentuk di tengah bilangan), dan laporan yang berbunyi "Unit 1, 6, 2, 8"
  // membuat orang tua mencari-cari.
  const unitNo = (id: string) => Number(id.match(/-u(\d+)$/)?.[1] ?? 0);
  const unitIds = [...new Set(refs.map((r) => r.unitId))].sort((a, b) => unitNo(a) - unitNo(b));
  const units: UnitReport[] = unitIds.map((uid) => {
    const ms = modules.filter((_, i) => refs[i]!.unitId === uid);
    const done = ms.filter((m) => CLEARED.includes(m.outcome));
    const s = span(ms.map((m) => m.startedOn).concat(done.map((m) => m.masteredOn)));
    return {
      id: uid,
      title: unitTitle(uid),
      total: ms.length,
      cleared: done.length,
      stars: ms.reduce((t, m) => t + m.stars, 0),
      days: done.length === ms.length && s ? daysBetween(s.from, s.to) + 1 : null,
      modules: ms,
    };
  });

  const dueDates = cleared.map((m) => m.nextReview).filter((d): d is string => d != null).sort();

  return {
    grade,
    total: modules.length,
    cleared: cleared.length,
    complete,
    startedOn: whole?.from ?? null,
    completedOn,
    lastActiveOn: whole?.to ?? null,
    days: whole && (completedOn ?? whole.to) ? daysBetween(whole.from, completedOn ?? whole.to) + 1 : null,
    // Hari belajar SAMPAI tuntas — ulangan sesudahnya tidak ikut menambah "berapa hari".
    activeDays: new Set(activity.filter((d): d is string => d != null && (!completedOn || d <= completedOn))).size,
    stars: modules.reduce((t, m) => t + m.stars, 0),
    maxStars: modules.length * 3,
    accuracy: answered > 0 ? correct / answered : null,
    sessions: modules.reduce((t, m) => t + m.sessions, 0),
    questions: answered,
    approxMinutes: Math.round(minutes),
    firstTry: cleared.filter((m) => m.quizTries === 1).length,
    extraTries: cleared
      .filter((m) => (m.quizTries ?? 0) > 1)
      .sort((a, b) => (b.quizTries ?? 0) - (a.quizTries ?? 0)),
    speedOpen: modules.filter((m) => m.outcome === 'speed-open').length,
    skipped: cleared.filter((m) => m.skipped).length,
    reviews: {
      checked: modules.filter((m) => m.reviewsPassed > 0).length,
      retained: modules.filter((m) => m.outcome === 'retained').length,
      needsReview: modules.filter((m) => m.outcome === 'needs-review').length,
      nextDue: dueDates[0] ?? null,
    },
    perDay,
    units,
  };
}

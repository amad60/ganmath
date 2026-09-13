import { describe, expect, it } from 'vitest';
import { gradeReport, moduleReport } from './report';
import { state } from './fixtures';
import type { Attempt } from './types';

const att = (date: string, kind: Attempt['kind'], passed: boolean, ms = 4000): Attempt => ({
  date,
  kind,
  accuracy: passed ? 1 : 0.6,
  medianThinkMs: ms / 2,
  medianTotalMs: ms,
  passed,
});

const refs = [
  { id: 'a1', title: 'A one', unitId: 'u1' },
  { id: 'a2', title: 'A two', unitId: 'u1' },
  { id: 'b1', title: 'B one', unitId: 'u2' },
  { id: 'b2', title: 'B two', unitId: 'u2' },
];

const done = {
  // Hari 1: dipelajari, lulus kuis pertama.
  a1: state({
    status: 'mastered',
    stars: 2,
    learnCompletedAt: '2026-09-08',
    masteredAt: '2026-09-08',
    reviewStage: 1,
    attempts: [att('2026-09-08', 'practice', true), att('2026-09-08', 'quiz', true)],
    totals: { sessions: 2, questions: 18, correct: 17 },
  }),
  // Hari 1–3: gagal dua kali dulu.
  a2: state({
    status: 'mastered',
    stars: 1,
    learnCompletedAt: '2026-09-08',
    masteredAt: '2026-09-10',
    reviewStage: 2,
    attempts: [att('2026-09-08', 'quiz', false), att('2026-09-09', 'quiz', false), att('2026-09-10', 'quiz', true)],
    totals: { sessions: 3, questions: 30, correct: 22 },
  }),
  // Lulus akurasi, kecepatan belum.
  b1: state({
    status: 'practiced',
    stars: 2,
    learnCompletedAt: '2026-09-10',
    attempts: [att('2026-09-10', 'quiz', true, 9000)],
    totals: { sessions: 1, questions: 10, correct: 10 },
  }),
  // Dilompati lewat tes unit: tanpa satu sesi pun di modul ini.
  b2: state({ status: 'mastered', stars: 1, masteredAt: '2026-09-10', learnCompletedAt: '2026-09-10', reviewStage: 1 }),
};

describe('laporan per grade', () => {
  const r = gradeReport(1, refs, done, (u) => u.toUpperCase());

  it('tuntas: dari hari pertama sampai modul terakhir dikuasai, inklusif', () => {
    expect(r.complete).toBe(true);
    expect(r.startedOn).toBe('2026-09-08');
    expect(r.completedOn).toBe('2026-09-10');
    expect(r.days).toBe(3);
    expect(r.activeDays).toBe(3);
  });

  it('Speed Round yang masih terbuka tetap dihitung tuntas (modul berikutnya sudah terbuka)', () => {
    expect(r.cleared).toBe(4);
    expect(r.speedOpen).toBe(1);
  });

  it('membedakan lulus pertama, perlu diulang, dan dilompati', () => {
    expect(r.firstTry).toBe(2); // a1 dan b1
    expect(r.extraTries.map((m) => [m.id, m.quizTries])).toEqual([['a2', 3]]);
    expect(r.skipped).toBe(1);
    expect(moduleReport(refs[3]!, done.b2).skipped).toBe(true);
    expect(moduleReport(refs[0]!, done.a1).skipped).toBe(false);
  });

  it('grafik per hari: hari kosong ikut, jumlahnya = modul yang dikuasai', () => {
    // b1 (practiced) belum punya masteredAt, jadi tidak jatuh di hari mana pun.
    expect(r.perDay).toEqual([
      { date: '2026-09-08', count: 1 },
      { date: '2026-09-09', count: 0 },
      { date: '2026-09-10', count: 2 },
    ]);
  });

  it('akurasi & perkiraan waktu dari data yang tersimpan', () => {
    expect(r.questions).toBe(58);
    expect(r.accuracy).toBeCloseTo(49 / 58, 6);
    // 18×4s + 30×4s + 10×9s = 282s ≈ 5 menit
    expect(r.approxMinutes).toBe(5);
  });

  it('unit diurutkan nomornya, bukan urutan jalur belajar', () => {
    const mixed = [
      { id: 'x1', title: 'X', unitId: 'g1-u6' },
      { id: 'x2', title: 'Y', unitId: 'g1-u2' },
      { id: 'x3', title: 'Z', unitId: 'g1-u10' },
    ];
    expect(gradeReport(1, mixed, {}, (u) => u).units.map((u) => u.id)).toEqual(['g1-u2', 'g1-u6', 'g1-u10']);
  });

  it('unit: bintang dan hari per unit', () => {
    expect(r.units.map((u) => [u.title, u.cleared, u.stars, u.days])).toEqual([
      ['U1', 2, 3, 3],
      ['U2', 2, 3, 1],
    ]);
  });

  it('ulangan sesudah tuntas tidak memanjangkan "berapa hari"', () => {
    const later = {
      ...done,
      a1: { ...done.a1, reviewStage: 2 as const, attempts: [...done.a1.attempts, att('2026-09-11', 'review', true)] },
    };
    const x = gradeReport(1, refs, later, (u) => u);
    expect(x.days).toBe(3);
    expect(x.activeDays).toBe(3);
    expect(x.lastActiveOn).toBe('2026-09-11');
    expect(moduleReport(refs[0]!, later.a1).reviewsPassed).toBe(1);
    // a1 (lulus R1) dan a2 (reviewStage 2) sudah lulus satu ulangan.
    expect(x.reviews.checked).toBe(2);
  });

  it('grade yang belum disentuh tidak mengarang tanggal', () => {
    const x = gradeReport(2, refs, {}, (u) => u);
    expect(x.cleared).toBe(0);
    expect(x.startedOn).toBeNull();
    expect(x.days).toBeNull();
    expect(x.perDay).toEqual([]);
  });

  it('grade berjalan: belum ada tanggal tuntas', () => {
    const x = gradeReport(1, refs, { a1: done.a1 }, (u) => u);
    expect(x.complete).toBe(false);
    expect(x.completedOn).toBeNull();
    expect(x.days).toBe(1);
  });
});

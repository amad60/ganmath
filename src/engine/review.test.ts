import { describe, expect, it } from 'vitest';
import { addDays, daysBetween, dueReviews, nextReviewDate, toDateString } from './review';
import { state } from './fixtures';

describe('tanggal', () => {
  it('addDays menyeberangi batas bulan', () => {
    expect(addDays('2026-01-30', 3)).toBe('2026-02-02');
  });
  it('daysBetween tahan terhadap pergantian DST (dihitung di UTC)', () => {
    expect(daysBetween('2026-03-01', '2026-04-01')).toBe(31);
  });
  it('toDateString memakai tanggal lokal, bukan UTC', () => {
    expect(toDateString(new Date(2026, 8, 8))).toBe('2026-09-08');
  });
});

describe('jadwal review', () => {
  it('R1 jatuh 3 hari setelah dikuasai', () => {
    const s = state({ status: 'mastered', masteredAt: '2026-09-01', reviewStage: 1 });
    expect(nextReviewDate(s)).toBe('2026-09-04');
  });

  it('offset naik 3 → 7 → 30 → 60 hari', () => {
    const base = { status: 'mastered' as const, masteredAt: '2026-09-01' };
    expect(nextReviewDate(state({ ...base, reviewStage: 1 }))).toBe('2026-09-04');
    expect(nextReviewDate(state({ ...base, reviewStage: 2 }))).toBe('2026-09-08');
    expect(nextReviewDate(state({ ...base, reviewStage: 3 }))).toBe('2026-10-01');
    expect(nextReviewDate(state({ ...base, reviewStage: 4 }))).toBe('2026-10-31');
  });

  it('modul retained keluar dari antrean', () => {
    expect(nextReviewDate(state({ status: 'retained', masteredAt: '2026-09-01' }))).toBeNull();
  });

  it('maksimal 2 modul review per hari', () => {
    const modules = Object.fromEntries(
      ['a', 'b', 'c', 'd'].map((id) => [
        id,
        state({ status: 'mastered', masteredAt: '2026-09-01', reviewStage: 1 }),
      ]),
    );
    expect(dueReviews(modules, '2026-09-20')).toHaveLength(2);
  });

  it('prioritas: akurasi terendah lebih dulu', () => {
    const mk = (correct: number) =>
      state({
        status: 'mastered',
        masteredAt: '2026-09-01',
        reviewStage: 1,
        totals: { sessions: 1, questions: 10, correct },
      });
    const due = dueReviews({ good: mk(10), weak: mk(6), mid: mk(8) }, '2026-09-20');
    expect(due.map((d) => d.moduleId)).toEqual(['weak', 'mid']);
  });

  it('modul needs_review selalu masuk antrean hari ini', () => {
    const due = dueReviews({ x: state({ status: 'needs_review' }) }, '2026-09-20');
    expect(due[0]?.moduleId).toBe('x');
  });

  it('yang belum jatuh tempo tidak muncul', () => {
    const s = state({ status: 'mastered', masteredAt: '2026-09-01', reviewStage: 1 });
    expect(dueReviews({ x: s }, '2026-09-02')).toHaveLength(0);
  });
});

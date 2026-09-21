import { describe, expect, it } from 'vitest';
import {
  addDays,
  daysBetween,
  dueReviews,
  dueReviewsForGrade,
  gradeOfModuleId,
  nextReviewDate,
  toDateString,
} from './review';
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

describe('ulangan lintas grade', () => {
  const mastered = (extra: Partial<ReturnType<typeof state>> = {}) =>
    state({
      status: 'mastered',
      masteredAt: '2026-09-01',
      reviewStage: 1,
      totals: { sessions: 1, questions: 10, correct: 8 },
      ...extra,
    });

  it('membaca grade dari ID modul', () => {
    expect(gradeOfModuleId('g1-u2-m4')).toBe(1);
    expect(gradeOfModuleId('g2-u1-m1')).toBe(2);
    expect(gradeOfModuleId('unit:g1-u2')).toBeNull();
  });

  it('Grade 1: dua ulangan dari kelas itu sendiri', () => {
    const due = dueReviewsForGrade(
      {
        'g1-u1-m1': mastered({ totals: { sessions: 1, questions: 10, correct: 5 } }),
        'g1-u2-m4': mastered({ totals: { sessions: 1, questions: 10, correct: 9 } }),
        'g1-u4-m2': mastered(),
      },
      '2026-09-20',
      1,
    );
    expect(due.map((d) => d.moduleId)).toEqual(['g1-u1-m1', 'g1-u4-m2']);
  });

  it('Grade 2: satu slot untuk fakta Grade 1 yang jatuh tempo', () => {
    const due = dueReviewsForGrade(
      {
        'g1-u2-m4': mastered({ totals: { sessions: 1, questions: 10, correct: 4 } }),
        'g2-u1-m1': mastered({ totals: { sessions: 1, questions: 10, correct: 8 } }),
        'g2-u2-m1': mastered({ totals: { sessions: 1, questions: 10, correct: 9 } }),
      },
      '2026-09-20',
      2,
    );
    expect(due.map((d) => d.moduleId)).toEqual(['g1-u2-m4', 'g2-u1-m1']);
  });

  it('kalau kelas lama tidak punya yang jatuh tempo, keduanya dari kelas aktif', () => {
    const due = dueReviewsForGrade(
      {
        'g1-u2-m4': state({ status: 'mastered', masteredAt: '2026-09-19', reviewStage: 1 }),
        'g2-u1-m1': mastered({ totals: { sessions: 1, questions: 10, correct: 5 } }),
        'g2-u2-m1': mastered({ totals: { sessions: 1, questions: 10, correct: 6 } }),
      },
      '2026-09-20',
      2,
    );
    expect(due.map((d) => d.moduleId)).toEqual(['g2-u1-m1', 'g2-u2-m1']);
  });
});

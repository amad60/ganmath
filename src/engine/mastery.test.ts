import { describe, expect, it } from 'vitest';
import { accuracyOf, evaluate, speedOf } from './mastery';
import { addModule, session, state } from './fixtures';
import type { QuestionResult } from './types';

const q = (over: Partial<QuestionResult> = {}): QuestionResult => ({
  questionId: 'q',
  type: 'choose-number',
  skill: 'add-within-10',
  correct: true,
  thinkMs: 2000,
  totalMs: 3000,
  retried: false,
  hintUsed: false,
  ...over,
});

describe('akurasi & kecepatan', () => {
  it('soal ulangan tidak dihitung dalam akurasi — satu kesalahan tidak dihukum dua kali', () => {
    const r = session({ n: 0 });
    r.questions = [
      ...Array.from({ length: 8 }, () => q()),
      q({ correct: false, retried: true }),
      q({ correct: true, retried: true }),
    ];
    expect(accuracyOf(r)).toBe(1);
  });

  it('soal >30 detik dibuang dari kecepatan tapi tetap dihitung untuk akurasi', () => {
    const r = session({ n: 0 });
    r.questions = [
      q({ thinkMs: 2000, totalMs: 3000 }),
      q({ thinkMs: 2200, totalMs: 3200 }),
      q({ correct: false, thinkMs: 45000, totalMs: 60000 }),
    ];
    expect(speedOf(r).thinkMs).toBe(2100);
    expect(accuracyOf(r)).toBeCloseTo(2 / 3);
  });
});

describe('mastery check — tabel keputusan', () => {
  const def = addModule();

  it('sesi pertama lulus tapi belum cukup konsistensi → belum mastered', () => {
    const e = evaluate(def, state(), session());
    expect(e.detail.accuracyPass).toBe(true);
    expect(e.detail.sessionsPass).toBe(false);
    expect(e.next.status).toBe('learning');
  });

  it('dua sesi lulus (grade 1 boleh hari sama) → mastered + 2 bintang', () => {
    const first = evaluate(def, state(), session());
    const second = evaluate(def, first.next, session());
    expect(second.next.status).toBe('mastered');
    expect(second.next.stars).toBe(2); // akurasi 100% ≥ 95%
    expect(second.events.map((x) => x.type)).toContain('mastered');
  });

  it('grade 2 menuntut hari berbeda', () => {
    const g2 = addModule({ id: 'g2-x', grade: 2 });
    const a = evaluate(g2, state(), session({ date: '2026-09-08' }));
    const b = evaluate(g2, a.next, session({ date: '2026-09-08' }));
    expect(b.next.status).toBe('learning');
    const c = evaluate(g2, b.next, session({ date: '2026-09-09' }));
    expect(c.next.status).toBe('mastered');
  });

  it('akurasi di bawah ambang → learning', () => {
    const e = evaluate(def, state(), session({ correct: 6 }));
    expect(e.next.status).toBe('learning');
  });

  it('cakupan gagal (satu questionType tidak pernah benar) → tidak lulus', () => {
    const e = evaluate(def, state(), session({ types: ['choose-number'] }));
    expect(e.detail.coveragePass).toBe(false);
    expect(e.next.status).toBe('learning');
  });

  it('paham tapi lambat → practiced, BUKAN gagal, dan modul berikutnya tetap terbuka', () => {
    const a = evaluate(def, state(), session({ thinkMs: 12_000 }));
    const b = evaluate(def, a.next, session({ thinkMs: 12_000 }));
    expect(b.detail.accuracyPass).toBe(true);
    expect(b.detail.speedPass).toBe(false);
    expect(b.next.status).toBe('practiced');
    expect(b.events.map((x) => x.type)).toContain('speed-round-offered');
  });

  it('modul concept tidak pernah dinilai kecepatan', () => {
    const concept = addModule({ kind: 'concept', fluencyTracked: false });
    const a = evaluate(concept, state(), session({ thinkMs: 20_000 }));
    const b = evaluate(concept, a.next, session({ thinkMs: 20_000 }));
    expect(b.next.status).toBe('mastered');
  });

  it('3 kali gagal berturut-turut memicu ajar ulang', () => {
    let s = state();
    let events: string[] = [];
    for (let i = 0; i < 3; i++) {
      const e = evaluate(def, s, session({ correct: 4 }));
      s = e.next;
      events = e.events.map((x) => x.type);
    }
    expect(s.consecutiveFails).toBe(3);
    expect(events).toContain('needs-reteach');
  });

  it('sesi latihan tidak pernah menaikkan status ke mastered', () => {
    const e = evaluate(def, state(), session({ kind: 'practice' }));
    expect(e.next.status).toBe('learning');
  });

  it('riwayat attempt dibatasi 10 terakhir (batas ukuran localStorage)', () => {
    let s = state();
    for (let i = 0; i < 15; i++) s = evaluate(def, s, session()).next;
    expect(s.attempts).toHaveLength(10);
  });
});

describe('speed round & master round', () => {
  const def = addModule();

  it('speed round menaikkan practiced → mastered', () => {
    const practiced = state({ status: 'practiced' });
    const e = evaluate(def, practiced, session({ kind: 'speed', thinkMs: 2000 }));
    expect(e.next.status).toBe('mastered');
  });

  it('speed round yang masih lambat tidak mengubah apa pun', () => {
    const practiced = state({ status: 'practiced' });
    const e = evaluate(def, practiced, session({ kind: 'speed', thinkMs: 12_000 }));
    expect(e.next.status).toBe('practiced');
  });

  it('master round memberi bintang ke-3 kalau cepat, tanpa hint, maks 1 salah', () => {
    const m = state({ status: 'mastered', stars: 2 });
    const e = evaluate(def, m, session({ kind: 'master', n: 10, correct: 9, thinkMs: 2500 }));
    expect(e.next.stars).toBe(3);
  });

  it('master round dengan hint tidak memberi bintang ke-3', () => {
    const m = state({ status: 'mastered', stars: 2 });
    const e = evaluate(def, m, session({ kind: 'master', thinkMs: 2500, hintUsed: true }));
    expect(e.next.stars).toBe(2);
  });

  it('master round yang lambat tidak memberi bintang ke-3', () => {
    const m = state({ status: 'mastered', stars: 2 });
    const e = evaluate(def, m, session({ kind: 'master', thinkMs: 5000 }));
    expect(e.next.stars).toBe(2);
  });
});

describe('tes-lewat (jump level)', () => {
  const def = addModule();

  it('anak yang sudah bisa langsung menguasai modul tanpa dua sesi', () => {
    const e = evaluate(def, state(), session({ kind: 'testout', n: 10, correct: 10, thinkMs: 1800 }));
    expect(e.next.status).toBe('mastered');
    expect(e.events.map((x) => x.type)).toContain('tested-out');
  });

  it('ambangnya lebih tinggi daripada lulus biasa — 80% tidak cukup untuk melompat', () => {
    const e = evaluate(def, state(), session({ kind: 'testout', n: 10, correct: 8, thinkMs: 1800 }));
    expect(e.next.status).not.toBe('mastered');
    expect(e.events.map((x) => x.type)).toContain('testout-failed');
  });

  it('gagal melompat tidak menghukum apa pun', () => {
    const before = state({ consecutiveFails: 1 });
    const e = evaluate(def, before, session({ kind: 'testout', correct: 3 }));
    expect(e.next.consecutiveFails).toBe(1);
    expect(e.next.status).toBe('available');
  });

  it('melompat sambil lambat tidak diizinkan untuk modul hafalan', () => {
    const e = evaluate(def, state(), session({ kind: 'testout', correct: 10, thinkMs: 12_000 }));
    expect(e.next.status).not.toBe('mastered');
  });
});

describe('review', () => {
  const def = addModule();

  it('review lulus menaikkan stage; stage 4 → retained', () => {
    let s = state({ status: 'mastered', stars: 1, masteredAt: '2026-09-01', reviewStage: 3 });
    const e = evaluate(def, s, session({ kind: 'review', n: 5, correct: 5 }));
    s = e.next;
    expect(s.reviewStage).toBe(4);
    expect(s.status).toBe('retained');
    expect(e.events.map((x) => x.type)).toContain('retained');
  });

  it('review gagal → needs_review dan mundur ke stage 1, tidak mengunci modul berikutnya', () => {
    const s = state({ status: 'mastered', masteredAt: '2026-09-01', reviewStage: 2 });
    const e = evaluate(def, s, session({ kind: 'review', n: 5, correct: 1 }));
    expect(e.next.status).toBe('needs_review');
    expect(e.next.reviewStage).toBe(1);
  });
});

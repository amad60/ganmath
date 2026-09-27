import { describe, expect, it } from 'vitest';
import { looksFresh, winningSide, winningState } from './winner';

describe('winningSide', () => {
  it('yang ditulis belakangan menang', () => {
    expect(winningSide('2026-09-21T04:00:00.000Z', '2026-09-21T05:00:00.000Z')).toBe('cloud');
    expect(winningSide('2026-09-21T05:00:00.000Z', '2026-09-21T04:00:00.000Z')).toBe('local');
  });

  it('stempel sama = tidak perlu tulis ulang', () => {
    expect(winningSide('2026-09-21T04:00:00.000Z', '2026-09-21T04:00:00.000Z')).toBe('same');
  });
});

describe('winningState', () => {
  const empty = { updatedAt: '2026-09-21T12:00:00.000Z', modules: {} };
  const learned = {
    updatedAt: '2026-09-21T08:00:00.000Z',
    modules: { 'g1-u1-m1': { status: 'mastered' } },
  };

  it('HP baru yang hanya punya nama tidak menimpa progress cloud', () => {
    expect(winningState(empty, learned)).toBe('cloud');
    expect(looksFresh(empty.modules)).toBe(true);
  });

  it('cloud kosong tidak menimpa HP yang sudah belajar', () => {
    expect(winningState(learned, empty)).toBe('local');
  });

  it('dua HP yang sama-sama ada isinya: stempel yang lebih baru', () => {
    const newer = { ...learned, updatedAt: '2026-09-21T13:00:00.000Z' };
    expect(winningState(learned, newer)).toBe('cloud');
    expect(winningState(newer, learned)).toBe('local');
  });

  it('cloud yang memiliki modul read tidak dianggap kosong', () => {
    const readLearned = {
      updatedAt: '2026-09-27T08:00:00.000Z',
      modules: { 'r1-u1-m1': { status: 'mastered' } },
    };
    expect(looksFresh(readLearned.modules)).toBe(false);
  });
});

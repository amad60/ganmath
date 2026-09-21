import { describe, expect, it } from 'vitest';
import { winningSide } from './winner';

describe('winningSide', () => {
  it('yang ditulis belakangan menang', () => {
    expect(winningSide('2026-09-21T04:00:00.000Z', '2026-09-21T05:00:00.000Z')).toBe('cloud');
    expect(winningSide('2026-09-21T05:00:00.000Z', '2026-09-21T04:00:00.000Z')).toBe('local');
  });

  it('stempel sama = tidak perlu tulis ulang', () => {
    expect(winningSide('2026-09-21T04:00:00.000Z', '2026-09-21T04:00:00.000Z')).toBe('same');
  });
});

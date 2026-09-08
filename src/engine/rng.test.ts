import { describe, expect, it } from 'vitest';
import { median, mulberry32, randInt, shuffle } from './rng';

describe('rng', () => {
  it('seed yang sama menghasilkan urutan yang sama (sesi bisa direproduksi)', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    const seqA = Array.from({ length: 20 }, () => a());
    const seqB = Array.from({ length: 20 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('seed berbeda menghasilkan urutan berbeda', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });

  it('randInt menghormati batas inklusif', () => {
    const rng = mulberry32(7);
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) seen.add(randInt(rng, 3, 6));
    expect([...seen].sort()).toEqual([3, 4, 5, 6]);
  });

  it('shuffle tidak mengubah input', () => {
    const rng = mulberry32(9);
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(rng, input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect(out.slice().sort()).toEqual(input);
  });

  it('median menangani ganjil, genap, dan kosong', () => {
    expect(median([5, 1, 3])).toBe(3);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([])).toBe(0);
  });

  it('median tahan terhadap satu nilai ekstrem (alasan kita tidak pakai rata-rata)', () => {
    expect(median([2000, 2100, 2200, 2300, 60000])).toBe(2200);
  });
});

import { describe, expect, it } from 'vitest';
import { clamp, formatValue, fromRatio, snapToStep, ticksFor, toRatio } from './scale';

describe('penempatan pada garis bilangan', () => {
  it('bekerja pada domain positif', () => {
    expect(toRatio(50, 0, 100)).toBe(0.5);
    expect(fromRatio(0.5, 0, 100)).toBe(50);
  });

  it('bekerja pada domain negatif (Grade 6 — integers)', () => {
    expect(toRatio(0, -10, 10)).toBe(0.5);
    expect(toRatio(-10, -10, 10)).toBe(0);
    expect(fromRatio(0.25, -10, 10)).toBe(-5);
  });

  it('snap relatif terhadap min, bukan terhadap nol', () => {
    expect(snapToStep(2.6, 0, 1)).toBe(3);
    expect(snapToStep(-2.6, -10, 1)).toBe(-3);
    expect(snapToStep(0.34, 0, 0.25)).toBe(0.25);
  });

  it('snap pecahan tidak menghasilkan sampah floating point', () => {
    expect(snapToStep(0.3, 0, 0.1)).toBe(0.3);
    expect(String(snapToStep(0.7, 0, 0.1))).toBe('0.7');
  });

  it('clamp menjaga nilai di dalam domain', () => {
    expect(clamp(120, 0, 100)).toBe(100);
    expect(clamp(-5, 0, 100)).toBe(0);
  });
});

describe('tick', () => {
  it('garis 0–10 menampilkan semua satuan', () => {
    expect(ticksFor(0, 10, 1)).toHaveLength(11);
  });

  it('garis 0–100 tidak jadi sisir rapat', () => {
    const ticks = ticksFor(0, 100, 1);
    expect(ticks.length).toBeLessThanOrEqual(21);
    expect(ticks[1]).toBe(5);
  });

  it('domain negatif tetap memuat nol', () => {
    expect(ticksFor(-10, 10, 1)).toContain(0);
  });
});

describe('label pecahan (Grade 3+)', () => {
  it('tanpa denominator menampilkan angka biasa', () => {
    expect(formatValue(3)).toBe('3');
  });

  it('menyederhanakan pecahan', () => {
    expect(formatValue(0.5, 4)).toBe('1/2');
    expect(formatValue(0.25, 4)).toBe('1/4');
    expect(formatValue(0.75, 4)).toBe('3/4');
  });

  it('menampilkan pecahan campuran', () => {
    expect(formatValue(1.5, 2)).toBe('1 1/2');
  });

  it('bilangan bulat tidak ditulis sebagai pecahan', () => {
    expect(formatValue(2, 4)).toBe('2');
  });
});

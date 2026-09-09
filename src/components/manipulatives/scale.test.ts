import { describe, expect, it } from 'vitest';
import {
  clamp,
  formatValue,
  fromRatio,
  maxTicksFor,
  snapToStep,
  stepFor,
  ticksFor,
  toRatio,
} from './scale';

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

/**
 * Sebelum ini setiap garis bilangan memakai langkah 1, berapa pun lebarnya.
 * Di garis 0–10.000 itu berarti satu satuan selebar 0,036px: soal "Put 3000 on
 * the line" di g3-u1-m5 tidak pernah bisa dijawab tepat, dan labelnya mendarat
 * di 3125 / 6250 / 9375.
 */
describe('stepFor — langkah diturunkan dari lebar rentang', () => {
  it('garis satuan tetap melompat per satu', () => {
    expect(stepFor(0, 10)).toBe(1);
    expect(stepFor(10, 20)).toBe(1);
  });

  it('rentang lebar melompat dengan angka bulat yang enak dibaca', () => {
    expect(stepFor(0, 50)).toBe(5);
    expect(stepFor(0, 100)).toBe(10);
    expect(stepFor(0, 1000)).toBe(100);
    expect(stepFor(0, 10000)).toBe(1000);
    expect(stepFor(0, 100000)).toBe(10000);
  });

  it('langkahnya selalu dari deret 1 / 2 / 5 × pangkat sepuluh', () => {
    for (const max of [3, 8, 17, 40, 70, 260, 900, 4000, 60000]) {
      const step = stepFor(0, max);
      const mantissa = step / Math.pow(10, Math.floor(Math.log10(step)));
      expect([1, 2, 5]).toContain(Number(mantissa.toFixed(6)));
    }
  });

  it('domain bilangan bulat tidak pernah dipecah jadi setengah satuan', () => {
    // 0–8 secara matematis "ingin" langkah 0,8 — tapi setengah satuan di garis
    // bilangan bulat hanya membuat anak mendarat di 2,4.
    expect(stepFor(0, 8)).toBe(1);
    expect(stepFor(0, 4)).toBe(1);
  });

  it('jawaban tiap soal number-line-drop mendarat pas di langkah otomatisnya', () => {
    // Rentang persis dari konten yang sudah live.
    const cases: [number, number, number][] = [
      [0, 10000, 3000], // g3-u1-m5 — korban bug ini
      [0, 1000, 700], // g2-u1-m2
      [0, 100, 70], // g1-u5-m2
      [400, 500, 470], // g3-u1-m4
      [40, 80, 55], // g2-u3-m5
    ];
    for (const [min, max, answer] of cases) {
      expect(snapToStep(answer, min, stepFor(min, max))).toBe(answer);
    }
  });
});

describe('label tick mengikuti langkah efektif', () => {
  it('garis 0–10.000 tidak lagi berlabel 3125 / 6250 / 9375', () => {
    const ticks = ticksFor(0, 10000, stepFor(0, 10000), maxTicksFor(0, 10000));
    expect(ticks).not.toContain(3125);
    for (const t of ticks) expect(t % 1000).toBe(0);
    expect(ticks[0]).toBe(0);
    expect(ticks[ticks.length - 1]).toBe(10000);
  });

  it('setiap label jatuh di posisi yang bisa disentuh anak', () => {
    for (const [min, max] of [
      [0, 10],
      [0, 100],
      [0, 1000],
      [40, 70],
      [100, 200],
    ] as [number, number][]) {
      const step = stepFor(min, max);
      for (const t of ticksFor(min, max, step, maxTicksFor(min, max))) {
        expect(snapToStep(t, min, step)).toBe(t);
      }
    }
  });

  it('langkah pecahan dari data modul tidak dibulatkan jadi bilangan bulat', () => {
    const ticks = ticksFor(0, 1, 0.1, 11);
    expect(ticks).toHaveLength(11);
    expect(ticks).toContain(0.3);
  });

  it('label panjang berarti label lebih sedikit — "10000" tidak muat sebanyak "5"', () => {
    expect(maxTicksFor(0, 10000)).toBeLessThan(maxTicksFor(0, 10));
    expect(maxTicksFor(0, 10000)).toBeGreaterThanOrEqual(3);
  });
});

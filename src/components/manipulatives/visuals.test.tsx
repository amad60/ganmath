import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ArrayGrid } from './ArrayGrid';
import { Base10Blocks } from './Base10Blocks';
import { TallyChart } from './TallyChart';
import { RectShape } from './RectShape';

/**
 * Manipulatif adalah CARA app mengajar, bukan hiasan — jadi jumlah benda yang
 * digambar harus persis, bukan kira-kira.
 */
describe('manipulatif menggambar jumlah yang benar', () => {
  it('array menggambar baris × kolom titik', () => {
    const { container } = render(<ArrayGrid rows={3} cols={4} />);
    expect(container.querySelectorAll('span')).toHaveLength(12);
  });

  it('array yang diputar berisi jumlah yang sama — dasar sifat komutatif', () => {
    const a = render(<ArrayGrid rows={3} cols={5} />).container.querySelectorAll('span').length;
    const b = render(<ArrayGrid rows={5} cols={3} />).container.querySelectorAll('span').length;
    expect(a).toBe(b);
  });

  it('blok nilai tempat: satu lempeng = 100 kubus kecil', () => {
    const { container } = render(<Base10Blocks hundreds={2} tens={3} ones={4} />);
    // 2 lempeng (200) + 3 batang × 10 + 4 satuan
    expect(container.querySelectorAll('span')).toHaveLength(200 + 30 + 4);
  });

  it('turus dikelompokkan lima-lima', () => {
    const { container } = render(<TallyChart count={12} />);
    // dua kelompok penuh (4 garis + 1 miring) + dua garis sisa = 12
    expect(container.querySelectorAll('line')).toHaveLength(5 + 5 + 2);
  });
});

describe('RectShape — panjang sisi harus terbaca dan sebanding', () => {
  it('menulis kedua panjang sisi beserta satuannya', () => {
    const { container } = render(<RectShape w={6} h={2} />);
    const labels = [...container.querySelectorAll('text')].map((t) => t.textContent);
    expect(labels).toEqual(['6 cm', '2 cm']);
  });

  it('sisi yang lebih panjang benar-benar digambar lebih panjang', () => {
    const { container } = render(<RectShape w={8} h={2} />);
    const r = container.querySelector('rect') as SVGRectElement;
    expect(Number(r.getAttribute('width'))).toBeGreaterThan(Number(r.getAttribute('height')));
  });

  it('sisi terpendek tetap terlihat walau rasionya ekstrem', () => {
    // Persegi panjang 9x1 tanpa penjepit rasio menyusut jadi garis rambut.
    const { container } = render(<RectShape w={9} h={1} />);
    const r = container.querySelector('rect') as SVGRectElement;
    expect(Number(r.getAttribute('height'))).toBeGreaterThanOrEqual(38);
  });

  it('label sisi kanan muat di dalam gambar, tidak terpotong', () => {
    // Regresi: dengan padding simetris, "3 cm" di sisi kanan terpotong di tepi SVG.
    const { container } = render(<RectShape w={12} h={11} />);
    const svg = container.querySelector('svg') as SVGSVGElement;
    const [, , vbW] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
    const r = container.querySelector('rect') as SVGRectElement;
    const rightEdge = Number(r.getAttribute('x')) + Number(r.getAttribute('width'));
    expect((vbW as number) - rightEdge).toBeGreaterThanOrEqual(60);
  });

  it('menandai sudut siku hanya kalau diminta', () => {
    const off = render(<RectShape w={4} h={3} />).container.querySelectorAll('path');
    const on = render(<RectShape w={4} h={3} showCorners />).container.querySelectorAll('path');
    expect(off).toHaveLength(0);
    expect(on).toHaveLength(4);
  });
});

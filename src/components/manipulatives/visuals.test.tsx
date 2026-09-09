import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ArrayGrid } from './ArrayGrid';
import { Base10Blocks } from './Base10Blocks';
import { TallyChart } from './TallyChart';
import { RectShape } from './RectShape';
import { Angle, ANGLE_NAMES, angleKind } from './Angle';

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

describe('angleKind — nama jenis sudut', () => {
  it('90° adalah sudut siku, bukan lancip yang kebetulan besar', () => {
    expect(angleKind(90)).toBe('right');
  });

  it('batasnya tepat: 89 lancip, 91 tumpul, 180 lurus', () => {
    expect(angleKind(89)).toBe('acute');
    expect(angleKind(91)).toBe('obtuse');
    expect(angleKind(179)).toBe('obtuse');
    expect(angleKind(180)).toBe('straight');
    expect(angleKind(181)).toBe('reflex');
  });

  it('setiap jenis punya nama English sederhana', () => {
    expect(ANGLE_NAMES[angleKind(45)]).toBe('acute angle');
    expect(ANGLE_NAMES[angleKind(120)]).toBe('obtuse angle');
  });
});

describe('Angle — bukaan yang digambar harus jujur', () => {
  it('selalu menggambar dua kaki sama panjang — yang diukur bukaannya, bukan kakinya', () => {
    const { container } = render(<Angle degrees={40} />);
    const rays = [...container.querySelectorAll('[data-part="ray"]')] as SVGLineElement[];
    expect(rays).toHaveLength(2);
    const len = (l: SVGLineElement) =>
      Math.hypot(
        Number(l.getAttribute('x2')) - Number(l.getAttribute('x1')),
        Number(l.getAttribute('y2')) - Number(l.getAttribute('y1')),
      );
    expect(len(rays[0] as SVGLineElement)).toBeCloseTo(len(rays[1] as SVGLineElement), 5);
  });

  it('sudut yang lebih besar menaruh ujung kedua kaki lebih berjauhan', () => {
    const span = (deg: number) => {
      const rays = [
        ...render(<Angle degrees={deg} />).container.querySelectorAll('[data-part="ray"]'),
      ] as SVGLineElement[];
      const [a, b] = rays;
      return Math.hypot(
        Number((a as SVGLineElement).getAttribute('x2')) - Number((b as SVGLineElement).getAttribute('x2')),
        Number((a as SVGLineElement).getAttribute('y2')) - Number((b as SVGLineElement).getAttribute('y2')),
      );
    };
    expect(span(30)).toBeLessThan(span(90));
    expect(span(90)).toBeLessThan(span(150));
  });

  it('sudut siku memakai tanda kotak, bukan busur — itu lambang di buku', () => {
    const right = render(<Angle degrees={90} />).container;
    expect(right.querySelector('[data-part="right-mark"]')).not.toBeNull();
    expect(right.querySelector('[data-part="arc"]')).toBeNull();

    const acute = render(<Angle degrees={50} />).container;
    expect(acute.querySelector('[data-part="right-mark"]')).toBeNull();
    expect(acute.querySelector('[data-part="arc"]')).not.toBeNull();
  });

  it('busur sudut tumpul memakai flag busur-besar hanya di atas 180°', () => {
    const flag = (deg: number) =>
      (render(<Angle degrees={deg} />)
        .container.querySelector('[data-part="arc"]')
        ?.getAttribute('d') ?? '').split(/\s+/)[7];
    expect(flag(120)).toBe('0');
    expect(flag(300)).toBe('1');
  });

  it('gambar tetap di dalam bingkai untuk semua besar sudut dan semua putaran', () => {
    // Regresi: menggeser titik sudut sejauh tetap ke arah garis bagi membuat
    // sudut 300° menonjol keluar viewBox — sudut refleks tidak lopsided.
    for (const scale of [false, true]) {
      for (const deg of [10, 90, 135, 180, 300, 359]) {
        for (const rot of [0, 37, 90, 200, 315]) {
          const { container } = render(<Angle degrees={deg} rotate={rot} showScale={scale} />);
          const svg = container.querySelector('svg') as SVGSVGElement;
          const [vx, vy, vw, vh] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
          const inside = (x: number, y: number) => {
            expect(x).toBeGreaterThanOrEqual(vx as number);
            expect(x).toBeLessThanOrEqual((vx as number) + (vw as number));
            expect(y).toBeGreaterThanOrEqual(vy as number);
            expect(y).toBeLessThanOrEqual((vy as number) + (vh as number));
          };
          for (const l of container.querySelectorAll('[data-part="ray"],[data-part="tick"]')) {
            inside(Number(l.getAttribute('x2')), Number(l.getAttribute('y2')));
          }
          for (const t of container.querySelectorAll('[data-part="tick-label"]')) {
            inside(Number(t.getAttribute('x')), Number(t.getAttribute('y')));
          }
        }
      }
    }
  });

  it('memutar sudut tidak mengubah besarnya — 90° miring tetap sudut siku', () => {
    const { container } = render(<Angle degrees={90} rotate={35} showName />);
    expect(container.querySelector('[data-part="right-mark"]')).not.toBeNull();
    expect(container.querySelector('[data-part="name"]')?.textContent).toBe('right angle');
  });

  it('menulis besarnya hanya kalau diminta — kalau tidak, jawaban soal bocor', () => {
    expect(
      render(<Angle degrees={70} />).container.querySelector('[data-part="value"]'),
    ).toBeNull();
    expect(
      render(<Angle degrees={70} showValue />).container.querySelector('[data-part="value"]')
        ?.textContent,
    ).toBe('70°');
  });

  it('label pembaca layar tidak membocorkan apa yang sengaja disembunyikan', () => {
    const aria = (el: Element | null) => el?.getAttribute('aria-label');
    expect(aria(render(<Angle degrees={70} />).container.querySelector('svg'))).toBe('angle');
    expect(aria(render(<Angle degrees={70} showName />).container.querySelector('svg'))).toBe(
      'acute angle',
    );
    expect(aria(render(<Angle degrees={70} showValue />).container.querySelector('svg'))).toBe(
      '70 degree angle',
    );
  });

  it('skala derajat: garis tiap 10°, angka tiap 30°', () => {
    const { container } = render(<Angle degrees={60} showScale />);
    expect(container.querySelectorAll('[data-part="tick"]')).toHaveLength(19);
    const labels = [...container.querySelectorAll('[data-part="tick-label"]')].map(
      (t) => t.textContent,
    );
    expect(labels).toEqual(['0', '30', '60', '90', '120', '150', '180']);
  });

  it('skala menambah ruang di sekeliling gambar, bukan menimpa kakinya', () => {
    const vb = (el: Element | null) => (el?.getAttribute('viewBox') ?? '').split(' ').map(Number);
    const plain = vb(render(<Angle degrees={60} />).container.querySelector('svg'));
    const scaled = vb(render(<Angle degrees={60} showScale />).container.querySelector('svg'));
    expect(scaled[2] as number).toBeGreaterThan(plain[2] as number);
    expect(scaled[0] as number).toBeLessThan(plain[0] as number);
  });
});

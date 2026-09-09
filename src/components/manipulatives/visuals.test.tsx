import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { ArrayGrid } from './ArrayGrid';
import { Bars } from './Bars';
import { Base10Blocks } from './Base10Blocks';
import { TallyChart } from './TallyChart';
import { RectShape } from './RectShape';
import { Angle, ANGLE_NAMES, angleKind } from './Angle';
import { NumberLine } from './NumberLine';
import { Solid3D } from './Solid3D';
import { Circle } from './Circle';
import { CoordinatePlane } from './CoordinatePlane';
import { LearnVisualView } from '../../app/screens/LearnVisualView';
import {
  PI,
  areaOf,
  circumferenceFromDiameter,
  circumferenceOf,
  diameterFromRadius,
  radiusFromDiameter,
} from './circles';
import {
  axisDistance,
  formatPoint,
  fourthCorner,
  quadrantName,
  quadrantOf,
  rectCorners,
} from './coordinates';
import { maxTicksFor, stepFor, ticksFor } from './scale';
import { ShapeNet } from './ShapeNet';
import { Shape2D } from './Shape2D';
import {
  NET_SOLIDS,
  SOLID_FACES,
  layerOf,
  netEdges,
  netFaces,
  netLayoutCount,
  solidFromDims,
  surfaceAreaOf,
  volumeOf,
} from './solids';

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

/**
 * Garis bilangan dulu selalu melompat per satu satuan, berapa pun lebarnya —
 * `step` tidak pernah sampai ke komponen ini. Di garis 0–10.000 (g3-u1-m5, sudah
 * live) itu membuat soalnya mustahil dijawab tepat dan labelnya jatuh di angka
 * ganjil. Langkahnya sekarang diturunkan dari rentang, dan data modul boleh
 * menimpanya.
 */
describe('NumberLine — langkah otomatis dari rentang', () => {
  /** jsdom tidak melakukan layout: garisnya harus diberi lebar supaya bisa disentuh. */
  const withWidth = (el: HTMLElement, width = 300) => {
    el.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width, height: 96, right: width, bottom: 96, x: 0, y: 0 }) as DOMRect;
  };
  const labels = (c: HTMLElement) => [...c.querySelectorAll('span')].map((s) => s.textContent);

  it('garis 0–10 tetap berlabel setiap satuan', () => {
    const { container } = render(<NumberLine min={0} max={10} />);
    expect(labels(container)).toEqual(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });

  it('garis 0–10.000 berlabel ribuan bulat, bukan 3125 / 6250 / 9375', () => {
    const { container } = render(<NumberLine min={0} max={10000} />);
    const shown = labels(container);
    expect(shown).not.toContain('3125');
    expect(shown[0]).toBe('0');
    expect(shown[shown.length - 1]).toBe('10000');
    for (const t of shown) expect(Number(t) % 1000).toBe(0);
  });

  it('label tidak berdesakan di layar 390px', () => {
    const { container } = render(<NumberLine min={0} max={10000} />);
    expect(labels(container).length).toBeLessThanOrEqual(7);
  });

  it('anak menjatuhkan penanda tepat di 3000 — soal g3-u1-m5 jadi bisa dijawab', () => {
    const picked: number[] = [];
    const { container } = render(
      <NumberLine min={0} max={10000} onChange={(v) => picked.push(v)} />,
    );
    const line = container.firstElementChild as HTMLElement;
    withWidth(line);
    // 0,3 × 300px = tepat di 3000; sedikit meleset pun harus mendarat di 3000.
    fireEvent.pointerDown(line, { clientX: 94 });
    expect(picked).toEqual([3000]);
  });

  it('data modul boleh menimpa langkahnya untuk pecahan dan desimal', () => {
    const picked: number[] = [];
    const { container } = render(
      <NumberLine min={0} max={1} step={0.25} denominator={4} onChange={(v) => picked.push(v)} />,
    );
    expect(labels(container)).toEqual(['0', '1/4', '1/2', '3/4', '1']);
    const line = container.firstElementChild as HTMLElement;
    withWidth(line);
    fireEvent.pointerDown(line, { clientX: 160 });
    expect(picked).toEqual([0.5]);
  });

  it('posisi yang bisa disentuh tetap terlihat walau labelnya dijarangkan', () => {
    // 0–1000 melompat 100 tapi hanya berlabel enam angka: tanda kecil tanpa angka
    // yang memberi tahu anak ke mana penandanya bisa mendarat.
    const { container } = render(<NumberLine min={0} max={1000} />);
    expect(labels(container)).toEqual(['0', '200', '400', '600', '800', '1000']);
    expect(container.querySelectorAll('div[style*="opacity: 0.55"]')).toHaveLength(5);
  });
});

/**
 * Aturan bangun ruang dipakai DUA kali: sekali oleh data modul yang menyusun soal,
 * sekali oleh gambar yang menuliskannya di layar. Test di sini menjaga keduanya
 * mengambil dari satu sumber — bukan menghitung sendiri-sendiri.
 */
describe('solids — aturan yang dipakai bersama data modul dan gambar', () => {
  it('kubus hanya kubus kalau ketiga rusuknya sama', () => {
    expect(solidFromDims(3, 3, 3)).toBe('cube');
    expect(solidFromDims(3, 3, 2)).toBe('rectangular-prism');
    expect(solidFromDims(1, 1, 1)).toBe('cube');
  });

  it('volume = panjang × lebar × tinggi, dan satu lapis = panjang × lebar', () => {
    expect(volumeOf(3, 4, 2)).toBe(24);
    expect(layerOf(3, 4)).toBe(12);
    // Volume itu lapis yang ditumpuk — inti materi g5-u5.
    expect(layerOf(3, 4) * 2).toBe(volumeOf(3, 4, 2));
  });

  it('luas permukaan balok 2(pl + pt + lt)', () => {
    expect(surfaceAreaOf(2, 3, 4)).toBe(52);
    expect(surfaceAreaOf(2, 2, 2)).toBe(24);
  });

  it('jaring selalu punya sebanyak sisi bangunnya, di setiap susunan', () => {
    for (const solid of NET_SOLIDS) {
      for (let layout = 0; layout < netLayoutCount(solid); layout++) {
        expect(netFaces(solid, {}, layout)).toHaveLength(SOLID_FACES[solid]);
      }
    }
  });

  it('jaring yang sah punya tepat (jumlah sisi − 1) garis lipat', () => {
    // Kalau lebih, ada sisi yang dobel; kalau kurang, jaringnya terputus jadi dua
    // lembar dan tidak mungkin dilipat. Ini pagar geometri, bukan gaya gambar.
    for (const solid of NET_SOLIDS) {
      if (solid === 'cylinder') continue; // sisi bundar tidak punya rusuk lurus
      for (let layout = 0; layout < netLayoutCount(solid); layout++) {
        const folds = netEdges(netFaces(solid, {}, layout)).filter((e) => e.fold);
        expect(folds).toHaveLength(SOLID_FACES[solid] - 1);
      }
    }
  });

  it('nomor susunan di luar rentang dibungkus, tidak membuat jaring kosong', () => {
    expect(netFaces('cube', {}, 7)).toHaveLength(6);
    expect(netFaces('cube', {}, -1)).toHaveLength(6);
  });
});

/** Ambil semua titik yang benar-benar digambar sebuah SVG. */
function drawnPoints(container: HTMLElement): [number, number][] {
  const pts: [number, number][] = [];
  for (const el of container.querySelectorAll('polygon')) {
    for (const pair of (el.getAttribute('points') ?? '').trim().split(/\s+/)) {
      const [x, y] = pair.split(',').map(Number);
      pts.push([x as number, y as number]);
    }
  }
  for (const el of container.querySelectorAll('line')) {
    pts.push([Number(el.getAttribute('x1')), Number(el.getAttribute('y1'))]);
    pts.push([Number(el.getAttribute('x2')), Number(el.getAttribute('y2'))]);
  }
  for (const el of container.querySelectorAll('circle')) {
    const cx = Number(el.getAttribute('cx'));
    const cy = Number(el.getAttribute('cy'));
    const r = Number(el.getAttribute('r'));
    pts.push([cx - r, cy - r], [cx + r, cy + r]);
  }
  for (const el of container.querySelectorAll('rect')) {
    const x = Number(el.getAttribute('x'));
    const y = Number(el.getAttribute('y'));
    pts.push([x, y], [x + Number(el.getAttribute('width')), y + Number(el.getAttribute('height'))]);
  }
  for (const el of container.querySelectorAll('text')) {
    pts.push([Number(el.getAttribute('x')), Number(el.getAttribute('y'))]);
  }
  return pts;
}

function expectInsideViewBox(container: HTMLElement) {
  const svg = container.querySelector('svg') as SVGSVGElement;
  const [vx, vy, vw, vh] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
  for (const [x, y] of drawnPoints(container)) {
    expect(x).toBeGreaterThanOrEqual(vx as number);
    expect(x).toBeLessThanOrEqual((vx as number) + (vw as number));
    expect(y).toBeGreaterThanOrEqual(vy as number);
    expect(y).toBeLessThanOrEqual((vy as number) + (vh as number));
  }
}

describe('Solid3D — kubus satuan yang bisa dihitung anak', () => {
  const faces = (c: HTMLElement) => c.querySelectorAll('[data-part="face"]');

  it('menggambar tiap kubus satuan, bukan satu kotak mulus', () => {
    // 3×4×2 = 24 kubus; 6 di dalam tidak pernah terlihat, jadi 18 kubus × 3 sisi.
    const { container } = render(<Solid3D l={3} w={4} h={2} />);
    expect(faces(container)).toHaveLength(18 * 3);
  });

  it('kubus yang tertutup tidak digambar — 6×6×6 tetap murah', () => {
    const { container } = render(<Solid3D l={6} w={6} h={6} />);
    expect(faces(container).length).toBe((216 - 125) * 3);
  });

  it('balok tanpa kubus satuan hanya tiga sisi — untuk tahap p × l × t', () => {
    const { container } = render(<Solid3D l={5} w={4} h={3} cubes={false} />);
    expect(faces(container)).toHaveLength(3);
  });

  it('sisi kubus pekat — kalau tembus pandang, kubus belakang muncul di depan', () => {
    const { container } = render(<Solid3D l={3} w={3} h={3} />);
    for (const f of container.querySelectorAll('[data-part="face"]')) {
      expect(f.getAttribute('fill-opacity')).toBeNull();
    }
  });

  it('menyorot satu lapis: itu jembatan dari luas alas ke volume', () => {
    const { container } = render(<Solid3D l={3} w={4} h={2} highlightLayer={0} />);
    const hot = [...faces(container)].filter((f) =>
      (f.getAttribute('fill') ?? '').includes('--c-unit-3'),
    );
    // Lapis bawah 3×4: hanya lapis paling atas yang seluruhnya terlihat, di lapis
    // bawah yang tergambar adalah kubus tepinya saja (12 − 2×3 tertutup = 6).
    expect(hot.length).toBe(6 * 3);
    expect(hot.length).toBeLessThan(faces(container).length);
  });

  it('ukuran kubus tidak pernah menyusut jadi tak terhitung', () => {
    // Rusuk kubus di layar = lebar sisi atas dibagi jumlah kolomnya.
    const { container } = render(<Solid3D l={8} w={8} h={8} />);
    const svg = container.querySelector('svg') as SVGSVGElement;
    const [, , vw] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
    expect((vw as number) / 16).toBeGreaterThan(12);
  });

  it('menulis volumenya hanya kalau diminta — kalau tidak, jawaban soal bocor', () => {
    expect(
      render(<Solid3D l={3} w={4} h={2} />).container.querySelector('[data-part="value"]'),
    ).toBeNull();
    expect(
      render(<Solid3D l={3} w={4} h={2} showVolume />).container.querySelector(
        '[data-part="value"]',
      )?.textContent,
    ).toBe('24 cubic units');
    expect(
      render(<Solid3D l={3} w={4} h={2} showVolume unit="cm" />).container.querySelector(
        '[data-part="value"]',
      )?.textContent,
    ).toBe('24 cubic cm');
  });

  it('nama bangun mengikuti aturan yang sama dengan data modul', () => {
    const name = (l: number, w: number, h: number) =>
      render(<Solid3D l={l} w={w} h={h} showName />).container.querySelector(
        '[data-part="name"]',
      )?.textContent;
    expect(name(3, 3, 3)).toBe('cube');
    expect(name(3, 3, 2)).toBe('rectangular prism');
  });

  it('ukuran rusuk ditulis lengkap dengan satuannya', () => {
    const { container } = render(<Solid3D l={5} w={3} h={2} showDimensions unit="cm" />);
    const dims = [...container.querySelectorAll('[data-part="dim"]')].map((t) => t.textContent);
    expect(dims).toEqual(['5 cm', '3 cm', '2 cm']);
  });

  it('label pembaca layar tidak membocorkan apa yang sengaja disembunyikan', () => {
    const aria = (el: ReactElement) =>
      render(el).container.querySelector('svg')?.getAttribute('aria-label');
    expect(aria(<Solid3D l={3} w={4} h={2} />)).toBe('solid made of unit cubes');
    expect(aria(<Solid3D l={3} w={4} h={2} showName />)).toBe('rectangular prism');
    expect(aria(<Solid3D l={3} w={4} h={2} showVolume />)).toBe(
      'rectangular prism of 24 unit cubes',
    );
  });

  it('gambar tetap di dalam bingkai untuk semua ukuran dan semua label', () => {
    // Pola yang sama dengan regresi Angle: label rusuk jatuh di empat arah berbeda,
    // jadi kotak pembatas TIDAK boleh ditebak dari siluetnya saja.
    for (const [l, w, h] of [
      [1, 1, 1],
      [8, 1, 1],
      [1, 8, 1],
      [1, 1, 8],
      [3, 4, 2],
      [8, 8, 8],
      [6, 2, 5],
    ] as const) {
      for (const opts of [
        {},
        { showDimensions: true },
        { showDimensions: true, unit: 'cm', showVolume: true, showName: true },
        { cubes: false, showVolume: true },
      ]) {
        const { container } = render(<Solid3D l={l} w={w} h={h} {...opts} />);
        expectInsideViewBox(container);
      }
    }
  });
});

describe('ShapeNet — bentangan yang bisa dilipat kembali', () => {
  it('menggambar setiap sisi bangunnya', () => {
    for (const solid of NET_SOLIDS) {
      const { container } = render(<ShapeNet solid={solid} />);
      expect(container.querySelectorAll('[data-part="face"]')).toHaveLength(SOLID_FACES[solid]);
    }
  });

  it('membedakan garis lipat dari garis potong — tanpa itu jaring cuma kotak berdempet', () => {
    const { container } = render(<ShapeNet solid="cube" />);
    const folds = container.querySelectorAll('[data-part="fold"]');
    expect(folds).toHaveLength(5);
    expect([...folds].every((f) => f.getAttribute('stroke-dasharray'))).toBe(true);
    // 6 sisi × 4 rusuk = 24; 5 pasang berimpit jadi 19 rusuk, 5 di antaranya lipatan.
    expect(container.querySelectorAll('[data-part="cut"]')).toHaveLength(14);
  });

  it('satu bangun punya beberapa bentangan yang berbeda gambarnya', () => {
    const shot = (layout: number) =>
      [...render(<ShapeNet solid="cube" layout={layout} />).container.querySelectorAll('polygon')]
        .map((p) => p.getAttribute('points'))
        .join('|');
    expect(shot(0)).not.toBe(shot(1));
    expect(shot(0)).not.toBe(shot(2));
  });

  it('jaring balok tidak identik dengan jaring kubus', () => {
    const cube = render(<ShapeNet solid="cube" />).container.querySelector('polygon');
    const box = render(<ShapeNet solid="rectangular-prism" />).container.querySelector('polygon');
    expect(cube?.getAttribute('points')).not.toBe(box?.getAttribute('points'));
  });

  it('memberi nomor sisi hanya kalau diminta — kalau tidak, "how many faces" terjawab sendiri', () => {
    expect(
      render(<ShapeNet solid="cube" />).container.querySelectorAll('[data-part="face-number"]'),
    ).toHaveLength(0);
    const numbered = render(<ShapeNet solid="cube" numberFaces />).container;
    expect([...numbered.querySelectorAll('[data-part="face-number"]')].map((t) => t.textContent))
      .toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('menulis nama bangun hanya kalau diminta', () => {
    expect(
      render(<ShapeNet solid="square-pyramid" />).container.querySelector('[data-part="name"]'),
    ).toBeNull();
    expect(
      render(<ShapeNet solid="square-pyramid" showName />).container.querySelector(
        '[data-part="name"]',
      )?.textContent,
    ).toBe('square pyramid');
    expect(
      render(<ShapeNet solid="cube" />).container.querySelector('svg')?.getAttribute('aria-label'),
    ).toBe('net of a solid shape');
  });

  it('gambar tetap di dalam bingkai untuk semua bangun dan semua susunan', () => {
    for (const solid of NET_SOLIDS) {
      for (let layout = 0; layout < netLayoutCount(solid); layout++) {
        for (const opts of [{}, { showName: true }, { numberFaces: true, showName: true }]) {
          const { container } = render(<ShapeNet solid={solid} layout={layout} {...opts} />);
          expectInsideViewBox(container);
        }
      }
    }
  });

  it('jaring lebar dan jaring tinggi sama-sama muat di layar 390px', () => {
    for (const solid of NET_SOLIDS) {
      const svg = render(<ShapeNet solid={solid} />).container.querySelector(
        'svg',
      ) as SVGSVGElement;
      const [, , vw, vh] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
      expect(vw as number).toBeLessThanOrEqual(330);
      expect(vh as number).toBeLessThanOrEqual(240);
    }
  });
});

/**
 * Aturan lingkaran dipakai DUA kali: sekali oleh data modul yang menyusun soal dan
 * jawabannya, sekali oleh gambar yang menuliskannya di layar. Kalau keduanya
 * menghitung sendiri, anak yang mengetik angka yang dia baca di gambar bisa disalahkan.
 */
describe('circles — aturan yang dipakai bersama data modul dan gambar', () => {
  it('π satu konstanta, 3.14 — bukan 22/7 yang mengunci jari-jari ke kelipatan 7', () => {
    expect(PI).toBe(3.14);
    expect(PI).not.toBeCloseTo(22 / 7, 3);
  });

  it('diameter dua kali jari-jari, bolak-balik', () => {
    expect(diameterFromRadius(5)).toBe(10);
    expect(radiusFromDiameter(10)).toBe(5);
    expect(radiusFromDiameter(9)).toBe(4.5);
    expect(diameterFromRadius(radiusFromDiameter(7))).toBe(7);
  });

  it('keliling = 2 × π × r, dan keliling ÷ diameter = π — itu ARTI π', () => {
    expect(circumferenceOf(5)).toBe(31.4);
    expect(circumferenceOf(10)).toBe(62.8);
    expect(circumferenceFromDiameter(10)).toBe(circumferenceOf(5));
    for (const r of [1, 2, 3.5, 7, 12, 100]) {
      expect(circumferenceOf(r) / diameterFromRadius(r)).toBeCloseTo(PI, 10);
    }
  });

  it('luas = π × r × r', () => {
    expect(areaOf(5)).toBe(78.5);
    expect(areaOf(10)).toBe(314);
    // Luas lingkaran berjari-jari dua kali lipat = empat kali luasnya, bukan dua.
    expect(areaOf(6)).toBe(areaOf(3) * 4);
  });

  it('tidak ada sampah floating point yang sampai ke layar', () => {
    // 3.14 × 49 dalam float = 153.86000000000001; angka itu tidak boleh ditulis di
    // gambar, karena anak akan mengetik 153.86 dan dinyatakan salah.
    expect(String(areaOf(7))).toBe('153.86');
    expect(String(circumferenceOf(2.5))).toBe('15.7');
    expect(String(areaOf(1.5))).toBe('7.065');
  });
});

describe('Circle — jari-jari, diameter, dan ukuran yang dinormalisasi', () => {
  const part = (c: HTMLElement, name: string) => c.querySelector(`[data-part="${name}"]`);
  const lineLen = (el: Element | null) =>
    Math.hypot(
      Number(el?.getAttribute('x2')) - Number(el?.getAttribute('x1')),
      Number(el?.getAttribute('y2')) - Number(el?.getAttribute('y1')),
    );

  it('menggambar lingkaran dengan jari-jari bertanda dari pusat ke tepi', () => {
    const { container } = render(<Circle r={5} />);
    const ring = part(container, 'ring');
    const radius = part(container, 'radius');
    expect(ring).not.toBeNull();
    expect(lineLen(radius)).toBeCloseTo(Number(ring?.getAttribute('r')), 5);
    // Ujung jari-jari mendarat DI tepi lingkaran, bukan di dalamnya.
    const end = part(container, 'radius-end');
    expect(Math.hypot(Number(end?.getAttribute('cx')), Number(end?.getAttribute('cy')))).toBeCloseTo(
      Number(ring?.getAttribute('r')),
      5,
    );
  });

  it('diameter digambar tepat dua kali jari-jari dan menembus pusat', () => {
    const { container } = render(<Circle r={5} mark="both" />);
    expect(lineLen(part(container, 'diameter'))).toBeCloseTo(
      lineLen(part(container, 'radius')) * 2,
      5,
    );
    const dia = part(container, 'diameter');
    expect(Number(dia?.getAttribute('x1'))).toBe(-Number(dia?.getAttribute('x2')));
  });

  it('menggambar hanya ruas yang diminta', () => {
    const marks = ['none', 'radius', 'diameter', 'both'] as const;
    const drawn = marks.map((mark) => {
      const c = render(<Circle r={4} mark={mark} />).container;
      return [Boolean(part(c, 'radius')), Boolean(part(c, 'diameter'))];
    });
    expect(drawn).toEqual([
      [false, false],
      [true, false],
      [false, true],
      [true, true],
    ]);
  });

  it('`d` sendirian menandai DIAMETER-nya, bukan jari-jarinya', () => {
    // Tanpa ini, <Circle d={10} /> menggambar ruas 5 cm untuk soal berdiameter 10 cm.
    const c = render(<Circle d={10} />).container;
    expect(part(c, 'diameter')).not.toBeNull();
    expect(part(c, 'radius')).toBeNull();
    expect(part(c, 'diameter-label')?.textContent).toBe('10 cm');
    // Yang menulis `mark` sendiri tetap menang.
    expect(part(render(<Circle d={10} mark="radius" />).container, 'radius')).not.toBeNull();
  });

  it('`d` dan `r` yang sepadan menghasilkan gambar dan label yang sama', () => {
    const fromR = render(<Circle r={5} mark="both" />).container;
    const fromD = render(<Circle d={10} mark="both" />).container;
    const labels = (c: HTMLElement) => [...c.querySelectorAll('text')].map((t) => t.textContent);
    expect(labels(fromD)).toEqual(labels(fromR));
    expect(labels(fromR)).toEqual(['r = 5 cm', 'd = 10 cm']);
  });

  it('satu ruas dilabeli panjangnya saja — seperti RectShape melabeli sisinya', () => {
    const { container } = render(<Circle r={3} mark="diameter" unit="m" />);
    expect(part(container, 'diameter-label')?.textContent).toBe('6 m');
    expect(part(container, 'radius-label')).toBeNull();
    expect(part(render(<Circle r={3} />).container, 'radius-label')?.textContent).toBe('3 cm');
  });

  it('dua ruas sekaligus HARUS diberi nama — itu justru yang diajarkan', () => {
    // "5 cm" dan "10 cm" berdampingan tanpa nama membuat anak menebak mana yang mana.
    const { container } = render(<Circle r={5} mark="both" />);
    expect(part(container, 'radius-label')?.textContent).toBe('r = 5 cm');
    expect(part(container, 'diameter-label')?.textContent).toBe('d = 10 cm');
  });

  it('menulis panjangnya hanya kalau diminta — kalau tidak, jawaban soal bocor', () => {
    const hidden = render(<Circle r={5} mark="both" showValue={false} />).container;
    expect(hidden.querySelectorAll('text')).toHaveLength(0);
    // Ruasnya tetap digambar: yang disembunyikan angkanya, bukan pelajarannya.
    expect(part(hidden, 'radius')).not.toBeNull();
  });

  it('keliling dan luas diambil dari circles.ts, bukan dihitung ulang di komponen', () => {
    const { container } = render(<Circle r={5} showCircumference showArea />);
    expect(part(container, 'circumference')?.textContent).toBe(`C = ${circumferenceOf(5)} cm`);
    expect(part(container, 'area')?.textContent).toBe(`A = ${areaOf(5)} cm²`);
  });

  it('keliling dan luas tidak pernah muncul sendiri — itu yang ditanyakan soal', () => {
    const { container } = render(<Circle r={5} />);
    expect(part(container, 'circumference')).toBeNull();
    expect(part(container, 'area')).toBeNull();
  });

  it('tanpa satuan, labelnya tetap kalimat yang bisa dibaca', () => {
    const { container } = render(<Circle r={2} unit="" showCircumference showArea />);
    expect(part(container, 'radius-label')?.textContent).toBe('2');
    expect(part(container, 'circumference')?.textContent).toBe('C = 12.56 units');
    expect(part(container, 'area')?.textContent).toBe('A = 12.56 sq units');
  });

  it('label pembaca layar tidak membocorkan apa yang sengaja disembunyikan', () => {
    const aria = (el: ReactElement) =>
      render(el).container.querySelector('svg')?.getAttribute('aria-label');
    expect(aria(<Circle r={5} showValue={false} />)).toBe('circle');
    expect(aria(<Circle r={5} />)).toBe('circle, radius 5 cm');
    expect(aria(<Circle r={5} mark="both" showCircumference />)).toBe(
      'circle, radius 5 cm, diameter 10 cm, circumference 31.4 cm',
    );
    expect(aria(<Circle r={5} mark="none" showArea />)).toBe('circle, area 78.5 square cm');
  });

  it('titik pusat ikut kalau ada ruas yang digambar, dan bisa dipaksa', () => {
    expect(part(render(<Circle r={5} />).container, 'center')).not.toBeNull();
    expect(part(render(<Circle r={5} mark="none" />).container, 'center')).toBeNull();
    expect(part(render(<Circle r={5} mark="none" showCenter />).container, 'center')).not.toBeNull();
  });

  it('r=2 dan r=100 digambar sama besar — yang berubah angkanya, bukan gambarnya', () => {
    // Tanpa normalisasi, r=2 jadi titik dan r=100 meledak keluar layar 390px.
    const radiusPx = (el: ReactElement) => {
      const svg = render(el).container.querySelector('svg') as SVGSVGElement;
      const [, , vw] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
      const ring = (svg.querySelector('[data-part="ring"]') as SVGCircleElement) ?? null;
      return (Number(ring.getAttribute('r')) * Number(svg.getAttribute('width'))) / (vw as number);
    };
    const base = radiusPx(<Circle r={2} />);
    expect(base).toBeGreaterThan(80);
    for (const r of [0.5, 2, 7, 12.5, 100, 500]) {
      expect(radiusPx(<Circle r={r} />)).toBeCloseTo(base, 0);
    }
    // Dan label yang panjang tidak boleh ikut menciutkan lingkarannya.
    for (const opts of [
      { showCircumference: true },
      { showCircumference: true, showArea: true, unit: '' },
      { mark: 'both' as const, showCircumference: true, showArea: true },
    ]) {
      expect(radiusPx(<Circle r={12.5} {...opts} />)).toBeCloseTo(base, 0);
    }
  });

  const CASES = [
    { r: 0.5 },
    { r: 3 },
    { r: 7, unit: 'm' },
    { r: 12.5 },
    { r: 500 },
    { d: 9 },
  ] as const;
  const OPTS = [
    {},
    { mark: 'none' as const },
    { mark: 'diameter' as const },
    { mark: 'both' as const },
    { showCircumference: true },
    { showArea: true },
    { mark: 'both' as const, showCircumference: true, showArea: true },
    { mark: 'both' as const, showCircumference: true, showArea: true, unit: '' },
    { showValue: false, showCircumference: true },
  ];

  it('gambar tetap di dalam bingkai untuk semua ukuran dan semua kombinasi label', () => {
    for (const c of CASES) {
      for (const opts of OPTS) {
        expectInsideViewBox(render(<Circle {...c} {...opts} />).container);
      }
    }
  });

  it('LEBAR TEKS label ikut menentukan viewBox, bukan cuma titik jangkarnya', () => {
    // Regresi yang sama dengan Solid3D: baris "A = 12.56 sq units" lebih lebar
    // daripada lingkarannya sendiri, jadi kotak pembatas tidak boleh ditebak dari
    // gambarnya saja — dulu ini yang memotong label sisi kanan RectShape.
    const CHAR_W = 9;
    for (const c of CASES) {
      for (const opts of OPTS) {
        const { container } = render(<Circle {...c} {...opts} />);
        const svg = container.querySelector('svg') as SVGSVGElement;
        const [vx, vy, vw, vh] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
        for (const t of container.querySelectorAll('text')) {
          const w = (t.textContent ?? '').length * CHAR_W;
          const x = Number(t.getAttribute('x'));
          const y = Number(t.getAttribute('y'));
          const left = t.getAttribute('text-anchor') === 'start' ? x : x - w / 2;
          expect(left).toBeGreaterThanOrEqual(vx as number);
          expect(left + w).toBeLessThanOrEqual((vx as number) + (vw as number));
          expect(y - 8).toBeGreaterThanOrEqual(vy as number);
          expect(y + 8).toBeLessThanOrEqual((vy as number) + (vh as number));
        }
      }
    }
  });

  it('gambar muat di layar 390px di setiap kombinasi label', () => {
    for (const c of CASES) {
      for (const opts of OPTS) {
        const svg = render(<Circle {...c} {...opts} />).container.querySelector(
          'svg',
        ) as SVGSVGElement;
        expect(Number(svg.getAttribute('width'))).toBeLessThanOrEqual(342);
        expect(Number(svg.getAttribute('height'))).toBeLessThanOrEqual(300);
      }
    }
  });

  it('materi memakai jalur render yang sama dengan manipulatif lain', () => {
    const { container } = render(
      <LearnVisualView
        visual={{ kind: 'circle', r: 5, mark: 'both', showCircumference: true }}
        value={0}
        onValue={() => {}}
        interactive={false}
      />,
    );
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'circle, radius 5 cm, diameter 10 cm, circumference 31.4 cm',
    );
  });
});

describe('coordinates — aturan yang dipakai bersama data modul dan gambar', () => {
  it('pasangan koordinat ditulis satu bentuk saja: (x, y)', () => {
    expect(formatPoint(3, 2)).toBe('(3, 2)');
    expect(formatPoint(3, -2)).toBe('(3, -2)');
    expect(formatPoint(0, 0)).toBe('(0, 0)');
    // Urutannya materi, bukan gaya penulisan: (3, 2) tidak sama dengan (2, 3).
    expect(formatPoint(3, 2)).not.toBe(formatPoint(2, 3));
  });

  it('kuadran: 1–4, dan titik di sumbu tidak dipaksa masuk kuadran', () => {
    expect(quadrantOf(3, 2)).toBe(1);
    expect(quadrantOf(-3, 2)).toBe(2);
    expect(quadrantOf(-3, -2)).toBe(3);
    expect(quadrantOf(3, -2)).toBe(4);
    expect(quadrantOf(0, 5)).toBe(0);
    expect(quadrantOf(5, 0)).toBe(0);
    expect(quadrantOf(0, 0)).toBe(0);
    expect(quadrantName(-3, 2)).toBe('quadrant II');
    expect(quadrantName(0, 4)).toBe('on an axis');
  });

  it('jarak hanya dihitung untuk titik yang sejajar sumbu', () => {
    expect(axisDistance({ x: 2, y: 5 }, { x: 7, y: 5 })).toBe(5);
    expect(axisDistance({ x: -3, y: 4 }, { x: -3, y: -2 })).toBe(6);
    expect(axisDistance({ x: 7, y: 5 }, { x: 2, y: 5 })).toBe(5);
    // Miring: Pythagoras belum diajarkan, jadi soalnya tidak boleh bisa dibuat.
    expect(axisDistance({ x: 1, y: 1 }, { x: 4, y: 5 })).toBeNull();
  });

  it('sudut keempat persegi panjang, dari urutan titik mana pun', () => {
    const corners = [
      { x: 1, y: 1 },
      { x: 1, y: 4 },
      { x: 5, y: 1 },
    ];
    for (const order of [
      [0, 1, 2],
      [1, 0, 2],
      [2, 1, 0],
      [1, 2, 0],
    ]) {
      const [a, b, c] = order.map((i) => corners[i] as { x: number; y: number });
      expect(fourthCorner(a!, b!, c!)).toEqual({ x: 5, y: 4 });
    }
  });

  it('tiga titik yang tidak bisa jadi persegi panjang mengembalikan null', () => {
    // Segaris mendatar.
    expect(fourthCorner({ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 })).toBeNull();
    // Tidak ada yang jadi sudut siku.
    expect(fourthCorner({ x: 1, y: 1 }, { x: 3, y: 4 }, { x: 6, y: 2 })).toBeNull();
    // Titik kembar — persegi panjang berlebar nol bukan persegi panjang.
    expect(fourthCorner({ x: 2, y: 2 }, { x: 2, y: 2 }, { x: 5, y: 5 })).toBeNull();
  });

  it('rectCorners dan fourthCorner tidak mungkin berbeda', () => {
    const [a, b, c, d] = rectCorners({ x: -2, y: -1 }, { x: 3, y: 4 });
    expect([a, b, c, d]).toEqual([
      { x: -2, y: -1 },
      { x: 3, y: -1 },
      { x: 3, y: 4 },
      { x: -2, y: 4 },
    ]);
    expect(fourthCorner(a, b, c)).toEqual(d);
    // Sisinya sejajar sumbu, jadi panjangnya bisa dihitung dengan mengurangi.
    expect(axisDistance(a, b)).toBe(5);
    expect(axisDistance(b, c)).toBe(5);
  });
});

describe('CoordinatePlane — dua angka untuk satu titik', () => {
  const parts = (c: HTMLElement, name: string) => c.querySelectorAll(`[data-part="${name}"]`);
  const texts = (c: HTMLElement, name: string) =>
    [...parts(c, name)].map((t) => t.textContent);

  it('grid selalu satu satuan per sel — itu yang bisa dihitung anak', () => {
    // 4 kuadran, rentang 5: garis di -5..5 = 11 tegak + 11 mendatar.
    const { container } = render(<CoordinatePlane range={5} />);
    expect(parts(container, 'grid-line')).toHaveLength(22);
    // Kuadran I saja, rentang 10: 0..10 = 11 + 11.
    const one = render(<CoordinatePlane quadrants={1} range={10} />).container;
    expect(parts(one, 'grid-line')).toHaveLength(22);
  });

  it('satu satuan x digambar sama panjang dengan satu satuan y', () => {
    // Kalau tidak, persegi yang diplot anak tampil sebagai persegi panjang —
    // gambarnya berbohong tentang bangun yang sedang dibaca.
    const { container } = render(
      <CoordinatePlane
        points={[
          { x: 1, y: 1 },
          { x: 4, y: 1 },
          { x: 4, y: 4 },
          { x: 1, y: 4 },
        ]}
        shape
      />,
    );
    const dots = [...parts(container, 'point')].map(
      (c) => [Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))] as [number, number],
    );
    const [p0, p1, p2] = dots as [
      [number, number],
      [number, number],
      [number, number],
    ];
    expect(Math.abs(p1[0] - p0[0])).toBeCloseTo(Math.abs(p2[1] - p1[1]), 5);
  });

  it('kuadran I saja tidak pernah menampilkan angka negatif', () => {
    const one = render(<CoordinatePlane quadrants={1} range={10} />).container;
    expect(texts(one, 'tick-label').some((t) => t?.startsWith('-'))).toBe(false);
    const four = render(<CoordinatePlane range={10} />).container;
    expect(texts(four, 'tick-label').some((t) => t?.startsWith('-'))).toBe(true);
  });

  it('angka sumbu memakai ulang aturan garis bilangan, bukan penjarangan kedua', () => {
    // 0..10 muat setiap satuan; -10..10 tidak, jadi ticksFor melompat ke 5.
    const one = render(<CoordinatePlane quadrants={1} range={10} />).container;
    const ONE_TO_TEN = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    expect(texts(one, 'tick-label')).toEqual([...ONE_TO_TEN, ...ONE_TO_TEN, '0']);
    const four = render(<CoordinatePlane range={10} />).container;
    expect(texts(four, 'tick-label')).toEqual([
      '-10', '-5', '5', '10', // sumbu x
      '-10', '-5', '5', '10', // sumbu y
      '0',
    ]);
    // Setiap angka yang tertulis harus jatuh di garis grid yang benar-benar ada.
    for (const t of texts(four, 'tick-label')) expect(Number.isInteger(Number(t))).toBe(true);
  });

  it('nol hanya ditulis sekali, di pojok antara kedua sumbu', () => {
    const { container } = render(<CoordinatePlane range={5} />);
    expect(texts(container, 'tick-label').filter((t) => t === '0')).toHaveLength(1);
  });

  it('titik asal bisa diberi nama, menggantikan angka nol', () => {
    const { container } = render(<CoordinatePlane range={5} showOrigin />);
    expect(texts(container, 'origin-label')).toEqual(['origin']);
    expect(texts(container, 'tick-label')).not.toContain('0');
    expect(parts(container, 'origin')).toHaveLength(1);
    expect(parts(render(<CoordinatePlane range={5} />).container, 'origin')).toHaveLength(0);
  });

  it('menggambar tiap titik, dengan namanya kalau ada', () => {
    const { container } = render(
      <CoordinatePlane
        points={[
          { x: 3, y: 2, label: 'A' },
          { x: -4, y: 1, label: 'B' },
        ]}
      />,
    );
    expect(parts(container, 'point')).toHaveLength(2);
    expect(texts(container, 'point-label')).toEqual(['A', 'B']);
  });

  it('koordinat yang sengaja disembunyikan tidak bocor lewat label maupun aria', () => {
    const aria = (el: ReactElement) =>
      render(el).container.querySelector('svg')?.getAttribute('aria-label');
    const hidden = render(
      <CoordinatePlane points={[{ x: 3, y: 2, label: 'A' }]} guides />,
    ).container;
    expect(texts(hidden, 'point-label')).toEqual(['A']);
    expect(aria(<CoordinatePlane points={[{ x: 3, y: 2, label: 'A' }]} />)).toBe(
      'coordinate grid, point A',
    );
    expect(aria(<CoordinatePlane points={[{ x: 3, y: 2, label: 'A' }]} showCoords />)).toBe(
      'coordinate grid, point A at (3, 2)',
    );
    const shown = render(
      <CoordinatePlane points={[{ x: 3, y: -2, label: 'A' }]} showCoords />,
    ).container;
    expect(texts(shown, 'point-label')).toEqual(['A (3, -2)']);
  });

  it('label titik memakai formatPoint yang sama dengan teks soal', () => {
    const { container } = render(<CoordinatePlane points={[{ x: -4, y: 3 }]} showCoords />);
    expect(texts(container, 'point-label')).toEqual([formatPoint(-4, 3)]);
  });

  it('garis bantu: dua per titik, dari titik ke kedua sumbu', () => {
    const pts = [
      { x: 3, y: 2 },
      { x: -1, y: 4 },
    ];
    expect(parts(render(<CoordinatePlane points={pts} />).container, 'guide')).toHaveLength(0);
    const { container } = render(<CoordinatePlane points={pts} guides />);
    expect(parts(container, 'guide')).toHaveLength(4);
  });

  it('bangun: 2 titik jadi ruas garis, 3+ jadi bangun tertutup', () => {
    const two = render(
      <CoordinatePlane points={[{ x: 1, y: 1 }, { x: 5, y: 1 }]} shape />,
    ).container;
    expect(parts(two, 'shape')[0]?.tagName.toLowerCase()).toBe('line');
    const corners = rectCorners({ x: 1, y: 1 }, { x: 4, y: 3 });
    const four = render(<CoordinatePlane points={corners} shape />).container;
    const poly = parts(four, 'shape')[0] as SVGPolygonElement;
    expect(poly.tagName.toLowerCase()).toBe('polygon');
    expect((poly.getAttribute('points') ?? '').trim().split(/\s+/)).toHaveLength(4);
    // Tanpa `shape` titiknya tetap titik lepas — bangun tidak muncul sendiri.
    expect(parts(render(<CoordinatePlane points={corners} />).container, 'shape')).toHaveLength(0);
  });

  it('titik di luar rentang tidak keluar bingkai — sumbunya yang melebar', () => {
    const { container } = render(<CoordinatePlane points={[{ x: 8, y: -7 }]} />);
    expect(texts(container, 'tick-label')).toContain('-8');
    expectInsideViewBox(container);
  });

  const PLANES = [
    {},
    { quadrants: 1 as const, range: 5 },
    { quadrants: 1 as const, range: 10 },
    { range: 2 },
    { range: 6 },
    { range: 10 },
    { range: 10, size: 200 },
    { range: 5, size: 342 },
    { showAxisNames: false },
    { showOrigin: true, range: 10 },
  ];
  const POINTS = [
    undefined,
    [{ x: 0, y: 0, label: 'O' }],
    [{ x: 10, y: 10, label: 'A' }],
    [{ x: -10, y: -10, label: 'B' }],
    [
      { x: -4, y: -3, label: 'A' },
      { x: 4, y: 3, label: 'B' },
    ],
    rectCorners({ x: -3, y: -2 }, { x: 3, y: 4 }),
  ];
  const OPTS = [{}, { showCoords: true }, { guides: true }, { shape: true, showCoords: true }];

  it('gambar tetap di dalam bingkai di setiap rentang, ukuran, dan kombinasi label', () => {
    for (const plane of PLANES) {
      for (const points of POINTS) {
        for (const opts of OPTS) {
          expectInsideViewBox(
            render(<CoordinatePlane {...plane} {...opts} points={points} />).container,
          );
        }
      }
    }
  });

  it('LEBAR TEKS ikut menentukan viewBox, bukan cuma titik jangkarnya', () => {
    // Regresi yang sama dengan Angle, Solid3D, dan Circle: "(-10, -10)" jauh lebih
    // lebar daripada jangkarnya, dan "-10" di sumbu jatuh di tepi kiri grid.
    for (const plane of PLANES) {
      for (const points of POINTS) {
        for (const opts of OPTS) {
          const { container } = render(
            <CoordinatePlane {...plane} {...opts} points={points} />,
          );
          const svg = container.querySelector('svg') as SVGSVGElement;
          const [vx, vy, vw, vh] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
          for (const t of container.querySelectorAll('text')) {
            const font = Number(t.getAttribute('font-size'));
            const w = (t.textContent ?? '').length * font * 0.6;
            const x = Number(t.getAttribute('x'));
            const y = Number(t.getAttribute('y'));
            const left = t.getAttribute('text-anchor') === 'end' ? x - w : x - w / 2;
            expect(left).toBeGreaterThanOrEqual(vx as number);
            expect(left + w).toBeLessThanOrEqual((vx as number) + (vw as number));
            expect(y - font / 2).toBeGreaterThanOrEqual(vy as number);
            expect(y + font / 2).toBeLessThanOrEqual((vy as number) + (vh as number));
          }
        }
      }
    }
  });

  it('gambar muat di layar 390px di setiap rentang dan kombinasi label', () => {
    for (const plane of PLANES) {
      for (const points of POINTS) {
        for (const opts of OPTS) {
          const svg = render(
            <CoordinatePlane {...plane} {...opts} points={points} />,
          ).container.querySelector('svg') as SVGSVGElement;
          expect(Number(svg.getAttribute('width'))).toBeLessThanOrEqual(342);
          expect(Number(svg.getAttribute('height'))).toBeLessThanOrEqual(342);
        }
      }
    }
  });

  it('materi memakai jalur render yang sama dengan manipulatif lain', () => {
    const { container } = render(
      <LearnVisualView
        visual={{
          kind: 'coordinate-grid',
          quadrants: 1,
          points: [{ x: 3, y: 2, label: 'A' }],
          showCoords: true,
          guides: true,
        }}
        value={0}
        onValue={() => {}}
        interactive={false}
      />,
    );
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'coordinate grid, point A at (3, 2)',
    );
    expect(container.querySelectorAll('[data-part="guide"]')).toHaveLength(2);
  });
});

describe('Bars — batang perbandingan dan batang bernilai', () => {
  const bars = (c: HTMLElement) => [...c.querySelectorAll('[data-part="bar"]')];
  const tickLabels = (c: HTMLElement) =>
    [...c.querySelectorAll('[data-part="tick-label"]')].map((t) => Number(t.textContent));

  it('tanpa `values` batang perbandingan tidak berubah sedikit pun', () => {
    // Ratusan modul Grade 1–6 memakai jalur ini. Sumbu berangka yang datang
    // diam-diam akan mengubah tampilan semuanya sekaligus tanpa ada yang meminta.
    const { container } = render(<Bars lengths={[0.8, 0.4]} labels={['A', 'B']} />);
    expect(container.querySelector('svg')).toBeNull();
    const spans = [...container.querySelectorAll('span')];
    expect(spans.map((s) => s.textContent)).toEqual(['A', '', 'B', '']);
    const drawn = spans.filter((s) => s.style.background);
    expect(drawn.map((s) => s.style.width)).toEqual(['80%', '40%']);
    for (const s of drawn) {
      expect(s.style.borderRadius).toBe('999px');
      expect(s.style.height).toBe('26px');
      expect(s.style.boxShadow).toBe('');
    }
    expect(container.querySelector('[aria-label="Compare lengths"]')).not.toBeNull();
  });

  it('materi lama memakai jalur render yang sama dan tetap tanpa sumbu', () => {
    const { container } = render(
      <LearnVisualView
        visual={{ kind: 'bars', lengths: [0.9, 0.5, 0.3], labels: ['A', 'B', 'C'] }}
        value={0}
        onValue={() => {}}
        interactive={false}
      />,
    );
    expect(container.querySelector('svg')).toBeNull();
    expect(
      [...container.querySelectorAll('span')]
        .filter((s) => s.style.background)
        .map((s) => s.style.width),
    ).toEqual(['90%', '50%', '30%']);
  });

  it('`values` menyalakan sumbu berangka — itu yang membuat batang bisa DIBACA', () => {
    const { container } = render(<Bars values={[8, 5, 12]} labels={['A', 'B', 'C']} />);
    expect(container.querySelectorAll('[data-part="axis"]')).toHaveLength(2);
    expect(bars(container)).toHaveLength(3);
    expect(tickLabels(container).length).toBeGreaterThan(2);
  });

  it('angka sumbu memakai ulang aturan garis bilangan, bukan penomoran ketiga', () => {
    // Sama seperti CoordinatePlane: setiap angka jatuh di kelipatan `stepFor`, dan
    // jumlahnya tidak pernah melebihi anggaran `maxTicksFor`. Tanpa ini muncul lagi
    // label 3125 / 6250 / 9375 yang dulu membuat garis bilangan tak terbaca.
    for (const values of [[8, 5, 12], [3], [300, 150], [10000], [7, 7, 7], [0.5, 1.5]]) {
      const { container } = render(<Bars values={values} />);
      const labelled = tickLabels(container);
      const top = labelled[labelled.length - 1] as number;
      const step = stepFor(0, top);
      expect(labelled[0]).toBe(0);
      expect(top).toBeGreaterThanOrEqual(Math.max(...values));
      expect(labelled.length).toBeLessThanOrEqual(maxTicksFor(0, top));
      for (const t of labelled) {
        expect(Math.abs(Math.round(t / step) - t / step)).toBeLessThan(1e-6);
      }
      // Jarak antar angka selalu sama — sumbu yang tidak rata tidak bisa dibaca.
      const gaps = labelled.slice(1).map((t, i) => t - (labelled[i] as number));
      for (const g of gaps) expect(g).toBeCloseTo(gaps[0] as number, 6);
    }
  });

  it('data modul boleh menimpa langkahnya, seperti garis bilangan', () => {
    const { container } = render(<Bars values={[1, 2]} max={2} step={0.5} />);
    expect(tickLabels(container)).toEqual(ticksFor(0, 2, 0.5, 21));
  });

  it('panjang batang sebanding dengan nilainya — kalau tidak, gambarnya berbohong', () => {
    const { container } = render(<Bars values={[4, 8, 2]} />);
    const w = bars(container).map((b) => Number(b.getAttribute('width')));
    expect((w[1] as number) / (w[0] as number)).toBeCloseTo(2, 2);
    expect((w[0] as number) / (w[2] as number)).toBeCloseTo(2, 2);
  });

  it('batang bernilai nol tetap terlihat sebagai batang, bukan baris yang hilang', () => {
    const { container } = render(<Bars values={[0, 5]} labels={['A', 'B']} />);
    expect(bars(container)).toHaveLength(2);
    expect(Number(bars(container)[0]?.getAttribute('width'))).toBeGreaterThan(0);
  });

  it('`max` dari data modul tidak pernah memotong batang yang lebih tinggi', () => {
    const { container } = render(<Bars values={[12]} max={5} />);
    const labelled = tickLabels(container);
    expect(labelled[labelled.length - 1]).toBeGreaterThanOrEqual(12);
  });

  it('menulis nilai di ujung batang hanya kalau diminta — kalau tidak, jawaban bocor', () => {
    const values = (c: HTMLElement) =>
      [...c.querySelectorAll('[data-part="bar-value"]')].map((t) => t.textContent);
    expect(values(render(<Bars values={[8, 5]} />).container)).toEqual([]);
    expect(values(render(<Bars values={[8, 5]} showValues />).container)).toEqual(['8', '5']);
  });

  it('label pembaca layar menyebut nilai yang memang sudah terlihat di sumbu', () => {
    const aria = (el: ReactElement) =>
      render(el).container.querySelector('svg')?.getAttribute('aria-label');
    expect(aria(<Bars values={[8, 5]} labels={['A', 'B']} />)).toBe(
      'bar chart, A is 8, B is 5',
    );
    expect(aria(<Bars values={[8]} />)).toBe('bar chart, bar 1 is 8');
  });

  const BAR_CASES: { values: number[]; labels?: string[] }[] = [
    { values: [8, 5, 12], labels: ['A', 'B', 'C'] },
    { values: [3] },
    { values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { values: [10000, 2500], labels: ['Mon', 'Tue'] },
    { values: [0.5, 1.5, 2], labels: ['A', 'B', 'C'] },
    { values: [7, 7, 7, 7], labels: ['Red', 'Blue', 'Green', 'Yellow'] },
  ];
  const BAR_OPTS = [{}, { showValues: true }, { max: 20 }, { step: 5, max: 25 }];

  it('gambar tetap di dalam bingkai untuk semua data dan kombinasi label', () => {
    for (const c of BAR_CASES) {
      for (const opts of BAR_OPTS) {
        expectInsideViewBox(render(<Bars {...c} {...opts} />).container);
      }
    }
  });

  it('LEBAR TEKS ikut menentukan viewBox, bukan cuma titik jangkarnya', () => {
    // Regresi yang sama dengan Angle, Solid3D, Circle, dan CoordinatePlane: angka
    // "10000" di ujung sumbu menonjol setengah lebarnya ke kanan, dan nama batang
    // menonjol ke kiri nol — dua-duanya di luar kotak yang ditebak dari gambarnya.
    for (const c of BAR_CASES) {
      for (const opts of BAR_OPTS) {
        const { container } = render(<Bars {...c} {...opts} />);
        const svg = container.querySelector('svg') as SVGSVGElement;
        const [vx, vy, vw, vh] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
        for (const t of container.querySelectorAll('text')) {
          const font = Number(t.getAttribute('font-size'));
          const w = (t.textContent ?? '').length * font * 0.6;
          const x = Number(t.getAttribute('x'));
          const y = Number(t.getAttribute('y'));
          const anchor = t.getAttribute('text-anchor');
          const left = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
          expect(left).toBeGreaterThanOrEqual(vx as number);
          expect(left + w).toBeLessThanOrEqual((vx as number) + (vw as number));
          expect(y - font / 2).toBeGreaterThanOrEqual(vy as number);
          expect(y + font / 2).toBeLessThanOrEqual((vy as number) + (vh as number));
        }
      }
    }
  });

  it('gambar muat di layar 390px di setiap data dan kombinasi label', () => {
    for (const c of BAR_CASES) {
      for (const opts of BAR_OPTS) {
        const svg = render(<Bars {...c} {...opts} />).container.querySelector(
          'svg',
        ) as SVGSVGElement;
        expect(Number(svg.getAttribute('width'))).toBeLessThanOrEqual(342);
        expect(Number(svg.getAttribute('height'))).toBeLessThanOrEqual(342);
      }
    }
  });

  it('materi memakai jalur render yang sama dengan manipulatif lain', () => {
    const { container } = render(
      <LearnVisualView
        visual={{ kind: 'bars', values: [8, 5], labels: ['A', 'B'], showValues: true }}
        value={0}
        onValue={() => {}}
        interactive={false}
      />,
    );
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'bar chart, A is 8, B is 5',
    );
    expect(container.querySelectorAll('[data-part="bar-value"]')).toHaveLength(2);
  });
});

describe('ArrayGrid — penanda bulat untuk benda, petak persegi untuk luas', () => {
  const cells = (c: HTMLElement) => [...c.querySelectorAll('span')];

  it('penanda bulat tidak berubah — modul perkalian dan perseratusan masih benar', () => {
    // `array-grid` dipakai dari g2 sampai g6; di sana yang dihitung BENDA, dan
    // bulat masih bacaan yang benar. Mode kotak wajib diminta sendiri.
    const { container } = render(<ArrayGrid rows={3} cols={4} />);
    expect(container.querySelector('[aria-label="3 rows of 4"]')).not.toBeNull();
    expect(container.querySelector('.gap-1\\.5')).not.toBeNull();
    for (const s of cells(container)) {
      expect(s.style.borderRadius).toBe('999px');
      expect(s.style.boxShadow).toBe('');
    }
  });

  it('mode kotak menggambar persegi yang berdempetan — itu ARTI menutup bidang', () => {
    const { container } = render(<ArrayGrid rows={3} cols={4} square />);
    expect(container.querySelector('[aria-label="3 rows of 4 squares"]')).not.toBeNull();
    // Tidak ada celah antar petak: bidangnya harus tampak tertutup habis.
    expect(container.querySelector('.gap-1\\.5')).toBeNull();
    for (const s of cells(container)) {
      expect(s.style.borderRadius).toBe('3px');
      // Garis pemisah, kalau tidak seluruh bidang jadi satu blok yang tak terhitung.
      expect(s.style.boxShadow).not.toBe('');
    }
  });

  it('jumlah petak tetap baris × kolom, dan sorot baris tetap bekerja', () => {
    const { container } = render(<ArrayGrid rows={3} cols={5} square highlightRow={0} />);
    expect(cells(container)).toHaveLength(15);
    const highlighted = cells(container).filter((s) =>
      s.style.background.includes('--c-unit-3'),
    );
    expect(highlighted).toHaveLength(5);
  });

  it('materi memakai jalur render yang sama dengan manipulatif lain', () => {
    const { container } = render(
      <LearnVisualView
        visual={{ kind: 'array', rows: 3, cols: 4, square: true }}
        value={0}
        onValue={() => {}}
        interactive={false}
      />,
    );
    expect(container.querySelector('[aria-label="3 rows of 4 squares"]')).not.toBeNull();
    expect(container.querySelectorAll('span')).toHaveLength(12);
  });
});

describe('Shape2D — sudut & sisi yang bisa dihitung anak', () => {
  const targets = (c: HTMLElement) => [...c.querySelectorAll('[data-part="tap-target"]')];

  it('tanpa `tap` bangunnya cuma gambar — tidak ada yang bisa disentuh', () => {
    const { container } = render(<Shape2D name="triangle" showCorners onTap={() => {}} />);
    expect(targets(container)).toHaveLength(0);
  });

  it('menghitung sudut, dan sentuhan kedua di sudut yang sama tidak menambah', () => {
    const seen: number[] = [];
    const { container } = render(
      <Shape2D name="square" showCorners tap="corners" onTap={(n) => seen.push(n)} />,
    );
    const t = targets(container);
    expect(t).toHaveLength(4);
    fireEvent.click(t[0]!);
    fireEvent.click(t[0]!);
    fireEvent.click(t[1]!);
    expect(seen).toEqual([1, 2]);
  });

  /**
   * Bug nyata: `take` membaca state lewat closure, jadi tiga sentuhan yang tiba di
   * tick yang sama semuanya membaca daftar kosong dan hanya yang terakhir tercatat.
   * Anak menyentuh tiga sudut, hitungannya berhenti di satu, dan Next tidak terbuka.
   */
  it('tiga sentuhan dalam satu tick tetap terhitung tiga', () => {
    const seen: number[] = [];
    const { container } = render(
      <Shape2D name="triangle" showCorners tap="corners" onTap={(n) => seen.push(n)} />,
    );
    const t = targets(container);
    act(() => {
      for (const el of t) el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(seen.at(-1)).toBe(3);
  });

  it('sisi dihitung per sisi, bukan per sudut', () => {
    const seen: number[] = [];
    const { container } = render(
      <Shape2D name="triangle" showCorners tap="sides" onTap={(n) => seen.push(n)} />,
    );
    const t = targets(container);
    expect(t.map((e) => e.getAttribute('aria-label'))).toEqual(['Side 1', 'Side 2', 'Side 3']);
    for (const el of t) fireEvent.click(el);
    expect(seen).toEqual([1, 2, 3]);
  });

  it('lingkaran tidak punya sudut maupun sisi untuk dihitung', () => {
    const { container } = render(<Shape2D name="circle" tap="corners" onTap={() => {}} />);
    expect(targets(container)).toHaveLength(0);
  });
});

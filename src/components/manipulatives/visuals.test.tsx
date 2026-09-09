import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { ArrayGrid } from './ArrayGrid';
import { Base10Blocks } from './Base10Blocks';
import { TallyChart } from './TallyChart';
import { RectShape } from './RectShape';
import { Angle, ANGLE_NAMES, angleKind } from './Angle';
import { NumberLine } from './NumberLine';
import { Solid3D } from './Solid3D';
import { ShapeNet } from './ShapeNet';
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

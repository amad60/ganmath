import { clamp } from './scale';
import { SOLID_NAMES, solidFromDims, volumeOf } from './solids';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

/** Proyeksi isometrik 2:1 yang dipakai buku: sumbu mendatar miring 30°. */
const COS30 = Math.cos(Math.PI / 6);

/**
 * Batas ukuran. Bukan angka sembarang: 8×8 lapis membuat sisi kubus tinggal ~14px
 * di layar 390px, dan kubus yang tidak bisa dihitung sama saja tidak digambar.
 */
const MAX_SIDE = 8;
/** Sisi kubus terbesar. Lebih dari ini balok 2×2×2 memenuhi layar tanpa guna. */
const MAX_UNIT = 34;
/** Tinggi gambar maksimum — layar soal masih harus memuat teks dan tombol. */
const MAX_H = 236;

const FONT = 15;
const CHAR_W = 9;

export type Solid3DProps = {
  /** Panjang (ke kanan-bawah), lebar/kedalaman (ke kiri-bawah), tinggi. Satuan kubus. */
  l: number;
  w: number;
  h: number;
  /**
   * Gambar tiap kubus satuan. Ini default-nya karena volume hanya masuk akal kalau
   * anak bisa MENGHITUNG kubusnya dulu. Matikan setelah dia siap memakai p×l×t.
   */
  cubes?: boolean;
  /** Tulis panjang tiap rusuk. */
  showDimensions?: boolean;
  /** Tulis volumenya. Dimatikan saat volumenya yang ditanyakan. */
  showVolume?: boolean;
  /** Tulis namanya, mis. "cube". */
  showName?: boolean;
  /** Sorot satu lapis, 0 = paling bawah. Memperlihatkan "satu lapis lalu ditumpuk". */
  highlightLayer?: number;
  /** Satuan panjang, mis. "cm". Kosong = satuan kubus tanpa nama. */
  unit?: string;
  /** Lebar maksimum gambar dalam piksel. */
  size?: number;
  color?: string;
};

type P = [number, number];

/**
 * Balok yang tersusun dari kubus satuan yang bisa dihitung.
 *
 * Volume tidak bisa diajarkan dengan bangun datar, dan tidak bisa juga dengan kotak
 * mulus berlabel "5 cm": anak yang belum pernah MENGHITUNG kubusnya hanya menghafal
 * p×l×t dan langsung tersandung begitu soalnya berubah sedikit. Maka bentuk dasarnya
 * adalah tumpukan kubus satuan, digambar isometrik supaya ketiga arah terlihat
 * sekaligus — "3 baris × 4 kolom × 2 lapis" harus bisa dibaca dari gambarnya saja.
 *
 * Hanya kubus di permukaan yang digambar (yang di dalam tertutup) dan urutan
 * gambarnya dari belakang ke depan, jadi tumpukan 6×6×6 tetap ~200 poligon,
 * bukan 648.
 */
export function Solid3D({
  l,
  w,
  h,
  cubes = true,
  showDimensions,
  showVolume,
  showName,
  highlightLayer,
  unit,
  size = 320,
  color = 'var(--c-unit-5)',
}: Solid3DProps) {
  const reduced = useReducedMotion();
  const L = Math.round(clamp(l, 1, MAX_SIDE));
  const W = Math.round(clamp(w, 1, MAX_SIDE));
  const H = Math.round(clamp(h, 1, MAX_SIDE));

  // Satu satuan dalam piksel: dipilih sebesar mungkin yang masih muat, supaya balok
  // kecil digambar besar dan balok besar mengecil sendiri, bukan terpotong.
  const u = Math.min(size / ((L + W) * COS30), MAX_H / ((L + W) / 2 + H), MAX_UNIT);

  const at = (i: number, j: number, k: number): P => [
    (i - j) * COS30 * u,
    ((i + j) / 2 - k) * u,
  ];

  /** Tiga sisi kotak yang menghadap ke penonton: atas, kanan (+p), kiri (+l). */
  const boxFaces = (i0: number, i1: number, j0: number, j1: number, k0: number, k1: number) => ({
    top: [at(i0, j0, k1), at(i1, j0, k1), at(i1, j1, k1), at(i0, j1, k1)],
    right: [at(i1, j0, k0), at(i1, j1, k0), at(i1, j1, k1), at(i1, j0, k1)],
    left: [at(i0, j1, k0), at(i1, j1, k0), at(i1, j1, k1), at(i0, j1, k1)],
  });

  const cells: { i: number; j: number; k: number }[] = [];
  if (cubes) {
    for (let k = 0; k < H; k++) {
      for (let j = 0; j < W; j++) {
        for (let i = 0; i < L; i++) {
          // Kubus di dalam tidak pernah terlihat — menggambarnya hanya membuang frame.
          if (i === L - 1 || j === W - 1 || k === H - 1) cells.push({ i, j, k });
        }
      }
    }
    // Urutan pelukis: yang jauh dulu. Di isometrik, jarak = i + j + k.
    cells.sort((a, b) => a.i + a.j + a.k - (b.i + b.j + b.k));
  }

  // Sembilan rusuk luar yang terlihat; tiga rusuk di pojok terjauh (0,0,0) tidak.
  const outline: [P, P][] = [];
  for (const j of [0, W] as const) {
    for (const k of [0, H] as const) {
      if (j === 0 && k === 0) continue;
      outline.push([at(0, j, k), at(L, j, k)]);
    }
  }
  for (const i of [0, L] as const) {
    for (const k of [0, H] as const) {
      if (i === 0 && k === 0) continue;
      outline.push([at(i, 0, k), at(i, W, k)]);
    }
  }
  for (const i of [0, L] as const) {
    for (const j of [0, W] as const) {
      if (i === 0 && j === 0) continue;
      outline.push([at(i, j, 0), at(i, j, H)]);
    }
  }

  const withUnit = (n: number) => (unit ? `${n} ${unit}` : String(n));

  /**
   * Label rusuk ditaruh di LUAR siluet, tegak lurus rusuknya. Menaruhnya di tengah
   * rusuk saja membuat angka tinggi jatuh di atas kubus dan tidak terbaca.
   */
  const mid = (a: P, b: P, dx: number, dy: number): P => [
    (a[0] + b[0]) / 2 + dx * u,
    (a[1] + b[1]) / 2 + dy * u,
  ];
  const dimLabels = showDimensions
    ? [
        { key: 'l', text: withUnit(L), at: mid(at(0, W, 0), at(L, W, 0), -0.42, 0.72) },
        { key: 'w', text: withUnit(W), at: mid(at(L, 0, 0), at(L, W, 0), 0.42, 0.72) },
        { key: 'h', text: withUnit(H), at: mid(at(L, 0, 0), at(L, 0, H), 0.62, 0.05) },
      ]
    : [];

  const rows: string[] = [];
  if (showName) rows.push(SOLID_NAMES[solidFromDims(L, W, H)]);
  if (showVolume) {
    const v = volumeOf(L, W, H);
    rows.push(unit ? `${v} cubic ${unit}` : `${v} cubic units`);
  }

  // viewBox dihitung dari SEMUA yang digambar, termasuk lebar teksnya. Kotak
  // pembatas yang ditebak (mis. "kasih padding 20") itu yang dulu memotong label
  // sisi kanan RectShape — di sini label bisa jatuh di keempat arah sekaligus.
  const xs: number[] = [];
  const ys: number[] = [];
  for (const i of [0, L] as const)
    for (const j of [0, W] as const)
      for (const k of [0, H] as const) {
        const [x, y] = at(i, j, k);
        xs.push(x);
        ys.push(y);
      }
  for (const d of dimLabels) {
    xs.push(d.at[0] - (d.text.length * CHAR_W) / 2, d.at[0] + (d.text.length * CHAR_W) / 2);
    ys.push(d.at[1] - FONT / 2, d.at[1] + FONT / 2);
  }

  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const rowTop = Math.max(...ys) + 18;
  const rowY = rows.map((_, i) => rowTop + i * 20);
  rows.forEach((t, i) => {
    xs.push(centerX - (t.length * CHAR_W) / 2, centerX + (t.length * CHAR_W) / 2);
    ys.push((rowY[i] ?? rowTop) + FONT / 2);
  });

  const pad = 4;
  const vbX = Math.min(...xs) - pad;
  const vbY = Math.min(...ys) - pad;
  const vbW = Math.max(...xs) - vbX + pad;
  const vbH = Math.max(...ys) - vbY + pad;

  /**
   * Balok tersusun LAPIS demi lapis, dan animasinya mengatakan hal yang sama:
   * satu lapis muncul utuh, lalu lapis berikutnya di atasnya. Menyapu per kubus
   * secara diagonal terlihat lebih ramai tapi tidak mengajarkan apa pun.
   */
  const step = teachingDuration(90, reduced);
  const solidName = SOLID_NAMES[solidFromDims(L, W, H)];
  /** Label pembaca layar mengikuti apa yang TERLIHAT — tidak membocorkan volumenya. */
  const aria = showVolume
    ? `${solidName} of ${volumeOf(L, W, H)} unit cubes`
    : showDimensions
      ? `${solidName}, ${L} by ${W} by ${H}`
      : showName
        ? solidName
        : cubes
          ? 'solid made of unit cubes'
          : 'solid shape';

  const poly = (pts: P[], fill: string, delay: number) => (
    <polygon
      data-part="face"
      points={pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ')}
      fill={fill}
      stroke="var(--c-ink)"
      strokeWidth={Math.max(0.8, u * 0.04)}
      strokeLinejoin="round"
      style={{ animation: `fade-rise ${teachingDuration(200, reduced)}ms ${delay}ms both` }}
    />
  );

  /**
   * Sisi kubus HARUS pekat. Memakai satu warna dengan opacity berbeda terlihat sama
   * di gambar tunggal, tapi di tumpukan kubus yang di belakang menembus yang di
   * depan dan muncul segitiga hantu di tiap sisi — bug ini benar-benar terjadi dan
   * baru terlihat setelah gambarnya dipandang. Warnanya tetap dari token: dicampur
   * ke warna permukaan, jadi ikut berubah sendiri di tema gelap.
   */
  const shade = (fill: string, pct: number) =>
    `color-mix(in srgb, ${fill} ${pct}%, var(--c-surface))`;

  const faceStack = (
    key: string,
    f: ReturnType<typeof boxFaces>,
    fill: string,
    delay: number,
  ) => (
    <g key={key}>
      {/* Tiga tingkat kecerahan pada satu warna: itu yang membuat kotak terbaca
          sebagai benda tiga dimensi, bukan segi enam datar. */}
      {poly(f.left, shade(fill, 52), delay)}
      {poly(f.right, shade(fill, 74), delay)}
      {poly(f.top, fill, delay)}
    </g>
  );

  return (
    <svg
      viewBox={`${vbX.toFixed(2)} ${vbY.toFixed(2)} ${vbW.toFixed(2)} ${vbH.toFixed(2)}`}
      width={Math.round(vbW)}
      height={Math.round(vbH)}
      role="img"
      aria-label={aria}
      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
    >
      {cubes
        ? cells.map(({ i, j, k }) =>
            faceStack(
              `${i}-${j}-${k}`,
              boxFaces(i, i + 1, j, j + 1, k, k + 1),
              k === highlightLayer ? 'var(--c-unit-3)' : color,
              k * step,
            ),
          )
        : faceStack('box', boxFaces(0, L, 0, W, 0, H), color, 0)}

      {outline.map(([a, b], i) => (
        <line
          key={i}
          data-part="edge"
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
          stroke="var(--c-ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}

      {dimLabels.map((d) => (
        <text
          key={d.key}
          data-part="dim"
          x={d.at[0]}
          y={d.at[1]}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={FONT}
          fontWeight="800"
          fill="var(--c-ink)"
        >
          {d.text}
        </text>
      ))}

      {rows.map((t, i) => (
        <text
          key={t}
          data-part={showName && i === 0 ? 'name' : 'value'}
          x={centerX}
          y={rowY[i] ?? rowTop}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={FONT}
          fontWeight="800"
          fill="var(--c-ink-soft)"
        >
          {t}
        </text>
      ))}
    </svg>
  );
}

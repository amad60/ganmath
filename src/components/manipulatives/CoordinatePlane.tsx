import { clamp, maxTicksFor, ticksFor } from './scale';
import { formatPoint } from './coordinates';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

/** Satu titik yang digambar. `label` = nama titik di buku, mis. "A". */
export type PlotPoint = { x: number; y: number; label?: string };

export type CoordinatePlaneProps = {
  /** Titik yang digambar. Urutannya dipakai saat titik disambung jadi bangun. */
  points?: PlotPoint[];
  /**
   * Kuadran yang ditampilkan. `1` = hanya kuadran I (x dan y ≥ 0) untuk modul
   * pengenalan; `4` = keempatnya, karena Grade 6 sudah mengenal bilangan negatif.
   */
  quadrants?: 1 | 4;
  /** Nilai terbesar di sumbu. Kosong = diturunkan dari titik-titiknya. */
  range?: number;
  /** Sambungkan titik jadi bangun. 2 titik = ruas garis, 3+ = bangun tertutup. */
  shape?: boolean;
  /** Tulis pasangan koordinat di sebelah titik. Matikan saat itu yang ditanyakan. */
  showCoords?: boolean;
  /** Garis bantu putus-putus dari titik ke kedua sumbu — cara MEMBACA koordinat. */
  guides?: boolean;
  /** Tulis "x" dan "y" di ujung sumbu. */
  showAxisNames?: boolean;
  /** Tandai titik asal dan namai "origin" (menggantikan angka 0 di sudut sumbu). */
  showOrigin?: boolean;
  /** Lebar grid dalam piksel — bukan lebar SVG-nya (label sumbu menambah di luarnya). */
  size?: number;
  color?: string;
};

/** Rentang sumbu terbesar. Lebih dari ini sel grid tinggal ~6px di layar 390px. */
const MAX_RANGE = 10;
const MIN_RANGE = 2;
/** Sel grid terbesar. Bidang −2..2 tidak perlu memenuhi layar. */
const MAX_U = 34;
/** Panjang sumbu melewati tepi grid — tempat kepala panahnya. */
const AX_OVER = 12;
const ARROW = 7;
/** Label titik dan nama sumbu. */
const FONT = 15;
const CHAR_W = 9;
/**
 * Angka di sumbu. Sengaja lebih kecil daripada label titik: yang harus menonjol
 * adalah titiknya, angka sumbu cuma penggaris.
 */
const TICK_FONT = 11;
const TICK_CHAR_W = 6.6;
const DOT_R = 5.5;
/** Tinggi gambar maksimum — layar soal masih harus memuat teks dan tombol. */
const MAX_H = 300;

type Text = {
  part: string;
  text: string;
  x: number;
  y: number;
  anchor: 'middle' | 'end';
  font: number;
  charW: number;
  fill: string;
};

/**
 * Bidang koordinat: dua sumbu bernomor, titik asal, dan titik-titik yang diplot.
 *
 * Ini bentuk yang tidak bisa diajarkan dengan `NumberLine`: garis bilangan hanya
 * punya SATU arah, sedangkan seluruh isi unit ini adalah bahwa satu titik butuh DUA
 * angka dan urutannya penting. Maka gridnya selalu persegi (satu satuan x = satu
 * satuan y — kalau tidak, persegi yang diplot anak tampil sebagai persegi panjang
 * dan gambarnya berbohong), dan garis bantu putus-putus dari titik ke kedua sumbu
 * memperlihatkan cara membacanya: berapa langkah ke kanan, lalu berapa langkah ke atas.
 *
 * Komponen ini READ-ONLY. Memplot titik dengan tap butuh tipe soal dan jalur jawaban
 * baru; sampai itu ada, soal memakai `choose-text` (mana koordinat titik ini) dan
 * `keypad` (berapa nilai x-nya).
 */
export function CoordinatePlane({
  points = [],
  quadrants = 4,
  range,
  shape,
  showCoords,
  guides,
  showAxisNames = true,
  showOrigin,
  size = 320,
  color = 'var(--c-unit-1)',
}: CoordinatePlaneProps) {
  const reduced = useReducedMotion();

  // Rentang diturunkan dari titiknya kalau tidak ditulis: modul tidak bisa lupa
  // melebarkan sumbu lalu memplot titik di luar bingkai tanpa ada yang menyadarinya.
  const widest = points.reduce((m, p) => Math.max(m, Math.abs(p.x), Math.abs(p.y)), 0);
  const R = Math.round(clamp(range ?? Math.max(5, Math.ceil(widest)), MIN_RANGE, MAX_RANGE));
  const xMin = quadrants === 1 ? 0 : -R;
  const yMin = xMin;
  const xMax = R;
  const yMax = R;
  const spanX = xMax - xMin;
  const spanY = yMax - yMin;

  const pts = points.slice(0, 8).map((p) => ({
    ...p,
    x: clamp(p.x, xMin, xMax),
    y: clamp(p.y, yMin, yMax),
  }));

  /**
   * Ruang di luar grid hanya disediakan di sisi yang benar-benar memakainya. Saat
   * keempat kuadran tampil, angka sumbu jatuh DI DALAM grid (di samping sumbu yang
   * ada di tengah), jadi menyisakan tepi kiri-bawah di sana hanya menciutkan gambar.
   */
  const tickChars = Math.max(String(xMin).length, String(xMax).length);
  const gutL = xMin === 0 ? tickChars * TICK_CHAR_W + 10 : (tickChars * TICK_CHAR_W) / 2 + 4;
  const gutB = yMin === 0 ? TICK_FONT + 12 : TICK_FONT / 2 + 4;
  const gut = AX_OVER + (showAxisNames ? 16 : 8);

  // Piksel per satuan grid: sebesar mungkin yang masih muat, sama untuk x dan y.
  const u = clamp(
    Math.min((size - gutL - gut) / spanX, (MAX_H - gutB - gut) / spanY),
    6,
    MAX_U,
  );

  const X = (x: number) => (x - xMin) * u;
  const Y = (y: number) => (yMax - y) * u;
  const gw = spanX * u;
  const gh = spanY * u;
  const ax = X(0);
  const ay = Y(0);

  /**
   * Penomoran sumbu memakai ulang `ticksFor`/`maxTicksFor` — aturan yang sama dengan
   * garis bilangan, bukan penjarangan kedua. `maxTicksFor` menghitung untuk garis
   * selebar layar (342px) dengan label 13px; sumbu di sini lebih pendek (±250px)
   * tapi angkanya juga lebih kecil (11px), dan kedua selisih itu saling meniadakan —
   * jadi anggarannya dipakai apa adanya.
   *
   * Garis gridnya sendiri TETAP satu satuan, berapa pun rentangnya: sel 1×1 itulah
   * yang membuat "3 ke kanan, 2 ke atas" bisa dihitung anak. Yang dijarangkan hanya
   * ANGKA-nya.
   */
  const labelledX = ticksFor(xMin, xMax, 1, maxTicksFor(xMin, xMax)).filter((t) => t !== 0);
  const labelledY = ticksFor(yMin, yMax, 1, maxTicksFor(yMin, yMax)).filter((t) => t !== 0);

  const gridX: number[] = [];
  for (let x = xMin; x <= xMax; x++) gridX.push(x);
  const gridY: number[] = [];
  for (let y = yMin; y <= yMax; y++) gridY.push(y);

  const texts: Text[] = [];
  for (const t of labelledX) {
    texts.push({
      part: 'tick-label',
      text: String(t),
      x: X(t),
      y: ay + TICK_FONT + 5,
      anchor: 'middle',
      font: TICK_FONT,
      charW: TICK_CHAR_W,
      fill: 'var(--c-ink-soft)',
    });
  }
  for (const t of labelledY) {
    texts.push({
      part: 'tick-label',
      text: String(t),
      x: ax - 7,
      y: Y(t),
      anchor: 'end',
      font: TICK_FONT,
      charW: TICK_CHAR_W,
      fill: 'var(--c-ink-soft)',
    });
  }
  // Satu angka nol saja, di pojok antara kedua sumbu — bukan dua nol yang berdempetan.
  texts.push({
    part: showOrigin ? 'origin-label' : 'tick-label',
    text: showOrigin ? 'origin' : '0',
    x: ax - 7,
    y: ay + TICK_FONT + 5,
    anchor: 'end',
    font: TICK_FONT,
    charW: TICK_CHAR_W,
    fill: showOrigin ? 'var(--c-ink)' : 'var(--c-ink-soft)',
  });

  if (showAxisNames) {
    texts.push({
      part: 'axis-name',
      text: 'x',
      x: gw + AX_OVER + 9,
      y: ay,
      anchor: 'middle',
      font: FONT,
      charW: CHAR_W,
      fill: 'var(--c-ink)',
    });
    texts.push({
      part: 'axis-name',
      text: 'y',
      x: ax,
      y: -AX_OVER - 10,
      anchor: 'middle',
      font: FONT,
      charW: CHAR_W,
      fill: 'var(--c-ink)',
    });
  }

  /**
   * Label titik ditaruh DI ATAS titiknya dan dijepit di dalam lebar grid. Tanpa
   * jepitan itu "(-4, -3)" di titik paling kanan melebarkan gambar keluar layar
   * 390px — bug yang sama dengan label sisi kanan RectShape dulu.
   */
  const dots = pts.map((p, i) => {
    const text = [p.label, showCoords ? formatPoint(p.x, p.y) : '']
      .filter(Boolean)
      .join(' ');
    const w = text.length * CHAR_W;
    return {
      key: `p${i}`,
      cx: X(p.x),
      cy: Y(p.y),
      text,
      tx: clamp(X(p.x), Math.min(w / 2, gw / 2), Math.max(gw - w / 2, gw / 2)),
      ty: Y(p.y) - DOT_R - 9,
    };
  });

  for (const d of dots) {
    if (!d.text) continue;
    texts.push({
      part: 'point-label',
      text: d.text,
      x: d.tx,
      y: d.ty,
      anchor: 'middle',
      font: FONT,
      charW: CHAR_W,
      fill: 'var(--c-ink)',
    });
  }

  /**
   * viewBox dihitung dari SEMUA yang digambar, termasuk LEBAR teksnya — pola yang
   * sama dengan Solid3D dan Circle. Kotak pembatas yang ditebak ("kasih padding 20")
   * memotong angka sumbu paling kiri begitu rentangnya jadi dua digit negatif.
   */
  const xs = [0, gw, gw + AX_OVER + ARROW, ax - ARROW, ax + ARROW];
  const ys = [0, gh, -AX_OVER - ARROW, ay - ARROW, ay + ARROW];
  for (const t of texts) {
    const w = t.text.length * t.charW;
    xs.push(t.anchor === 'end' ? t.x - w : t.x - w / 2, t.anchor === 'end' ? t.x : t.x + w / 2);
    ys.push(t.y - t.font / 2, t.y + t.font / 2);
  }
  for (const d of dots) {
    xs.push(d.cx - DOT_R, d.cx + DOT_R);
    ys.push(d.cy - DOT_R, d.cy + DOT_R);
  }

  const pad = 4;
  const vbX = Math.min(...xs) - pad;
  const vbY = Math.min(...ys) - pad;
  const vbW = Math.max(...xs) - vbX + pad;
  const vbH = Math.max(...ys) - vbY + pad;

  const fade = teachingDuration(220, reduced);
  const step = teachingDuration(120, reduced);

  /** Label pembaca layar mengikuti apa yang TERLIHAT — tidak membocorkan koordinat
   * yang sengaja disembunyikan karena itu yang ditanyakan. */
  const said = [shape && pts.length > 2 ? 'shape on a coordinate grid' : 'coordinate grid'];
  for (const p of pts) {
    const name = p.label ? `point ${p.label}` : 'point';
    said.push(showCoords ? `${name} at ${formatPoint(p.x, p.y)}` : name);
  }

  const axisLine = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line
      key={key}
      data-part="axis"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--c-ink)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  );

  return (
    <svg
      viewBox={`${vbX.toFixed(2)} ${vbY.toFixed(2)} ${vbW.toFixed(2)} ${vbH.toFixed(2)}`}
      width={Math.round(vbW)}
      height={Math.round(vbH)}
      role="img"
      aria-label={said.join(', ')}
      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
    >
      {gridX.map((x) => (
        <line
          key={`gx${x}`}
          data-part="grid-line"
          x1={X(x)}
          y1={0}
          x2={X(x)}
          y2={gh}
          stroke="var(--c-line)"
          strokeWidth="1"
        />
      ))}
      {gridY.map((y) => (
        <line
          key={`gy${y}`}
          data-part="grid-line"
          x1={0}
          y1={Y(y)}
          x2={gw}
          y2={Y(y)}
          stroke="var(--c-line)"
          strokeWidth="1"
        />
      ))}

      {shape && dots.length > 1 ? (
        dots.length === 2 ? (
          <line
            data-part="shape"
            x1={dots[0]?.cx}
            y1={dots[0]?.cy}
            x2={dots[1]?.cx}
            y2={dots[1]?.cy}
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ animation: `fade-rise ${fade}ms both` }}
          />
        ) : (
          <polygon
            data-part="shape"
            points={dots.map((d) => `${d.cx.toFixed(2)},${d.cy.toFixed(2)}`).join(' ')}
            fill={color}
            fillOpacity="0.18"
            stroke={color}
            strokeWidth="3.5"
            strokeLinejoin="round"
            style={{ animation: `fade-rise ${fade}ms both` }}
          />
        )
      ) : null}

      {/* Garis bantu: dari titik turun ke sumbu x dan mendatar ke sumbu y. Itulah
          gerakan membaca koordinat, digambar supaya bisa ditelusuri mata. */}
      {guides
        ? dots.flatMap((d, i) => [
            <line
              key={`gux${i}`}
              data-part="guide"
              x1={d.cx}
              y1={d.cy}
              x2={d.cx}
              y2={ay}
              stroke={color}
              strokeWidth="2"
              strokeDasharray="5 4"
            />,
            <line
              key={`guy${i}`}
              data-part="guide"
              x1={d.cx}
              y1={d.cy}
              x2={ax}
              y2={d.cy}
              stroke={color}
              strokeWidth="2"
              strokeDasharray="5 4"
            />,
          ])
        : null}

      {axisLine(0, ay, gw + AX_OVER - 2, ay, 'ax-x')}
      {axisLine(ax, gh, ax, -AX_OVER + 2, 'ax-y')}
      <polygon
        data-part="arrow"
        points={`${gw + AX_OVER + ARROW},${ay} ${gw + AX_OVER - 2},${ay - 4.5} ${gw + AX_OVER - 2},${ay + 4.5}`}
        fill="var(--c-ink)"
      />
      <polygon
        data-part="arrow"
        points={`${ax},${-AX_OVER - ARROW} ${ax - 4.5},${-AX_OVER + 2} ${ax + 4.5},${-AX_OVER + 2}`}
        fill="var(--c-ink)"
      />

      {labelledX.map((t) => (
        <line
          key={`tx${t}`}
          data-part="tick"
          x1={X(t)}
          y1={ay - 4}
          x2={X(t)}
          y2={ay + 4}
          stroke="var(--c-ink)"
          strokeWidth="2"
        />
      ))}
      {labelledY.map((t) => (
        <line
          key={`ty${t}`}
          data-part="tick"
          x1={ax - 4}
          y1={Y(t)}
          x2={ax + 4}
          y2={Y(t)}
          stroke="var(--c-ink)"
          strokeWidth="2"
        />
      ))}

      {showOrigin ? (
        <circle data-part="origin" cx={ax} cy={ay} r="4.5" fill="var(--c-ink)" />
      ) : null}

      {dots.map((d, i) => (
        <circle
          key={d.key}
          data-part="point"
          cx={d.cx}
          cy={d.cy}
          r={DOT_R}
          fill={color}
          stroke="var(--c-surface)"
          strokeWidth="1.5"
          style={{ animation: `fade-rise ${fade}ms ${i * step}ms both` }}
        />
      ))}

      {texts.map((t, i) => (
        <text
          key={`${t.part}${i}`}
          data-part={t.part}
          x={t.x}
          y={t.y}
          textAnchor={t.anchor}
          dominantBaseline="middle"
          fontSize={t.font}
          fontWeight={t.part === 'point-label' || t.part === 'axis-name' ? 800 : 700}
          fill={t.fill}
        >
          {t.text}
        </text>
      ))}
    </svg>
  );
}

import { clamp } from './scale';
import { areaOf, circumferenceOf, diameterFromRadius, radiusFromDiameter } from './circles';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type CircleMark = 'radius' | 'diameter' | 'both' | 'none';

export type CircleProps = {
  /** Jari-jari dalam SATUAN (bukan piksel). Isi ini ATAU `d`. */
  r?: number;
  /** Diameter dalam satuan. Dipakai kalau `r` tidak diisi. */
  d?: number;
  /** Ruas yang digambar di dalam lingkaran. Default: `diameter` kalau hanya `d`
   * yang diisi, selain itu `radius`. */
  mark?: CircleMark;
  /** Tulis panjang ruas yang digambar ("r = 5 cm"). Matikan saat itu yang ditanyakan. */
  showValue?: boolean;
  /** Titik pusat. Default: ikut muncul kalau ada ruas yang digambar. */
  showCenter?: boolean;
  /** Tulis kelilingnya. Dimatikan saat kelilingnya yang ditanyakan. */
  showCircumference?: boolean;
  /** Tulis luasnya. Dimatikan saat luasnya yang ditanyakan. */
  showArea?: boolean;
  /** Satuan panjang di label, mis. "cm". Kosong = "units". */
  unit?: string;
  /**
   * DIAMETER lingkaran dalam piksel — bukan lebar SVG-nya. Label yang menonjol
   * melebarkan SVG di sekeliling lingkaran; kalau `size` diartikan lebar SVG,
   * lingkarannya yang menciut setiap kali sebuah label ditambahkan.
   */
  size?: number;
  color?: string;
};

/**
 * Jari-jari lingkaran DI LAYAR — tetap, berapa pun jari-jari sebenarnya.
 *
 * `RectShape` menjaga perbandingan sisinya karena kedua sisi itu ada di dalam SATU
 * gambar: 6×2 yang digambar seperti persegi adalah kebohongan yang bisa dilihat anak.
 * Lingkaran tidak punya perbandingan dalam seperti itu — hanya ada satu panjang, dan
 * satu-satunya perbandingan yang harus jujur (r : d = 1 : 2) tetap jujur karena
 * keduanya digambar dari radius layar yang sama. Maka ukurannya dinormalisasi:
 * yang berubah antara r=2 dan r=10 adalah ANGKA di label, bukan besar gambarnya.
 * Kalau tidak, r=2 jadi titik dan r=100 meledak keluar layar 390px.
 */
const R = 62;

/** Jari-jari terbesar yang labelnya masih muat di layar 390px. */
const MAX_R = 500;

const FONT = 16;
const ROW_FONT = 15;
/** Perkiraan lebar satu karakter — dipakai menghitung viewBox, sama seperti Solid3D. */
const CHAR_W = 9;

type Anchor = 'middle' | 'start';
type Label = { part: string; text: string; x: number; y: number; anchor: Anchor; font: number };

/**
 * Lingkaran dengan jari-jari / diameter bertanda.
 *
 * Ini bentuk yang tidak bisa diajarkan dengan `Shape2D`: di sana lingkaran hanya
 * siluet, sedangkan yang harus dilihat anak justru RUAS di dalamnya — jari-jari dari
 * pusat ke tepi, dan diameter yang menembus pusat dan panjangnya persis dua kali.
 * Gambar inilah yang membuat "d = 2r" bisa diperiksa dengan mata sebelum dihafal,
 * dan yang membuat π masuk akal: keliling dan diameter tampil di gambar yang sama,
 * jadi π = C ÷ d adalah sesuatu yang anak BAGI sendiri, bukan angka yang jatuh dari langit.
 */
export function Circle({
  r,
  d,
  mark,
  showValue = true,
  showCenter,
  showCircumference,
  showArea,
  unit = 'cm',
  size = 180,
  color = 'var(--c-unit-7)',
}: CircleProps) {
  const reduced = useReducedMotion();
  // Jari-jari nol tidak menggambar apa pun. Batas atasnya bukan soal gambar —
  // gambarnya dinormalisasi — melainkan soal LABEL: luas r=9999 ditulis tujuh digit
  // dan barisnya sendiri jadi lebih lebar dari layar 390px.
  const rad = clamp(r ?? (d != null ? radiusFromDiameter(d) : 1), 0.1, MAX_R);
  const dia = diameterFromRadius(rad);

  // Modul yang menyebut DIAMETER ingin diameternya yang ditandai. Kalau default-nya
  // tetap jari-jari, `<Circle d={10} />` menggambar ruas sepanjang 5 cm berlabel
  // "5 cm" untuk soal yang menanyakan diameter 10 cm — dan tidak ada yang menyadarinya.
  const m: CircleMark = mark ?? (r == null && d != null ? 'diameter' : 'radius');
  const withRadius = m === 'radius' || m === 'both';
  const withDiameter = m === 'diameter' || m === 'both';
  const center = showCenter ?? m !== 'none';

  const len = (n: number) => (unit ? `${n} ${unit}` : String(n));

  // Saat keduanya digambar, jari-jari ditegakkan supaya tidak berimpit dengan
  // diameter — dan sekalian memperlihatkan bahwa jari-jari boleh ke arah mana saja.
  const radEnd: [number, number] = m === 'both' ? [0, -R] : [R, 0];

  /**
   * Satu ruas = tulis panjangnya saja ("5 cm"), sama seperti RectShape melabeli
   * sisinya: ruasnya sudah kelihatan yang mana. Dua ruas sekaligus TIDAK boleh
   * begitu — "5 cm" dan "10 cm" berdampingan tanpa nama membuat anak menebak mana
   * yang jari-jari, padahal justru itu yang sedang diajarkan.
   */
  const labels: Label[] = [];
  const both = m === 'both';
  if (showValue && withRadius) {
    labels.push({
      part: 'radius-label',
      text: both ? `r = ${len(rad)}` : len(rad),
      // Saat keduanya tampil, label jari-jari naik ke luar lingkaran: di dalam, dia
      // memotong garis tepi dan bertumpuk dengan label diameter.
      x: both ? 0 : R / 2,
      y: both ? -R - 13 : -13,
      anchor: 'middle',
      font: FONT,
    });
  }
  if (showValue && withDiameter) {
    labels.push({
      part: 'diameter-label',
      text: both ? `d = ${len(dia)}` : len(dia),
      x: 0,
      y: both ? 17 : -13,
      anchor: 'middle',
      font: FONT,
    });
  }

  /** Baris di bawah gambar. Sengaja pendek supaya lingkarannya tidak ikut menciut. */
  const rows: Label[] = [];
  if (showCircumference) {
    const c = circumferenceOf(rad);
    rows.push({
      part: 'circumference',
      text: `C = ${unit ? `${c} ${unit}` : `${c} units`}`,
      x: 0,
      y: 0,
      anchor: 'middle',
      font: ROW_FONT,
    });
  }
  if (showArea) {
    const a = areaOf(rad);
    rows.push({
      part: 'area',
      text: `A = ${unit ? `${a} ${unit}²` : `${a} sq units`}`,
      x: 0,
      y: 0,
      anchor: 'middle',
      font: ROW_FONT,
    });
  }
  rows.forEach((row, i) => {
    row.y = R + 20 + i * 20;
  });

  /**
   * viewBox dihitung dari SEMUA yang digambar, termasuk lebar teksnya — pola yang
   * sama dengan Solid3D. Kotak pembatas yang ditebak ("kasih padding 20") itu yang
   * dulu memotong label sisi kanan RectShape; di sini baris "C = 31.4 cm" bisa lebih
   * lebar daripada lingkarannya sendiri.
   */
  const xs: number[] = [-R - 3, R + 3];
  const ys: number[] = [-R - 3, R + 3];
  for (const l of [...labels, ...rows]) {
    const w = l.text.length * CHAR_W;
    xs.push(l.anchor === 'middle' ? l.x - w / 2 : l.x, l.anchor === 'middle' ? l.x + w / 2 : l.x + w);
    ys.push(l.y - l.font / 2, l.y + l.font / 2);
  }

  const pad = 4;
  const vbX = Math.min(...xs) - pad;
  const vbY = Math.min(...ys) - pad;
  const vbW = Math.max(...xs) - vbX + pad;
  const vbH = Math.max(...ys) - vbY + pad;

  // Piksel per satuan viewBox. Diturunkan dari LINGKARANNYA, jadi lingkaran punya
  // ukuran layar yang sama persis di setiap kombinasi label — itu inti normalisasi.
  const scale = size / (2 * R);

  const sweep = teachingDuration(520, reduced);
  const fade = teachingDuration(200, reduced);

  /**
   * Label pembaca layar mengikuti apa yang TERLIHAT. Menyebut kelilingnya saat
   * angkanya sengaja disembunyikan berarti membocorkan jawaban soal.
   */
  const said = ['circle'];
  if (showValue && withRadius) said.push(`radius ${len(rad)}`);
  if (showValue && withDiameter) said.push(`diameter ${len(dia)}`);
  if (showCircumference) said.push(`circumference ${len(circumferenceOf(rad))}`);
  if (showArea) said.push(`area ${areaOf(rad)}${unit ? ` square ${unit}` : ' square units'}`);

  const dot = (x: number, y: number, part: string) => (
    <circle key={part} data-part={part} cx={x} cy={y} r="4.5" fill="var(--c-ink)" />
  );

  return (
    <svg
      viewBox={`${vbX.toFixed(2)} ${vbY.toFixed(2)} ${vbW.toFixed(2)} ${vbH.toFixed(2)}`}
      width={Math.round(vbW * scale)}
      height={Math.round(vbH * scale)}
      role="img"
      aria-label={said.join(', ')}
      style={{ display: 'block', maxWidth: '100%' }}
    >
      <circle
        data-part="ring"
        cx={0}
        cy={0}
        r={R}
        fill={color}
        fillOpacity="0.16"
        stroke={color}
        strokeWidth="4"
        style={{ animation: `fade-rise ${fade}ms both` }}
      />

      {withDiameter ? (
        <g style={{ animation: `fade-rise ${fade}ms ${fade}ms both` }}>
          <line
            data-part="diameter"
            x1={-R}
            y1={0}
            x2={R}
            y2={0}
            stroke="var(--c-ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {dot(-R, 0, 'diameter-end-a')}
          {dot(R, 0, 'diameter-end-b')}
        </g>
      ) : null}

      {withRadius ? (
        /**
         * Jari-jari menyapu satu putaran penuh sebelum berhenti. Gerakan itu SENDIRI
         * yang mengajarkan definisinya: setiap titik di tepi berjarak sama dari pusat.
         * Rotasi murni — tidak ada layout yang dihitung ulang tiap frame.
         */
        <g
          style={{
            transformBox: 'view-box',
            transformOrigin: `${-vbX}px ${-vbY}px`,
            animation: `angle-open ${sweep}ms var(--ease-std) both`,
            ['--angle-open-from' as string]: '360deg',
          }}
        >
          <line
            data-part="radius"
            x1={0}
            y1={0}
            x2={radEnd[0]}
            y2={radEnd[1]}
            stroke="var(--c-ink)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {dot(radEnd[0], radEnd[1], 'radius-end')}
        </g>
      ) : null}

      {center ? dot(0, 0, 'center') : null}

      {labels.map((l) => (
        <text
          key={l.part}
          data-part={l.part}
          x={l.x}
          y={l.y}
          textAnchor={l.anchor}
          dominantBaseline="middle"
          fontSize={l.font}
          fontWeight="800"
          fill="var(--c-ink)"
          style={{ animation: `fade-rise ${fade}ms ${sweep}ms both` }}
        >
          {l.text}
        </text>
      ))}

      {rows.map((l) => (
        <text
          key={l.part}
          data-part={l.part}
          x={l.x}
          y={l.y}
          textAnchor={l.anchor}
          dominantBaseline="middle"
          fontSize={l.font}
          fontWeight="800"
          fill="var(--c-ink-soft)"
          style={{ animation: `fade-rise ${fade}ms ${sweep}ms both` }}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}

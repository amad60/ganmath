import { maxTicksFor, stepFor, ticksFor } from './scale';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type BarsProps = {
  /** Panjang relatif 0..1. Untuk MEMBANDINGKAN — batangnya tidak punya nilai. */
  lengths?: number[];
  /**
   * Nilai tiap batang dalam satuan. Mengisinya MENYALAKAN sumbu berangka: batang
   * jadi bisa dibaca nilainya, bukan cuma dibandingkan panjangnya. Menggantikan
   * `lengths` kalau dua-duanya diisi.
   */
  values?: number[];
  /** Nilai tertinggi di sumbu. Kosong = dinaikkan ke kelipatan langkah berikutnya. */
  max?: number;
  /** Menimpa langkah otomatis `stepFor`. Isi hanya untuk sumbu pecahan/desimal. */
  step?: number;
  /** Tulis nilai di ujung tiap batang. Matikan saat itu yang ditanyakan soal. */
  showValues?: boolean;
  labels?: string[];
  colors?: string[];
  /** Lebar gambar bersumbu dalam piksel. Tidak dipakai mode perbandingan. */
  size?: number;
};

const PALETTE = ['var(--c-unit-7)', 'var(--c-unit-3)', 'var(--c-unit-1)'];

/** Tinggi batang dan jarak antar batang — sama persis dengan mode perbandingan. */
const BAR_H = 26;
const BAR_GAP = 12;
/** Lebih dari ini gambarnya melewati tinggi yang tersisa di layar soal 390px. */
const MAX_BARS = 8;
/** Lebar acuan `maxTicksFor`: garis selebar layar soal (CLAUDE.md §10). */
const REF_W = 342;

const LABEL_FONT = 15;
const LABEL_CHAR_W = 9;
/** Angka sumbu sengaja lebih kecil daripada nama batang — sumbu itu penggaris. */
const TICK_FONT = 11;
const TICK_CHAR_W = 6.6;
const VALUE_FONT = 14;
const VALUE_CHAR_W = 8.4;

type Text = {
  part: string;
  text: string;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  font: number;
  charW: number;
  weight: number;
  fill: string;
};

/**
 * Batang pembanding panjang, dengan sumbu nilai berangka opsional.
 *
 * Dua mode, dan bedanya bukan gaya melainkan APA yang bisa ditanyakan:
 *
 * - `lengths` (0..1) — batang mulus tanpa sumbu. Yang bisa dibaca anak hanya
 *   "yang mana lebih panjang". Ini mode lama; ratusan modul memakainya.
 * - `values` — batang berdiri di atas sumbu berangka, jadi setiap batang punya
 *   NILAI yang bisa dibaca. Tanpa ini setiap soal data yang butuh angka tepat
 *   terpaksa digambar sebagai baris blok yang dihitung satu-satu.
 *
 * Sumbu berangka wajib dinyalakan sendiri lewat `values`: kalau datang diam-diam,
 * setiap batang perbandingan yang sudah ada ikut berubah tampilannya.
 *
 * Penomoran dan penjarangan labelnya memakai ulang `stepFor`/`ticksFor`/`maxTicksFor`
 * dari `scale.ts` — aturan yang sama dengan garis bilangan dan bidang koordinat,
 * bukan penomoran ketiga yang bisa menyimpang sendiri.
 */
export function Bars({
  lengths,
  values,
  max,
  step,
  showValues,
  labels,
  colors,
  size = 320,
}: BarsProps) {
  const reduced = useReducedMotion();
  const palette = colors ?? PALETTE;

  if (!values) {
    return (
      <div className="flex w-full flex-col gap-3" aria-label="Compare lengths">
        {(lengths ?? []).map((l, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-[18px] font-black">{labels?.[i] ?? ''}</span>
            <span
              style={{
                height: 26,
                width: `${Math.max(6, Math.min(100, l * 100))}%`,
                background: palette[i % palette.length],
                borderRadius: 999,
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  const vals = values.slice(0, MAX_BARS).map((v) => Math.max(0, v));
  const biggest = vals.reduce((m, v) => Math.max(m, v), 0);

  /**
   * Langkah dulu, puncak sumbu belakangan. Puncaknya harus jatuh TEPAT di kelipatan
   * langkah — kalau tidak, tick terakhir menggantung sebelum ujung sumbu dan batang
   * yang panjangnya persis segitu tampak melewati sumbunya sendiri.
   * `max` dari data modul tidak pernah boleh memotong batang: puncak selalu diambil
   * yang tertinggi antara permintaan modul dan nilai terbesarnya.
   */
  const step0 = step && step > 0 ? step : stepFor(0, biggest || 1);
  const asked = max != null && max > 0 ? Math.ceil((max - 1e-9) / step0) * step0 : 0;
  const top = Math.max(step0, asked, Math.ceil((biggest - 1e-9) / step0) * step0);
  const s = step && step > 0 ? step : stepFor(0, top);

  const nameChars = vals.reduce((m, _, i) => Math.max(m, (labels?.[i] ?? '').length), 0);
  const gutL = nameChars > 0 ? nameChars * LABEL_CHAR_W + 8 : 0;
  const valueChars = showValues ? vals.reduce((m, v) => Math.max(m, String(v).length), 0) : 0;
  const gutR = Math.max(
    showValues ? valueChars * VALUE_CHAR_W + 7 : 0,
    (String(top).length * TICK_CHAR_W) / 2 + 2,
  );
  const plotW = Math.max(80, size - gutL - gutR);

  const X = (v: number) => gutL + (v / top) * plotW;
  const pitch = BAR_H + BAR_GAP;
  const plotH = vals.length * pitch - BAR_GAP;
  const axisY = plotH + 7;

  /**
   * `maxTicksFor` menghitung anggaran label untuk garis selebar layar; bidang batang
   * di sini lebih sempit karena nama batang memakan sisi kiri, jadi anggarannya
   * diskalakan ke lebar sebenarnya. Yang memilih ANGKA-nya tetap `ticksFor`.
   */
  const maxTicks = Math.max(3, Math.round(maxTicksFor(0, top) * (plotW / REF_W)));
  const ticks = ticksFor(0, top, s, maxTicks);

  const texts: Text[] = [];
  for (const t of ticks) {
    texts.push({
      part: 'tick-label',
      text: String(t),
      x: X(t),
      y: axisY + 4 + TICK_FONT / 2 + 3,
      anchor: 'middle',
      font: TICK_FONT,
      charW: TICK_CHAR_W,
      weight: 700,
      fill: 'var(--c-ink-soft)',
    });
  }

  const bars = vals.map((v, i) => ({
    key: `b${i}`,
    v,
    y: i * pitch,
    // Nilai nol tetap harus terlihat sebagai batang kosong, bukan sebagai baris hilang.
    w: Math.max(2, X(v) - gutL),
    color: palette[i % palette.length],
  }));

  for (const [i, b] of bars.entries()) {
    const name = labels?.[i] ?? '';
    if (name) {
      texts.push({
        part: 'bar-name',
        text: name,
        x: gutL - 8,
        y: b.y + BAR_H / 2,
        anchor: 'end',
        font: LABEL_FONT,
        charW: LABEL_CHAR_W,
        weight: 800,
        fill: 'var(--c-ink)',
      });
    }
    if (showValues) {
      texts.push({
        part: 'bar-value',
        text: String(b.v),
        x: gutL + b.w + 6,
        y: b.y + BAR_H / 2,
        anchor: 'start',
        font: VALUE_FONT,
        charW: VALUE_CHAR_W,
        weight: 800,
        fill: 'var(--c-ink)',
      });
    }
  }

  /**
   * viewBox dihitung dari SEMUA yang digambar, termasuk LEBAR teksnya — pola yang
   * sama dengan Solid3D, Circle, dan CoordinatePlane. Angka sumbu terakhir menonjol
   * setengah lebarnya ke kanan ujung sumbu, dan nama batang menonjol ke kiri nol.
   */
  const xs: number[] = [0, gutL, gutL + plotW];
  const ys: number[] = [0, plotH, axisY + 4];
  for (const b of bars) ys.push(b.y, b.y + BAR_H);
  for (const t of texts) {
    const w = t.text.length * t.charW;
    xs.push(t.anchor === 'end' ? t.x - w : t.anchor === 'start' ? t.x : t.x - w / 2);
    xs.push(t.anchor === 'end' ? t.x : t.anchor === 'start' ? t.x + w : t.x + w / 2);
    ys.push(t.y - t.font / 2, t.y + t.font / 2);
  }

  const pad = 4;
  const vbX = Math.min(...xs) - pad;
  const vbY = Math.min(...ys) - pad;
  const vbW = Math.max(...xs) - vbX + pad;
  const vbH = Math.max(...ys) - vbY + pad;

  const grow = teachingDuration(320, reduced);
  const delay = teachingDuration(90, reduced);

  /**
   * Sumbu berangka membuat nilai tiap batang TERLIHAT, jadi pembaca layar boleh
   * menyebutnya — itu bukan bocoran, itu isi gambarnya.
   */
  const said = ['bar chart'];
  for (const [i, b] of bars.entries()) said.push(`${labels?.[i] ?? `bar ${i + 1}`} is ${b.v}`);

  return (
    <svg
      viewBox={`${vbX.toFixed(2)} ${vbY.toFixed(2)} ${vbW.toFixed(2)} ${vbH.toFixed(2)}`}
      width={Math.round(vbW)}
      height={Math.round(vbH)}
      role="img"
      aria-label={said.join(', ')}
      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
    >
      {/* Garis bantu tegak di tiap angka sumbu: itu yang membuat ujung batang bisa
          dibaca sampai ke angkanya, bukan cuma dikira-kira. */}
      {ticks.map((t) =>
        t === 0 ? null : (
          <line
            key={`g${t}`}
            data-part="grid-line"
            x1={X(t)}
            y1={0}
            x2={X(t)}
            y2={axisY}
            stroke="var(--c-line)"
            strokeWidth="1"
          />
        ),
      )}

      {bars.map((b, i) => (
        <rect
          key={b.key}
          data-part="bar"
          x={gutL}
          y={b.y}
          width={b.w}
          height={BAR_H}
          rx="4"
          fill={b.color}
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'left center',
            animation: `bar-grow ${grow}ms var(--ease-std) ${i * delay}ms both`,
          }}
        />
      ))}

      <line
        data-part="axis"
        x1={gutL}
        y1={axisY}
        x2={gutL + plotW}
        y2={axisY}
        stroke="var(--c-ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        data-part="axis"
        x1={gutL}
        y1={0}
        x2={gutL}
        y2={axisY}
        stroke="var(--c-ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {ticks.map((t) => (
        <line
          key={`t${t}`}
          data-part="tick"
          x1={X(t)}
          y1={axisY}
          x2={X(t)}
          y2={axisY + 4}
          stroke="var(--c-ink)"
          strokeWidth="2"
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
          fontWeight={t.weight}
          fill={t.fill}
        >
          {t.text}
        </text>
      ))}
    </svg>
  );
}

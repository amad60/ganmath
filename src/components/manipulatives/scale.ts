/**
 * Matematika penempatan untuk manipulatif — fungsi murni, bisa diuji tanpa DOM.
 * Dipisah dari komponen karena dipakai lintas number-line, bar-model, dan array-grid.
 */

/** Posisi 0..1 sebuah nilai di dalam domain. Aman untuk domain negatif. */
export function toRatio(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

/** Kebalikan toRatio — dipakai saat anak menyentuh garis bilangan. */
export function fromRatio(ratio: number, min: number, max: number): number {
  return min + ratio * (max - min);
}

/** Snap ke kelipatan step terdekat, relatif terhadap min (bukan terhadap 0). */
export function snapToStep(value: number, min: number, step: number): number {
  if (step <= 0) return value;
  const snapped = min + Math.round((value - min) / step) * step;
  // Kembalikan ke presisi step supaya 0.30000000000000004 tidak muncul di layar.
  const decimals = decimalsOf(step);
  return Number(snapped.toFixed(decimals));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function decimalsOf(step: number): number {
  const s = String(step);
  const dot = s.indexOf('.');
  return dot < 0 ? 0 : s.length - dot - 1;
}

/** Membuang sampah floating point (0.30000000000000004) tanpa mengubah nilainya. */
function tidy(value: number): number {
  return Number(value.toPrecision(12));
}

/** Deret langkah yang enak dibaca — sama seperti sumbu grafik: 1, 2, 5 × pangkat sepuluh. */
const NICE_MANTISSAS = [1, 2, 5];

/** Nilai terkecil dari deret 1/2/5 yang >= x. */
function niceCeil(x: number): number {
  if (!(x > 0)) return 1;
  const base = Math.pow(10, Math.floor(Math.log10(x)));
  for (const m of NICE_MANTISSAS) {
    const cand = tidy(m * base);
    if (cand >= x - 1e-9) return cand;
  }
  return tidy(10 * base);
}

/** Banyak selang yang dituju garis bilangan selebar layar 390px. */
const TARGET_INTERVALS = 10;

/**
 * Langkah "bulat" yang diturunkan dari LEBAR RENTANG.
 *
 * Ini yang membuat garis 0–10.000 bisa dijawab: tanpa ini setiap garis memakai
 * langkah 1, sehingga satu satuan hanya selebar 0,036px — anak tidak mungkin
 * menjatuhkan penanda tepat di 3000, dan labelnya jatuh di 3125/6250/9375.
 *
 * Domain bilangan bulat tidak pernah dipecah jadi setengah satuan; pecahan dan
 * desimal memakai `step` eksplisit dari data modul.
 */
export function stepFor(min: number, max: number): number {
  const span = Math.abs(max - min);
  if (span <= 0) return 1;
  let step = niceCeil(span / TARGET_INTERVALS);
  if (Number.isInteger(min) && Number.isInteger(max)) step = Math.max(1, step);
  return Math.min(step, span);
}

/** Lebar acuan garis: layar 390px dikurangi padding layar soal (CLAUDE.md §10). */
const LINE_PX = 342;
/** Perkiraan lebar satu karakter label (13px, font-bold) dan jarak antar label. */
const LABEL_CHAR_PX = 9;
const LABEL_GAP_PX = 12;

/**
 * Berapa banyak label yang masih terbaca di garis selebar layar.
 * "10000" butuh lebih dari tiga kali ruang "5" — jadi jumlah tick tidak bisa
 * satu angka tetap untuk semua rentang.
 */
export function maxTicksFor(min: number, max: number, denominator?: number): number {
  const len = Math.max(
    formatValue(min, denominator).length,
    formatValue(max, denominator).length,
    1,
  );
  const slot = len * LABEL_CHAR_PX + LABEL_GAP_PX;
  return Math.min(21, Math.max(3, Math.floor(LINE_PX / slot) + 1));
}

/**
 * Pengali penjarangan label. Semuanya kelipatan bulat dari step, jadi setiap label
 * selalu jatuh di posisi yang benar-benar bisa disentuh anak.
 */
const TICK_MULTIPLIERS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

/**
 * Nilai tick berlabel. Selalu kelipatan `step` — kalau tidak muat, jaraknya
 * dikalikan 2/5/10 dst, bukan dikali-kali sampai mendarat di angka ganjil.
 */
export function ticksFor(min: number, max: number, step: number, maxTicks = 21): number[] {
  const span = max - min;
  if (!(step > 0) || span <= 0) return [min];

  let effective = tidy(step);
  for (const k of TICK_MULTIPLIERS) {
    effective = tidy(step * k);
    if (span / effective + 1 <= maxTicks) break;
  }

  const decimals = decimalsOf(effective);
  const out: number[] = [];
  for (let i = 0; i <= 1000; i++) {
    const v = Number((min + i * effective).toFixed(decimals));
    if (v > max + 1e-9) break;
    out.push(v);
  }
  return out;
}

/** Label pecahan sederhana: 0.5 → "1/2". Dipakai mulai Grade 3. */
export function formatValue(value: number, denominator?: number): string {
  if (!denominator || denominator <= 1) return String(value);
  const whole = Math.trunc(value);
  const frac = Math.round((value - whole) * denominator);
  if (frac === 0) return String(whole);
  const g = gcd(Math.abs(frac), denominator);
  const num = frac / g;
  const den = denominator / g;
  return whole === 0 ? `${num}/${den}` : `${whole} ${Math.abs(num)}/${den}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

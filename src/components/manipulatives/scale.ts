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

/** Nilai tick yang ditampilkan. Dibatasi supaya garis 0–100 tidak jadi sisir rapat. */
export function ticksFor(min: number, max: number, step: number, maxTicks = 21): number[] {
  const span = max - min;
  let effective = step;
  while (span / effective + 1 > maxTicks) effective *= step === 1 ? 5 : 2;
  const out: number[] = [];
  for (let v = min; v <= max + 1e-9; v += effective) out.push(Number(v.toFixed(decimalsOf(effective))));
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

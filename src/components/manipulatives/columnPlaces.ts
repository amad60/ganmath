export type ColumnPlace = 'ones' | 'tens' | 'hundreds';

/**
 * Urutan baris hitungan pada penjumlahan/pengurangan bersusun.
 * Dipakai bersama oleh gambar kolom dan pintu "kerjakan dulu" di Learn,
 * supaya tombol dan baris yang muncul tidak pernah selisih.
 */
export function columnPlaces(a: number, b: number, op: '+' | '−' = '+'): ColumnPlace[] {
  if (op === '−') return ['ones', 'tens'];
  const ones = (a % 10) + (b % 10);
  const tens = (Math.floor(a / 10) % 10) * 10 + (Math.floor(b / 10) % 10) * 10;
  const hundreds = Math.floor(a / 100) * 100 + Math.floor(b / 100) * 100;
  const places: ColumnPlace[] = [];
  if (ones !== 0 || tens === 0) places.push('ones');
  if (tens !== 0) places.push('tens');
  if (hundreds !== 0) places.push('hundreds');
  return places;
}

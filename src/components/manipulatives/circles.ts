/**
 * Aturan lingkaran — fungsi murni, tanpa React, bisa diuji tanpa DOM.
 *
 * Sengaja dipisah dari komponennya (pola `angleKind` / `solids.ts`): data modul butuh
 * KELILING dan LUAS untuk menyusun soal dan jawabannya, sedangkan gambar butuh angka
 * yang sama untuk menuliskannya di layar. Kalau keduanya menghitung sendiri-sendiri,
 * cepat atau lambat soal bilang "31.4" sementara gambarnya berlabel "31.42" — dan
 * anak yang benar dinyatakan salah.
 */

/**
 * π yang dipakai SELURUH app: 3.14, bukan 22/7.
 *
 * 22/7 memaksa setiap jari-jari jadi kelipatan 7 supaya kelilingnya bulat, dan luasnya
 * TETAP pecahan (22/7 × 49 = 154, tapi 22/7 × 49/4 tidak). Keypad sudah menerima titik
 * desimal, jadi 3.14 memberi angka yang bisa diketik anak tanpa mengunci jari-jarinya.
 * Satu konstanta di satu tempat: gambar dan soal tidak mungkin memakai π yang berbeda.
 */
export const PI = 3.14;

/**
 * Membuang sampah floating point (3.14 × 49 = 153.86000000000001) tanpa mengubah
 * nilainya. Angka yang salah satu digit terakhirnya sampai ke layar akan dibaca anak
 * sebagai jawaban yang benar — lalu ditolak karena tidak sama dengan yang dia ketik.
 */
function tidy(n: number): number {
  return Number(n.toPrecision(12));
}

/** Jari-jari = diameter ÷ 2. */
export function radiusFromDiameter(d: number): number {
  return tidy(d / 2);
}

/** Diameter = 2 × jari-jari. */
export function diameterFromRadius(r: number): number {
  return tidy(r * 2);
}

/** Keliling = 2 × π × r. Satu-satunya tempat aturan ini ditulis. */
export function circumferenceOf(r: number): number {
  return tidy(2 * PI * r);
}

/** Keliling dari diameter — bentuk C = π × d, yang justru menurunkan arti π. */
export function circumferenceFromDiameter(d: number): number {
  return circumferenceOf(radiusFromDiameter(d));
}

/** Luas = π × r × r. */
export function areaOf(r: number): number {
  return tidy(PI * r * r);
}

/**
 * Empat pilihan kata dari daftar yang lebih panjang, jawabannya selalu ikut.
 *
 * `drop` memilih pengecoh mana yang dibuang (0 … all.length − 2), jadi pengecohnya
 * berganti-ganti antar soal tanpa undian — soal tetap deterministik dari parameternya.
 * Lima tombol tidak rapi di grid dua kolom, dan tombol ke-5 yang sendirian terbaca
 * sebagai "yang ini beda" — petunjuk yang tidak dimaksud.
 *
 * `never` = kata yang JUGA benar untuk jawaban ini dan karena itu tidak boleh jadi
 * tombol: persegi adalah persegi panjang, kubus adalah balok. Anak yang menekan
 * "rectangle" untuk persegi tidak salah, jadi tombol itu tidak boleh dinilai salah.
 */
export function fourOf<T extends string>(
  all: readonly T[],
  answer: number,
  drop: number,
  never: readonly T[] = [],
): T[] {
  const pool = all.filter((x, i) => i === answer || !never.includes(x));
  if (pool.length <= 4) return pool;
  const wrong = pool.filter((x) => x !== all[answer]);
  const gone = wrong[drop % wrong.length];
  return pool.filter((x) => x !== gone).slice(0, 4);
}

/** Nama yang juga benar untuk sebuah bangun — bentuk khusus dari bangun lain. */
export const ALSO_TRUE: Record<string, string[]> = {
  square: ['rectangle'],
  cube: ['box'],
};

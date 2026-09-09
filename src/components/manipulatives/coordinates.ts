/**
 * Aturan bidang koordinat — fungsi murni, tanpa React, bisa diuji tanpa DOM.
 *
 * Sengaja dipisah dari komponennya (pola `angleKind` / `solids.ts` / `circles.ts`):
 * data modul butuh PASANGAN KOORDINAT untuk menyusun teks soal dan pilihan jawaban,
 * sedangkan gambar butuh pasangan yang sama untuk menuliskannya di sebelah titik.
 * Kalau keduanya menulis sendiri-sendiri, cepat atau lambat soal bilang "(3,-2)"
 * sementara gambarnya berlabel "(3, −2)" — dan anak yang benar dinyatakan salah.
 */

/** Satu titik pada bidang koordinat. Satuan grid, bukan piksel. */
export type Coord = { x: number; y: number };

/**
 * Pasangan koordinat sebagaimana ditulis di layar DAN di teks soal: "(3, -2)".
 *
 * Satu tempat, satu bentuk. Urutannya (x lebih dulu) adalah separuh materi unit ini,
 * jadi tidak boleh ada modul yang menyusunnya dengan template sendiri.
 */
export function formatPoint(x: number, y: number): string {
  return `(${x}, ${y})`;
}

/**
 * Kuadran sebuah titik: 1–4, atau 0 kalau titiknya berada DI sumbu (termasuk titik asal).
 * Titik di sumbu tidak masuk kuadran mana pun — itu justru jebakan yang harus diajarkan,
 * jadi ia punya nilai kembalian sendiri, bukan dipaksa masuk kuadran terdekat.
 */
export function quadrantOf(x: number, y: number): 0 | 1 | 2 | 3 | 4 {
  if (x === 0 || y === 0) return 0;
  if (x > 0) return y > 0 ? 1 : 4;
  return y > 0 ? 2 : 3;
}

/** Nama kuadran seperti di buku — angka Romawi. Indeks 0 = titik yang ada di sumbu. */
export const QUADRANT_NAMES = [
  'on an axis',
  'quadrant I',
  'quadrant II',
  'quadrant III',
  'quadrant IV',
] as const;

/** Nama kuadran sebuah titik, dipakai label gambar dan pilihan jawaban. */
export function quadrantName(x: number, y: number): string {
  return QUADRANT_NAMES[quadrantOf(x, y)];
}

/**
 * Jarak dua titik yang SEJAJAR SUMBU — dihitung dengan mengurangi, bukan Pythagoras.
 * Itu memang satu-satunya jarak yang boleh ditanyakan di Grade 6, jadi titik yang
 * miring mengembalikan `null` supaya modul tidak bisa diam-diam menanyakannya.
 */
export function axisDistance(a: Coord, b: Coord): number | null {
  if (a.y === b.y) return Math.abs(a.x - b.x);
  if (a.x === b.x) return Math.abs(a.y - b.y);
  return null;
}

/**
 * Titik sudut KEEMPAT sebuah persegi panjang bersisi sejajar sumbu, dari tiga sudut
 * yang sudah diketahui. `null` kalau ketiga titik itu tidak bisa jadi tiga sudut
 * persegi panjang (segaris, atau tidak ada yang jadi sudut sikunya).
 *
 * Ini aturan yang paling gampang salah kalau ditulis dua kali: soal "what is the
 * fourth corner?" dan gambar yang menutup bangunnya harus memakai titik yang sama.
 */
export function fourthCorner(a: Coord, b: Coord, c: Coord): Coord | null {
  const pts = [a, b, c];
  for (let i = 0; i < 3; i++) {
    const corner = pts[i] as Coord;
    const rest = pts.filter((_, k) => k !== i) as [Coord, Coord];
    const [p, q] = rest;
    // Persegi panjang sejati: dua titik sisanya harus beda x DAN beda y.
    if (p.x === q.x || p.y === q.y) continue;
    if (corner.x === p.x && corner.y === q.y) return { x: q.x, y: p.y };
    if (corner.x === q.x && corner.y === p.y) return { x: p.x, y: q.y };
  }
  return null;
}

/**
 * Empat sudut persegi panjang dari dua sudut yang BERSEBERANGAN, urut memutar —
 * bentuk yang langsung bisa digambar sebagai bangun tertutup.
 */
export function rectCorners(a: Coord, c: Coord): [Coord, Coord, Coord, Coord] {
  return [a, { x: c.x, y: a.y }, c, { x: a.x, y: c.y }];
}

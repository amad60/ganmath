/**
 * Tempo layar Learn. Bukan hiasan: langkah `watch` dulu mengaktifkan Next seketika,
 * dan 72% langkah di app ini `watch` — anak mengetuk Next empat kali dalam tiga detik
 * tanpa pernah melihat gambarnya.
 *
 * Jeda look tidak boleh >800ms (docs/design/animation.md: animasi yang menghalangi
 * lanjut dibatasi 800ms, kecuali materi yang sengaja memakai waktu tampil).
 */
export const WATCH_LOOK_MS = 800;

/**
 * Quick Look = subitizing: titik tampil ±2 detik lalu hilang (docs/curriculum/grade-1.md).
 * Satu-satunya modul Grade 1 yang memakai batas waktu tampil — itu materinya, bukan tekanan.
 */
export const QUICK_LOOK_FLASH_MS = 2000;

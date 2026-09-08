# Rencana Implementasi — Fase 5a (Vertical Slice)

Sasaran 5a: **engine + gamifikasi + 16 modul pertama Grade 1**, terpasang di HP anak dan cukup
dipakai ±6–8 minggu. Bukan Grade 1 penuh — lihat `../curriculum/README.md`.

Urutan dipilih supaya **hal yang paling berisiko dikerjakan paling awal**, dan supaya setiap
langkah bisa dilihat hasilnya (tidak ada langkah yang "belum kelihatan apa-apa").

| # | Langkah | Selesai kalau… |
|---|---|---|
| **S0** ✅ | Setup proyek: Vite + React + TS + Tailwind + Zustand + Motion, `tokens.css`, font Nunito self-hosted, `netlify.toml` | ✅ `npm run build` bersih; smoke-test token tampil; **64.5KB gzip** (60.6 JS + 3.9 CSS) |
| **S1** ✅ | Engine murni: `rng`, `generator`, `mastery`, `review`, `unlock` + test Vitest | ✅ **56 test hijau**; aturan "nol impor React di `src/engine/`" ditegakkan oleh `architecture.test.ts` |
| **S2** | Store Zustand + persist + `migrations` + export/import file | tutup-buka app progress tetap; file export bisa diimpor balik dan menghasilkan state identik |
| **S3** | UI kit: `Button` (gaya tebal 3D), `ProgressBar`, `Keypad`, `StarRow`, `Header`, `Sheet` | halaman demo internal menampilkan semua komponen di light & dark, target tap ≥56px terverifikasi |
| **S4** | Manipulatif gelombang 1: `counter-objects`, `ten-frame`, `number-bond`, `number-line` | interaktif, animasi sesuai `../design/animation.md`, hormati `prefers-reduced-motion`, jalan 60fps di Poco F3 |
| **S5** | Layar: `map` → `learn` → `practice` → `quiz` → `result` | satu modul dummy bisa ditempuh dari peta sampai layar hasil, ujung ke ujung |
| **S6** | Gamifikasi: XP, bintang, badge, streak, perayaan | perayaan ≤3 detik & bisa di-tap lewat; badge tersimpan; streak berganti hari dengan benar (uji ganti tanggal HP) |
| **S7** | Konten **U1** (6 modul) + `scripts/lint-content.ts` | linter menegakkan 6 aturan; 6 modul bisa diselesaikan betulan |
| **S8** | Konten **U6-m1, U6-m2, U2** (10 modul) → total 16 | path order #1–16 tembus dari awal sampai akhir |
| **S9** | Onboarding, layar Badges, **Parent Area** (gerbang + diagnosis + backup) | orang tua bisa melihat topik yang sering salah dan menyimpan file backup |
| **S10** | PWA: manifest, ikon, precache, prompt Add to Home Screen, `navigator.storage.persist()` | mode pesawat: app tetap jalan penuh; terpasang di home screen kedua HP |
| **S11** | Uji perangkat + performa: Poco F3 & iPhone 17 | tidak ada scroll horizontal, safe-area benar di Dynamic Island, bundle <200KB gzip, tidak ada frame drop terlihat |
| **S12** | Deploy | user menjalankan deploy Netlify; link terbuka di HP anak |

## Kenapa urutannya begini

- **Engine sebelum UI (S1).** Aturan penguasaan adalah bagian tersulit dan paling mudah salah
  diam-diam. Fungsi murni + test menangkap kesalahan sebelum ada layar yang menyembunyikannya.
- **Manipulatif sebelum konten (S4 sebelum S7).** 4 komponen ini dipakai 16 modul pertama dan
  ratusan modul berikutnya. Menulis konten dulu berarti menulis ulang saat komponennya berubah.
- **Parent Area belakangan (S9).** Nilainya baru muncul setelah ada data pemakaian nyata.
- **PWA di akhir (S10), bukan awal.** Service worker yang aktif saat pengembangan bikin cache
  basi dan debugging menyesatkan.

## Catatan pelaksanaan

- **Anggaran bundle S0 direvisi: <60KB → <70KB gzip.** React 19 + ReactDOM saja sudah 60.6KB
  gzip; angka <60KB semula tidak realistis untuk halaman apa pun yang memakai React. Anggaran
  akhir (<200KB gzip untuk app lengkap) tidak berubah dan masih longgar.
- Versi yang benar-benar terpasang: Vite 8, React 19, **TypeScript 7** (tsc versi Go — `baseUrl`
  sudah dihapus, `paths` harus relatif), Tailwind 4, Vitest 5, Zustand 5, Motion 13.
- `vite-plugin-pwa` **belum** dipasang, sesuai rencana (S10).

## Anggaran & batas

| Hal | Batas |
|---|---|
| Bundle awal | < 200KB gzip |
| Waktu buka pertama (4G, mid-range) | < 2.5 detik |
| Dependensi runtime | 6 (react, react-dom, zustand, motion, + 2 cadangan) |
| Konten satu modul | ±3 layar Learn + 1 set aturan soal |

## Risiko dan penanganannya

| Risiko | Penanganan |
|---|---|
| Menulis 16 modul konten ternyata jauh lebih lama dari perkiraan | S7 dikerjakan lebih dulu untuk **1 modul saja**, ukur waktunya, baru lanjut. Kalau terlalu lambat, sederhanakan format Learn sebelum menulis 15 sisanya |
| Ambang kecepatan ternyata terlalu ketat/longgar untuk anak | Ambang ada di data, bukan di kode; bisa diubah dari Parent Area tanpa deploy ulang |
| `thinkMs` kotor karena anak menyentuh layar sembarangan | Buang outlier >30 dtk, pakai median; kalau masih kotor, hitung hanya dari soal `choose-number` |
| Bahasa Inggris ternyata menghambat | String terpusat di `src/i18n/en.ts` → menambah `id.ts` adalah pekerjaan sehari, bukan pekerjaan ulang |
| iOS menghapus localStorage | Tiga lapis pertahanan di `storage.md §5` |
| Maskot belum dipilih user | 5a jalan dengan placeholder; ganti maskot = ganti isi `src/assets/mascot/` |

## Setelah 5a
**5b — uji dengan anak ±2 minggu.** Yang dicatat: modul mana yang macet, instruksi mana yang
dibaca ulang, apakah ambang kecepatan realistis, apakah dia kembali tanpa disuruh. Baru setelah
itu 27 modul sisanya ditulis (5c).

# Rencana Implementasi — Fase 5a (Vertical Slice)

Sasaran 5a: **engine + gamifikasi + 16 modul pertama Grade 1**, terpasang di HP anak dan cukup
dipakai ±6–8 minggu. Bukan Grade 1 penuh — lihat `../curriculum/README.md`.

Urutan dipilih supaya **hal yang paling berisiko dikerjakan paling awal**, dan supaya setiap
langkah bisa dilihat hasilnya (tidak ada langkah yang "belum kelihatan apa-apa").

| # | Langkah | Selesai kalau… |
|---|---|---|
| **S0** ✅ | Setup proyek: Vite + React + TS + Tailwind + Zustand + Motion, `tokens.css`, font Nunito self-hosted, `netlify.toml` | ✅ `npm run build` bersih; smoke-test token tampil; **64.5KB gzip** (60.6 JS + 3.9 CSS) |
| **S1** ✅ | Engine murni: `rng`, `generator`, `mastery`, `review`, `unlock` + test Vitest | ✅ **56 test hijau**; aturan "nol impor React di `src/engine/`" ditegakkan oleh `architecture.test.ts` |
| **S2** ✅ | Store Zustand + persist + `migrations` + export/import file | ✅ tutup-buka app progress tetap; export→import menghasilkan state identik; **+ `resilientStorage`**: Safari mode privat tidak lagi menjatuhkan app |
| **S3** ✅ | UI kit: `Button` (gaya tebal 3D), `ProgressBar`, `Keypad`, `StarRow`, `Header`, `Sheet` | ✅ halaman demo dengan pengalih tema system/light/dark; semua tombol jawaban 64px |
| **S4** ✅ | Manipulatif gelombang 1: `counter-objects`, `ten-frame`, `number-bond`, `number-line` | ✅ keempatnya interaktif di halaman demo; `number-line` sudah menangani domain negatif & langkah pecahan; matematika penempatan diuji terpisah (12 test) |
| **S5** ✅ | Session runner + layar `map` → `learn` → `practice` → `quiz` → `result` | ✅ alur ujung-ke-ujung diuji di `src/app/flow.test.ts` (peta → learn → practice → quiz → mastered → modul berikutnya terbuka). Verifikasi visual di HP menyusul di S11 |
| **S6** ✅ | Gamifikasi: XP, bintang, badge, streak, perayaan | ✅ perayaan canvas 60 partikel, 3 detik, bisa di-tap lewat; 11 badge; streak diuji lintas hari, freeze, dan jam HP yang dimundurkan |
| **S7** ✅ | Konten **U1** (6 modul) + linter konten | ✅ Unit 1 lengkap; linter menegakkan 8 aturan dan langsung menemukan 8 pelanggaran kosakata di konten yang baru ditulis |
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
- **Temuan S2:** test mengungkap bahwa `zustand/persist` melempar error kalau `localStorage`
  diblokir (Safari mode privat) — app langsung jatuh. Ditambahkan `resilientStorage()` yang
  jatuh ke memori saat gagal: app tetap jalan penuh dalam sesi itu, hanya tidak tersimpan
  lintas sesi. `storageIsAvailable()` dipakai Parent Area untuk memperingatkan orang tua.
- **XP, streak, dan badge sengaja belum disentuh** di store — itu S6. Field-nya sudah ada di
  skema supaya tidak perlu migrasi nanti.
- **S4:** matematika penempatan dipisah ke `scale.ts` (fungsi murni) supaya bisa diuji tanpa DOM
  dan dipakai ulang oleh bar-model & array-grid nanti. `number-line` sengaja langsung mendukung
  domain negatif dan langkah pecahan meski Grade 1 tidak memakainya — menambahkannya belakangan
  berarti menulis ulang komponen yang sudah dipakai ratusan modul.
- **S5 mengklarifikasi spesifikasi yang bertabrakan sendiri:** `engine.md` semula menyuruh sesi
  lanjut sampai 5 menit *dan* berhenti lebih awal untuk anak yang cepat. Sekarang tiga aturan
  berurutan, dengan "benar semua + median thinkMs ≤4 detik" menang atas aturan 5 menit.
- **S5:** `recordSession` mengembalikan `Evaluation` utuh, supaya layar hasil memakai evaluasi
  yang SAMA dengan yang disimpan — versi pertama menghitungnya dua kali dan berisiko berbeda.
- **S6:** freeze streak dipakai **diam-diam** — anak tidak pernah diberi tahu streaknya nyaris
  putus, dan tidak ada peringatan "streakmu akan hilang malam ini". Kekuatan streak berasal dari
  rasa takut kehilangan, dan itu salah sasaran untuk anak yang tidak mengendalikan jadwalnya.
- **S6:** field `streak.freezesWeek` ditambahkan tanpa migrasi — state lama yang tidak punya
  field itu diisi default saat merge. Ini contoh kenapa aturan "migrasi hanya menambah" murah.
- **S7 — linter jadi `src/content/lint.ts` + test, bukan `scripts/lint-content.ts`.** Menjalankan
  skrip TypeScript butuh `tsx` (satu dependensi lagi) padahal Vitest sudah ada. `npm run build`
  sekarang menjalankan test lebih dulu, jadi konten yang melanggar aturan tidak bisa di-build.
- **S7 menambah aturan yang tidak ada di rencana awal: `renderable`.** Layar soal hanya bisa
  merender sebagian tipe soal; menulis konten dengan tipe di luar itu menghasilkan layar rusak
  yang baru ketahuan saat anak memakainya. Sekarang ditolak saat build.
- **Aturan animasi materi ditegakkan lewat `teachingDuration()`**: saat `prefers-reduced-motion`
  aktif, animasi manipulatif dipercepat 50%, bukan dimatikan — blok yang bergabung jadi puluhan
  itu materi, bukan dekorasi.

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

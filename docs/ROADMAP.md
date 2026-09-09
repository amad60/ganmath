# Roadmap — GanMath

Status keseluruhan: **KURIKULUM LENGKAP — Grade 1–6, 240 modul, 340 test.**

G1 43 · G2 38 · G3 40 · G4 40 · G5 40 · G6 39. Rantai prasyarat tiap grade diverifikasi utuh:
satu rantai lurus dari modul pertama grade itu, hanya modul pembuka yang `prereq: []`
(tiap kelas bisa dimasuki langsung), tidak ada modul yang tak terjangkau di `pathOrder`.

Grade 4 (40 modul) dibangun satu unit per iterasi lewat loop, dengan status per unit di
[`docs/curriculum/BUILD-STATE.md`](curriculum/BUILD-STATE.md). Tiga perbaikan komponen lahir
dari proses itu karena konten Grade 4 menabrak batas alat yang ada:
`fix-input-limits` (keypad tak lagi terkunci 3 digit), `add-angle-visual` (komponen `Angle`),
`fix-numberline-step` (step diturunkan dari rentang — sekaligus menyembuhkan 12 soal garis
bilangan Grade 2–3 yang selama ini tidak bisa dijawab), dan `fix-keypad-input`
(tombol `.` dan `−`, disiapkan untuk desimal & bilangan bulat negatif di Grade 5–6).

Grade 5 (40 modul) menambah satu komponen lagi dengan alasan yang sama: `add-solid-visual`
(`Solid3D` + `ShapeNet` + aturan murni `solids.ts`) — sebelumnya tidak ada satu pun visual
bangun ruang yang benar-benar dirender, dan modul "Solid Shapes" Grade 1 mengakalinya dengan
emoji 📦.

Grade 6 (39 modul) menambah dua komponen terakhir: `add-circle-visual` (`Circle` + `circles.ts`
dengan satu konstanta `PI = 3.14`) dan `add-coordinate-visual` (`CoordinatePlane` +
`coordinates.ts`). Yang kedua menutup `VisualId 'coordinate-grid'` yang selama ini terdaftar
tanpa renderer — jebakan yang sama dengan `shape-3d`. Status per unit dan seluruh keputusan
yang diambil sepanjang jalan tercatat di
[`docs/curriculum/BUILD-STATE.md`](curriculum/BUILD-STATE.md).

- Live: **https://ganmath.netlify.app**
- Repo: **https://github.com/amad60/ganmath** (private)

**Ronde perbaikan usability (2026-09-08)** setelah user menilai app "asal jadi":
7 keluhan diperbaiki, termasuk satu bug nyata (warna umpan balik jawaban tidak pernah muncul)
dan satu fitur baru (**pintu jump-level**). Rinciannya di
[`docs/design/usability-review.md`](design/usability-review.md), termasuk daftar jujur
**yang masih lemah**.

Berikutnya: **uji di HP sungguhan** — 12 poin di
[`docs/tech/device-checklist.md`](tech/device-checklist.md) — lalu ronde perbaikan #2
(bangun komponen bentuk sungguhan, hint berjenjang, transisi antar soal).
Baca `../CLAUDE.md` dulu untuk arahan produk.

| Fase | Isi | Output | Status |
|---|---|---|---|
| 0 | Menangkap arahan produk | `CLAUDE.md`, roadmap, open questions | ✅ selesai |
| 1 | Riset | Kurikulum Merdeka + acuan internasional untuk SD 1–6, cara mengajar konsep ke anak 6 th, bongkar mekanik Duolingo/Khan Kids/Prodigy, ambang mastery & spaced repetition, kosakata English yang aman untuk pembaca pemula | ✅ selesai → [`docs/research/`](research/README.md) |
| 2 | Rancang kurikulum | Peta lengkap Grade→Unit→Module, prasyarat, tipe soal, flag kecepatan, path order | ✅ selesai → [`docs/curriculum/`](curriculum/README.md) |
| 3 | Desain | Sistem desain, maskot, wireframe 8 layar, spesifikasi animasi | ✅ selesai → [`docs/design/`](design/README.md) |
| 4 | Desain teknis + plan | Arsitektur, storage & migrasi, engine + rencana test, 13 langkah implementasi | ✅ selesai → [`docs/tech/`](tech/README.md) |
| 5a | Build vertical slice | Engine + peta + gamifikasi + **modul #1–16 Grade 1**, live di Netlify | ✅ selesai — 13/13 langkah |
| 5b | Uji dengan anak | Pakai betulan ±2 minggu, catat titik bingung, perbaiki pola sebelum konten diperbanyak | 🔜 berikutnya |
| 5c | Lengkapi Grade 1 | 27 modul sisanya (#17–43) | ✅ selesai — 43/43 |
| 6 | Isi konten | Grade 2–6 menyusul, satu grade per iterasi, dirinci saat gilirannya | ✅ selesai — G2–G6 lengkap |

## Catatan urutan
- Fase 5 sengaja hanya Grade 1: lebih baik satu kelas yang benar-benar enak dipakai daripada
  enam grade setengah jadi. Anak baru butuh Grade 1.
- **Fase 5 dipecah jadi 5a/5b/5c** (keputusan Fase 2): 43 modul Grade 1 terlalu banyak untuk
  ditulis sebelum engine teruji dengan anak sungguhan. Uji pemakaian kini berada **di tengah**
  Fase 5, bukan sesudahnya.
- Fase 5b juga menjawab pertanyaan terbuka #17 (bahasa Inggris terbaca lancar atau tidak).

## Layar yang harus ada di v1 (dipakai sebagai checklist desain & build)
1. Beranda / peta jalur belajar (dengan node terkunci & terbuka)
2. Layar Belajar (materi interaktif)
3. Layar Latihan (dengan hint)
4. Layar Uji Penguasaan
5. Layar hasil sesi (bintang, XP, badge, animasi rayakan)
6. Koleksi badge & progress keseluruhan
7. Parent Area (progress, setelan, export/import file)
8. Onboarding pertama kali (nama + avatar, sesingkat mungkin)

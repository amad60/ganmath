# Open Questions — GanMath

Log keputusan produk. Semua yang terjawab sudah dipindahkan ke `../CLAUDE.md`.

## ✅ Terjawab (2026-09-08)

| # | Pertanyaan | Keputusan user |
|---|---|---|
| 1 | Kemampuan baca anak | Sudah lancar membaca → teks jadi kanal utama, narasi audio opsional |
| 2 | Perlu narasi suara? | Tidak wajib di v1 |
| 3 | Bahasa materi | **Bahasa Inggris** (English sederhana untuk pembaca pemula) |
| 4 | Acuan kurikulum | **Kurikulum Merdeka + kombinasi acuan internasional** (Common Core / Singapore Math) |
| 5 | Ruang lingkup build pertama | **Grade 1 dulu sampai matang**; kurikulum 1–6 dipetakan di atas kertas |
| 6 | Ambang penguasaan | Setuju, **naik bertahap per grade** (G1 80%/≤8dtk → G6 90%/≤4dtk) |
| 14 | Maskot | **Gan si rubah** (user menolak robot, minta yang lucu). Avatar anak: kucing, panda, harimau, koala, kelinci |
| 19 | Anak yang levelnya sudah di atas | **Pintu jump-level**: ⏩ "I already know this" per modul (kuis singkat, ambang 90%, gagal tidak menghukum) + bagian Jump to level di Parent Area |
| 16 | Batas waktu belajar harian | **Tidak ada penguncian app**; hanya `Daily reminder` opsional (default OFF). App sudah membatasi diri lewat sesi 5–10 menit & maks 2 modul review/hari |
| 7 | Cara menjalankan | **Deploy statis ke Netlify** akun pribadi user; deploy dilakukan user sendiri |
| 8 | Device | **Poco F3 (Android/Chrome)** & **iPhone 17 (iOS/Safari)** → desain 390–430px portrait |
| 9 | Nama app | **GanMath** |
| 10 | Stack teknis | Diserahkan ke Claude → Vite + React + TS + Tailwind + Motion + Zustand + PWA |
| 11 | Titik mulai anak | Sudah bisa hitung sampai 100, tapi **mulai dari modul awal**, tanpa tes penempatan |
| 12 | Kalau macet di satu modul | **Tahan di modul itu**, tidak ada jalur alternatif |
| 13 | Panjang sesi | **Minimal 5 menit** per sesi |
| — | Backup progress | Export/import file JSON wajib di v1 + pengingat backup berkala |

## ⬜ Belum terjawab / muncul kemudian

| # | Pertanyaan | Kapan perlu dijawab | Rekomendasi |
|---|---|---|---|
| 15 | Ada silabus/buku matematika dari sekolah anak yang bisa jadi acuan? | kapan saja | Kalau ada, kirim — urutan unit Grade 1 digeser agar sinkron dengan sekolah |
| 18 | Modul uang pakai **Rupiah** (Rp500–Rp20.000) atau Dollar? | sebelum modul `g1-u7-m5` dibangun (Fase 5c) | Rupiah — itu uang yang benar-benar dipegang anak |
| 17 | Kalau anak ternyata tersendat membaca instruksi Bahasa Inggris, mau tambah narasi audio atau tambah Bahasa Indonesia? | Fase 6 (uji dengan anak) | Putuskan setelah lihat data pemakaian nyata |

# Fase 1 — Hasil Riset (indeks)

Selesai: 2026-09-08.

| Dokumen | Isi |
|---|---|
| [01-curriculum.md](01-curriculum.md) | Kurikulum Merdeka (fase A/B/C) + Common Core Grade 1, perbandingan & keputusan |
| [02-pedagogy.md](02-pedagogy.md) | CPA, komponen visual wajib, penanganan jawaban salah, batasan bahasa English |
| [03-mastery-and-spacing.md](03-mastery-and-spacing.md) | Riset kelancaran 3 detik, penyesuaian ambang, jadwal review 4 titik |
| [04-app-mechanics.md](04-app-mechanics.md) | Bongkar Duolingo/Khan Kids/Prodigy, apa yang diambil & ditolak, draft badge |

## 8 temuan yang mengubah rencana

1. **CP Merdeka hanya mengunci capaian di akhir fase (2 tahun), bukan per kelas.** Kita bebas
   menyusun urutan modul kelas 1 vs 2 — pakai urutan Singapore/Common Core yang lebih rapi untuk
   gating, tanpa melanggar kurikulum nasional.
2. **Merdeka dan Common Core sejalan**, hanya beda kecepatan tipis. Tidak ada konflik yang perlu
   diputuskan user. Yang kita ambil dari CC adalah **batas kelancaran eksplisit**
   ("fluent within 10" di Grade 1) yang tidak ada di CP Merdeka.
3. **CPA wajib, dan itu sekaligus menjawab masalah bahasa.** Anak paham dari objek yang bergerak;
   teks English cuma penegas. Setiap modul melewati Concrete → Pictorial → Abstract.
4. **Komponen visual (ten-frame, number bond, number line, base-10 blocks, bar model, array,
   fraction shapes, clock/coins) adalah aset terbesar app ini** — dibangun di Grade 1, dipakai
   sampai Grade 6. Harus jadi inti rencana teknis Fase 4, bukan detail belakangan.
5. **Ambang kecepatan kita perlu dua metrik.** Riset memakai 3 detik untuk jawaban lisan; angka
   kita (8 dtk di G1) mencakup waktu baca + mengetik. Usul: ukur `thinkMs` (sampai input pertama)
   di samping `totalMs`, pakai median, buang outlier >30 detik.
6. **Review jadi 4 titik, bukan 3** (+3 hari, +1 minggu, +1 bulan, **+2 bulan**). Riset: yang
   menentukan retensi adalah **jumlah sesi terdistribusi (±4)**, bukan pola intervalnya.
7. **Prodigy adalah contoh kegagalan yang harus dihindari:** engagement tinggi tapi rasio waktu
   belajar rendah, hadiah untuk jawaban benar bukan untuk paham. Lahir aturan **80/20**
   (min. 80% waktu di app = waktu matematika, animasi perayaan ≤3 detik & bisa dilewati).
8. **Streak harus versi lunak.** Kekuatan streak berasal dari *loss aversion* — berbahaya untuk
   anak yang tidak mengendalikan jadwalnya sendiri. Tampilkan sebagai pencapaian, freeze otomatis,
   tidak ada peringatan "streak-mu akan hilang".

## Usulan yang menunggu penerapan (Fase 4)
Checklist ada di [03-mastery-and-spacing.md §3.4](03-mastery-and-spacing.md). Semuanya penambahan,
tidak membatalkan kesepakatan yang sudah dibuat user.

## Masih terbuka
- **#15 — silabus/buku matematika dari sekolah anak.** Kalau ada, urutan modul Grade 1 disesuaikan
  supaya app sejalan dengan yang dia pelajari di sekolah. Ini satu-satunya temuan riset yang
  butuh input user, dan tidak menghambat Fase 2.

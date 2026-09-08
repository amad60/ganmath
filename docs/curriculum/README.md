# Fase 2 — Rancangan Kurikulum GanMath

Selesai: 2026-09-08. Dasar: [`../research/01-curriculum.md`](../research/01-curriculum.md).

| Dokumen | Isi |
|---|---|
| [module-schema.md](module-schema.md) | Skema data satu modul + taksonomi tipe soal + aturan penamaan |
| [grade-1.md](grade-1.md) | **Detail penuh Grade 1** — 8 unit, 43 modul, prasyarat, tipe soal, flag kecepatan |
| [grades-2-6.md](grades-2-6.md) | Peta unit-level Grade 2–6 (dirinci per grade saat gilirannya dibangun) |

## Konvensi ID

```
g1-u2-m4      Grade 1, Unit 2, Module 4     ← ID modul, dipakai sebagai key di localStorage
g1-u2         Grade 1, Unit 2               ← ID unit
add-within-10 skill id                       ← lintas modul, dipakai untuk skillStats & review
```

Aturan: **ID tidak pernah berubah setelah dirilis.** Kalau sebuah modul dipecah atau diganti,
ID lama dipertahankan sebagai alias di layer migrasi supaya progress anak tidak hilang.

## Ringkasan cakupan

| Grade | Unit | Modul | Fokus utama | Acuan |
|---|---|---|---|---|
| 1 | 8 | 43 | Bilangan s/d 100, +/− dalam 20, bangun datar & ruang, ukuran tak baku, pola, data turus | Fase A + CC G1 |
| 2 | 7 | ±38 | Nilai tempat s/d 1.000, +/− dengan menyimpan/meminjam, pengenalan ×, waktu & uang | Fase A akhir + CC G2 |
| 3 | 7 | ±40 | Perkalian & pembagian, pecahan sederhana, satuan baku, keliling | Fase B + CC G3 |
| 4 | 7 | ±40 | Bilangan s/d 10.000, faktor & kelipatan, pecahan senilai, sudut, luas | Fase B + CC G4 |
| 5 | 7 | ±40 | Operasi pecahan, desimal, persen, volume, KPK/FPB | Fase C + CC G5 |
| 6 | 7 | ±40 | Bilangan bulat, rasio & proporsi, lingkaran, koordinat, statistika & peluang | Fase C + CC G6 |

Total perkiraan **±240 modul** untuk enam tahun. Itu besar — karena itu Grade 1 saja yang dirinci
sekarang, dan urutan pembangunannya dipecah (lihat di bawah).

## Batas antar-grade yang sengaja diputuskan

CP Kurikulum Merdeka hanya mengunci capaian di **akhir fase** (2 tahun), jadi pembagian kelas 1
vs 2 adalah keputusan kita. Yang kita putuskan:

| Materi | Grade 1 | Grade 2 | Alasan |
|---|---|---|---|
| Number sense s/d 100 | ✅ | — | Fase A memang s/d 100 |
| +/− dalam 20 | ✅ tuntas | — | Fase A membatasi +/− pada 20; CC juga |
| +/− 2 digit **dengan menyimpan/meminjam** | ❌ | ✅ | Butuh nilai tempat yang matang; memaksakan di G1 = sumber frustrasi |
| ±10 dan kelipatan 10 secara mental | ✅ | — | Ini kerja **nilai tempat**, bukan algoritma penjumlahan |
| Setengah & seperempat | ✅ (sebagai bagian bangun datar) | — | Fase A: "memahami setengah dan seperempat" |
| Perkalian | ❌ | pengenalan (penjumlahan berulang) | Fase B baru menuntut ×/÷ |
| Jam | o'clock & half past | quarter & menit | Bertahap |

## Urutan pembangunan (penting — mengubah rencana Fase 5)

43 modul Grade 1 dengan materi CPA yang ditulis tangan adalah pekerjaan besar. Membangunnya
sekaligus berisiko: engine belum teruji tapi konten sudah terlanjur banyak.

**Usulan pemecahan Fase 5:**

| Tahap | Isi | Kenapa |
|---|---|---|
| **5a — Vertical slice** | Engine + peta + gamifikasi + **modul #1–16 di path order** (U1 + 2 modul bentuk + U2) | Cukup untuk anak dipakai betulan ±6–8 minggu, dan cukup untuk membuktikan engine |
| **5b — Uji dengan anak** | Perbaiki berdasarkan pemakaian nyata | Sebelum menulis 29 modul sisanya dengan pola yang mungkin salah |
| **5c — Lengkapi Grade 1** | 27 modul sisanya (#17–43) | Pola sudah terbukti, tinggal isi konten |

**Fase 5c SELESAI — Grade 1 lengkap 43 dari 43 modul.**

Delapan unit utuh: Numbers to 10, Add & Subtract within 10, Numbers to 20,
Add & Subtract within 20, Numbers to 100, Shapes, Measure/Time/Money, dan Patterns & Data.

Komponen visual yang lahir dari isi kurikulum ini dan akan dipakai ulang sampai Grade 6:
ten-frame, number bond, number line, counter objects, base-10 blocks, bars, 2D shapes,
fraction shapes, clock, money (rupiah), tally chart, pictogram.

Ini menggeser Fase 6 (uji dengan anak) jadi **di tengah** Fase 5, bukan sesudahnya. Perubahan
ini sudah dimasukkan ke `../ROADMAP.md`.

## Yang masih menunggu user
- **Open question #15** — silabus/buku matematika sekolah anak. Kalau ada, urutan unit Grade 1
  digeser agar sinkron dengan pelajaran di sekolah. Rancangan saat ini tidak menunggu itu.
- **Mata uang**: modul uang memakai **Rupiah** (Rp500 – Rp20.000) meski bahasa app English,
  karena itu uang yang benar-benar dipegang anak. Kalau kamu lebih suka Dollar (untuk keperluan
  sekolah internasional), bilang saja — tinggal ganti data, bukan logika.

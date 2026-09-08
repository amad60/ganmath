# Riset 2 — Cara Mengajar Matematika ke Anak 6 Tahun (Self-Learning)

Ini menentukan bentuk layar **Learn** dan **Practice** di GanMath.

## 2.1 CPA — Concrete → Pictorial → Abstract

Metode inti Singapore Math: setiap konsep diajarkan lewat tiga tahap berurutan sebelum simbol
muncul.

| Tahap | Di dunia nyata | **Padanan di GanMath (layar)** |
|---|---|---|
| Concrete | benda fisik, balok, jari | objek yang bisa **di-tap/drag** di layar (apel, blok, koin) |
| Pictorial | gambar, number bond, bar model | **diagram**: number bond, ten-frame, number line, bar |
| Abstract | angka & simbol | `7 + 5 = 12` dengan keypad angka |

**Aturan wajib untuk GanMath:** setiap modul baru **harus melewati tiga tahap ini**, tidak boleh
langsung ke angka. Ini juga cara paling ampuh mengurangi beban membaca — anak paham lewat objek
yang bergerak, teks cuma penegas.

Manfaat terbukti CPA: skor lebih baik, pemahaman konseptual lebih dalam, dan kepercayaan diri
matematika meningkat.

Sumber: [Maths — No Problem: Number Bonds](https://mathsnoproblem.com/en/approach/number-bonds),
[NIE Singapore — CPA (PDF)](https://math.nie.edu.sg/wkho/Research/My%20publications/Math%20Education/Yew%20Hoong%20et%20al%20(Final).pdf),
[Singaporemath.com — What is Singapore Math](https://www.singaporemath.com/pages/what-is-singapore-math)

## 2.2 Alat visual yang wajib ada di engine

Ini bukan hiasan — masing-masing mengajarkan sesuatu yang spesifik. Semua harus jadi
**komponen reusable**, dipakai lintas modul dan lintas grade.

| Komponen | Mengajarkan | Dipakai di |
|---|---|---|
| **Ten-frame** | subitizing, "berapa lagi sampai 10" | G1 counting, make-10 |
| **Number bond** | hubungan part–whole (dasar +/-) | G1–G2, dasar pecahan nanti |
| **Number line** | urutan, jarak, maju/mundur, nanti pecahan & bilangan bulat | G1–G6 |
| **Base-10 blocks** | nilai tempat, menyimpan/meminjam | G1–G4 |
| **Bar model** | soal cerita, rasio, pecahan | G2–G6 |
| **Array / grid** | perkalian, luas | G3–G5 |
| **Fraction shapes** (lingkaran/persegi terbagi) | pecahan, persen | G1 (½,¼) → G5 |
| **Clock & coins** | waktu & uang | G1–G3 |

> **Konsekuensi arsitektur:** komponen visual ini adalah **investasi terbesar dan aset paling
> berharga** dari app ini. Dibangun sekali di Grade 1, dipakai ulang sampai Grade 6. Ini harus
> jadi bagian inti rencana teknis di Fase 4, bukan detail belakangan.

## 2.3 Subitizing & number bonds

- **Subitizing** = mengenali jumlah tanpa menghitung satu-satu (lihat 5 titik → langsung tahu 5).
  Ini pintu masuk berhitung cepat. Latihan: tampilkan pola titik **sebentar** lalu tanya jumlahnya.
- **Number bonds** membangun number sense yang dibutuhkan untuk +/- di kelas 1: whole di satu
  lingkaran, parts di lingkaran yang tersambung.
- Urutan yang terbukti untuk +/- dalam 10 → 20: hitung semua → hitung lanjut (count on) →
  **make ten** (7+5 → 7+3+2) → tarik dari memori.

> **Implikasi mastery:** modul "make ten" harus dikuasai **sebelum** modul "add within 20",
> karena itu strategi yang bikin anak bisa cepat. Kalau prasyarat ini dilewat, ambang kecepatan
> kita jadi kejam. Ini contoh kenapa peta prasyarat di Fase 2 penting.

## 2.4 Menangani jawaban salah (kritis untuk self-learning)

Karena tidak ada orang dewasa yang menjelaskan, **umpan balik salah harus mengajar**, bukan
sekadar bilang salah. Aturan untuk GanMath:

1. Jangan pernah cuma "Wrong". Tunjukkan **kenapa** lewat visual yang sama dengan materinya
   (mis. ten-frame terisi memperlihatkan jawabannya).
2. **Hint berjenjang** di layar Practice: (a) petunjuk arah → (b) tunjukkan alat visualnya →
   (c) demo pelan langkah kerjanya. Baru setelah itu jawaban.
3. Soal yang salah **dimunculkan lagi** di akhir sesi yang sama (immediate re-test).
4. Salah tidak mengurangi apa pun. Tidak ada nyawa. Tidak ada skor merah.
5. Deteksi **pola miskonsepsi**, bukan cuma hitung salah — mis. selalu salah kalau ada
   "menyimpan" → arahkan ke modul nilai tempat, bukan disuruh mengulang acak.

## 2.5 Beban kognitif & bahasa (English untuk pembaca pemula)

- Satu layar = satu ide. Instruksi maksimal **1 kalimat, 3–8 kata**.
- Kata kerja instruksi dibatasi jadi **daftar tertutup** yang diperkenalkan sekali lalu dipakai
  konsisten selamanya: *tap, drag, count, add, take away, match, choose, type, how many, which,
  more, less, same, next*.
- Angka ditulis sebagai **angka** (`7`), bukan kata (`seven`), kecuali modul yang memang
  mengajarkan kata bilangan.
- Istilah matematika baru diperkenalkan dengan pola tetap: **kata + ikon + contoh bergerak**,
  lalu dipakai berulang. Simpan sebagai "glossary" supaya bisa ditinjau ulang anak.
- Hindari kalimat pasif, klausa ganda, dan idiom.
- Soal cerita panjang **tidak masuk Grade 1–2** (sudah jadi non-goal di CLAUDE.md) — bukan karena
  anak tidak bisa membaca, tapi karena beban baca mengganggu pengukuran kemampuan matematikanya.

> **Uji sederhana yang bisa kita pakai sendiri:** kalau sebuah instruksi tidak bisa dimengerti
> dengan menutup teksnya dan hanya melihat layar, instruksi itu belum cukup visual.

## 2.6 Panjang sesi
User menetapkan minimal 5 menit/sesi. Untuk anak 6 tahun, rentang fokus efektif ±5–10 menit.
Rancangan: satu sesi = **8–12 soal** atau **5 menit**, mana yang lebih dulu tercapai, dengan
jaminan sesi tidak pernah berhenti di tengah soal.

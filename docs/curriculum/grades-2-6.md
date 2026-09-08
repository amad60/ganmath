# Grade 2–6 — Peta Unit

Tingkat detail di sini sengaja **unit-level saja**. Rincian modul per grade ditulis saat grade itu
tiba gilirannya dibangun (Fase 6 di ROADMAP), memakai format yang sama dengan [`grade-1.md`](grade-1.md).
Alasan: merinci 200 modul sekarang berisiko usang sebelum dipakai — Fase 6 (uji dengan anak)
hampir pasti mengubah pola modul.

Kolom **⏱** = jumlah unit yang berisi modul `fact` (dinilai kecepatan).

---

## Grade 2 — Fase A (akhir) + CC G2 · 38 modul · ✅ dibangun

| Unit | Isi | Modul | ⏱ |
|---|---|---|---|
| U1 | Numbers to 1000 — nilai tempat ratusan, membaca & menulis, membandingkan | 6 | – |
| U2 | Add & Subtract 2-Digit — **dengan menyimpan & meminjam**, base-10 blocks | 7 | ✅ |
| U3 | Mental Math — +/− 10 & 100, dekat puluhan, strategi kompensasi | 5 | ✅ |
| U4 | Meet Multiplication — penjumlahan berulang, array, ×2 ×5 ×10 | 6 | ✅ |
| U5 | Even, Odd and Patterns — ganjil/genap, pola bertambah | 4 | – |
| U6 | Measure with Real Units — cm & m, gram & kg, satuan baku | 5 | – |
| U7 | Time, Money and Data — jam sampai 5 menit, uang & kembalian, diagram batang | 5 | – |

Batas: perkalian hanya **pengenalan** (×2, ×5, ×10). Tabel perkalian penuh → Grade 3 (sesuai Fase B).

## Grade 3 — Fase B + CC G3 · 40 modul · ✅ dibangun

| Unit | Isi | Modul | ⏱ |
|---|---|---|---|
| U1 | Numbers to 10.000 — nilai tempat ribuan, pembulatan | 5 | – |
| U2 | Multiplication Facts — tabel 1–10, sifat komutatif & distributif | 8 | ✅ |
| U3 | Division — berbagi rata, hubungan ×↔÷, sisa | 6 | ✅ |
| U4 | Add & Subtract to 1000 | 5 | ✅ |
| U5 | Fractions — bagian dari satu utuh, pecahan pada garis bilangan, membandingkan | 6 | – |
| U6 | Shapes & Perimeter — ciri bangun datar, keliling | 5 | – |
| U7 | Time, Data & Money — durasi, tabel & piktogram, masalah uang | 5 | – |

**Titik kritis:** U2 (tabel perkalian) adalah modul `fact` terbesar di seluruh app. Ini tempat
ambang kecepatan & spaced repetition paling menentukan.

## Grade 4 — Fase B (akhir) + CC G4 · ±40 modul · 🔜 berikutnya

| Unit | Isi | Modul | ⏱ |
|---|---|---|---|
| U1 | Big Numbers — s/d 1.000.000, nilai tempat, pembulatan | 5 | – |
| U2 | Multiply & Divide Bigger — 2–3 digit × 1 digit, pembagian panjang awal | 7 | ✅ |
| U3 | Factors & Multiples — faktor, kelipatan, bilangan prima, KPK & FPB awal | 6 | – |
| U4 | Equivalent Fractions — pecahan senilai, menyederhanakan, +/− penyebut sama | 7 | – |
| U5 | Decimals Begin — persepuluhan & perseratusan, hubungan dengan pecahan | 5 | – |
| U6 | Angles & Area — jenis sudut, mengukur sudut, luas & keliling | 6 | – |
| U7 | Data — diagram batang, tabel frekuensi, rata-rata sederhana | 4 | – |

## Grade 5 — Fase C + CC G5 · ±40 modul

| Unit | Isi | Modul | ⏱ |
|---|---|---|---|
| U1 | Fraction Operations — +/− penyebut beda, × dan ÷ pecahan | 8 | – |
| U2 | Decimals — operasi desimal, konversi pecahan↔desimal | 6 | ✅ |
| U3 | Percent — persen, hubungan dengan pecahan & desimal, diskon | 5 | – |
| U4 | Multiply & Divide Fluently — bilangan besar, pangkat dua & akar | 6 | ✅ |
| U5 | Volume & Measurement — volume kubus & balok, konversi satuan | 6 | – |
| U6 | Shapes in Space — jaring-jaring, visualisasi spasial | 5 | – |
| U7 | Data & Speed — kecepatan, jarak, waktu; interpretasi data | 4 | – |

## Grade 6 — Fase C (akhir) + CC G6 · ±40 modul

| Unit | Isi | Modul | ⏱ |
|---|---|---|---|
| U1 | Integers — bilangan bulat negatif, garis bilangan, operasi | 6 | ✅ |
| U2 | Ratio & Proportion — rasio, skala, perbandingan senilai & berbalik nilai | 7 | – |
| U3 | Algebra Begins — variabel, persamaan sederhana, pola ×/÷ | 6 | – |
| U4 | Circles — keliling & luas lingkaran, π | 5 | – |
| U5 | Solids — volume & luas permukaan bangun ruang | 5 | – |
| U6 | Coordinates — sistem koordinat, memplot titik & bangun | 4 | – |
| U7 | Statistics & Chance — mean/median/modus, peluang percobaan acak | 6 | – |

---

## Benang merah yang harus dijaga lintas grade

Ini alasan kenapa peta 6 grade dibuat sekarang meski baru Grade 1 yang dibangun — supaya komponen
dan struktur data hari ini tidak menghalangi materi tahun ke-5.

| Benang | G1 | G2 | G3 | G4 | G5 | G6 |
|---|---|---|---|---|---|---|
| `number-line` | 0–20, 0–100 | 0–1000 | pecahan | desimal | pecahan & desimal | **negatif** |
| `base10-blocks` | puluhan-satuan | ratusan | ribuan | jutaan | desimal | — |
| `number-bond` | part–whole | fact family | ×/÷ | faktor | pecahan | rasio |
| `array-grid` | doubles | perkalian awal | tabel perkalian | luas | volume | — |
| `bar-model` | — | soal cerita | ×/÷ | pecahan | persen | **rasio & aljabar** |
| `fraction-shape` | ½, ¼ | — | pecahan dasar | senilai | operasi | — |

**Konsekuensi desain untuk Fase 4:** `number-line` harus mendukung nilai negatif dan pecahan
**sejak awal** (walaupun Grade 1 tidak memakainya), dan `bar-model` harus bisa bertingkat.
Menambahkannya belakangan berarti menulis ulang komponen yang sudah dipakai ratusan modul.

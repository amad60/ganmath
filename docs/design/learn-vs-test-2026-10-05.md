# Evaluasi Belajar vs Tes — 2026-10-05

Ditulis karena pengamatan pemakaian: **semua modul terasa seperti tes, tanpa belajar.**
Pengamatan itu tepat untuk waktu yang dihabiskan anak, dan lebih parah di Science serta
Read daripada di Math awal.

Dokumen ini tidak mengubah app. Ia mencatat apa yang bisa diperiksa di kode dan di
konten pada commit `e2259fc`.

## Akar masalah

Di ketiga jalur, sebagian besar waktu anak habis menjawab soal. Bagian belajarnya ada,
tapi tipis, dan setelah sekali lewat tidak pernah muncul lagi — kecuali anak gagal kuis
tiga kali berturut-turut (`RETEACH_AFTER_FAILS = 3` di `src/engine/steps.ts`).

Dua pemeriksaan penguasaan (latihan lalu dua kuis) itu wajar. Yang kurang bukan
soalnya. Yang kurang adalah **membangun idenya sebelum ditanya.**

Keputusan desain lama — tombol Next di Learn tidak aktif sampai anak beraksi — hanya
berlaku untuk langkah yang memang minta tindakan. Langkah `watch` membuka Next setelah
jeda lihat **800 ms** (`WATCH_LOOK_MS`). Jeda itu bukan mengajar.

## Duduk pertama, satu modul

Learn = langkah di `module.learn`, lalu satu kartu **"Now you try."** Kartu itu bukan
soal baru: `learnCheck` mengambil item dari `generateSet` yang sama dengan kuis. Tidak
dinilai, tapi harus dijawab benar; jawaban salah mengganti seed jadi soal lain.

Setelah `learnCompletedAt` terisi, `nextStepFor` hanya mengembalikan latihan, kuis,
speed, ulasan, atau selesai.

| Sesi | Panjang | Catatan |
|---|---|---|
| Latihan | 8 | 12 kalau modul punya soal cerita (8 hitung + 4 cerita) |
| Kuis / master / test-out | 10 | 2 di antaranya cerita, kalau modul punya cerita |
| Speed Round | 8 | Hanya modul `fluencyTracked` yang belum cukup cepat |
| Ulasan | 5 | Setelah dikuasai, bukan duduk pertama |

Ambang Grade 1: akurasi 0,8, **dua sesi**, boleh di hari yang sama, kecepatan 8 detik.
Anak yang lancar di modul tanpa cerita: **1 cek belajar (tidak dinilai) + 8 latihan +
10 kuis + 10 kuis = 28 soal bernilai.** Anak yang lambat di Math menambah Speed Round
8 soal. Science dan Read tidak punya Speed Round (`fluencyTracked: false`).

Grade 6 menuntut tiga sesi, jadi porsi kuisnya lebih panjang lagi. Belajarnya tetap
sekali.

## Per jalur

### Math — ada satu langkah tangan, lalu tes

Sekitar 240 modul Math. Hampir setiap modul punya **tepat satu** langkah yang minta
anak melakukan sesuatu, hampir selalu di tahap konkret:

- 171 `tap-count`
- 29 `tap-fill`
- 51 `drop-on-line`
- 660 `watch`

Jadi CPA tertulis di skema, tapi dua dari tiga langkahnya pasif. Anak menyentuh
manipulatif sekali, menonton dua kartu, menjawab "Now you try.", lalu mengerjakan
28 soal. Skor mengajar yang dulu memberi nilai tinggi karena "CPA ada" menghitung
keberadaan langkah, bukan waktu anak di dalamnya.

### Read — tiga kartu, lalu tes yang sama

17 modul (Level 1 unit 1 punya dua modul; sisanya satu modul per unit sampai Level 4).
Setiap langkah Learn adalah `action: 'watch'` — 3 kartu per modul, 51 semuanya.
Tidak ada Speed Round.

Mengajarnya: baca kalimat, tunggu 800 ms, tiga kali, lalu soal dari bank yang sama.
Untuk jalur baca, menonton kalimat lalu memilih kalimat masih satu keluarga kegiatan.
Masalahnya volume: belajar sekali, tes 28 soal.

### Science — GanRead dengan kalimat sains

30 modul, Level 1–3, sepuluh unit masing-masing. Setiap langkah Learn juga
`action: 'watch'` — 90 kartu, nol yang interaktif. Tidak ada Speed Round.

Aktivitasnya memakai mesin Read:

- belajar: dua kalimat di kartu `evidence-text`
- soal: `clue-tap` dan `choose-text`
- komponen yang sama (`EvidenceText`)
- kaki layar yang sama: "Tap the sentence that shows the clue!"

Anak tidak mengubah satu hal lalu melihat hasilnya. Tidak ada variabel, tidak ada
akibat yang bergerak. Mencocokkan kata ("water" di soal dan di jawaban) bisa lulus
tanpa paham sebabnya. Topik Level 1–3 (makhluk hidup, sebab-akibat, mekanisme) layak;
bungkusnya yang salah.

Intro unit Science masih animasi roket generik ("Ready for sN-uN"). Kalimat konsep
di intro adalah satu-satunya pengajaran di luar tiga kartu itu.

## Yang jangan dibongkar

- Dua kuis untuk menguasai satu modul. Itu pemeriksaan, bukan pengganti belajar.
- Latihan 8 dan kuis 10. Panjangnya masuk akal kalau sebelumnya ada kegiatan yang
  membangun ide.
- Hint yang tidak membocorkan jawaban, dan jalur `sci-` yang tidak jatuh ke mesin
  hitung.
- Perbedaan layar Mastery Check (tanpa hint) dengan latihan.

## Arah, belum dikerjakan

Satu perubahan yang layak dicoba dulu, hanya di **Science Level 1**, satu jenis adegan
yang dipakai ulang — bukan sepuluh mesin:

1. Anak mengubah satu hal.
2. Gambarannya berubah.
3. Keterangan bahasa Inggris pendek muncul setelah gambar bergerak.

Tiga gerakan yang cukup untuk Level 1: ubah satu hal; ketuk bagian pada gambar;
pilih gambar "apa yang terjadi selanjutnya", lalu putar hasil yang benar walaupun
pilihannya salah. Topik Level 1 tetap. Level 2 dan 3 dibiarkan sampai Level 1
terasa seperti sains, bukan seperti baca.

Untuk Math dan Read, yang perlu ditambah bukan soal baru. Yang perlu ditambah adalah
waktu membangun ide sebelum deretan 8 + 10 + 10. Dokumen ini tidak memilih desain
itu; ia hanya menetapkan bahwa kesenjangannya ada.

## Dikerjakan — 2026-10-05

Tiga perubahan, tiap fase satu deploy. Mastery tidak disentuh: dua kuis, latihan 8,
kuis 10, kuis tanpa hint.

1. **Latihan mengajar** (`f7fd55c`).
   - Salah jawab di latihan membuka gambar bantuan soal itu ("Let's look again."),
     lalu menunggu Next.
   - Soal pilihan atau baca yang salah diganti soal kembaran dari aturan yang sama
     (`freshSibling`).
   - Tiga soal pertama latihan dibimbing. Bimbingan ini tidak dicatat sebagai
     `hintUsed`.
   - Hint latihan tidak dijatah lagi.
   - Hint Read/Science tadinya mati, karena layar soal hanya mencari modul Math.
     Sekarang sudah hidup.
2. **Materi bisa dibuka ulang** (`a6c92a7`).
   - Tombol "See lesson" di peta dan setelah kuis gagal, tanpa mengubah progres.
   - +10 XP saat materi selesai.
   - Ke-17 modul Read punya langkah `tap-clue`: anak mengetuk kalimat bukti di
     cerita pendek.
3. **Science Level 1 jadi sains.**
   - Komponen `ScienceScene` dengan tiga gerakan: `change`, `tap-part`, dan
     `predict`.
   - Action Learn `explore`.
   - Soal `pick-picture` ("What happens next?" bergambar).
   - Intro unit memutar adegannya.
   - Hint Science memakai adegan `change`, bukan `predict`. Adegan `predict`
     memutar hasil yang benar, jadi bisa menjadi kunci jawaban.

Belum: Learn Math tahap abstract.

Susulan: kosakata Read lama dirapikan, sehingga Read lolos lint penuh di keempat level
(75 kata dideklarasikan atau diganti, 3 prompt dipendekkan). Science Level 2–3 juga
sudah memakai format adegan + `pick-picture`, jadi ketiga level Science (30 modul)
sekarang dikerjakan, bukan dibaca.

# Evaluasi Usability — 2026-09-08

Ditulis setelah user memakai app hasil 5a dan menilainya **"kayak app asal jadi"**.
Penilaian itu tepat, dan penyebabnya satu.

## Akar masalah

**App ini dibangun tanpa pernah dilihat.** Seluruh verifikasi Fase 5a berupa test logika,
typecheck, build, dan pengecekan HTTP. Tidak ada satu pun test yang **merender komponen**,
dan tidak ada satu pun momen di mana layarnya benar-benar diperiksa.

Akibatnya, kelas kesalahan yang lolos semuanya sejenis: **hal yang benar secara logika tapi
salah secara pengalaman.** Test bisa membuktikan "modul terbuka setelah dikuasai" tapi tidak
bisa memberi tahu bahwa tombol jawaban tidak berubah warna saat ditekan.

## Temuan & perbaikan

| # | Keluhan | Diagnosis | Perbaikan |
|---|---|---|---|
| 1 | Ikon awal robot, tidak lucu | Maskot memang belum pernah dibuat; `🤖` cuma placeholder | **Gan si rubah**, SVG dengan 6 ekspresi, muncul di onboarding, learn, soal, dan hasil |
| 2 | Tidak ada avatar kucing | Daftar avatar sembarangan | Avatar jadi kucing, panda, harimau, koala, kelinci. Rubah dikeluarkan karena itu maskot |
| 3 | Jawaban ditekan tapi tidak ada pembeda | **Bug nyata.** `bg-surface` (varian) dan `bg-correct` (umpan balik) adalah dua utility Tailwind yang bertabrakan; pemenangnya ditentukan urutan di file CSS, bukan urutan di `className`. Warna sering tidak muncul sama sekali | Warna tombol ditulis lewat `style`, deterministik. Tambah state `selected` dan `reveal`. Jawaban benar ikut menyala saat anak salah |
| 4 | Tidak tahu sisa berapa soal lagi | Ada progress bar tapi tanpa angka, dan `progressOf` menghitung total secara keliru | Angka eksplisit **"3 / 10"** + **deretan titik** per soal (hijau/oranye/sekarang/sisa). `progressOf` diperbaiki |
| 5 | Bintang tidak berwarna di layar "Keep going" | Bintang kosong digambar abu-abu → layar gagal terasa seperti vonis | Bintang kosong kini emas berongga; layar hasil dapat maskot, XP, dan kalimat jarak-menuju-lulus |
| 6 | Tidak bisa lihat riwayat & milestone terkunci | Layar Badges cuma grid badge | Jadi **My Progress**: riwayat 8 sesi terakhir, "Coming next" 3 modul berikutnya, petunjuk badge yang belum didapat |
| 7 | Butuh pintu **jump level** | Gating ketat tidak menyediakan jalan bagi anak yang sudah bisa | **⏩ "I already know this"** di peta: kuis singkat, ambang lebih tinggi (90%), lulus = langsung dikuasai tanpa dua sesi, gagal tidak menghukum apa pun. Plus bagian "Jump to level" di Parent Area |

Tambahan yang tidak diminta tapi jelas kurang:
- **Suara & getar** — dibuat lewat WebAudio (tanpa file, tanpa menambah bundle). Tidak ada
  buzzer untuk jawaban salah; nadanya netral.
- **Kartu "Next up"** di peta supaya anak tidak perlu memindai jalur.
- **Modul terkunci menjelaskan apa yang membukanya**, bukan gembok bisu.
- **Layar Learn** kini menampilkan Gan yang menunjuk, dan tanda ✓ saat targetnya tercapai.

## Pencegahan

Ditambahkan **`src/app/screens/screens.test.tsx`** — 12 test yang benar-benar merender layar
(jsdom + Testing Library) dan menekan tombolnya. Yang dijaga:
tombol yang dipilih anak berubah warna; jawaban benar ikut ditunjukkan; hitungan soal muncul;
bintang tetap emas walau nol; Mastery Check tanpa Hint; maskot rubah bukan robot;
modul terkunci tidak bisa ditekan; pintu jump-level memanggil aksinya.

Total test: **141**.

## Yang MASIH lemah (jujur)

Diurut berdasarkan seberapa besar pengaruhnya ke rasa "asal jadi".

| Prioritas | Masalah |
|---|---|
| **1** | **Masih belum pernah dilihat mata.** Tidak ada tooling browser di sesi ini; render test bukan pengganti melihat. Ini harus dipecahkan sebelum ronde perbaikan berikutnya |
| **2** | **Modul bentuk memakai emoji, bukan bangun sungguhan.** `shape-2d`/`shape-3d` masih ada di daftar komponen tapi belum dibuat. Emoji 🔺🟦 terlihat murah dan tidak bisa dipakai mengajar sisi/sudut |
| **3** | **Hint di Practice masih kasar** — cuma mengisi ten-frame. Rancangannya hint berjenjang: arah → tunjukkan alat → demo langkah |
| **4** | **Tidak ada transisi antar soal.** Rancangan meminta geser keluar/masuk 300ms; sekarang soal berganti mendadak |
| **5** | **Layar Learn masih terasa datar** untuk langkah `watch` — tidak ada gerak yang menjelaskan, cuma gambar diam |
| **6** | Baru 16 dari 43 modul Grade 1 |
| **7** | Maskot belum punya animasi idle halus; kemunculannya masih statis |

## Pelajaran yang dicatat ke cara kerja

Fitur yang dilihat anak **tidak boleh** dinyatakan selesai hanya karena test logika hijau.
Minimal harus ada test render yang menekan tombolnya, dan idealnya seseorang melihat layarnya.

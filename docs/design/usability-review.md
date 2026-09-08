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

## Ronde 2 — dengan MELIHAT layarnya

Masalah nomor 1 di daftar bawah akhirnya terpecahkan: Chrome sudah terpasang di mesin ini,
jadi `puppeteer-core` bisa memakainya tanpa mengunduh browser, dan hasil PNG-nya bisa
diperiksa langsung.

```bash
npm run shots          # 8 layar, 393x873, tema terang
npm run shots -- --dark
```

Temuan yang **hanya bisa terlihat dengan mata**, semuanya sudah diperbaiki:

| Layar | Temuan | Perbaikan |
|---|---|---|
| Peta | Tombol Start berada di dalam daftar node yang digeser `translateX`, sehingga **menembus tepi kanan layar** | Aksi utama pindah ke footer lengket di bawah |
| Peta | Banner "Add to home screen" `fixed` dan **menutupi node terakhir** | Jadi kartu biasa di dalam aliran, bisa ditutup |
| Peta | Tidak ada garis penghubung → terbaca sebagai daftar acak | Penghubung berwarna antar node; terisi warna unit kalau sudah dilewati |
| Peta | Emoji di atas lingkaran warna pekat (apel merah di lingkaran biru) | Lingkaran terang + cincin warna unit |
| Peta | Node terakhir tertutup footer | Ruang bawah disesuaikan tinggi footer |
| Soal | **Ten-frame kosong muncul padahal hint belum ditekan** | Hanya muncul setelah hint |
| Soal | Dua tombol jawaban di bawah garis lipat | Tinggi tombol & jarak disesuaikan; konten bisa menyusut |
| Soal | Soal melayang di tengah, jauh dari tombol jawaban | Soal dikelompokkan tepat di atas tombol — mata dan jempol berdekatan |
| Soal | Tertulis "1 / 12" padahal sesi biasanya berhenti di 8 | Target dihitung dari batas minimum |
| Soal | Titik hitam pekat 44px terasa berat | Dirender sebagai lingkaran berwarna |
| Soal | Tombol lain redup 40% setelah menjawab → layar terlihat mati | Interaksi dimatikan tanpa meredupkan |
| My Progress | Urutan unit "Unit 1, Unit 6, Unit 2" | Diurutkan numerik |
| Parent | "1 modules" | Bentuk jamak diperbaiki |
| Onboarding | Input nama kosong tanpa placeholder; avatar membungkus 4+1 | Placeholder + grid 5 kolom |
| Semua | CTA terlalu menempel ke tepi | Padding horizontal aksi dinaikkan ke 24px |

## Ronde 3 — kontrol yang tidak melakukan apa-apa

User bertanya "how to pindah kelas saat ini?" dan jawabannya memalukan: **tidak bisa**.
Tombol Grade 1–6 di Parent Area dibuat tanpa `onClick` sama sekali — termasuk Grade 1.
Kontrol yang terlihat bisa ditekan tapi tidak melakukan apa pun adalah bentuk lain dari
"asal jadi", dan tidak ada test yang bisa menangkapnya karena tidak ada yang salah
secara logika; yang salah adalah tidak adanya perilaku.

Diperbaiki jadi mekanisme sungguhan:
- `profile.grade` disimpan (aditif, state lama otomatis dapat default 1).
- `registryFor(grade)` — gating dihitung **di dalam kelas aktif saja**, sehingga anak
  kelas 2 tidak perlu menempuh seluruh Grade 1 lebih dulu.
- Kelas yang belum punya konten tidak bisa dipilih dan ditandai "soon"; kelas aktif
  disorot dan menampilkan jumlah modulnya.
- Berpindah kelas **tidak pernah menghapus apa pun** — progress disimpan per modul,
  jadi selalu bisa dibalik.

**Keputusan: tidak memakai burger menu.** Menu tersembunyi di balik ikon tiga garis harus
ditemukan dan dibaca lebih dulu, dan isinya bukan hal yang dibutuhkan anak setiap hari.
Pindah kelas adalah keputusan orang tua yang jarang, jadi tempatnya di Parent Area.
Navigasi anak tetap dua ikon di header: 🏅 progress dan 👤 area orang tua.

## Yang MASIH lemah (jujur)

Diurut berdasarkan seberapa besar pengaruhnya ke rasa "asal jadi".

| Prioritas | Masalah |
|---|---|
| **1** | **Belum pernah diuji di HP fisik.** Screenshot memakai Chrome desktop pada viewport HP — itu menangkap tata letak, tapi bukan sentuhan, kelincahan, atau perilaku Safari iOS |
| ~~2~~ | ~~Modul bentuk memakai emoji~~ — **selesai.** `Shape2D` (SVG, bisa menandai sudut), `Base10Blocks`, dan `Bars` dibuat, dan soal kini bisa membawa gambarnya sendiri. Bangun ruang masih emoji |
| **3** | **Hint di Practice masih kasar** — cuma mengisi ten-frame. Rancangannya hint berjenjang: arah → tunjukkan alat → demo langkah |
| **4** | **Tidak ada transisi antar soal.** Rancangan meminta geser keluar/masuk 300ms; sekarang soal berganti mendadak |
| **5** | **Layar Learn masih terasa datar** untuk langkah `watch` — tidak ada gerak yang menjelaskan, cuma gambar diam |
| **6** | Baru 16 dari 43 modul Grade 1 |
| **7** | Maskot belum punya animasi idle halus; kemunculannya masih statis |

## Pelajaran yang dicatat ke cara kerja

Fitur yang dilihat anak **tidak boleh** dinyatakan selesai hanya karena test logika hijau.
Minimal harus ada test render yang menekan tombolnya, dan idealnya seseorang melihat layarnya.

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

## Ronde 4 — pass desain menyeluruh

Dipicu satu laporan: header peta tidak punya jarak atas sama sekali. Penyebabnya bug
kelas: helper area aman ditulis `padding-top: env(safe-area-inset-top)`, dan
**`env()` bernilai 0** di browser desktop maupun di Android yang belum dipasang ke home
screen. Jadi jaraknya hilang total.

Perbaikan itu justru membuka masalah yang lebih besar: `.safe-bottom` **menimpa**
`p-5` milik modal (20px → 12px), jadi helper yang dimaksudkan menambah jarak malah
menguranginya. Sekarang nilainya aditif (`calc(20px + env(...))`), dan ada
**test yang gagal** kalau ada elemen memakai `safe-*` bersama utility padding di sisi
yang sama.

Pass desain lainnya:
- **Ikon antarmuka jadi SVG** (piala, orang, gembok, tutup, lewati). Emoji dirender
  berbeda di tiap sistem, ukurannya tidak presisi, dan warnanya tidak ikut tema — di
  sebelah maskot SVG, emoji terlihat seperti tempelan. Emoji tetap dipakai untuk ISI
  pelajaran, di mana keragamannya tidak masalah.
- **17 ikon modul diganti**: emoji keycap (🔟 1️⃣ 💯 🔢) terbaca sebagai chip antarmuka
  di dalam lingkaran node, bukan sebagai gambar.
- Header dapat garis rambut pemisah; angka statistik memakai *tabular numerals*
  sehingga tidak bergoyang saat berubah.
- Label progress diberi lebar tetap supaya bar tidak bergeser saat 9 → 10.
- Tinggi label badge dikunci dua baris supaya kartu tidak naik-turun.
- Belokan jalur peta diperbesar supaya terbaca sebagai jalur, bukan daftar.
- Kotak jawaban di gerbang orang tua menggantikan em-dash yang terbaca sebagai garis nyasar.

## Ronde 5 — jebakan yang membuat app tidak bisa diselesaikan

User melaporkan "anak bisa terjebak di modul yang sama berkali-kali". Setelah ditelusuri,
kenyataannya lebih buruk: **tidak ada satu modul pun yang bisa dikuasai lewat permainan
normal.**

Layar peta menebak langkah berikutnya sendiri:
`status === 'learning' ? 'practice' : 'quiz'`. Setelah materi selesai status menjadi
`learning`, dan sesi latihan menurut desain **tidak pernah menaikkan status** — jadi
tombol utama mengirim anak ke latihan, selamanya. Kuis tidak pernah tercapai.

Bug ini lolos karena test integrasi memanggil `playSession(..., 'quiz')` **langsung**:
menguji engine, tapi tidak pernah menguji navigasinya. Pelajarannya sama dengan
tombol Grade yang tidak punya `onClick` — yang tidak diuji adalah **perilaku app**,
bukan kebenaran fungsinya.

Perbaikan:
- **`engine/steps.ts`** jadi satu-satunya sumber kebenaran untuk "anak harus ngapain
  sekarang": materi → latihan → kuis → (ulang) → dikuasai; gagal kuis mengembalikan ke
  **latihan**, bukan mengulang kuis; gagal tiga kali mengembalikan ke **materi**.
  Menyelesaikan materi mereset hitungan gagal, supaya tidak berputar di situ.
- **Tombol utama selalu menyebut langkah yang sebenarnya** — "Practice: Count to 10",
  "Mastery Check: Count to 10" — bukan "Start" generik. Anak dan orang tua bisa melihat
  bahwa dia memang bergerak.
- **Layar hasil membawa maju**, bukan mengembalikan ke peta. Sebelumnya tombolnya
  mengembalikan ke peta dan dari peta anak menemukan modul yang sama lagi — terasa
  berputar di tempat justru setelah dia berhasil. Sekarang tombol utama langsung
  mengerjakan langkah berikutnya, atau modul berikutnya kalau modul ini sudah tuntas.
- Dua test regresi meniru **persis apa yang dilakukan tombol utama**, dan membuktikan
  modul benar-benar bisa dituntaskan, serta anak yang selalu gagal tidak diulang-ulang
  di langkah yang sama.

## Ronde 6 — audit fitur mati

Diminta user setelah bug alur: "audit lagi flow lainnya, takut ada yang mati juga".
Wajar dicurigai, dan benar: **empat fitur lagi selesai di engine, lengkap dengan
testnya, tapi tidak pernah bisa dijangkau anak.**

| Fitur | Kenapa mati | Perbaikan |
|---|---|---|
| **Ulangan berjarak (3/7/30/60 hari)** | `dueReviews()` tidak pernah dipanggil app. Modul yang sudah dikuasai dilewati `nextModule`, jadi tidak pernah muncul lagi di peta. Seluruh jadwal retensi — inti janji "di luar kepala" — tidak pernah terjadi | Kartu **"Time to remember"** di peta, maksimal 2 modul/hari, node ikut ditandai ⟲ |
| **Master Round (bintang ke-3)** | Tidak ada satu pun tempat memulai sesi `master`. Bintang ketiga dan badge Gold Brain mustahil didapat | Ditawarkan di layar hasil begitu modul dikuasai dengan <3 bintang |
| **Toggle "Reduce motion"** | Tersimpan di setelan, tapi `useReducedMotion` hanya membaca `prefers-reduced-motion`. Togglenya tidak melakukan apa pun | Setelan ditulis ke atribut `<html>`, hook mengamatinya, berlaku seketika |
| **Pemulihan data terhapus** | `looksWiped()` tidak pernah dipanggil. Anak yang kehilangan progress hanya melihat layar "anak baru" | Onboarding menawarkan **"Load progress from a file"** kalau app terdeteksi pernah dipakai |

**Penjaga baru**: satu test memastikan setiap jenis sesi punya jalan dari app —
lewat literal di kode app, atau lewat `nextStepFor` yang dibuktikan mengembalikannya.
Penjaga ini langsung menemukan satu positif palsu (Speed Round dijangkau lewat step
machine, bukan literal), yang justru membuat aturannya jadi presisi.

Pola yang sama muncul lima kali di proyek ini: **selesai di engine ≠ sampai ke anak.**
Test unit membuktikan fungsinya benar; tidak ada yang membuktikan fungsinya dipakai.

## Ronde 7 — audit lanjutan

| Temuan | Dampak nyata | Perbaikan |
|---|---|---|
| **Sesi berjalan tidak pernah disimpan** — `SESSION_KEY` dideklarasikan lalu tidak dipakai siapa pun, padahal `engine.md` menjanjikannya | HP terkunci, app dibunuh sistem, atau orang tua mengambil HP di tengah kuis = **seluruh jawaban anak hilang** dan dia mulai dari soal pertama. Untuk anak 6 tahun itu alasan berhenti | Sesi disimpan tiap jawaban dan dipulihkan otomatis saat app dibuka. Data rusak diabaikan, tidak menjatuhkan app |
| **Menekan node yang sudah selesai meluncurkan modul LAIN** | Anak menekan "Count to 5", tiba-tiba mengerjakan modul yang berbeda | Node yang tuntas kini membuka **ulangan modul itu sendiri** |
| **Paket `motion` terpasang tapi nol impor** | Dependensi yang menyiratkan fitur yang tidak ada | Dihapus; transisi antar soal ditulis dengan CSS |
| **Tidak ada transisi antar soal** (rancangan meminta geser 300ms) | Soal berganti mendadak, terasa seperti teks berkedip | Animasi masuk per soal, otomatis dipotong saat `prefers-reduced-motion` |
| **`reviewQueue` di skema tidak pernah diisi** | Field mati yang ikut terbawa ke setiap file backup | Dihapus |

## Ronde 8 — audit CTA

Keluhan user: "CTA ada banyak tapi unclear arahnya", "ga jelas hubungannya antara sub unit",
"kenapa bintang 2 semua".

**Diagnosis:**
1. **Peta tidak pernah menampilkan unit.** 43 modul tampil sebagai satu daftar panjang
   berkelok tanpa struktur. Unit ada di data, ada di layar My Progress, tapi tidak ada di
   tempat anak menghabiskan waktunya.
2. **Tiga CTA bersaing di tempat yang sama** — tombol utama plus dua tombol hantu
   berdampingan ("Skip this one", "Skip whole unit") dengan bobot visual yang sama dan
   nama yang menuntut anak sudah paham konsepnya.
3. **Node tidak memberi tahu apa yang terjadi kalau ditekan.** Modul yang sama bisa
   membuka materi, latihan, kuis, atau ulangan — dan tidak ada satu pun petunjuk.
4. **Bintang tidak bermakna.** Nilai sempurna memberi 2 bintang, dan bintang ke-3 hanya
   ada di layar hasil sebagai tombol sekunder yang mudah terlewat. Hasilnya hampir semua
   modul berhenti di ★★☆ tanpa penjelasan.

**Perbaikan:**
- **Peta dikelompokkan per unit**, dengan judul dan kemajuan tiap unit (`3/6`), serta titik
  berwarna unit yang berubah emas saat unit tuntas.
- **Satu tombol utama** yang menyebut langkah sebenarnya. Pintu melompat jadi satu tombol
  hantu → membuka lembar berisi dua pilihan yang **dijelaskan kalimatnya**, plus jaminan
  "kalau gagal, tidak ada yang hilang".
- **Setiap node punya keterangan** di bawahnya: "Tap to start", "Done · tap to practise
  again", "Time to remember · tap", atau syarat pembukanya.
- **Kartu berikutnya jadi tombol** (sebelumnya hanya kartu hiasan) dengan panah arah.
- **Menekan modul yang sudah selesai membuka lembar pilihan** — Quick Review atau Master
  Round — beserta penjelasan **kenapa bintang ketiga belum didapat**. Bintang ke-3 kini
  punya jalan yang terlihat, bukan hanya tombol sekunder di layar hasil.

## Yang MASIH lemah (jujur)

Diurut berdasarkan seberapa besar pengaruhnya ke rasa "asal jadi".

| Prioritas | Masalah |
|---|---|
| **1** | **Belum pernah diuji di HP fisik.** Screenshot memakai Chrome desktop pada viewport HP — itu menangkap tata letak, tapi bukan sentuhan, kelincahan, atau perilaku Safari iOS |
| ~~2~~ | ~~Modul bentuk memakai emoji~~ — **selesai.** `Shape2D` (SVG, bisa menandai sudut), `Base10Blocks`, dan `Bars` dibuat, dan soal kini bisa membawa gambarnya sendiri. Bangun ruang masih emoji |
| **2** | **Hint di Practice masih satu tingkat** — cuma mengisi ten-frame. Rancangannya berjenjang: arah → tunjukkan alat → demo langkah. Ini sisa terbesar |
| **5** | **Layar Learn masih terasa datar** untuk langkah `watch` — tidak ada gerak yang menjelaskan, cuma gambar diam |
| **6** | Baru 16 dari 43 modul Grade 1 |
| **7** | Maskot belum punya animasi idle halus; kemunculannya masih statis |

## Pelajaran yang dicatat ke cara kerja

Fitur yang dilihat anak **tidak boleh** dinyatakan selesai hanya karena test logika hijau.
Minimal harus ada test render yang menekan tombolnya, dan idealnya seseorang melihat layarnya.

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

## Ronde 9 — layar hasil: satu tombol

Keluhan user: "many CTA, ga jelas alurnya… sekarang chaos asal-asalan aja."

Layar hasil menumpuk **tiga tombol tanpa hierarki** — lanjut ke modul berikutnya,
Master Round, kembali ke peta — ditambah judul modul di paling bawah dengan gaya teks
abu-abu yang terbaca sebagai **tombol keempat**.

Akar masalahnya bukan tata letak: **satu aksi punya dua rumah.** Layar hasil
menduplikasi navigasi yang sudah dimiliki peta, padahal peta sudah punya tombol utama
yang menyebut langkah berikutnya.

Prinsip yang dipakai: **satu aksi hanya punya satu rumah**, dan setiap layar punya
**satu tombol utama**.

- Layar hasil kini punya **tepat satu tombol: "Back to the map"** — ada testnya yang
  gagal kalau tombolnya bertambah.
- Modul berikutnya ditampilkan sebagai **keterangan** ("Next up: More or Less"), bukan
  tombol yang bersaing.
- **Master Round pindah sepenuhnya ke peta** (tekan modul yang sudah selesai), tempat
  bintangnya terlihat dan alasannya dijelaskan.
- Nama modul pindah ke atas sebagai subjudul.
- **Bar kemajuan disembunyikan saat modul sudah dikuasai** — sebelumnya tertulis "1/2"
  tepat di samping "Module mastered!", dua pernyataan yang saling bertentangan.
- **Perayaan tidak lagi menelan ketukan pertama.** Confetti dulu berupa lapisan penuh
  layar yang bisa ditekan, jadi selama 3 detik ketukan pertama anak hanya membuang
  confetti alih-alih menekan tombol yang dituju.

Alurnya sekarang selalu sama: **peta → satu tombol → sesi → hasil → kembali ke peta**,
dan peta selalu menunjukkan langkah berikutnya.

## Ronde 10 — ikon PWA

Ikon lama cuma tanda plus putih di atas indigo: benar secara teknis, tapi tidak ada
hubungannya dengan app yang dilihat anak. Ikon di home screen adalah hal **pertama** yang
dia lihat setiap hari.

Sekarang ikonnya **wajah Gan**, dibuat dari SVG maskot yang sama lewat
`npm run icons` (Chrome yang sudah terpasang, tanpa dependensi grafis). Varian
*maskable* memakai maskot lebih kecil di dalam zona aman, karena Android boleh memotong
ikonnya sampai bentuk lingkaran.

## Ronde 11 — urutan unit di peta

User bertanya: "unit emang sengaja ga berurutan ya?" Jawabannya dua-duanya.

**Sengaja:** unit bentuk, ukur, dan pola memang **disisipkan sebagai jeda** di antara blok
aritmetika, supaya anak tidak mengerjakan 14 modul hitungan berturut-turut. Ini keputusan
Fase 2 dan berdasar riset (latihan berselang lebih baik untuk retensi). Urutan sebenarnya:

```
#1  Unit 1 ×6 → #7  Unit 6 ×2 → #9  Unit 2 ×8 → #17 Unit 8 ×1 → #18 Unit 3 ×4
#22 Unit 7 ×2 → #24 Unit 4 ×6 → #30 Unit 6 ×2 → #32 Unit 5 ×6 → #38 Unit 6 ×1
#39 Unit 7 ×3 → #42 Unit 8 ×2
```

**Bug:** peta mengelompokkan per unit berdasarkan **kemunculan pertama**, sehingga SELURUH
modul Unit 6 ditarik ke posisi ketujuh — padahal tiga di antaranya baru terbuka di #30, #31,
dan #38. Urutan yang dilihat anak jadi tidak sama dengan urutan yang benar-benar dia tempuh,
dan modul terkunci menumpuk jauh sebelum waktunya.

Perbaikan:
- Peta dikelompokkan per **potongan berurutan**, bukan per unit unik. Unit yang kembali muncul
  sebagai bagian tersendiri dengan penanda "· more".
- Angka kemajuan tetap menghitung **seluruh unit** (2/5), bukan potongannya saja — kalau tidak,
  "1/2" di dua tempat untuk unit yang sama justru membingungkan.
- **Test regresi**: urutan node yang dirender harus persis sama dengan path order.
- My Progress (yang mengurutkan unit secara numerik) menjelaskan kenapa peta mencampurnya,
  supaya orang tua tidak mengira urutannya kacau.

## Ronde 12 — audit lanjutan + warna teks yang bermakna

Temuan audit:

| Temuan | Kenapa penting |
|---|---|
| **Teks usang di Parent Area** — masih menyebut tombol dengan nama lamanya ("tap I already know this") | Petunjuk yang menyuruh orang tua mencari tombol yang sudah tidak ada namanya |
| **"Struggling with" menghitung SELURUH kurikulum**, bukan kelas aktif | Kalau nanti Grade 2 ada, orang tua melihat modul dari kelas yang tidak ditempuh anaknya |
| **Gembok emoji di My Progress** sementara peta memakai ikon SVG | Dua bahasa visual untuk arti yang sama |
| **String `startNext` sudah tidak dipakai** sejak CTA menyebut langkah sebenarnya | Sisa yang menyesatkan pembaca kode |
| **Tombol hantu berwarna abu-abu** | Tombol hantu tetap sebuah AKSI; abu-abu membuatnya terbaca sebagai keterangan |

**Ide user: warna teks membedakan jenisnya.** Diterapkan dan dijadikan aturan di
`design-system.md §3b` — empat peran, empat warna:

| Peran | Warna |
|---|---|
| Bisa dikerjakan sekarang | `--c-primary` |
| Sudah selesai | `--c-correct` |
| Minta perhatian, tidak mendesak | `--c-review` |
| Terkunci / tidak aktif | `--c-locked` |

Sebelumnya semua keterangan memakai abu-abu yang sama, jadi "Tap to start" (ajakan),
"Done" (status), dan "Finish the one before" (syarat) terlihat identik — anak harus
membaca satu per satu untuk tahu mana yang bisa ditekan. Aturannya ditulis eksplisit:
**warna hanya untuk makna, tidak pernah untuk hiasan.**

## Ronde 13 — badge, dan lensa B = M·A·T

### Lensa keputusan yang kini dipakai seterusnya

Ditambahkan ke `CLAUDE.md §4b`: setiap keputusan UX diperiksa lewat **B = M·A·T** (Fogg)
plus dua sumbu khas produk ini.

| Sumbu | Pertanyaan |
|---|---|
| **Motivation** | Apakah anak *ingin*? |
| **Ability** | Apakah *mudah dilakukan*? |
| **Trigger** | Apakah *jelas kapan dan apa*? |
| **Nilai pendidikan** | Apakah anak jadi *lebih bisa*? |
| **Retensi** | Apakah *bertahan* dan dia *kembali*? |

Gunanya bukan sekadar rapi: ia memaksa diagnosis sebelum menambal. Contoh nyata dari
proyek ini — anak terjebak mengulang modul **bukan** karena kurang motivasi, tapi karena
**Trigger**-nya salah: tombol utamanya tidak pernah mengarah ke langkah berikutnya.
Kalau waktu itu kami "menambah hadiah", masalahnya tidak akan tersentuh.

### Audit badge

| Temuan | Sumbu yang patah | Perbaikan |
|---|---|---|
| Badge ditaruh **di bawah** progress kelas dan Coming next | Motivation | Badge naik ke paling atas — ini bagian yang paling ingin dilihat anak |
| Tidak ada penanda **badge terbaru** | Motivation | Kartu sorotan "Newest badge" dengan ikon besar dan cara mendapatkannya |
| Anak yang belum punya badge melihat grid abu-abu tanpa arah | Trigger | Kalau belum ada satu pun, yang ditampilkan adalah **badge pertama yang bisa dikejar** |
| Sebelas badge sekaligus membanjiri layar | Ability | Enam dulu, sisanya lewat **"See all 11 badges"**; yang sudah didapat tampil lebih dulu |
| Badge tidak bisa ditekan — hadiah yang tidak bisa dilihat lebih dekat | Motivation + Trigger | Setiap badge membuka lembar: ikon besar, cara mendapatkannya, status. **Badge terkunci pun bisa dibuka** — justru di situ pemicunya |

## Ronde 14 — audit kurikulum setelah Grade 2 lengkap

Dengan 38–43 modul per kelas, panjang konten sendiri jadi masalah usability yang
belum pernah ada saat modulnya baru enam belas.

| Temuan | Sumbu B=MAT | Perbaikan |
|---|---|---|
| **Membuka peta mendarat di bagian yang sudah selesai.** Anak harus menggulir jauh untuk menemukan dirinya | Ability | Peta **selalu terbuka pada posisi anak berada** (`scrollIntoView` pada node berikutnya) |
| **Empat puluh node dalam satu gulungan** membuat yang penting tenggelam | Ability | **Unit yang sudah tuntas dilipat** jadi satu baris "All 6 done"; bisa dibuka lagi. Bagian tempat anak berada tidak pernah dilipat |
| **Kelas aktif tidak terlihat di layar utama** — hanya di Parent Area, di balik gerbang | Trigger | Lencana **G1 / G2** di header peta |
| Navigasi antar kelas hanya lewat Parent Area | — | Dipertahankan: pindah kelas adalah keputusan orang tua yang jarang, dan gerbangnya mencegah anak mengubahnya tidak sengaja. Yang kurang cuma *kejelasan kelas aktif*, dan itu sudah diperbaiki |

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

## Ronde 15 — layar soal tanpa gambar, dan pengecoh yang bisa dicoret gratis

Ditemukan lewat screenshot Grade 3 (`npm run shots -- --from=g3-u2-m8`).

**1. Setengah layar kosong pada soal fakta.**
Soal seperti `8 × 7 = ?` tidak punya gambar, sehingga area soal — yang sengaja
di-*bottom-anchor* supaya mata dan jempol berdekatan — menyisakan ruang kosong
sebesar separuh layar. Terbaca seperti halaman yang gagal dimuat.
*Perbaikan:* Gan tampil besar (190px) di tengah ruang sisa kalau soal tidak punya
gambar, dan Gan kecil di header disembunyikan supaya tidak ada dua Gan sekaligus.
Ekspresinya mengikuti jawaban (happy / encourage), jadi ruang kosong sekarang
membawa umpan balik. Dijaga dua test di `screens.test.tsx`.

**2. Pengecoh berskala salah — kelas kesalahan ketiga kalinya.**
"Round 270 to the nearest hundred" menawarkan **298** dan **302**. Anak yang paham
kata "hundred" bisa mencoret keduanya tanpa berhitung; soalnya jadi menilai
pembacaan, bukan pembulatan. Kesalahan yang sama pernah terjadi pada uang
(Rp12.000 vs Rp12.002) dan sekarang pada ribuan.

*Perbaikan:* `QuestionRule.distractorUnit` — pengecoh `near` dibuat pada jarak
±1, ±2, ±3 **kali** nilai itu. Ditambah aturan lint baru `distractor-scale`: kalau
seluruh jawaban satu aturan adalah kelipatan *g* ≥ 10 sementara `distractorUnit`
lebih kecil, konten ditolak. Aturan itu langsung menemukan **21 aturan bermasalah**
di Grade 2 dan Grade 3 — semuanya sudah diperbaiki. Ini bukan lagi hal yang perlu
diingat saat menulis konten.

**3. `pathOrder.json` bisa melenceng dari registry.**
File itu dipakai `npm run shots -- --from=`; kalau melenceng, seeding-nya salah dan
pemeriksaan visual jadi menyesatkan. Sekarang ada `npm run pathorder` (memuat
`src/content/index.ts` lewat Vite, jadi tidak ada resolver kedua) dan test
`pathOrder.test.ts` yang menjaganya tetap sama.

**4. Screenshot per modul memotret layar yang salah.**
Mode `--from=` masih memakai profil kelas 1, jadi modul kelas 3 dipotret di peta
kelas 1; dan setelah CTA "I already know this" berubah membuka lembar pilihan,
skripnya berhenti di lembar itu, bukan di layar soal. Keduanya diperbaiki.

## Ronde 16 — pilihan yang selalu di tombol yang sama, dan label yang terpotong

**1. Urutan pilihan `choose-text` tidak pernah diacak.**
Generator menulis `q.choices = labels.map((_, i) => i)` — persis urutan penulisan
konten. Untuk aturan yang jawabannya selalu indeks tetap, jawaban benar akan selalu
berada di tombol yang sama; anak bisa lulus tanpa membaca soal. Bahkan pada modul
lama (Halves and Fourths) pilihan "whole" selalu tombol keempat.
*Perbaikan:* urutan tombol diacak lewat RNG sesi. Dijaga test yang memeriksa bahwa
tombol pertama tidak selalu memuat jawaban yang sama.

**2. Label sisi kanan pada persegi panjang terpotong.**
Komponen baru `RectShape` (dibutuhkan Unit 6 — keliling) memakai padding simetris,
padahal label "3 cm" ditulis DI LUAR bangunnya. Ketahuan langsung di screenshot:
yang terbaca cuma "3 (". *Perbaikan:* padding kanan dilebihkan, plus test yang
memeriksa jarak dari tepi kanan bangun ke tepi gambar.

**3. Catatan cakupan kurikulum.**
Rencana Grade 3 menyebut "pecahan pada garis bilangan". Yang tersedia hari ini
adalah garis bilangan berlabel BILANGAN BULAT, jadi modulnya ditulis sebagai
"Parts on a Line" — garisnya dipotong N bagian sama besar dan anak menaruh penanda
di bagian ke-k. Ini representasi yang dipakai Singapore Math sebelum notasi, dan
sah secara pedagogis. Garis bilangan dengan label pecahan (0, 1/4, 1/2, ...) masih
menjadi lubang yang diketahui — butuh `step` dan format label di `NumberLine`.

## Ronde 17 — audit kurikulum setelah Grade 3 lengkap

Diperiksa dengan screenshot pada dua keadaan: kelas 3 baru dibuka (0/40) dan kelas 3
di tengah jalan (24/40).

**Yang sudah bekerja.** Peta membuka tepat di modul yang sedang dikerjakan (bukan di
bagian yang sudah selesai), unit yang tuntas terlipat jadi satu baris ringkasan, satu
CTA utama di bawah yang menyebut namanya sendiri ("Learn: Equal Parts"), dan satu
tautan sekunder untuk melompat. Dengan 40 modul dalam 7 unit, peta tetap bisa dipindai.

**1. Baris ringkasan unit terlipat terlihat bisa ditekan, tapi mati.**
"⭐ All 6 done" digambar sebagai kartu bergaris selebar layar — bentuk yang sama
persis dengan tombol. Satu-satunya kontrol sebenarnya adalah kata "Show" kecil di
kanan atas. Anak akan menekan kartunya lebih dulu dan tidak terjadi apa-apa.
*Perbaikan:* seluruh baris jadi tombol dengan aksi yang sama.

**2. Pil kelas "G3" juga afordansi palsu.**
Berwarna aksen dan berbentuk pil, tapi tidak bisa ditekan — padahal "bagaimana cara
pindah kelas?" adalah pertanyaan pertama orang tua, dan jawabannya (Parent Area)
tidak terhubung dari situ. *Perbaikan:* pil itu sekarang membuka gerbang orang tua.

**3. "Finish the one before to open this" diulang 35 kali.**
Kalimat itu tercetak di bawah SETIAP modul terkunci. Di Grade 1 (6 modul per unit)
itu masih tertahankan; di Grade 3, peta berubah jadi dinding kalimat yang sama dan
justru menutupi hal yang penting. *Perbaikan:* hanya muncul di modul terkunci
PERTAMA — satu-satunya tempat ia menjawab pertanyaan yang sedang ada di kepala anak.
Efek sampingnya satu node lagi muat di layar.

**Yang sengaja tidak diubah.** Penggantian kelas tetap hanya di Parent Area di balik
gerbang: anak tidak boleh bisa berpindah kelas sendiri, karena itu memutus gating
yang jadi inti app ini. Pil G3 memberi JALAN ke sana, bukan pintasannya.

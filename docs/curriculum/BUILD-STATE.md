# Build State — Grade 4–6

File ini adalah **satu-satunya sumber kebenaran** untuk loop pembangunan konten.
Loop tidak boleh bergantung pada ingatan percakapan — semua status ada di sini.

**Aturan:** kerjakan baris **belum tercentang paling atas**. Satu tick = satu baris.
Selesai semua baris → loop berhenti.

Rincian isi tiap unit ada di [`grades-2-6.md`](grades-2-6.md).
Skema modul di [`module-schema.md`](module-schema.md). Pola penulisan: tiru unit
sepadan di `src/content/grade3/`.

---

## Grade 4 — ±40 modul

- [x] `g4-u1` · Big Numbers — s/d 1.000.000, nilai tempat, pembulatan · 5 modul → 5 modul, commit `5686af2`
- [x] `fix-input-limits` · **penghalang g4-u2** — lebar input diturunkan per rule (pagar 6 digit), lint `input-width`, commit `e945cc3`
- [x] `g4-u2` · Multiply & Divide Bigger — 2–3 digit × 1 digit, pembagian panjang awal · 7 modul · ⏱ fact → commit `b6b5e54` (`m3` pakai `speedTargetMs: 9000`, hitung dua langkah)
- [x] `g4-u3` · Factors & Multiples — faktor, kelipatan, prima, KPK & FPB awal · 6 modul → commit `03e19cc` (KPK/FPB dibatasi metode mendaftar, tanpa faktorisasi prima)
- [x] `g4-u4` · Equivalent Fractions — senilai, menyederhanakan, +/− penyebut sama · 7 modul → commit `56a9760`
- [x] `g4-u5` · Decimals Begin — persepuluhan & perseratusan, hubungan dengan pecahan · 5 modul → commit `2a44e12` (perseratusan pakai `array-grid` 10×10, bukan `fraction-shape`)
- [x] `add-angle-visual` · **penghalang g4-u6** — komponen `Angle` + `angleKind()`, commit `ef42c62`
- [x] `g4-u6` · Angles & Area — jenis sudut, mengukur sudut, luas & keliling · 6 modul → commit `8060399`
- [x] `g4-u7` · Data — diagram batang, tabel frekuensi, rata-rata sederhana · 4 modul → commit `927d42b`; rantai prereq G4 diverifikasi utuh (40 modul, hanya `g4-u1-m1` yang `prereq: []`)
- [x] `fix-numberline-step` · `stepFor()` deret 1/2/5×10ⁿ + override `step?`; lint `number-line-step`; commit `178a9f6` — `g3-u1-m5` sembuh tanpa disunting
- [x] `fix-keypad-input` · `answerCaps()` per rule → `allowDecimal`/`allowNegative`; keypad 4 kolom saat perlu; `answer.ts` normalisasi desimal; commit `dae385c`
- [x] `g4-DONE` · ROADMAP + CLAUDE.md diperbarui (`b662e9d`); build 471 KB / **122 KB gzip**; deploy prod `6aa0b69e` ✅

## Grade 5 — ±40 modul

- [x] `g5-u1` · Fraction Operations — +/− penyebut beda, × dan ÷ pecahan · 8 modul → commit `07ad431` (`m3` pakai `step: 1` eksplisit; opsi `choose-text` dicek unik brute-force)
- [x] `g5-u2` · Decimals — operasi desimal, konversi pecahan↔desimal · 6 modul · ⏱ fact → commit `ae60132`; **9 rule jawaban desimal diketik** (bukti `fix-keypad-input` terpakai), `m1`/`m2` override `speedTargetMs`
- [x] `g5-u3` · Percent — persen, hubungan dengan pecahan & desimal, diskon · 5 modul → commit `a8f4c30`; 6 rule ketik desimal, harga Rp10.000–90.000 (jawaban ≤5 digit)
- [x] `g5-u4` · Multiply & Divide Fluently — bilangan besar, pangkat dua & akar · 6 modul · ⏱ fact → commit `a6f245d`; `m1` override 15000 ms, `m4`/`m5` tetap ketat 5000 (hafalan)
- [x] `add-solid-visual` · `Solid3D` + `ShapeNet` + `solids.ts` (aturan murni bersama), commit `894a2b7`
- [x] `g5-u5` · Volume & Measurement — volume kubus & balok, konversi satuan · 6 modul → commit `133a180`; data modul memakai `volumeOf`/`layerOf`/`solidFromDims`, `m4`/`m5` jawaban desimal diketik
- [x] `g5-u6` · Shapes in Space — jaring-jaring, visualisasi spasial · 5 modul → commit `00cff20`; `netLayoutCount` dipakai sebagai variasi, **bukan jawaban** (app gambar 3 jaring kubus, matematika punya 11)
- [x] `g5-u7` · Data & Speed — kecepatan, jarak, waktu; interpretasi data · 4 modul → commit `58f3edf`; rantai prereq G5 diverifikasi utuh (40 modul, hanya `g5-u1-m1` yang `prereq: []`)
- [x] `g5-DONE` · ROADMAP + CLAUDE.md diperbarui (`b5cf52d`); build 552 KB / **137 KB gzip**; deploy prod `6aa0cdaf` ✅

## Grade 6 — ±40 modul

- [ ] `g6-u1` · Integers — bilangan bulat negatif, garis bilangan, operasi · 6 modul · ⏱ fact
- [ ] `g6-u2` · Ratio & Proportion — rasio, skala, perbandingan senilai & berbalik nilai · 7 modul
- [ ] `g6-u3` · Algebra Begins — variabel, persamaan sederhana, pola ×/÷ · 6 modul
- [ ] `g6-u4` · Circles — keliling & luas lingkaran, π · 5 modul
- [ ] `g6-u5` · Solids — volume & luas permukaan bangun ruang · 5 modul
- [ ] `g6-u6` · Coordinates — sistem koordinat, memplot titik & bangun · 4 modul
- [ ] `g6-u7` · Statistics & Chance — mean/median/modus, peluang percobaan acak · 6 modul
- [ ] `g6-DONE` · update `docs/ROADMAP.md` + Status di `CLAUDE.md`

---

## Definition of done per unit

1. Semua modul unit ditulis ke `src/content/grade<N>/u<M>/m<k>-<slug>.ts`.
2. Terdaftar di `src/content/index.ts`: import, `modules` registry, `pathOrder`, `unitTitles`.
3. `npm run pathorder` dijalankan (memperbarui `pathOrder.json`).
4. `npm test` **hijau** (termasuk `lint.ts` konten) dan `npx tsc --noEmit` bersih.
5. `git commit -m "content: g<N>-u<M> <judul unit>"`.
6. Gagal hijau setelah 2 percobaan → **jangan commit**, tulis di Catatan, hentikan loop.

## Batasan yang harus dijaga

- Semua teks yang dilihat anak: **English sederhana**, prompt ≤8 kata (dicek linter).
- `learn` wajib melewati urutan CPA (concrete → pictorial → abstract) kecuali `kind: 'application'`.
- Modul pertama tiap grade `prereq: []` — tiap kelas harus bisa dimasuki langsung.
- `fluencyTracked` = `(kind === 'fact')`.
- Pakai visual yang sudah ada; lihat tabel "Benang merah" di `grades-2-6.md` sebelum
  menambah komponen visual baru.
- Jangan deploy dari dalam loop.

## Catatan

_(diisi loop: unit yang gagal + alasan, atau keputusan yang perlu ditanyakan ke user)_

### Gotcha penulisan konten (dikumpulkan sambil jalan)

- **Jawaban ketik harus bilangan bulat positif.** Lint `input-width` menolak `keypad`/
  `missing-number` yang jawabannya pecahan atau negatif — keypad tidak punya titik desimal
  maupun minus. Siasat yang dipakai `g4-u4`: yang diketik adalah pembilang/penyebut/pengali
  yang hilang; pecahan utuh selalu lewat `choose-text`/`choose-number`/`compare-symbol`.
- **Generator men-dedupe soal** dengan kunci `tipe + teks + visual`. Jadi `choose-text` yang
  teksnya konstan dan tanpa visual akan menyusut jadi **satu** soal dan gagal syarat minimal 8.
  Teks soal harus memuat angkanya (lihat `g4-u4-m5`).
- **`number-line-drop` jangan dipakai untuk rentang lebar** selama bug `step` masih terbuka.

### Utang kualitas kecil (bukan penghalang, menunggu keputusan user)

- **`Solid3D` + `ShapeNet`** (`894a2b7`) — dua komponen terpisah karena prop-nya tidak
  beririsan. `Solid3D {l,w,h,cubes,showDimensions,showVolume,showName,highlightLayer,unit}`
  menggambar balok isometrik dari kubus satuan yang bisa dihitung anak (hanya kubus permukaan,
  urut belakang→depan). `ShapeNet {solid,layout,l,w,h,showName,numberFaces}` menggambar
  bentangan kubus/balok/prisma segitiga/limas/tabung, garis lipat putus-putus vs potong tebal.
  Aturan bersama di `src/components/manipulatives/solids.ts` (murni, tanpa React, pola yang sama
  dengan `angleKind`): `SOLID_NAMES/FACES/EDGES/VERTICES`, `solidFromDims`, `volumeOf`,
  `layerOf`, `surfaceAreaOf`, `netFaces`, `netEdges`, `netLayoutCount`. **Data modul wajib
  mengambil angka dari sini**, jangan menghitung sendiri.
  Dipakai lewat `kind: 'solid'` / `kind: 'net'`.
  Belum bisa: bola & kerucut, luas permukaan bergambar, animasi melipat jaring.

- **`Bars` tidak punya sumbu berangka.** Di `g4-u7` batang mulus hanya bisa dipakai untuk soal
  *perbandingan*; setiap soal yang butuh nilai tepat terpaksa digambar sebagai baris blok
  (`pictogram`) yang bisa dihitung satu-satu. Untuk Grade 5–6 (data & statistik makin banyak)
  sumbu berangka pada `Bars` kemungkinan besar diperlukan.
- **`array-grid` menggambar penanda bulat, bukan kotak.** Di `g4-u6` (luas) teksnya terpaksa
  memakai kata "parts", bukan "squares". Padahal inti gagasan luas justru **menutup bidang
  dengan persegi**. Perbaikannya kecil (mode kotak pada `ArrayGrid`) tapi menyentuh komponen
  yang dipakai banyak modul — belum dikerjakan.

### Komponen visual yang ditambahkan sambil jalan

- **`Angle`** (`src/components/manipulatives/Angle.tsx`, commit `ef42c62`) — props `degrees`,
  `rotate`, `showArc`, `showValue`, `showName`, `showScale` (busur derajat), `size`, `color`.
  Mengekspor `angleKind()` + `ANGLE_NAMES` supaya data modul dan gambarnya memakai satu aturan
  yang sama. Dipakai lewat `kind: 'angle'` pada `LearnVisual` & `QuestionVisual`.
  Belum bisa: sudut yang digeser anak (read-only), penjumlahan sudut satu titik sudut,
  sudut di dalam poligon.

### ~~Keputusan yang akan datang~~ — DIPUTUSKAN 2026-09-09: dua-duanya diperbaiki

User memutuskan kedua penghalang komponen diperbaiki sebelum Grade 5 dimulai, dan menyerahkan
pilihan pendekatannya. Dua baris checklist disisipkan **sebelum `g4-DONE`** supaya deploy Grade 4
sekalian membawa perbaikannya.

**`fix-numberline-step` — pendekatan yang dipilih: step diturunkan otomatis dari rentang,
dengan override eksplisit.** `NumberLine` menghitung sendiri step "bulat" yang enak dibaca
(1 / 2 / 5 / 10 / 25 / 100 … sesuai lebar rentang), dan `QuestionRule`/`LearnVisual` boleh
menimpanya lewat `step` opsional. Alasan memilih ini di atas alternatifnya:
- Menambah `step` wajib di data modul saja → 150+ modul harus disunting, dan tiap modul baru
  bisa lupa mengisinya. Otomatis berarti `g3-u1-m5` sembuh **tanpa menyentuh konten**.
- Toleransi jawaban ("anggap benar kalau dekat") ditolak — itu menyembunyikan soal yang memang
  tidak bisa dijawab, bukan memperbaikinya.
- Override tetap ada karena pecahan & desimal butuh step yang bukan bilangan bulat.
`ticksFor` juga harus ikut step, supaya label tidak lagi jatuh di 3125/6250/9375.

**`fix-keypad-input` — SELESAI (`dae385c`).** Kuncinya: kemunculan tombol diturunkan **per rule**,
bukan per soal — sama seperti `maxDigits`. Kalau per soal, ada-tidaknya tombol minus langsung
membocorkan tanda jawabannya. Termasuk: validasi satu titik desimal, minus hanya di depan,
dan `input-width` dilonggarkan supaya desimal/negatif tidak lagi ditolak. Di luar lingkup:
mengetik pecahan (`3/4`) — itu tetap lewat soal pilihan.



`g5-u2` (operasi desimal), `g5-u3` (persen) dan `g6-u1` (bilangan bulat negatif) adalah unit
yang **inti materinya** justru jawaban desimal/negatif. Dengan keypad sekarang, unit-unit itu
hanya bisa dibangun lewat soal pilihan — bisa jalan, tapi anak tidak pernah menuliskan sendiri
jawaban desimal, padahal itu keterampilannya. Perlu keputusan user sebelum G5 U2:
tambah tombol `.` dan `−` di keypad (plus longgarkan lint), atau terima batasan soal pilihan.

### Bug lama yang ditemukan saat membangun g4-u1 (2026-09-09) — perlu keputusan user

Dua-duanya **bukan** cacat konten Grade 4, tapi cacat komponen yang sudah terlanjur dipakai
Grade 3. Bug 1 sudah diperbaiki di tick tersendiri. Bug 2 masih terbuka.

1. ~~**Keypad maksimal 3 digit.**~~ **SELESAI** (commit `e945cc3`). Lebar input kini diturunkan
   dari jawaban terbesar yang mungkin **per rule** (bukan per soal — kalau per soal, panjang
   kotak membocorkan jawaban), dipagari `MAX_ANSWER_DIGITS = 6`. Lint baru `input-width`
   menolak rule ketik yang jawabannya melebihi kapasitas keypad, **atau negatif/pecahan**
   (keypad tidak punya minus maupun titik desimal) — ini yang akan menjaga g5-u2 desimal dan
   g6-u1 bilangan bulat. Ternyata tidak ada modul yang perlu diubah; `g3-u1-m2` lolos sendiri.

2. ~~**`NumberLine` tidak pernah menerima `step`.**~~ **SELESAI** (commit `178a9f6`).
   `stepFor(min,max)` di `scale.ts` memilih langkah dari deret 1/2/5 × pangkat sepuluh yang
   memberi ±10 selang; `step?` opsional di `QuestionRule`/`LearnVisual` bisa menimpanya.
   `ticksFor` mengalikan step efektif (bukan step 1), `maxTicksFor` menghitung berapa label
   yang muat di 390px. `g3-u1-m5` sembuh **tanpa disunting**; 11 rule `number-line-drop` lain
   kini terjawab tepat dan tampilan semua modul garis bilangan membaik (0–1000 dulu hanya
   berlabel 0 dan 625). Delapan langkah Learn diberi `step` eksplisit.
   Lint baru `number-line-step` menolak target yang tak bisa didaratkan.

Kedua bug ini dulu lolos `npm test` karena linter konten tidak tahu batas UI. Sekarang
masing-masing punya aturan lint penjaganya sendiri: `input-width` dan `number-line-step`.

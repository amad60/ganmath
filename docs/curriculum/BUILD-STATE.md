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
- [ ] `g4-u2` · Multiply & Divide Bigger — 2–3 digit × 1 digit, pembagian panjang awal · 7 modul · ⏱ fact
- [ ] `g4-u3` · Factors & Multiples — faktor, kelipatan, prima, KPK & FPB awal · 6 modul
- [ ] `g4-u4` · Equivalent Fractions — senilai, menyederhanakan, +/− penyebut sama · 7 modul
- [ ] `g4-u5` · Decimals Begin — persepuluhan & perseratusan, hubungan dengan pecahan · 5 modul
- [ ] `g4-u6` · Angles & Area — jenis sudut, mengukur sudut, luas & keliling · 6 modul
- [ ] `g4-u7` · Data — diagram batang, tabel frekuensi, rata-rata sederhana · 4 modul
- [ ] `g4-DONE` · update `docs/ROADMAP.md` + Status di `CLAUDE.md`

## Grade 5 — ±40 modul

- [ ] `g5-u1` · Fraction Operations — +/− penyebut beda, × dan ÷ pecahan · 8 modul
- [ ] `g5-u2` · Decimals — operasi desimal, konversi pecahan↔desimal · 6 modul · ⏱ fact
- [ ] `g5-u3` · Percent — persen, hubungan dengan pecahan & desimal, diskon · 5 modul
- [ ] `g5-u4` · Multiply & Divide Fluently — bilangan besar, pangkat dua & akar · 6 modul · ⏱ fact
- [ ] `g5-u5` · Volume & Measurement — volume kubus & balok, konversi satuan · 6 modul
- [ ] `g5-u6` · Shapes in Space — jaring-jaring, visualisasi spasial · 5 modul
- [ ] `g5-u7` · Data & Speed — kecepatan, jarak, waktu; interpretasi data · 4 modul
- [ ] `g5-DONE` · update `docs/ROADMAP.md` + Status di `CLAUDE.md`

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

### Bug lama yang ditemukan saat membangun g4-u1 (2026-09-09) — perlu keputusan user

Dua-duanya **bukan** cacat konten Grade 4, tapi cacat komponen yang sudah terlanjur dipakai
Grade 3. Bug 1 sudah diperbaiki di tick tersendiri. Bug 2 masih terbuka.

1. ~~**Keypad maksimal 3 digit.**~~ **SELESAI** (commit `e945cc3`). Lebar input kini diturunkan
   dari jawaban terbesar yang mungkin **per rule** (bukan per soal — kalau per soal, panjang
   kotak membocorkan jawaban), dipagari `MAX_ANSWER_DIGITS = 6`. Lint baru `input-width`
   menolak rule ketik yang jawabannya melebihi kapasitas keypad, **atau negatif/pecahan**
   (keypad tidak punya minus maupun titik desimal) — ini yang akan menjaga g5-u2 desimal dan
   g6-u1 bilangan bulat. Ternyata tidak ada modul yang perlu diubah; `g3-u1-m2` lolos sendiri.

2. **`NumberLine` tidak pernah menerima `step`** dari `QuestionScreen`/`LearnScreen` — selalu
   `step = 1`. **MASIH TERBUKA, perlu keputusan user.** Dua akibatnya di `g3-u1-m5` (0–10.000),
   yang **sudah live**: `number-line-drop` tidak bisa dijawab tepat, dan label tick jatuh di
   angka ganjil (3125 / 6250 / 9375) karena `ticksFor` mengalikan step 1 dengan 5.
   → Perbaikannya **tidak sepele**: butuh `step` di `QuestionRule` dan `LearnVisual`, plus
     mengubah tampilan tick pada komponen yang dipakai ratusan modul. Karena itu tidak
     dikerjakan diam-diam oleh loop.
   → Siasat sementara: unit G4 ke atas tidak memakai `number-line-drop` untuk rentang lebar.
     Langkah Learn `drop-on-line` aman (gerbangnya `value >= target`).

Keduanya lolos `npm test` karena linter konten tidak tahu batas UI — **pertimbangkan menambah
aturan lint** yang menolak rule keypad dengan jawaban melebihi `maxLength`.

# Wireframe — 8 Layar v1

Lebar acuan 390px. Semua tombol jawaban berada di zona jempol (sepertiga bawah).

---

## 1. Onboarding (sekali seumur hidup, ≤30 detik)

```
┌───────────────────────────────┐
│                               │
│          [ MASKOT 160 ]       │
│                               │
│         Hi! I am Gan.         │  24/700
│      What is your name?       │  20/700
│                               │
│   ┌───────────────────────┐   │
│   │  ____________         │   │  input, keyboard langsung terbuka
│   └───────────────────────┘   │
│                               │
│   Pick your look:             │
│   ( 🦊 ) ( 🐼 ) ( 🐯 ) ( 🐨 ) │  4 avatar, tap = pilih
│                               │
├───────────────────────────────┤
│      [   Let's go!   ]        │  64px, --c-primary
└───────────────────────────────┘
```
Hanya **2 input**. Tidak ada umur, tidak ada kelas, tidak ada email. Setelah ini langsung ke
modul pertama — bukan ke peta — supaya anak segera mengerjakan sesuatu.

---

## 2. Peta jalur (layar utama)

```
┌───────────────────────────────┐
│ 🔥7   ⭐124   Lv.3       [👤] │  header 56px: streak · XP · level · parent
├───────────────────────────────┤
│  ▓▓▓▓▓▓▓░░░░░  Grade 1  16/43 │  progress grade
├───────────────────────────────┤
│                               │
│         ( ✓ ) Count to 5      │  mastered — emas, ada bintang
│        ⋮                      │
│      ( ✓ ) Count to 10        │
│        ⋮                      │
│    ( ★ ) Read and Write  ⟲    │  ⟲ = perlu review (retak)
│        ⋮                      │
│      (  ●  ) Quick Look       │  ← BERIKUTNYA: besar, berdenyut, warna unit
│        ⋮                      │
│        ( 🔒 ) More or Less    │  terkunci — abu, tidak bisa ditap
│        ⋮                      │
│        ( 🔒 ) Put in Order    │
│                               │
│   ┌─────────────────────────┐ │
│   │ 🏁  Unit 1: Numbers to 10│ │  papan unit, warna unit
│   └─────────────────────────┘ │
├───────────────────────────────┤
│   [  Start: Quick Look  ]     │  tombol lengket — anak tidak perlu mencari
└───────────────────────────────┘
```

Jalur **berkelok vertikal** (zig-zag), scroll otomatis ke node berikutnya saat dibuka.
Node terkunci tetap terlihat (memberi rasa "ada tujuan"), tapi tidak bisa ditekan — ini
konsekuensi langsung dari keputusan gating ketat.

---

## 3. Layar Learn (materi)

```
┌───────────────────────────────┐
│ ✕            ●●○○             │  keluar · langkah 2 dari 4 (CPA)
├───────────────────────────────┤
│                               │
│      Ten makes a full frame.  │  instruksi ≤8 kata, 20/700
│                               │
│   ┌───┬───┬───┬───┬───┐       │
│   │ ● │ ● │ ● │ ● │ ● │       │  ten-frame — objek nyata bisa di-drag
│   ├───┼───┼───┼───┼───┤       │
│   │ ● │ ● │   │   │   │       │
│   └───┴───┴───┴───┴───┘       │
│                               │
│        [MASKOT] ← menunjuk    │
│                               │
│      Tap to add one more.     │  aksi yang diminta
├───────────────────────────────┤
│        [    Next    ]         │  aktif hanya setelah anak beraksi
└───────────────────────────────┘
```

Tombol `Next` **tidak aktif sampai anak melakukan aksinya** — ini yang membedakan Learn dari
slide pasif. Tiga titik langkah = tiga tahap CPA (concrete → pictorial → abstract).

---

## 4. Layar Practice (dengan hint)

```
┌───────────────────────────────┐
│ ✕      ▓▓▓▓░░░░░░  4/10       │  progress sesi
├───────────────────────────────┤
│                               │
│           7 + 3 = ?           │  56/900
│                               │
│   ┌───┬───┬───┬───┬───┐       │
│   │ ● │ ● │ ● │ ● │ ● │       │  visual pendamping (boleh dimatikan
│   ├───┼───┼───┼───┼───┤       │  di modul lanjut)
│   │ ● │ ● │   │   │   │       │
│   └───┴───┴───┴───┴───┘       │
│                               │
│          [ 💡 Hint ]          │  hint berjenjang: arah → alat → demo
├───────────────────────────────┤
│   [   9   ]     [   10  ]     │  64px, 40/900
│   [   11  ]     [   8   ]     │
└───────────────────────────────┘
```

Salah → tombol jadi oranye + ikon ↻, visual **menunjukkan jawabannya** (ten-frame terisi),
maskot `encourage`. Soal yang salah masuk antrean untuk diulang di akhir sesi yang sama.

---

## 5. Layar Mastery Check (kuis)

Sama dengan Practice, dengan tiga perbedaan yang harus terlihat jelas oleh anak:

```
┌───────────────────────────────┐
│ ✕   ⭐ MASTERY CHECK   6/10   │  header emas — terasa "ujian" tapi ramah
├───────────────────────────────┤
│           8 + 5 = ?           │
│                               │  ← TIDAK ada visual pendamping
│                               │  ← TIDAK ada tombol Hint
├───────────────────────────────┤
│   [   12  ]     [   13  ]     │
│   [   14  ]     [   3   ]     │  pengecoh: near & miskonsepsi
└───────────────────────────────┘
```
Waktu diukur diam-diam (`thinkMs` & `totalMs`). **Tidak ada timer yang terlihat** — sesuai
keputusan "kecepatan diukur diam-diam".

---

## 6. Hasil sesi

```
┌───────────────────────────────┐
│         [MASKOT celebrate]    │
│                               │
│        ⭐ ⭐ ☆                │  bintang membesar satu per satu
│                               │
│         Nice work!            │
│                               │
│   ┌─────────────────────────┐ │
│   │ Correct      9 / 10     │ │
│   │ Speed        4.1s       │ │
│   │ XP           +45        │ │
│   └─────────────────────────┘ │
│                               │
│   ▓▓▓▓▓▓▓▓░░  Module 80%     │  progress menuju mastered
│   One more good round to      │
│   master this!                │  ← kalimat arah, bukan vonis
├───────────────────────────────┤
│   [   Continue   ]            │
│   [ Try again ]               │  hanya muncul kalau belum lulus
└───────────────────────────────┘
```

Kalau **belum lulus**, layar ini tidak pernah menulis "Failed". Yang ditulis adalah **jarak menuju
lulus** dan tombol untuk mengulang. Confetti ≤3 detik dan bisa di-tap untuk dilewati (aturan 80/20).

---

## 7. Badge & progress

```
┌───────────────────────────────┐
│ ←         My Badges           │
├───────────────────────────────┤
│  🏅   🏅   🏅   🔒   🔒       │  didapat berwarna, belum abu
│  First Module Gold  ?     ?   │
│  Step  Master Brain           │
│                               │
│  ▓▓▓▓▓▓▓░░░░░  Grade 1        │
│  16 / 43 modules              │
│                               │
│  Unit 1  ▓▓▓▓▓▓▓▓▓▓  6/6  ✓  │
│  Unit 2  ▓▓▓▓░░░░░░  3/8      │
│  Unit 3  ░░░░░░░░░░  0/4  🔒  │
│                               │
│  🔥 Streak 7 days             │
│     Best ever: 12 days        │  rekor ditampilkan sebagai pencapaian
└───────────────────────────────┘
```
Badge terkunci **ditampilkan sebagai siluet dengan tanda tanya** — memberi target tanpa
membocorkan kejutannya.

---

## 8. Parent Area (dijaga gerbang)

Gerbang: tekan lama ikon 👤 selama 2 detik → soal perkalian dewasa (`17 × 4 = ?`, ketik).

```
┌───────────────────────────────┐
│ ←        Parent Area          │
├───────────────────────────────┤
│  This week                    │
│  ▓▓▓▓▓░░  5 sessions · 38 min │
│                               │
│  Mastered      16 modules     │
│  Needs review   2 modules     │
│                               │
│  Struggling with:             │
│  • Bonds of 10   (62% correct)│  ← diagnosis, bukan sekadar angka
│  • Take Away 5   (71% correct)│
│                               │
│  ── Settings ──────────────── │
│  Sound              [ ON  ]   │
│  Reduce motion      [ OFF ]   │
│  Mastery threshold  [ 80% ▾]  │
│  Daily reminder     [ OFF ]   │
│                               │
│  ── Progress backup ───────── │
│  [  Save to file  ]           │
│  [  Load from file  ]         │
│  Last backup: 3 days ago      │
│                               │
│  [  Reset progress  ]         │  satu-satunya elemen MERAH di app
└───────────────────────────────┘
```

**Jawaban untuk open question #16 (batas waktu harian):** tidak ada penguncian app. Yang
disediakan hanya `Daily reminder` (notifikasi PWA opsional, default OFF). Alasannya: app ini
sudah membatasi dirinya sendiri — sesi 5–10 menit dan maksimal 2 modul review/hari. Mengunci app
saat anak sedang **mau** belajar matematika adalah hukuman untuk perilaku yang justru kita
inginkan.

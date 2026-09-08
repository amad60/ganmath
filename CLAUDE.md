# CLAUDE.md — GanMath

Dokumen ini adalah **sumber kebenaran utama** untuk proyek di folder `learn math`.
Semua kode, materi, aset, dan dokumen proyek **wajib** disimpan di dalam folder ini.
Baca file ini lebih dulu sebelum mengerjakan task apa pun di proyek ini.

**Nama app: GanMath.**
Status: **Fase 2 (Rancang kurikulum) selesai** — hasil di `docs/research/` & `docs/curriculum/`.
Berikutnya Fase 3 (desain).
Terakhir diperbarui: 2026-09-08

---

## 1. Visi Satu Kalimat

Web mobile app belajar matematika SD (kelas 1–6) bergaya **Duolingo**: anak belajar sendiri
dari materi yang bisa dibaca dan dipahami mandiri, lalu diuji, dan **hanya boleh lanjut ke modul
berikutnya kalau benar-benar menguasai** — bukan sekadar lulus sekali.

## 2. Pengguna

- **Pengguna utama:** anak usia 6 tahun (mulai kelas 1 SD), akan tumbuh memakai app ini sampai
  kelas 6. App harus bertahan lintas usia 6–12 tahun.
- **Pengguna sekunder:** orang tua — sesekali melihat progress, tidak mendampingi terus-menerus.
- **Konteks pakai:** HP pribadi, sesi pendek, sendirian, **minim guidance orang dewasa**.
- **Kemampuan awal:** anak **sudah lancar membaca** dan **sudah bisa berhitung sampai 100**.
  Tetap dimulai dari modul paling awal (tidak ada tes penempatan) — lihat §7.

### Konsekuensi desain
- Teks boleh jadi kanal utama penyampaian materi; konsep *self-read* memang layak.
- Kalimat pendek dan konkret; satu ide per layar. Lancar membaca ≠ membaca cepat.
- Font besar, kontras tinggi, target tap minimal 44×44px.
- Teks selalu didampingi visual/animasi yang menunjukkan maksudnya, bukan hiasan.
- Tidak ada menu bertingkat, tidak ada form, tidak ada mengetik panjang. Aksi utama = tap, drag,
  pilih dari opsi visual; input angka lewat keypad besar di layar.
- Narasi audio = **opsional / nice-to-have**, ditinjau lagi kalau materi mulai padat.

## 3. Bahasa

- **Bahasa antarmuka dan materi: Bahasa Inggris.** (Keputusan user.)
- Level bahasa: **English sederhana untuk pembaca pemula** — kalimat 3–8 kata, kosakata dasar,
  istilah matematika diperkenalkan pelan-pelan dengan gambar pendamping
  (mis. "add" selalu muncul bersama ikon `+` dan objek yang digabung).
- Semua string ditaruh di satu tempat (bukan disebar di komponen) supaya bisa ditambah
  Bahasa Indonesia nanti kalau ternyata perlu.
- **Catatan risiko:** kelancaran membaca dalam Bahasa Indonesia belum tentu setara dalam Bahasa
  Inggris. Kalau di uji coba anak terlihat tersendat membaca instruksi, dua penawarnya sudah
  disiapkan: (a) aktifkan narasi audio/TTS, atau (b) tambahkan Bahasa Indonesia sebagai bahasa
  kedua. Arsitektur teks harus siap untuk keduanya sejak awal.

## 4. Prinsip Produk (jangan dilanggar)

1. **Self-learning.** Setiap konsep diajarkan lebih dulu di dalam app (mode Learn), baru diuji.
   Tidak pernah ada kuis tentang materi yang belum diajarkan.
2. **Mastery-based, bukan completion-based.** Lanjut hanya kalau lulus ambang penguasaan.
3. **"Di luar kepala".** Untuk fakta dasar, penguasaan diukur juga dari **kecepatan &
   konsistensi**, bukan cuma benar/salah. Detail di §6.
4. **Reward loop yang bikin balik lagi.** Setiap sesi selesai harus terasa memuaskan.
5. **Minim guidance.** Anak bisa buka app dan tahu harus ngapain tanpa dijelaskan orang tua.
6. **Sesi pendek.** Satu sesi **minimal 5 menit**, ideal 5–10 menit. Jangan ada layar lama
   tanpa interaksi.
7. **Gagal itu aman.** Tidak ada skor merah. Salah = coba lagi dengan petunjuk visual.
8. **Offline-first.** Harus jalan tanpa internet setelah dibuka sekali.

## 5. Struktur Konten

```
Grade (1–6)
└── Unit / Bab            (mis. "Numbers to 20")
    └── Module            (unit belajar terkecil yang bisa dikunci/dibuka)
        ├── Learn         (1–4 layar konsep, interaktif, self-read)
        ├── Practice      (soal berpemandu, boleh salah, ada hint)
        └── Mastery Check (kuis, menentukan lulus/tidak)
```

- **Module** adalah unit gating. Terkunci sampai modul prasyaratnya dikuasai.
- Peta belajar berbentuk **jalur/path** ala Duolingo: node berurutan.
- Naik grade hanya kalau seluruh modul wajib di grade itu sudah dikuasai.
- Materi disimpan sebagai **data (JSON/TS), bukan hardcoded di komponen**. Satu modul =
  satu file data berisi konten belajar + aturan/bank soal.

### Acuan kurikulum
**Kurikulum Merdeka (SD Indonesia) sebagai rangka utama, dikombinasikan dengan acuan
internasional** (Common Core / Singapore Math) untuk urutan konsep dan tipe soal.
Kalau ada silabus dari sekolah anak, itu jadi acuan pelengkap.

Garis besar (dirinci di Fase 1–2):
- **Grade 1:** numbers to 20 lalu 100, counting, addition & subtraction dasar, shapes,
  comparison, pengenalan time & money.
- **Grade 2:** place value, +/- sampai 100 dengan menyimpan/meminjam, pengenalan multiplication,
  measurement, time.
- **Grade 3:** multiplication & division, pecahan sederhana, perimeter, faktor/kelipatan awal.
- **Grade 4:** operasi bilangan besar, equivalent fractions, factors & multiples, angles, area.
- **Grade 5:** operasi pecahan, decimals, percent, volume, speed.
- **Grade 6:** integers, ratio & proportion, statistika sederhana, circles, coordinates.

## 6. Aturan Penguasaan (Mastery) — inti produk

Sebuah modul **dikuasai** kalau memenuhi akurasi, konsistensi, kecepatan, dan cakupan.
**Ambang dinaikkan bertahap per grade** — awal ramah supaya anak tidak patah semangat,
makin tinggi grade makin ketat menuju benar-benar otomatis.

| Grade | Akurasi kuis | Konsistensi | Kecepatan (soal hafalan) |
|---|---|---|---|
| 1 | ≥ 80% | 2 sesi lulus, boleh di hari yang sama | ≤ 8 detik/soal |
| 2 | ≥ 85% | 2 sesi lulus, beda hari | ≤ 7 detik/soal |
| 3 | ≥ 85% | 2 sesi lulus, beda hari | ≤ 6 detik/soal |
| 4 | ≥ 90% | 2 sesi lulus, beda hari | ≤ 5 detik/soal |
| 5 | ≥ 90% | 2 sesi lulus, beda hari | ≤ 5 detik/soal |
| 6 | ≥ 90% | 3 sesi lulus, beda hari | ≤ 4 detik/soal |

Berlaku di semua grade:
- **Cakupan:** semua sub-tipe soal dalam modul pernah muncul dan pernah dijawab benar.
- Ambang kecepatan hanya untuk modul bertipe **fakta hafalan** (mis. 7+5, 6×8). Modul bertipe
  **penalaran** (word problem, geometri, pemecahan masalah) tidak dinilai kecepatannya.
- Angka di atas adalah default; bisa disetel per modul di data konten, dan bisa diubah orang tua.
- **Retensi / spaced repetition.** Modul yang sudah dikuasai muncul lagi sebagai sesi
  "Quick Review" setelah ~3 hari, ~1 minggu, ~1 bulan. Gagal review → status jadi `needs_review`
  (tidak mengunci ulang modul berikutnya, tapi memunculkan pengingat).
- **Kalau gagal:** app tidak bilang "gagal". App mengarahkan balik ke bagian materi yang salah,
  lalu tawarkan coba lagi. Tidak ada batas jumlah percobaan.
- **Anti-tebak:** soal digenerate dari aturan/bank secara acak, bukan set tetap.
- **Status modul:** `locked` → `available` → `learning` → `practiced` → `mastered` → `needs_review`.

## 7. Gating & Anti-Macet

- **Keputusan user: gating ketat.** Kalau anak belum menguasai sebuah modul, dia **ditahan di
  modul itu** — tidak ada jalur alternatif untuk melompatinya.
- **Tidak ada tes penempatan.** Anak mulai dari modul pertama Grade 1 meski sudah bisa berhitung
  sampai 100.
- Karena dua hal di atas, dua hal ini jadi wajib supaya tidak membosankan / tidak frustrasi:
  1. **Modul awal harus bisa cepat selesai.** Kalau anak langsung benar semua dengan cepat,
     sesi selesai lebih pendek dan bintangnya penuh — jangan paksa jumlah soal tetap.
  2. **Setelah 2–3 kali gagal berturut-turut di modul yang sama**, app mengubah pendekatan:
     kembali ke materi dengan penjelasan alternatif, soal dipermudah dulu (scaffolding), dan
     nada maskot berubah jadi menyemangati. Menahan ≠ mengulang hal yang sama persis.

## 8. Gamifikasi & Reward

- **Stars** per modul (1–3, dari akurasi + kecepatan).
- **XP** per sesi; level pemain naik dari akumulasi XP.
- **Badges** untuk pencapaian: modul dikuasai, unit selesai, grade selesai, streak, perfect
  session, fast thinker, dsb.
- **Daily streak** yang ramah anak: tidak menghakimi kalau putus, ada "freeze".
- **Progress bar** di tiga level: dalam sesi, per modul, per grade.
- **Rayakan kemenangan:** confetti, suara, maskot bereaksi.
- Hindari mekanik menekan: tidak ada hearts/nyawa yang menghentikan belajar, tidak ada
  leaderboard kompetitif, tidak ada timer menakutkan (kecepatan diukur diam-diam).

## 9. Animasi & Interaksi

- Animasi **sederhana, cepat (150–400ms), bermakna** — menjelaskan, bukan pamer.
- Wajib: feedback benar/salah instan, transisi antar soal, objek yang bisa di-tap/drag, angka
  bergerak di number line, progress bar mengisi, perayaan akhir sesi.
- **Maskot** sebagai pemandu, karakter tetap sepanjang app.
- Target 60fps di HP kelas menengah. Prefer CSS transform/opacity + SVG.
- Hormati `prefers-reduced-motion`.

## 10. Target Perangkat

- **Poco F3 (Android, Chrome)** — 6.67", viewport ±393×873 CSS px, refresh 120Hz.
- **iPhone 17 (iOS, Safari)** — 6.3", viewport ±402×874 CSS px, ada Dynamic Island.
- Desain acuan: **lebar 390–430px, portrait**, layar tinggi (rasio ±19.5–20:9). Harus tetap rapi
  di tablet, tapi bukan prioritas.
- Wajib: `viewport-fit=cover` + `env(safe-area-inset-*)`, tanpa horizontal scroll, tombol utama
  dalam jangkauan jempol (sepertiga bawah layar).
- **Peringatan khusus iOS:** Safari bisa menghapus localStorage situs yang tidak dibuka
  ±7 hari. Penawarnya: (a) dorong anak **Add to Home Screen** (PWA terinstal jauh lebih aman),
  dan (b) backup file — lihat §11.

## 11. Batasan Teknis

- **Web mobile app** (bukan native), mobile-first, portrait.
- **Tanpa database, tanpa backend, tanpa login.** Semua state di **localStorage**.
- **PWA**: installable ke home screen, jalan offline.
- Tidak mengumpulkan data pribadi anak. Tidak ada iklan. Tidak ada tracking pihak ketiga.

### Backup progress (wajib di v1)
- **Save to file** di Parent Area → unduh `ganmath-progress-YYYY-MM-DD.json`.
- **Load from file** → pilih file, app validasi `schemaVersion`, konfirmasi kalau akan menimpa
  progress yang ada, lalu pulihkan.
- **Pengingat backup otomatis** setiap satu grade selesai atau tiap ~2 minggu pemakaian.
- File export lama harus tetap bisa diimpor versi app yang lebih baru → semua penulisan state
  **versioned + migratable**.
- Satu profil anak cukup untuk v1, tapi struktur data disiapkan untuk multi-profil.

### Sketsa data progress (indikatif, difinalkan di Fase 4)
```jsonc
{
  "schemaVersion": 1,
  "profile": { "name": "...", "avatar": "...", "createdAt": "..." },
  "xp": 0, "level": 1,
  "streak": { "current": 0, "best": 0, "lastActiveDate": "YYYY-MM-DD", "freezes": 0 },
  "badges": ["first-lesson"],
  "modules": {
    "g1-u1-m1": {
      "status": "mastered",
      "stars": 3,
      "attempts": [ { "date": "...", "accuracy": 0.95, "avgMs": 3200, "passed": true } ],
      "masteredAt": "...",
      "nextReviewAt": "...",
      "skillStats": { "add-within-10": { "seen": 40, "correct": 38, "avgMs": 2900 } }
    }
  },
  "settings": { "sound": true, "music": false, "reducedMotion": false }
}
```

### Stack (keputusan saya, user menyerahkan pilihan — difinalkan di Fase 4)
- **Vite + React + TypeScript** — konten 6 grade akan besar; tipe & komponen menahan kekacauan
  jangka panjang jauh lebih baik daripada vanilla JS.
- **Tailwind CSS** untuk styling cepat dan konsisten.
- **Motion (framer-motion)** untuk animasi deklaratif; fallback ke CSS transition untuk yang
  sederhana.
- **Zustand** untuk state + persist ke localStorage (kecil, tanpa boilerplate).
- **vite-plugin-pwa** untuk service worker & offline.
- Aturan: setiap dependensi baru harus dibenarkan; target bundle awal < 200KB gzip.

### Deployment
- Deploy sebagai **situs statis ke Netlify**, akun pribadi user (`rahmad.id60@gmail.com`).
  Deploy dilakukan **oleh user sendiri**, bukan otomatis dari sesi ini.
- Sediakan `netlify.toml` (build command, publish dir, SPA redirect) supaya sekali klik jadi.
- Link bersifat privat (tidak dibagikan/diindeks); tidak ada data sensitif di sisi server karena
  memang tidak ada server.

## 12. Parent Area

Terpisah dan terlindungi (gerbang sederhana, mis. tekan lama + soal perkalian dewasa):
ringkasan progress per grade/modul, topik yang sering salah, waktu belajar, atur ambang
penguasaan, export/import/reset progress.

## 13. Non-Goals (v1)

- Bukan aplikasi multi-user / kelas / guru.
- Tidak ada akun, cloud sync, atau server.
- Tidak ada word problem panjang di grade awal.
- Tidak ada monetisasi, iklan, atau analitik.
- Tidak generate soal via AI saat runtime (harus offline & deterministik).

## 14. Konvensi Folder

```
learn math/
├── CLAUDE.md              ← file ini, arahan utama
├── docs/
│   ├── ROADMAP.md         ← tahapan kerja & status
│   ├── OPEN-QUESTIONS.md  ← keputusan user (terjawab & belum)
│   ├── research/          ← ✅ Fase 1: riset kurikulum, pedagogi, mastery, app sejenis
│   ├── curriculum/        ← ✅ Fase 2: skema modul, Grade 1 lengkap, peta Grade 2–6
│   └── design/            ← Fase 3: sistem desain, wireframe, maskot
├── src/                   ← kode aplikasi (Fase 5)
└── content/               ← data materi & bank soal per modul
```

Aturan: **tidak ada file proyek ini yang ditaruh di luar folder `learn math`.**

## 15. Cara Kerja Claude di Repo Ini

- Baca `CLAUDE.md` + `docs/ROADMAP.md` sebelum mulai task.
- Jangan mulai menulis kode sebelum diminta; ikuti urutan fase di roadmap.
- Setiap keputusan besar dicatat ke dokumen di `docs/` atau file ini, bukan hanya di percakapan.
- Pertanyaan yang mengubah arah produk → tulis ke `docs/OPEN-QUESTIONS.md` dan tanyakan;
  jangan diam-diam berasumsi.
- Update "Status" di atas dan `docs/ROADMAP.md` setiap fase selesai.
- Semua teks yang dilihat anak ditulis dalam **English sederhana**; dokumen internal boleh
  Bahasa Indonesia.

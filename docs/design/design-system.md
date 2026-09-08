# Sistem Desain GanMath

Target: **portrait 390–430px**, Poco F3 (Chrome) & iPhone 17 (Safari). Semua nilai di sini adalah
token yang langsung dipakai di Tailwind config saat Fase 5.

## 1. Prinsip visual

1. **Tenang, bukan ramai.** Layar soal hampir kosong: satu pertanyaan, satu visual, tombol jawaban.
   Warna cerah dipakai untuk *aksi dan hadiah*, bukan untuk latar.
2. **Warna punya makna tetap.** Satu warna = satu arti di seluruh app, tidak pernah dipakai
   sebagai dekorasi.
3. **Besar itu wajib, bukan gaya.** Teks ≥18px, angka ≥40px, target tap ≥56px.
4. **Tidak ada merah alarm.** Lihat §3.
5. Latar layar belajar selalu netral supaya manipulatif (blok, ten-frame) jadi objek paling
   menonjol di layar.

## 2. Token warna

Semua warna didefinisikan di `:root` (light), lalu di-override untuk dark. Kontras teks utama
terhadap latar **minimal 7:1** (AAA) — anak sering memakai HP di kondisi terang.

```css
:root {
  /* dasar */
  --c-bg:            #F7F6F2;   /* off-white hangat, bukan putih menyilaukan */
  --c-surface:       #FFFFFF;
  --c-surface-sunk:  #EDEBE4;
  --c-ink:           #1F2430;   /* teks utama, 13.8:1 di atas --c-bg */
  --c-ink-soft:      #5A6273;
  --c-line:          #DFDCD3;

  /* aksi & progres */
  --c-primary:       #4C5BD4;   /* tombol utama, progress bar terisi */
  --c-primary-ink:   #FFFFFF;
  --c-primary-soft:  #E5E7FB;

  /* umpan balik — lihat §3 */
  --c-correct:       #2E9E6B;
  --c-correct-soft:  #DFF3E9;
  --c-retry:         #E8952F;   /* "coba lagi", BUKAN merah */
  --c-retry-soft:    #FDF0DE;

  /* hadiah */
  --c-star:          #F2B90C;
  --c-badge:         #C77DFF;
  --c-streak:        #FF7A45;

  /* status modul di peta */
  --c-locked:        #C9C6BE;
  --c-available:     var(--c-primary);
  --c-mastered:      var(--c-star);
  --c-review:        #7CA3E8;   /* modul "retak", minta diulang */
}

:root:not([data-theme="light"]) { /* dark, mengikuti prefers-color-scheme */
  --c-bg: #171A21; --c-surface: #212633; --c-surface-sunk: #12151B;
  --c-ink: #F2F3F7; --c-ink-soft: #A7AEBF; --c-line: #333A4A;
  --c-primary: #8B95F0; --c-primary-ink: #14161C; --c-primary-soft: #2A3050;
  --c-correct: #56C596; --c-correct-soft: #1D3A2F;
  --c-retry: #F0AC5C;  --c-retry-soft: #3A2E1C;
  --c-locked: #4A5060;
}
```

### Warna unit (peta Grade 1)
Tiap unit punya satu hue supaya anak melihat kemajuan sebagai perjalanan melewati "daerah" berbeda.

| Unit | Hue | Unit | Hue |
|---|---|---|---|
| U1 Numbers to 10 | `#4C9BD4` biru | U5 Numbers to 100 | `#4C5BD4` indigo |
| U2 Add & Subtract 10 | `#2E9E6B` hijau | U6 Shapes | `#C77DFF` ungu |
| U3 Numbers to 20 | `#E8952F` oranye | U7 Measure & Time | `#3FA9A0` teal |
| U4 Add & Subtract 20 | `#D4574C` batu bata | U8 Patterns & Data | `#8A7CE8` lavender |

## 3. Aturan warna umpan balik (keputusan penting)

**Tidak ada merah menyala di seluruh app.** Jawaban salah memakai **oranye `--c-retry`** dengan
label "Try again", bukan merah dengan label "Wrong".

Alasannya bukan estetika: prinsip produk kita adalah *gagal itu aman* dan gating-nya ketat — anak
akan sering salah, dan sering melihat warna alarm merah akan mengubah rasa app dari "aku sedang
belajar" jadi "aku sedang dinilai". Merah hanya dipakai di **Parent Area** (tombol Reset Progress),
tempat peringatan memang diperlukan.

| Kejadian | Warna | Ikon | Suara | Getar |
|---|---|---|---|---|
| Benar | `--c-correct` | ✓ | naik pendek | ringan 10ms |
| Salah | `--c-retry` | ↻ | netral, **bukan** buzzer | — |
| Modul dikuasai | `--c-star` | ⭐ | fanfare pendek | pola 3 ketuk |
| Badge baru | `--c-badge` | 🏅 | fanfare | pola 3 ketuk |

## 3b. Warna teks menyatakan JENISNYA

Teks kecil di app ini punya empat peran, dan warnanya membedakannya. Sebelum aturan ini,
semua keterangan memakai abu-abu yang sama — "Tap to start" (ajakan), "Done" (status), dan
"Finish the one before" (syarat) terlihat identik, jadi anak harus membacanya satu per satu
untuk tahu mana yang bisa ditekan.

| Peran | Warna | Contoh |
|---|---|---|
| **Bisa dikerjakan sekarang** | `--c-primary` | "Tap to start", seluruh tombol hantu |
| **Sudah selesai** | `--c-correct` | "Done · tap to practise again", "Module mastered!" |
| **Minta perhatian, tidak mendesak** | `--c-review` | "Time to remember · tap" |
| **Terkunci / tidak aktif** | `--c-locked` | "Finish the one before to open this" |
| Keterangan netral | `--c-ink-soft` | nama unit, label statistik |

Aturan: **warna hanya dipakai untuk makna, tidak pernah untuk hiasan.** Kalau sebuah teks
tidak masuk salah satu peran di atas, dia netral.

## 4. Tipografi

- **Satu keluarga: Nunito** (400 / 700 / 900). Rounded, terbaca, angka jelas.
- **Di-host sendiri** (`woff2`, subset Latin + angka), **bukan dari Google Fonts CDN** — app harus
  jalan offline sebagai PWA.
- Fallback: `ui-rounded, "SF Pro Rounded", system-ui, sans-serif`.

| Peran | Ukuran | Berat | Catatan |
|---|---|---|---|
| Angka soal | 56px | 900 | angka besar = fokus layar |
| Angka di tombol jawaban | 40px | 900 | |
| Judul layar / modul | 24px | 700 | |
| Instruksi | 20px | 700 | maksimal 8 kata (aturan konten) |
| Teks materi (Learn) | 18px | 400 | line-height 1.6 |
| Label kecil, XP, meta | 15px | 700 | |

Aturan: **jangan pernah di bawah 15px**, dan jangan pakai huruf kapital semua untuk kata yang
harus dibaca anak (kapital semua memperlambat pembaca pemula).

## 5. Spasi, radius, elevasi

```
spacing: 4 · 8 · 12 · 16 · 24 · 32 · 48
radius:  sm 12 · md 20 · lg 28 · pill 999
shadow:  card  0 2px 0 rgba(0,0,0,.06), 0 8px 24px rgba(31,36,48,.08)
         press 0 1px 0 rgba(0,0,0,.10)            /* tombol saat ditekan */
```

**Tombol bergaya "tebal 3D"** (garis bawah gelap 4px yang hilang saat ditekan) — memberi umpan
balik sentuh yang jelas tanpa animasi mahal, dan terasa mainan, bukan formulir.

## 6. Layout & area aman

```
┌─ status bar HP ─────────────┐
│ safe-area-inset-top         │
├─────────────────────────────┤
│ Header 56px (progress/exit) │
├─────────────────────────────┤
│                             │
│  Konten — padding 20px      │
│  (visual + pertanyaan)      │
│                             │
├─────────────────────────────┤
│ Zona jempol 200px           │  ← semua tombol jawaban di sini
│ (tombol jawaban / lanjut)   │
├─────────────────────────────┤
│ safe-area-inset-bottom      │
└─────────────────────────────┘
```

- `viewport-fit=cover` + `env(safe-area-inset-*)` wajib (Dynamic Island iPhone 17).
- Semua tombol jawaban berada di **sepertiga bawah layar** — dalam jangkauan jempol anak.
- Tinggi tombol jawaban **64px**, jarak antar tombol **12px** (mencegah salah tekan).
- **Tidak boleh ada scroll horizontal.** Visual lebar (number line 0–100) di-scroll di dalam
  containernya sendiri.
- Orientasi dikunci portrait.

## 7. Aksesibilitas
- Kontras teks utama ≥7:1, teks besar ≥4.5:1.
- **Warna tidak pernah jadi satu-satunya penanda**: benar/salah selalu punya ikon + gerakan.
- Dukung `prefers-reduced-motion` (lihat `animation.md`).
- Dukung ukuran font sistem sampai 130% tanpa layout pecah.
- Semua elemen interaktif punya `aria-label` English yang sama dengan teks terlihat.

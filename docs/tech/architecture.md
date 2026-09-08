# Arsitektur GanMath

## 1. Stack final

| Lapis | Pilihan | Alasan |
|---|---|---|
| Build | **Vite 6** | dev cepat, output statis untuk Netlify |
| UI | **React 19 + TypeScript** | konten 6 grade akan besar; tipe menahan kekacauan |
| Styling | **Tailwind CSS 4** | token desain jadi utility; tidak ada CSS yatim |
| Animasi | **Motion** (framer-motion) | animasi deklaratif; CSS transition untuk yang sederhana |
| State | **Zustand + persist** | kecil, tanpa boilerplate, middleware persist langsung ke localStorage |
| PWA | **vite-plugin-pwa** (Workbox) | service worker & offline |
| Test | **Vitest** | engine adalah fungsi murni — murah diuji |
| Routing | **tidak ada library** | lihat §3 |

Anggaran: **bundle awal < 200KB gzip**. Setiap dependensi baru harus dibenarkan tertulis di sini.

## 2. Struktur folder

```
learn math/
├── index.html
├── vite.config.ts
├── netlify.toml
├── scripts/
│   └── lint-content.ts        # linter konten, jalan di `npm run build`
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx            # mesin state layar (§3)
│   │   └── screens/           # 8 layar dari docs/design/wireframes.md
│   ├── components/
│   │   ├── ui/                # Button, ProgressBar, Card, Keypad, StarRow …
│   │   ├── manipulatives/     # ★ 17 komponen visual — aset terbesar app
│   │   └── mascot/            # Mascot.tsx + peta ekspresi
│   ├── engine/
│   │   ├── rng.ts             # PRNG berseed
│   │   ├── generator.ts       # aturan soal → soal konkret
│   │   ├── session.ts         # runner satu sesi
│   │   ├── mastery.ts         # evaluator penguasaan (fungsi murni)
│   │   ├── review.ts          # penjadwal spaced repetition
│   │   └── unlock.ts          # gating & path order
│   ├── store/
│   │   ├── progress.ts        # Zustand + persist
│   │   └── migrations.ts      # v1 → v2 → …
│   ├── content/
│   │   ├── grade1/u1/*.ts     # satu file per modul
│   │   └── index.ts           # registry modul + path order
│   ├── i18n/en.ts             # SEMUA string English di satu file
│   ├── design/tokens.css      # token dari docs/design/design-system.md
│   └── assets/
│       ├── fonts/             # Nunito woff2 (self-hosted)
│       ├── mascot/            # SVG — diganti kalau maskot diganti
│       └── sfx/               # 6 suara pendek
└── public/                    # ikon PWA, manifest
```

**Aturan impor (dicek oleh linter):**
`content/` → tidak boleh impor `components/` atau `store/`. Konten adalah **data murni**.
`engine/` → tidak boleh impor `components/`. Engine tidak tahu React.
Ini yang membuat engine bisa diuji tanpa DOM dan konten bisa dipindah ke format lain nanti.

## 3. Navigasi tanpa router

App ini adalah **mesin state**, bukan situs. Tidak ada URL yang perlu dibagikan, tidak ada
deep-link. Memakai react-router berarti menambah dependensi untuk masalah yang tidak kita punya.

```ts
type Screen =
  | { name: 'onboarding' }
  | { name: 'map' }
  | { name: 'learn';    moduleId: string; step: number }
  | { name: 'practice'; moduleId: string }
  | { name: 'quiz';     moduleId: string }
  | { name: 'result';   sessionId: string }
  | { name: 'badges' }
  | { name: 'parent' };
```

Tombol back HP (Android) dipetakan ke `history.pushState` per layar supaya tidak keluar app
tanpa sengaja — satu-satunya tempat kita menyentuh History API.

## 4. Aliran data satu sesi

```
map → pilih modul
        │
        ▼
  unlock.ts ── boleh? ──✗──► node tidak bisa ditap
        │ ✓
        ▼
  learn (kalau belum pernah) → practice → quiz
        │                                   │
        │            generator.ts ──────────┤ soal dibuat dari aturan + seed
        │                                   │
        ▼                                   ▼
   session.ts mengumpulkan jawaban  → SessionResult
                                          │
                                          ▼
                                   mastery.ts (murni)
                                          │
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
                    ModuleState      badges/XP       review.ts
                          └───────────────┴───────────────┘
                                          ▼
                                   store/progress.ts → localStorage
```

`mastery.ts` adalah **fungsi murni**: `(moduleState, result, thresholds) => { next, events[] }`.
Semua keputusan "lulus / bintang / badge / jadwal review" lahir di satu tempat yang bisa diuji.

## 5. PWA & offline

- **Precache semua**: app shell, font, SFX, seluruh konten modul. App harus 100% jalan offline
  setelah kunjungan pertama.
- Strategi: `CacheFirst` untuk aset, `NetworkFirst` hanya untuk `index.html` (agar update terambil).
- Update: service worker baru → tampilkan toast kecil "New version ready — tap to update".
  **Jangan pernah reload otomatis di tengah sesi anak.**
- `manifest.json`: `display: standalone`, `orientation: portrait`, ikon 192/512/maskable.
- **Prompt "Add to Home Screen"** ditampilkan setelah anak menyelesaikan modul pertama — bukan
  saat pertama buka. Ini penting untuk iOS: PWA terinstal jauh lebih tahan dari penghapusan
  localStorage oleh Safari (lihat `storage.md §5`).

## 5b. Seberapa berat materinya, dan kapan diunduh

Angka nyata (31 modul, diukur 2026-09-08):

| Hal | Ukuran terkirim (gzip) |
|---|---|
| Kode app (React + engine + semua layar) | 88 KB |
| CSS | 5,5 KB |
| Font Nunito | 39 KB |
| **Total kunjungan pertama** | **±130 KB** |
| **Seluruh 31 modul materi** | **7,5 KB** (±242 byte per modul) |

Materinya hampir tidak berbobot, dan itu bukan kebetulan:

1. **Soal dibuat di HP, bukan diunduh.** Satu modul menyimpan *aturan* ("a + b, keduanya
   1–9, buang yang lebih dari 10"), bukan daftar ribuan soal. Resep, bukan katalog.
2. **Tidak ada satu pun file gambar.** Semua visual digambar kode sebagai SVG. Empat PNG
   yang ada hanya ikon home-screen, tidak pernah dimuat saat anak belajar.

### Kapan diunduh
- **Kunjungan pertama:** seluruh app + seluruh materi diunduh sekali dari Netlify (±130 KB,
  sekitar satu detik di 4G).
- **Service worker menyimpannya di HP.** Sesudah itu **tidak ada apa pun yang diambil dari
  jaringan** — app terbuka dari HP, jalan penuh dalam mode pesawat.
- **Versi baru** hanya diunduh saat kita deploy, dan penerapannya menunggu ketukan anak,
  tidak pernah memutus sesi yang sedang berjalan.

### Proyeksi
| Cakupan | Tambahan materi |
|---|---|
| Grade 1 lengkap (43 modul) | ±10 KB |
| Enam grade penuh (±240 modul) | ±58 KB |

Seluruh kurikulum enam tahun **masih lebih ringan daripada fontnya sendiri**.

### Kapan ini perlu ditinjau ulang
Memecah materi per grade (unduh saat dibutuhkan) baru masuk akal kalau materi menembus
**±150 KB gzip** — kira-kira 600+ modul, atau kalau kita menambahkan audio/gambar sungguhan.
Sekarang memecahnya justru merugikan: menambah permintaan jaringan dan merumitkan offline
tanpa keuntungan apa pun. Kalau saatnya tiba, `registryFor(grade)` sudah menyiapkan batasnya,
jadi tinggal mengubahnya jadi `import()` dinamis.

## 6. Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```
Deploy dilakukan **oleh user**, bukan dari sesi ini.

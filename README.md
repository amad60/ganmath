# GanMath

Web mobile app belajar matematika SD bergaya Duolingo, dibuat untuk satu anak kelas 1.
Anak belajar sendiri dari materi yang bisa dibaca, lalu diuji, dan **hanya boleh lanjut ke modul
berikutnya kalau benar-benar menguasai**.

- **Tanpa backend, tanpa database, tanpa login.** Semua progress di localStorage + backup file.
- **Offline-first** (PWA, installable ke home screen).
- **Bahasa app: English sederhana** untuk pembaca pemula.

## Menjalankan

```bash
npm install
npm run dev      # buka alamat Network dari HP di WiFi yang sama
npm run test     # 125 test
npm run build    # menjalankan test dulu, lalu typecheck, lalu build
npm run preview  # menjalankan hasil build (service worker aktif di sini)
```

## Isi

| Folder | Isi |
|---|---|
| `docs/` | Seluruh perencanaan: riset, kurikulum, desain, arsitektur, roadmap |
| `src/engine/` | Aturan penguasaan, generator soal, review, gating — **fungsi murni tanpa React** |
| `src/content/` | Materi & bank soal per modul — **data murni**, plus linter konten |
| `src/components/manipulatives/` | Ten-frame, number bond, number line, counter objects |
| `src/app/screens/` | 8 layar |

Mulai dari [`CLAUDE.md`](CLAUDE.md) untuk arahan produk, lalu
[`docs/ROADMAP.md`](docs/ROADMAP.md) untuk status.

## Status

Fase 5a (vertical slice): **16 modul Grade 1** — Unit 1 (Numbers to 10), dua modul bentuk,
Unit 2 (Add & Subtract within 10). Grade 1 lengkap 43 modul menyusul setelah diuji dengan anak.

## Deploy

Situs statis. `netlify.toml` sudah disiapkan:

```bash
netlify login          # pastikan akun yang benar
netlify init           # sekali, untuk menautkan project
netlify deploy --prod
```

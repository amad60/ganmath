# GanMath

**Live: https://ganmath.netlify.app**

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
npm run test     # 407 test
npm run build    # menjalankan test dulu, lalu typecheck, lalu build
npm run preview  # menjalankan hasil build (service worker aktif di sini)

# Screenshot 8 layar utama memakai Chrome yang sudah terpasang
# (jalankan `npm run preview` di terminal lain lebih dulu)
npm run shots
npm run shots -- --dark
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

**Kurikulum lengkap Grade 1–6: 240 modul, 43 unit**, semuanya punya materi Learn, bank soal,
dan progresi concrete → pictorial → abstract.

Dipakai anak sungguhan, dan perubahan didorong oleh apa yang terjadi waktu dia memakainya —
bukan oleh daftar fitur. Beberapa keputusan yang lahir dari situ, semuanya tercatat lengkap
dengan alasannya di [`CLAUDE.md`](CLAUDE.md):

- **Bintang mengukur kebenaran, kecepatan mengukur status.** Anak yang menjawab 100% benar
  tapi berpikir lama tetap mendapat dua bintang.
- **Kecepatan tidak pernah mengunci kemajuan.** Paham tapi belum cepat → modul berikutnya
  tetap terbuka, dan Speed Round ditawarkan.
- **Badge punya sumbu kedalaman**, tersebar sampai Grade 6 — bukan hanya "pertama kali".
- **Hint wajib benar-benar menampilkan sesuatu di setiap modul**; ia satu-satunya pertolongan
  untuk anak yang macet sendirian.

## Deploy

Situs statis. `netlify.toml` sudah disiapkan:

Folder ini sudah ter-link ke project Netlify `ganmath`:

```bash
npm run build
netlify deploy --prod --dir dist
```

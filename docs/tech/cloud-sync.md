# Cloud sync — akun orang tua

Keputusan 2026-09-21: progress mengikuti **akun email orang tua**, bukan file
yang dikirim antar HP. File backup tetap ada sebagai jaring pengaman.

**Project:** [ganmath](https://supabase.com/dashboard/project/arqgihpkloeczvyqxyci)
(Singapore). Tabel `progress` + RLS sudah dipasang. Anak tidak pernah melihat
login di peta — pintunya di layar nama (HP baru) dan Parent Area.

## Cara kerja
1. **HP baru (PWA di home screen):** jangan ketik nama, jangan ketuk tautan email.
   Di HP lama (sudah masuk): Parent Area → **Show a code**. Ketik kode 6 digit
   itu di HP baru. Tautan email membuka Chrome/Safari — session-nya **bukan**
   PWA, jadi PWA tetap menunggu.
2. Progress diunggah ke satu baris `progress` milik akun itu setelah tiap
   pelajaran, dan saat app ditutup.
3. **Tiap kali app dibuka** (dan saat HP kembali ke depan): tarik kalau cloud
   lebih baru. Dua HP dipakai bergantian: yang terakhir menyelesaikan sesi
   menang utuh. Tidak digabung.
4. HP yang baru diisi nama (modul masih kosong) **tidak** menimpa Grade 1 di
   cloud, meski stempel waktunya lebih baru.

## Status setup (2026-09-21)

| Langkah | Status |
|---|---|
| Project `ganmath` | ✅ `arqgihpkloeczvyqxyci` |
| Migrasi `progress` + RLS | ✅ |
| `.env.local` (dev) | ✅ gitignored |
| Site URL | ✅ `https://ganmath.netlify.app` |
| Kode 6 digit antar HP | ✅ Parent Area → Show a code (bukan tautan email) |
| Env Netlify + rebuild | ✅ `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |

Email Magic Link default adalah tautan dan di iOS membuka browser lain, bukan
PWA. Jangan dipakai untuk HP kedua. Pakai **Show a code** di HP yang sudah
masuk.

## Env yang dipakai app

```
VITE_SUPABASE_URL=https://arqgihpkloeczvyqxyci.supabase.co
VITE_SUPABASE_ANON_KEY=…   # anon/publishable saja, JANGAN service_role
```

Dev: file `.env.local`. Production: Netlify → Environment variables, lalu
**rebuild** (Vite membakar env saat build).

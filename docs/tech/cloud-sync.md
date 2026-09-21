# Cloud sync — akun orang tua

Keputusan 2026-09-21: progress mengikuti **akun email orang tua**, bukan file
yang dikirim antar HP. File backup tetap ada sebagai jaring pengaman.

Anak tidak pernah melihat layar masuk. Pintunya hanya di Parent Area.

## Cara kerja
1. Orang tua memasukkan email di Parent Area → kode 6 digit ke inbox.
2. Kode diketik di app (bukan link — link magic membuka Safari, bukan PWA).
3. Progress diunggah ke satu baris `progress` milik akun itu.
4. HP lain: masuk email yang sama → progress terunduh.
5. Kalau kedua HP menulis, yang `updatedAt`-nya lebih baru menang utuh.
   Tidak digabung.

## Setup sekali (Supabase + Netlify)

1. Buat project di [supabase.com](https://supabase.com).
2. SQL Editor: jalankan `supabase/migrations/001_progress.sql`.
3. **Authentication → Email**: ubah template Magic Link supaya berisi
   `{{ .Token }}` (kode 6 digit), bukan hanya `{{ .ConfirmationURL }}`.
   Tanpa ini, email berisi tautan yang memecah PWA di iPhone.
4. Project Settings → API: salin URL dan anon key ke:
   - `.env.local` (dev)
   - Netlify → Site settings → Environment variables
     (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) lalu **rebuild**
5. Authentication → URL configuration: Site URL = `https://ganmath.netlify.app`

Setelah itu: di Poco, Parent Area → Cloud sync → email → kode. Ulangi di
iPhone 12 mini (buka dari ikon home screen, bukan tab Safari).

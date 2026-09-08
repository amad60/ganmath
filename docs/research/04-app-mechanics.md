# Riset 4 — Bongkar Mekanik App Sejenis

## 4.1 Duolingo — yang ditiru

| Mekanik | Cara kerja | Ambil untuk GanMath? |
|---|---|---|
| **Path / jalur node** | tiap lingkaran = satu lesson, berurutan, jelas mana berikutnya | ✅ ambil — inti navigasi |
| **Crown levels** | tiap skill punya 5 tingkat kesulitan bertingkat, plus "Legendary" (tanpa bantuan, maks 3 salah) | ✅ **adaptasi** — jadi 3 bintang + "Master Round" |
| **Cracked skill** | skill yang mulai terlupa "retak" dan minta diperbaiki | ✅ ambil — visual paling jelas untuk spaced repetition |
| **Streak** | pendorong retensi terkuat; bekerja lewat *loss aversion* — 90 hari terasa aset yang harus dijaga | ⚠️ **ambil versi lunak** — lihat §4.3 |
| **XP** | mata uang progress dari tiap sesi | ✅ ambil |
| **Leagues / leaderboard** | menaikkan penyelesaian lesson 25%, engagement 40% | ❌ **tolak** — user tunggal, dan kompetisi tidak cocok untuk anak 6 th belajar sendiri |
| **Hearts / nyawa** | membatasi jumlah kesalahan | ❌ **tolak** — sudah jadi non-goal; menghukum kesalahan merusak self-learning |
| **Widget streak** | +60% komitmen buka app harian | ❌ tidak bisa (web app), diganti notifikasi PWA opsional |

Sumber: [StriveCloud — Duolingo gamification](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo),
[Duolingo crown levels](https://duolingoguides.com/duolingo-crown-levels/),
[Orizon — streaks & XP](https://www.orizon.co/blog/duolingos-gamification-secrets),
[Davide Quaranta — how Duolingo motivates](https://davquar.it/post/hci/duolingo-gamification/)

**Adaptasi "Crown → Master Round" untuk GanMath:**
Duolingo menaikkan level lewat pengulangan berkali-kali. Kita tidak punya waktu sebanyak itu dan
sudah punya aturan mastery sendiri. Padanannya:

| Tingkat | Syarat | Hadiah |
|---|---|---|
| ⭐ | lulus Mastery Check sekali | modul berikutnya terbuka |
| ⭐⭐ | lulus 2 sesi (sesuai aturan konsistensi per grade) | badge modul |
| ⭐⭐⭐ | **Master Round**: 10 soal, tanpa hint, maks 1 salah, `thinkMs` median ≤3 dtk | badge emas + efek khusus di peta |

Bintang ke-3 **opsional** — tidak wajib untuk membuka modul berikutnya. Ini memberi anak yang
cepat sesuatu untuk dikejar tanpa menahan anak yang lebih lambat.

## 4.2 Khan Academy Kids & Prodigy — yang dihindari

- **Khan Academy Kids** dianggap acuan terbaik untuk pembelajaran nyata: gratis, tanpa iklan,
  tanpa upsell. → Kita sudah sejalan (tanpa iklan, tanpa monetisasi, tanpa akun).
- **Prodigy** kuat menghasilkan engagement, tapi kritik yang konsisten:
  - **rasio waktu belajar vs hiburan buruk** — anak lama di app, sebentar mengerjakan matematika;
  - **scaffolding konseptual minim** — memberi hadiah untuk *jawaban benar*, bukan untuk *paham*;
  - disebut **"cognitive candy"**: berat di hadiah (pet, tiket, avatar), ringan di pembelajaran;
  - keluhan berulang soal **tekanan upsell** di dalam game.

Sumber: [The Learning Standard — Prodigy review](https://thelearningstandard.org/apps/prodigy),
[Screenwise — Khan/ABCmouse/edtech besar](https://screenwiseapp.com/guides/khan-academy-abcmouse-and-the-big-ed-tech-players),
[HomeschoolFox — Khan vs Prodigy](https://homeschoolfox.com/compare/khan-academy-vs-prodigy-math)

### Aturan yang lahir dari kritik ini (masuk ke prinsip produk)

1. **Rasio 80/20.** Minimal 80% waktu di dalam app adalah waktu mengerjakan/mempelajari
   matematika. Animasi perayaan dibatasi **≤3 detik** dan bisa di-tap untuk dilewati.
2. **Hadiah diikat ke penguasaan, bukan ke waktu bermain.** Tidak ada hadiah untuk sekadar
   "buka app" atau "main lama". XP hanya dari soal dan modul.
3. **Tidak ada mata uang yang bisa dibelanjakan** (koin, pet, kostum) di v1. Kalau nanti terasa
   perlu, hadiahnya harus tetap bersumber dari penguasaan.
4. **Tidak ada upsell, iklan, atau pembelian** — selamanya, bukan cuma v1.

## 4.3 Streak versi ramah anak

Streak efektif justru karena *loss aversion* — dan itu persis yang berbahaya untuk anak 6 tahun
yang tidak mengendalikan jadwalnya sendiri (sekolah, sakit, liburan, HP dipegang orang tua).

Aturan GanMath:
- Streak **ditampilkan sebagai pencapaian, bukan sebagai sesuatu yang akan hilang.** Tidak ada
  peringatan "streak-mu akan hilang malam ini!".
- **Freeze otomatis** 2 buah, terisi ulang tiap minggu — dipakai diam-diam tanpa anak perlu tahu.
- Streak putus → app menampilkan **rekor terbaik** dan mengajak mulai lagi; tidak ada animasi sedih,
  tidak ada rasa bersalah.
- Target streak dirayakan di angka kecil dulu (3, 7, 14, 30) supaya cepat terasa.

## 4.4 Daftar badge awal (draft untuk Fase 3)

| Badge | Syarat |
|---|---|
| First Step | menyelesaikan lesson pertama |
| Module Master | modul pertama dikuasai |
| Gold Brain | bintang 3 pertama |
| Unit Champion | satu unit selesai |
| Grade Graduate | satu grade selesai |
| Perfect Round | satu sesi tanpa salah |
| Fast Thinker | median `thinkMs` ≤3 dtk dalam satu sesi |
| Comeback | lulus modul setelah sebelumnya gagal |
| Steady 7 / 14 / 30 | streak 7 / 14 / 30 hari |
| Memory Keeper | lolos review R4 (modul jadi `retained`) |

"Comeback" sengaja ada: memberi penghargaan pada ketekunan setelah gagal, penyeimbang langsung
untuk aturan gating ketat yang dipilih user.

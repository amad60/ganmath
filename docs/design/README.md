# Fase 3 — Desain (indeks)

Selesai: 2026-09-08.

| Dokumen | Isi |
|---|---|
| [design-system.md](design-system.md) | Token warna light/dark, warna unit, tipografi, spasi, layout & area aman, aksesibilitas |
| [mascot.md](mascot.md) | 4 opsi maskot + rekomendasi + peta reaksi (**butuh pilihan user**) |
| [wireframes.md](wireframes.md) | 8 layar v1 lengkap |
| [animation.md](animation.md) | Durasi & easing, daftar animasi wajib, teknik & performa, reduced-motion, suara |

## Keputusan desain yang mengikat Fase 4–5

1. **Tidak ada merah menyala di seluruh app.** Jawaban salah memakai oranye "Try again". Merah
   hanya untuk tombol Reset di Parent Area. Anak akan sering salah karena gating-nya ketat —
   warna alarm akan mengubah rasa app dari "aku belajar" jadi "aku dinilai".
2. **Tombol `Next` di layar Learn tidak aktif sampai anak beraksi.** Ini yang membedakan Learn
   dari slide pasif.
3. **Mastery Check terlihat berbeda dari Practice**: tanpa visual pendamping, tanpa hint, header
   emas. Anak harus tahu kapan dia sedang diuji.
4. **Tidak ada timer yang terlihat**, padahal waktu diukur. Sesuai keputusan "kecepatan diukur
   diam-diam".
5. **Layar hasil tidak pernah menulis "Failed"** — yang ditulis adalah jarak menuju lulus.
6. **Animasi manipulatif tetap jalan saat `prefers-reduced-motion`** (dipercepat 50%), karena itu
   materi, bukan dekorasi.
7. **Font di-host sendiri**, bukan dari Google Fonts CDN — app harus jalan offline.
8. **Semua tombol jawaban di sepertiga bawah layar**, tinggi 64px, jarak 12px.

## Jawaban untuk pertanyaan terbuka
- **#16 (batas waktu harian):** tidak ada penguncian app; hanya `Daily reminder` opsional (default
  OFF). App sudah membatasi diri lewat sesi 5–10 menit dan maks 2 modul review/hari. Mengunci app
  saat anak sedang *mau* belajar = menghukum perilaku yang kita inginkan. → dipindahkan ke
  `../OPEN-QUESTIONS.md` sebagai terjawab.
- **#14 (maskot):** 4 opsi di [mascot.md](mascot.md), rekomendasi **Gan si Robot** (badannya
  terbuat dari bangun datar Unit 6 — maskotnya ikut mengajar). **Masih menunggu pilihanmu**;
  Fase 4–5a jalan terus dengan placeholder, dan mengganti maskot = mengganti isi folder aset SVG.

# Checklist Uji Perangkat (S11)

Yang bisa diverifikasi tanpa HP fisik **sudah dilakukan**; sisanya butuh HP anak sungguhan.

## ✅ Sudah terverifikasi di mesin ini

| Hal | Hasil |
|---|---|
| Build produksi bersih | ✅ `npm run build` (test → typecheck → build) |
| App terlayani & HTML benar | ✅ HTTP 200, `viewport-fit=cover`, theme-color light & dark, apple-touch-icon |
| Manifest PWA sah | ✅ `standalone`, `portrait`, 3 ikon termasuk maskable |
| Service worker terbit | ✅ `sw.js` 200, precache 14 entri (328KB) |
| Anggaran bundle | ✅ **±81KB gzip JS + 5KB CSS**, jauh di bawah batas 200KB |
| Logika ujung-ke-ujung | ✅ 125 test, termasuk alur peta → learn → quiz → mastered |

## ⬜ Butuh HP sungguhan (Poco F3 & iPhone 17)

Jalankan `npm run preview` lalu buka alamat Network dari HP (service worker hanya aktif di
build, bukan di `npm run dev`).

| # | Yang dicek | Kenapa penting |
|---|---|---|
| 1 | Tidak ada scroll horizontal di semua layar | Aturan layout; paling sering bocor di peta & keypad |
| 2 | Area aman benar di iPhone 17 (Dynamic Island tidak menutupi header) | `env(safe-area-inset-*)` |
| 3 | Semua tombol jawaban terjangkau jempol tanpa menggeser tangan | Anak memegang HP sendiri |
| 4 | Tap tidak memicu zoom atau seleksi teks | Anak akan tap cepat berkali-kali |
| 5 | Animasi ten-frame & number line mulus (tanpa patah) | Target 60fps di Poco F3 |
| 6 | Confetti berhenti sendiri ≤3 detik dan bisa di-tap lewat | Aturan 80/20 |
| 7 | Mode gelap terbaca (buka di malam hari / paksa dark) | Palet dark |
| 8 | **Mode pesawat: app tetap jalan penuh** setelah sekali dibuka | Janji offline-first |
| 9 | Add to Home Screen muncul setelah modul pertama, dan app terbuka standalone | Pertahanan utama terhadap penghapusan storage iOS |
| 10 | Tutup app, buka lagi besok: progress & streak utuh | Persistensi |
| 11 | Parent Area: Save to file menghasilkan file, Load from file memulihkan | Backup |
| 12 | Anak benar-benar paham instruksinya tanpa dibantu | **Yang paling menentukan** — ini pertanyaan #17 |

Catatan #12: itu bukan uji teknis, itu uji produk. Kalau anak berhenti dan bertanya
"ini maksudnya apa?", catat modul dan langkahnya — itu daftar kerja pertama Fase 5b.

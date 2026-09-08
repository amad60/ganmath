# Spesifikasi Animasi

Aturan induk: animasi **menjelaskan atau memberi umpan balik**. Kalau sebuah animasi tidak
melakukan keduanya, animasi itu dihapus. Ini turunan langsung dari aturan 80/20
(min. 80% waktu di app = waktu matematika).

## 1. Durasi & easing

| Kelas | Durasi | Easing | Contoh |
|---|---|---|---|
| Mikro (umpan balik sentuh) | 100–150ms | `ease-out` | tombol ditekan, checkbox |
| Standar (perubahan state) | 250ms | `cubic-bezier(.2,.8,.2,1)` | jawaban benar/salah, kartu masuk |
| Transisi layar | 300–400ms | `cubic-bezier(.4,0,.2,1)` | pindah soal, buka modul |
| Naratif (menjelaskan) | 400–800ms | `ease-in-out` | blok bergerak ke ten-frame, angka melompat di number line |
| Perayaan | **≤3000ms, bisa dilewati** | — | confetti, bintang, badge |

**Batas keras:** tidak ada animasi >800ms yang **menghalangi** anak melanjutkan, kecuali perayaan
(yang bisa di-tap untuk dilewati).

## 2. Daftar animasi wajib

### Umpan balik jawaban
| Kejadian | Animasi |
|---|---|
| Tombol disentuh | turun 2px, bayangan hilang, 100ms |
| Benar | tombol → hijau, ikon ✓ muncul dengan `scale 0→1.2→1`, 250ms |
| Salah | tombol → oranye, **goyang horizontal ±6px 2×**, 300ms; **tanpa suara buzzer** |
| Salah lalu jawaban ditunjukkan | visual (ten-frame/number line) mengisi diri sendiri pelan, 600ms |
| Soal berikutnya | soal lama geser keluar kiri, baru masuk dari kanan, 300ms |

Goyang saat salah sengaja **horizontal, bukan getar merah** — bahasa tubuhnya "belum, coba lagi",
bukan "salah!".

### Progres & hadiah
| Kejadian | Animasi |
|---|---|
| Progress bar bertambah | lebar bertransisi 400ms, ada kilau melintas |
| XP bertambah | angka menghitung naik (count-up) 600ms |
| Bintang didapat | jatuh dari atas + memantul + kilau, berurutan 200ms antar bintang |
| Badge baru | kartu badge membesar dari 0 dengan sedikit overshoot, 400ms + confetti |
| Modul dikuasai di peta | node berubah emas, denyut sekali, node berikutnya "terbuka" (rantai putus) |
| Streak bertambah | angka api membesar sekali, 250ms |

### Peta
| Kejadian | Animasi |
|---|---|
| Membuka peta | node muncul berurutan dari bawah ke atas, 40ms per node (maks 600ms total) |
| Node berikutnya | **denyut lembut terus-menerus** (`scale 1→1.06`, 1.6s, infinite) — satu-satunya animasi tak berujung di app |
| Modul perlu review | node "retak" bergetar pelan tiap 4 detik |
| Maskot berpindah | berjalan/memanjat ke node berikutnya, 800ms |

### Manipulatif (paling penting untuk mengajar)
| Komponen | Animasi |
|---|---|
| `ten-frame` | titik masuk satu per satu 120ms, bunyi klik kecil; saat penuh → seluruh frame berkilau |
| `number-bond` | angka mengalir dari whole ke parts lewat garis |
| `number-line` | penanda melompat per satuan (bukan meluncur) — melompat **mengajarkan** hitungan |
| `base10-blocks` | 10 satuan otomatis bergabung jadi 1 batang puluhan saat menyentuh — inilah cara "menyimpan" dijelaskan tanpa kata |
| `fraction-shape` | potongan berputar terpisah lalu menyatu |

## 3. Teknik & performa

- Hanya animasikan `transform` dan `opacity`. **Jangan pernah** menganimasikan `width`, `height`,
  `top`, `left` (kecuali progress bar, yang memakai `transform: scaleX`).
- Semua `@keyframes` berulang dijalankan di elemen dengan `will-change: transform`.
- Target 60fps di Poco F3; anggaran **≤4 elemen beranimasi bersamaan** di luar perayaan.
- Confetti memakai canvas, **maksimal 60 partikel**, otomatis berhenti setelah 3 detik.
- Animasi dijeda saat tab tidak terlihat (`visibilitychange`) — hemat baterai.

## 4. `prefers-reduced-motion`

Wajib dihormati. Bukan mematikan semua animasi — umpan balik tetap harus ada:

| Normal | Reduced |
|---|---|
| Geser + fade antar soal | fade saja, 150ms |
| Goyang saat salah | garis tepi oranye muncul, tanpa gerak |
| Confetti | satu kilau statis 400ms |
| Denyut node berikutnya | garis tepi tebal statis |
| Manipulatif bergerak | tetap ada (ini **materi**, bukan dekorasi) tapi durasi dipotong 50% |

Baris terakhir itu keputusan sadar: animasi manipulatif adalah cara app mengajar, jadi tidak boleh
hilang total — hanya dipercepat.

## 5. Suara

- Semua suara **pendek (<400ms)**, lembut, bisa dimatikan dari Parent Area (default ON).
- Set minimal: `tap` · `correct` · `retry` · `star` · `badge` · `levelup`.
- **Tidak ada suara buzzer/salah yang keras.** Suara "retry" bernada netral, bukan menurun.
- Tidak ada musik latar di v1 (menambah bundle & mengganggu konsentrasi).
- Audio harus dibuka oleh gestur pertama pengguna (kebijakan autoplay iOS Safari) — inisialisasi
  di tap pertama onboarding.

# Riset 3 — Ambang Penguasaan & Jadwal Pengulangan

Menguji apakah angka-angka di `CLAUDE.md` §6 masuk akal secara riset.

## 3.1 Temuan riset kelancaran (fluency)

- **Patokan 3 detik.** Sebuah fakta dianggap dikuasai kalau anak bisa menjawab dalam **≤3 detik**,
  entah dari ingatan langsung atau lewat strategi yang sudah otomatis. 3 detik adalah batas
  praktis antara **mengingat** dan **menghitung ulang**.
- **Retrieval otomatis sesungguhnya** berlangsung **400–900 ms** menurut studi psikologi.
- **Automaticity ≠ fluency.** *Automaticity* = tarik dari memori tanpa usaha. *Fluency* lebih luas:
  akurat, efisien, **fleksibel** — boleh lewat strategi efisien, tidak harus hafal mentah.
- Tidak ada satu angka cutoff yang berlaku untuk semua anak.

Sumber: [MathFactLab — Automaticity vs Fluency](https://www.mathfactlab.com/math-facts-journal/math-fact-automaticity-vs-math-fact-fluency),
[Rocket Math — Fluency expectations by grade](https://www.rocketmath.com/2022/11/30/math-fact-fluency-expectations-by-grade-level/),
[McGraw Hill — Research-based approach to fact fluency](https://medium.com/inspired-ideas-prek-12/a-research-based-approach-to-math-fact-fluency-that-also-promotes-a-love-of-mathematics-31f9d7e8099f),
[Boddle — Fluency isn't speed](https://www.boddlelearning.com/article/math-fact-fluency)

## 3.2 Cocokkan dengan ambang GanMath

Ambang kita: G1 ≤8 dtk → G6 ≤4 dtk. Riset bilang 3 dtk. **Tidak bertentangan**, karena angka riset
mengukur *jawaban lisan*, sedangkan angka kita mengukur *dari soal muncul sampai jawaban terkirim* —
di dalamnya ada waktu membaca soal + waktu motorik menekan keypad, yang untuk anak 6 tahun bisa
2–4 detik sendiri.

**Usulan penyesuaian (untuk diputuskan di Fase 4, bukan mengubah kesepakatan sekarang):**

1. **Ukur dua angka, bukan satu.**
   - `totalMs` — soal muncul → jawaban terkirim (dipakai untuk ambang yang sudah disepakati).
   - `thinkMs` — soal muncul → **input pertama** disentuh. Ini jauh lebih dekat ke ukuran riset,
     karena membuang waktu mengetik.
2. **`thinkMs ≤ 3 detik` jadi penanda internal "otomatis"** — dipakai untuk memberi **bintang ke-3**
   dan untuk memutuskan modul boleh naik ke interval review yang lebih panjang.
3. **Buang outlier.** Anak teralih perhatian (HP ditaruh, lalu balik) akan merusak rata-rata.
   Aturan: abaikan soal dengan `totalMs > 30 detik` dari perhitungan kecepatan, jangan dari akurasi.
4. **Pakai median, bukan rata-rata.** Lebih tahan terhadap satu-dua soal yang aneh.
5. **Kecepatan tidak pernah jadi syarat tunggal untuk gagal.** Kalau akurasi sudah lolos tapi
   kecepatan belum, statusnya `practiced` (bukan gagal) dan app menawarkan sesi "Speed Round"
   yang pendek dan menyenangkan — bukan mengulang seluruh modul.

## 3.3 Jadwal pengulangan (spaced repetition)

Temuan riset:
- Melanjutkan latihan **selama ~2 minggu** setelah pertama belajar, lalu review pada **1 bulan**
  dan **2 bulan**, membuat hampir seluruh materi bertahan.
- **Expanding vs equal interval:** jadwal melebar unggul di awal, tapi **tidak berbeda signifikan
  untuk retensi jangka panjang** asalkan anak mendapat **±4 sesi pengulangan**. Yang penting
  **jumlah sesi terdistribusi**, bukan pola intervalnya.

Sumber: [Karpicke & Roediger — Is expanded retrieval superior? (PDF)](http://psychnet.wustl.edu/coglab/wp-content/uploads/2015/01/2007-Is-expanded.pdf),
[Parenting Science — spaced learning schedules for children](https://parentingscience.com/spaced-learning/),
[Meta-analytic review of spacing (PDF)](http://www.lscp.net/persons/ramus/docs/EPR20.pdf),
[Third Space Learning — teacher's guide to spaced repetition](https://thirdspacelearning.com/us/blog/spaced-repetition/)

**Keputusan untuk GanMath:** pakai **4 titik review** per modul, bukan 3.

| Review | Jarak dari `masteredAt` | Bentuk |
|---|---|---|
| R1 | +3 hari | Quick Review, 5 soal |
| R2 | +1 minggu | Quick Review, 5 soal |
| R3 | +1 bulan | Quick Review, 5 soal |
| R4 | +2 bulan | Quick Review, 5 soal → setelah lolos, modul jadi `retained` |

Aturan:
- Maksimal **2 modul review per hari** supaya sesi tetap ≤5–10 menit dan tidak menumpuk jadi
  hukuman setelah beberapa bulan.
- Prioritas review: modul dengan akurasi terendah dulu, lalu yang paling lama tidak disentuh.
- Gagal review → status `needs_review`, jadwal mundur ke R1 lagi. **Tidak mengunci ulang** modul
  berikutnya (sudah jadi keputusan di CLAUDE.md).
- Review dihitung sebagai sesi yang sah untuk streak — ini yang bikin anak mau mengerjakannya.

## 3.4 Ringkasan perubahan yang diusulkan ke CLAUDE.md §6
- [ ] Tambah `thinkMs` sebagai metrik kedua (usul 1–2 di atas)
- [ ] Median + buang outlier >30 dtk (usul 3–4)
- [ ] Kecepatan tidak menggagalkan; ada "Speed Round" terpisah (usul 5)
- [ ] Review jadi 4 titik: 3 hari / 1 minggu / 1 bulan / **2 bulan**, maks 2 modul review/hari
- [ ] Tambah status `retained` setelah R4 lolos

Semua ini **penambahan**, bukan pembatalan kesepakatan sebelumnya. Diterapkan saat Fase 4.

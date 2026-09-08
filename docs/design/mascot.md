# Maskot — Usulan (butuh pilihan user, open question #14)

Maskot bukan hiasan. Di app self-learning dia memegang tiga tugas: **menyampaikan instruksi tanpa
menambah teks**, **memberi reaksi saat jawaban salah supaya tidak terasa menghakimi**, dan
**menjadi wajah perayaan** saat modul dikuasai.

## Syarat teknis (berlaku untuk opsi mana pun)

1. **SVG, bukan gambar raster** — harus tajam di semua ukuran dan ringan untuk offline.
2. **Ekspresi hanya dari mata + mulut**, badan tetap. Satu badan + 6 set wajah = 6 emosi dengan
   biaya kecil: `idle · thinking · happy · celebrate · encourage · sleepy`.
3. Bisa digambar dalam **≤20 path**. Maskot rumit = bundle besar & animasi berat.
4. Punya "tangan" atau padanannya untuk **menunjuk** ke elemen di layar (dipakai di layar Learn).
5. Tetap terbaca pada ukuran **32px** (di header) sampai **160px** (di layar hasil).

## Opsi

### A. **Gan si Robot** ⭐ rekomendasi
Robot kecil yang **tersusun dari bangun datar** — kepala persegi bulat, badan persegi panjang,
telinga lingkaran, kaki segitiga.
- ✅ **Terikat langsung ke materi.** Unit 6 mengajarkan circle/triangle/square/rectangle —
  maskotnya secara harfiah terbuat dari itu. Bisa "bongkar pasang" jadi materi.
- ✅ Paling murah dianimasikan: bentuk geometris, tidak butuh anatomi yang benar.
- ✅ Netral gender & netral budaya, cocok dipakai sampai anak 12 tahun (tidak terasa kekanakan).
- ✅ Masuk akal memegang angka, kartu, dan blok.
- ⚠️ Robot adalah pilihan yang aman, bukan yang paling berkarakter.

### B. **Cicak** (tokek kecil)
Cicak rumah — hewan yang setiap anak Indonesia kenal.
- ✅ Khas, lokal, langsung akrab. Tidak ada app matematika lain yang memakainya.
- ✅ Bisa **memanjat peta belajar** — animasi perpindahan antar modul jadi natural dan lucu.
- ✅ Ekor bisa jadi penunjuk, jari lengket bisa "menempel" ke jawaban benar.
- ⚠️ Sebagian anak tidak suka reptil.
- ⚠️ Lebih sulit digambar konsisten dari berbagai sudut.

### C. **Momo si Monyet**
- ✅ Ekspresif, mudah dibuat lucu, cocok memanjat jalur.
- ⚠️ Sangat umum di app anak — mudah terasa generik.

### D. **Bintang si Kucing**
- ✅ Kucing selalu disukai anak; mudah dibuat menggemaskan.
- ⚠️ Tidak punya hubungan apa pun dengan matematika.

## Rekomendasi

**A (Gan si Robot)**, karena satu alasan yang mengalahkan selera: maskotnya **ikut mengajar**.
Badannya adalah materi Unit 6, bisa dibongkar jadi bangun datar untuk menjelaskan, dan bisa
"tumbuh" seiring grade (menambah bagian tiap grade selesai) — itu hadiah jangka panjang yang
gratis secara desain. Nama "Gan" juga menyatu dengan nama app.

**Kalau kamu mau yang lebih berkarakter dan khas Indonesia, pilih B (Cicak)** — saya siapkan
sistem desainnya supaya maskot bisa diganti tanpa menyentuh kode lain (satu folder aset SVG +
satu peta ekspresi).

> **Sementara menunggu pilihanmu**, Fase 4 & 5a jalan terus memakai **placeholder Gan si Robot**.
> Mengganti maskot nanti = mengganti isi `src/assets/mascot/`, bukan menulis ulang layar.

## Peta reaksi maskot (berlaku untuk opsi mana pun)

| Kejadian | Ekspresi | Gerakan | Durasi |
|---|---|---|---|
| Layar Learn terbuka | `idle` | melambai sekali | 400ms |
| Menjelaskan langkah | `thinking` | menunjuk ke visual | 300ms |
| Jawaban benar | `happy` | melompat kecil | 250ms |
| Jawaban salah | `encourage` | miringkan kepala, **tidak sedih** | 300ms |
| 3× salah berturut-turut | `encourage` | mendekat & menunjuk hint | 400ms |
| Modul dikuasai | `celebrate` | melompat + confetti | ≤3 detik, bisa di-tap lewat |
| Tidak dibuka >3 hari | `sleepy` | muncul di layar pembuka | 400ms |

**Aturan keras:** maskot **tidak pernah** menampilkan ekspresi sedih, kecewa, atau menangis saat
anak salah. Itu memindahkan beban emosi ke anak — persis yang ingin kita hindari dengan gating
ketat.

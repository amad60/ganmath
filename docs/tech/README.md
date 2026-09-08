# Fase 4 — Desain Teknis & Rencana (indeks)

Selesai: 2026-09-08.

| Dokumen | Isi |
|---|---|
| [architecture.md](architecture.md) | Stack final, struktur folder, aturan impor, navigasi tanpa router, aliran data, PWA, Netlify |
| [storage.md](storage.md) | Skema `ProgressState` final, batas ukuran, migrasi, risiko iOS, format export/import |
| [engine.md](engine.md) | RNG berseed, generator & pengecoh, session runner, evaluator penguasaan, penjadwal review, gating, rencana test |
| [implementation-plan.md](implementation-plan.md) | 13 langkah Fase 5a + definition of done, anggaran, risiko |

## Keputusan arsitektur yang mengikat

1. **Engine tidak tahu React.** `src/engine/` adalah fungsi murni tanpa impor React —
   aturan penguasaan terlalu mudah salah diam-diam untuk disembunyikan di dalam komponen.
2. **Konten adalah data murni.** `src/content/` tidak boleh impor `components/` atau `store/`.
3. **Tidak ada router.** App ini mesin state, bukan situs — tidak ada URL yang perlu dibagikan.
4. **`locked` tidak disimpan.** Terkunci = keadaan turunan dari prasyarat + path order. Kalau
   disimpan, data jadi kadaluwarsa setiap kali kurikulum bertambah.
5. **Kurikulum bertambah bukan perubahan skema** — modul baru muncul otomatis tanpa migrasi.
6. **Kecepatan tidak pernah mengunci kemajuan.** Paham tapi belum cepat → `practiced`, modul
   berikutnya tetap terbuka, kekurangannya ditangani lewat Speed Round & review.
7. **Soal ulangan dalam sesi tidak dihitung dalam akurasi** — satu kesalahan tidak boleh dihukum
   dua kali.
8. **Import tidak pernah menggabungkan.** Menggabungkan dua riwayat penguasaan menghasilkan data
   yang tidak bisa dipercaya; impor = ganti total setelah konfirmasi yang menampilkan perbandingan.
9. **PWA dikerjakan di akhir**, bukan awal — service worker aktif saat pengembangan menyesatkan.

## Usulan Fase 1 yang sekarang diterapkan
Seluruh checklist `../research/03-mastery-and-spacing.md §3.4` sudah masuk ke `../../CLAUDE.md §6`:
`thinkMs`, median, buang outlier >30 dtk, Speed Round, review 4 titik, status `retained`.

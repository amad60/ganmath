# Engine — Soal, Sesi, Penguasaan, Review

Semua di sini adalah **fungsi murni tanpa React**, diuji dengan Vitest.

## 1. RNG berseed

```ts
function mulberry32(seed: number): () => number
```
Setiap sesi menyimpan `seed`. Konsekuensinya: satu sesi bisa **direproduksi persis** untuk
debugging ("kenapa dia dapat soal ini?"), dan soal tetap acak untuk anak. Seed = `Date.now()`
saat sesi dimulai, disimpan di `ganmath.v1.session`.

## 2. Generator soal

```ts
generate(rule: QuestionRule, rng): Question
```

Aturan yang berlaku untuk semua generator:
1. **Tidak ada pengulangan soal identik** dalam satu sesi (buffer 8 soal terakhir).
2. **Buang soal sepele**: `n + 0`, `n - 0`, `n × 1` maksimal 1 per sesi.
3. **Distribusi merata** ke seluruh rentang parameter — bukan uniform acak, tapi sampling tanpa
   pengembalian dari daftar kemungkinan yang diacak. Tanpa ini, `7+3` bisa muncul 4× dan `9+1`
   tidak sama sekali.
4. **Cakupan sub-tipe wajib**: Mastery Check harus memuat minimal satu soal dari setiap
   `questionType` milik modul (syarat "cakupan" di aturan penguasaan).

### Pengecoh
```ts
distractors(answer, kind, rng): number[]   // selalu 3, unik, tidak negatif
```
- `near` → `answer ±1, ±2`
- `digit-swap` → tukar puluhan-satuan (`21`→`12`)
- **Wajib**: minimal 1 pengecoh mencerminkan miskonsepsi modul, mis. untuk `Take Away`:
  hasil **penjumlahan** (anak salah membaca operator). Kalau anak memilih pengecoh itu berulang,
  Parent Area bisa melaporkan "sering tertukar + dan −", bukan sekadar "62% benar".
- Pengecoh **tidak boleh** di luar rentang yang masuk akal (jawaban 3 digit untuk soal dalam 10 =
  memberi jawaban gratis).

## 3. Session runner

```ts
type SessionConfig = {
  kind: 'practice'|'quiz'|'review';
  minQuestions: 8; maxQuestions: 12;   // practice & quiz
  reviewQuestions: 5;                  // review
  minSeconds: 300;                     // aturan user: sesi minimal 5 menit
};
```

Aturan berhenti (tiga, diperiksa berurutan — **klarifikasi saat S5**, spesifikasi awal saling
bertabrakan antara "lanjut sampai 5 menit" dan "anak cepat selesai lebih cepat"):
1. `maxQuestions` tercapai → berhenti. Sesi tidak pernah berlarut-larut.
2. `minQuestions` tercapai **dan semua benar dan median `thinkMs` ≤4 detik** → berhenti lebih
   awal. Anak sudah jelas bisa; memanjangkan sesi hanya menghukum yang cepat.
3. `minQuestions` tercapai **dan** ≥5 menit berlalu → berhenti.

Sesi **tidak pernah berhenti di tengah soal** — pemeriksaan hanya terjadi setelah menjawab.
- **Antrean ulang**: soal yang dijawab salah masuk ke antrean, dimunculkan lagi setelah ≥2 soal
  lain. Soal ulangan **tidak dihitung** dalam akurasi (kalau dihitung, satu kesalahan dihukum
  dua kali) tapi dicatat sebagai `retried: true` untuk diagnosis.
- **Anak cepat selesai lebih cepat**: kalau 8 soal pertama benar semua dan mediannya cepat, sesi
  berhenti di 8 — memenuhi janji "modul awal harus bisa cepat selesai" (CLAUDE.md §7).
- Sesi berjalan disimpan ke `ganmath.v1.session` setiap jawaban dan **dipulihkan otomatis**
  saat app dibuka → HP terkunci atau app dibunuh sistem tidak menghilangkan kemajuan.

### Pengukuran waktu
```ts
thinkMs = firstInputAt - questionRenderedAt   // ← metrik utama kecepatan
totalMs = answerSubmittedAt - questionRenderedAt
```
- Timer mulai setelah **animasi masuk soal selesai** — bukan saat state berubah.
- Soal dengan `totalMs > 30_000` **dibuang dari perhitungan kecepatan** (anak teralih), tapi
  tetap dihitung untuk akurasi.
- Dipakai **median**, bukan rata-rata.

## 4. Evaluator penguasaan

```ts
evaluate(module, state, result, thresholds): { next: ModuleState; events: Event[] }
```

Urutan pemeriksaan:
```
1. accuracy   >= thresholds.accuracy (grade, atau override modul/orang tua)?
2. sessions   — sudah cukup sesi lulus, sesuai aturan konsistensi grade?
3. coverage   — semua questionType pernah benar?
4. speed      — HANYA kalau module.fluencyTracked:
                median(thinkMs) <= target
```

Hasil:

| Kondisi | Status | Yang dilihat anak |
|---|---|---|
| 1–4 lolos | `mastered` | ⭐ + modul berikutnya terbuka |
| 1–3 lolos, 4 gagal | `practiced` | "Almost! Try a Speed Round" — modul berikutnya **tetap** terbuka |
| 1 atau 2 gagal | `learning` | jarak menuju lulus + tombol coba lagi |

**Keputusan penting: kecepatan tidak pernah mengunci kemajuan.** Anak yang paham tapi belum cepat
tetap maju; kekurangan kecepatannya ditangani lewat Speed Round dan review berkala. Mengunci
karena lambat akan menghukum anak yang berpikir hati-hati.

**Bintang:**
| ⭐ | lulus mastery |
| ⭐⭐ | lulus + akurasi ≥95% |
| ⭐⭐⭐ | Master Round: 10 soal, tanpa hint, maks 1 salah, median `thinkMs` ≤3 dtk |

### Anti-macet (CLAUDE.md §7)
```ts
if (consecutiveFailedSessions >= 3) {
  → paksa kembali ke layar Learn dengan penjelasan alternatif
  → sesi berikutnya memakai rentang parameter yang dipersempit (scaffolding)
  → maskot beralih ke nada menyemangati
}
```
Gating tetap ketat — yang berubah adalah **cara mengajarnya**, bukan syarat lulusnya.

## 5. Penjadwal review

```ts
const REVIEW_OFFSETS_DAYS = [3, 7, 30, 60];   // R1..R4
```
- Lolos R4 → status `retained`, keluar dari antrean.
- Gagal review → `needs_review`, `reviewStage` kembali ke 1. **Tidak mengunci ulang** modul
  berikutnya.
- **Maksimal 2 modul review per hari.** Prioritas: akurasi terendah → paling lama tidak disentuh.
- Review masuk hitungan streak (kalau tidak, anak tidak akan mau mengerjakannya).
- Review muncul di peta sebagai node "retak" di posisi modul aslinya, bukan sebagai daftar tugas
  terpisah — daftar tugas terasa seperti PR.

## 6. Gating & path order

```ts
isUnlocked(moduleId, state): boolean
// = semua prereq berstatus mastered|retained
//   DAN semua modul sebelumnya di pathOrder sudah mastered|retained
```
Dua syarat sekaligus karena `prereq` adalah graf logis (apa yang dibutuhkan) sementara `pathOrder`
adalah urutan yang dilihat anak. Keputusan user "gating ketat, tidak ada jalur alternatif" membuat
`pathOrder` yang mengikat; `prereq` tetap ada karena dia yang menjaga kebenaran urutan saat
kurikulum ditambah atau digeser.

## 7. Rencana pengujian

| Modul | Yang diuji |
|---|---|
| `generator` | tidak ada duplikat, cakupan sub-tipe, pengecoh unik & masuk akal, distribusi merata (1000 sampel) |
| `mastery` | tabel keputusan lengkap: setiap kombinasi lolos/gagal 4 syarat |
| `review` | offset hari benar, batas 2/hari, gagal → stage 1, R4 → retained |
| `unlock` | prereq melingkar terdeteksi, path order dihormati, modul baru tidak mengunci progress lama |
| `migrations` | contoh state versi lama nyata → hasil valid |
| `session` | antrean ulang, sesi tak berhenti di tengah soal, aturan berhenti cepat |
| lint konten | 6 aturan di `docs/curriculum/module-schema.md` |

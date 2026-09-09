# Skema Modul & Taksonomi Tipe Soal

Dokumen ini yang dipakai Fase 4 (desain teknis) dan Fase 5 (build). Satu modul = satu file data.

## 1. Skema satu modul

```ts
type Module = {
  id: string;              // "g1-u2-m4" — permanen, tidak pernah berubah
  unitId: string;          // "g1-u2"
  grade: 1|2|3|4|5|6;
  title: string;           // English, ≤4 kata, mis. "Make Ten"
  icon: string;            // emoji/ikon di peta

  prereq: string[];        // id modul yang harus `mastered` dulu. [] = modul pembuka grade
  skills: string[];        // skill id yang dilatih, mis. ["make-ten","add-within-10"]

  kind: 'concept' | 'fact' | 'application';
  //  concept     — memahami ide baru (nilai tempat, bentuk). TIDAK dinilai kecepatan.
  //  fact        — fakta yang harus otomatis (7+5). DINILAI kecepatan.
  //  application — memakai konsep di situasi (jam, uang, data). TIDAK dinilai kecepatan.

  fluencyTracked: boolean; // = (kind === 'fact'); ditulis eksplisit supaya bisa dikecualikan
  speedTargetMs?: number;  // override ambang grade; default dari tabel CLAUDE.md §6

  learn: LearnStep[];      // 1–4 layar, WAJIB melalui urutan CPA
  questionTypes: QType[];  // tipe soal yang boleh muncul di Practice & Mastery Check
  visuals: VisualId[];     // komponen visual yang dipakai — untuk cek reuse
  vocab: string[];         // kata English baru yang diperkenalkan modul ini

  masteryOverride?: {      // hanya kalau modul ini perlu ambang khusus
    accuracy?: number;
    sessions?: number;
  };
};

type LearnStep = {
  stage: 'concrete' | 'pictorial' | 'abstract';
  prompt: string;          // ≤8 kata English
  visual: VisualId;
  interaction: 'tap' | 'drag' | 'count' | 'watch' | 'choose';
  check?: Question;        // cek pemahaman ringan, tanpa konsekuensi
};
```

**Aturan yang divalidasi otomatis saat build** (linter konten, dibuat di Fase 5):
1. Setiap modul `kind: 'concept'` atau `'fact'` harus punya minimal satu `learn` step di tiap
   tahap CPA — tidak boleh langsung ke `abstract`.
2. Setiap `prereq` harus menunjuk modul yang ada, dan **tidak boleh melingkar**.
3. Setiap `prereq` harus berada di grade yang sama atau lebih rendah.
4. `prompt` maksimal 8 kata; kata di luar daftar kosakata yang sudah diperkenalkan → error.
5. `fluencyTracked: true` hanya boleh kalau `kind === 'fact'`.
6. Setiap modul punya minimal 2 `questionTypes` berbeda (anti-hafal-bentuk-soal).

## 2. Taksonomi tipe soal

| ID | Bentuk | Input | Cocok untuk | Grade |
|---|---|---|---|---|
| `count-tap` | tap objek satu per satu sambil dihitung | tap | berhitung, subitizing | 1–2 |
| `choose-number` | pilih 1 dari 3–4 angka | tap | hampir semua | 1–6 |
| `keypad` | ketik jawaban di keypad besar | keypad | fakta +/−/×/÷ | 1–6 |
| `tenframe-fill` | isi ten-frame sampai jumlah tertentu | drag/tap | make ten, teen numbers | 1–2 |
| `number-bond` | isi bagian yang kosong di number bond | keypad/drag | part–whole, fact family | 1–3 |
| `number-line-drop` | letakkan angka di garis bilangan | drag | urutan, jarak, pecahan, bilangan bulat | 1–6 |
| `drag-to-bucket` | kelompokkan objek ke kategori | drag | bangun, ganjil/genap, data | 1–6 |
| `match-pairs` | pasangkan dua kolom | tap-tap | angka↔kata, bentuk↔nama, pecahan↔gambar | 1–6 |
| `order-items` | urutkan dari kecil ke besar | drag | urutan bilangan, panjang | 1–6 |
| `compare-symbol` | pilih `>` `=` `<` | tap | perbandingan | 1–6 |
| `missing-number` | `8 + ? = 11` | keypad | makna `=`, aljabar awal | 1–6 |
| `true-false` | benar/salah | tap | cek miskonsepsi | 1–6 |
| `build-number` | susun dengan base-10 blocks | drag | nilai tempat | 1–4 |
| `clock-set` | putar jarum jam | drag | waktu | 1–3 |
| `coin-pick` | ambil uang senilai X | tap | uang | 1–3 |
| `pattern-next` | lanjutkan pola | tap/drag | pola | 1–4 |
| `bar-model` | isi bar model | drag/keypad | soal cerita, rasio | 2–6 |
| `grid-array` | bentuk array | tap | perkalian, luas | 3–5 |

**Catatan input:** `keypad` menambah waktu motorik paling besar. Untuk modul `fact` di Grade 1–2,
utamakan `choose-number` (3 opsi) agar `totalMs` tidak didominasi waktu mengetik — `keypad`
dipakai mulai Grade 3 atau untuk Master Round.

**Lebar input keypad tidak perlu ditulis di konten.** Sejak 2026-09-09 lebarnya diturunkan
otomatis dari jawaban TERBESAR yang mungkin dihasilkan aturannya (`answerDigits` di
`src/engine/generator.ts`), lalu dipakai `QuestionScreen`. Diambil per aturan, bukan per soal,
supaya panjang input tidak membocorkan jawaban. Batas atasnya `MAX_ANSWER_DIGITS = 6` —
aturan yang minta lebih, atau berjawaban negatif/pecahan (keypad tidak punya minus maupun
titik desimal), ditolak linter lewat aturan `input-width`.

## 3. Komponen visual (ID tetap, dipakai lintas grade)

`ten-frame` · `number-bond` · `number-line` · `base10-blocks` · `bar-model` · `array-grid` ·
`fraction-shape` · `clock` · `money` · `shape-2d` · `shape-3d` · `tally-chart` · `pictogram` ·
`bar-chart` · `angle-arc` · `coordinate-grid` · `counter-objects`

Ini daftar tertutup untuk v1. Modul baru **harus** memakai salah satu dari ini; kalau butuh yang
baru, itu keputusan arsitektur (biaya besar), bukan keputusan konten.

## 4. Bank soal — aturan generasi

Soal **digenerate dari aturan**, bukan daftar tetap (anti-hafal, sudah jadi keputusan di
CLAUDE.md §6).

```ts
type QuestionRule = {
  type: QType;
  params: Record<string, [min, max] | number[]>;  // rentang angka yang boleh muncul
  exclude?: (q) => boolean;    // mis. buang soal trivial seperti 0 + n
  distractors: 'near' | 'digit-swap' | 'random';  // cara membuat pilihan salah
};
```

**Aturan pengecoh (distractor)** — ini yang membedakan kuis yang mengajar dari kuis yang menebak:
- `near` — jawaban ±1, ±2 (menguji ketelitian berhitung).
- `digit-swap` — 21 vs 12 (menguji nilai tempat).
- Jangan pernah membuat pengecoh yang **mustahil** (mis. jawaban 3 digit untuk soal dalam 10) —
  itu memberi jawaban gratis.
- Minimal satu pengecoh harus mencerminkan **miskonsepsi yang umum** untuk modul itu, supaya
  data salah anak bisa dibaca sebagai diagnosis (lihat `../research/02-pedagogy.md §2.4`).

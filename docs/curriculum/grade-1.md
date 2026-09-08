# Grade 1 — Rancangan Lengkap

**8 unit · 43 modul.** Acuan: Fase A Kurikulum Merdeka + Common Core Grade 1.

Kolom **Kind**: `concept` (paham ide) · `fact` (harus otomatis, **dinilai kecepatan**) ·
`application` (memakai konsep). Kolom **⏱** = `fluencyTracked`.

---

## U1 — Numbers to 10

| ID | Title | Kind | ⏱ | Prereq | Visual | Tipe soal | Kosakata baru |
|---|---|---|---|---|---|---|---|
| `g1-u1-m1` | Count to 5 | concept | – | — | counter-objects | count-tap, choose-number | count, how many |
| `g1-u1-m2` | Count to 10 | concept | – | u1-m1 | counter-objects, ten-frame | count-tap, choose-number | — |
| `g1-u1-m3` | Read and Write | concept | – | u1-m2 | counter-objects | match-pairs, choose-number | number, zero |
| `g1-u1-m4` | Quick Look | fact | ✅ | u1-m2 | ten-frame | choose-number | quick, look |
| `g1-u1-m5` | More or Less | concept | – | u1-m3 | counter-objects, ten-frame | compare-symbol, choose-number | more, less, same |
| `g1-u1-m6` | Put in Order | concept | – | u1-m5 | number-line | order-items, number-line-drop | before, after, order |

`Quick Look` = subitizing: pola titik ditampilkan **±2 detik** lalu ditutup. Ini satu-satunya modul
di Grade 1 yang memakai batas waktu tampil, dan itu bagian dari materinya — bukan tekanan.

## U2 — Add and Subtract within 10

| ID | Title | Kind | ⏱ | Prereq | Visual | Tipe soal | Kosakata baru |
|---|---|---|---|---|---|---|---|
| `g1-u2-m1` | Part and Whole | concept | – | u1-m6 | number-bond, counter-objects | number-bond, drag-to-bucket | part, whole |
| `g1-u2-m2` | Add to 5 | fact | ✅ | u2-m1 | ten-frame, number-bond | choose-number, keypad | add, plus, altogether |
| `g1-u2-m3` | Take Away from 5 | fact | ✅ | u2-m2 | ten-frame, counter-objects | choose-number | take away, minus, left |
| `g1-u2-m4` | Bonds of 10 | fact | ✅ | u2-m2 | ten-frame, number-bond | number-bond, tenframe-fill | bond, ten |
| `g1-u2-m5` | Add to 10 | fact | ✅ | u2-m4 | ten-frame | choose-number, keypad | — |
| `g1-u2-m6` | Take Away from 10 | fact | ✅ | u2-m5, u2-m3 | ten-frame | choose-number | — |
| `g1-u2-m7` | Fact Family | concept | – | u2-m6 | number-bond | number-bond, true-false | family, same |
| `g1-u2-m8` | Missing Number | concept | – | u2-m7 | number-bond, ten-frame | missing-number | missing, equals |

`Bonds of 10` adalah **modul kunci Grade 1** — prasyarat strategi *make ten* di U4. Kalau anak
lemah di sini, seluruh penjumlahan dalam 20 jadi lambat. Ambang modul ini sengaja dinaikkan:
`masteryOverride: { accuracy: 0.9 }`.

## U3 — Numbers to 20

| ID | Title | Kind | ⏱ | Prereq | Visual | Tipe soal | Kosakata baru |
|---|---|---|---|---|---|---|---|
| `g1-u3-m1` | Teen Numbers | concept | – | u2-m5 | ten-frame (×2) | tenframe-fill, choose-number | teen |
| `g1-u3-m2` | Tens and Ones | concept | – | u3-m1 | base10-blocks | build-number, choose-number | tens, ones, digit |
| `g1-u3-m3` | Compare to 20 | concept | – | u3-m2 | base10-blocks, number-line | compare-symbol | bigger, smaller |
| `g1-u3-m4` | Order to 20 | concept | – | u3-m3 | number-line | order-items, number-line-drop | — |

## U4 — Add and Subtract within 20

| ID | Title | Kind | ⏱ | Prereq | Visual | Tipe soal | Kosakata baru |
|---|---|---|---|---|---|---|---|
| `g1-u4-m1` | Add Ten | fact | ✅ | u3-m1 | ten-frame (×2) | choose-number | — |
| `g1-u4-m2` | Doubles | fact | ✅ | u2-m5 | ten-frame, array-grid | choose-number | double |
| `g1-u4-m3` | Near Doubles | fact | ✅ | u4-m2 | ten-frame | choose-number | near |
| `g1-u4-m4` | Make Ten to Add | concept | – | u2-m4, u4-m1 | ten-frame (×2), number-bond | tenframe-fill, number-bond | make, split |
| `g1-u4-m5` | Add within 20 | fact | ✅ | u4-m4, u4-m3 | ten-frame (×2) | choose-number, keypad | — |
| `g1-u4-m6` | Subtract within 20 | fact | ✅ | u4-m5, u2-m6 | ten-frame (×2), number-line | choose-number | — |

`Make Ten to Add` sengaja `concept` (tanpa ambang kecepatan) meski isinya aritmetika — anak sedang
belajar **strategi**, memaksanya cepat justru mematikan strateginya. Kecepatan baru dituntut di
`Add within 20`, modul sesudahnya.

## U5 — Numbers to 100

| ID | Title | Kind | ⏱ | Prereq | Visual | Tipe soal | Kosakata baru |
|---|---|---|---|---|---|---|---|
| `g1-u5-m1` | Count to 50 | concept | – | u3-m4 | number-line, base10-blocks | count-tap, order-items | — |
| `g1-u5-m2` | Count to 100 | concept | – | u5-m1 | number-line (100), base10-blocks | count-tap, choose-number | hundred |
| `g1-u5-m3` | Skip Count | fact | ✅ | u5-m2 | number-line (100) | pattern-next, choose-number | skip, by twos |
| `g1-u5-m4` | Tens and Ones to 100 | concept | – | u5-m2, u3-m2 | base10-blocks | build-number | — |
| `g1-u5-m5` | Compare Two-Digit | concept | – | u5-m4 | base10-blocks | compare-symbol | — |
| `g1-u5-m6` | Ten More, Ten Less | fact | ✅ | u5-m4 | base10-blocks, number-line | choose-number | — |

**Batas yang sengaja tidak dilewati:** Grade 1 berhenti di nilai tempat & ±10 mental.
Penjumlahan 2 digit **dengan menyimpan** masuk Grade 2 (lihat `README.md`).

## U6 — Shapes and Space

| ID | Title | Kind | ⏱ | Prereq | Visual | Tipe soal | Kosakata baru |
|---|---|---|---|---|---|---|---|
| `g1-u6-m1` | Flat Shapes | concept | – | u1-m2 | shape-2d | drag-to-bucket, match-pairs | circle, triangle, square, rectangle, side, corner |
| `g1-u6-m2` | Solid Shapes | concept | – | u6-m1 | shape-3d | drag-to-bucket, match-pairs | cube, box, cone, ball, cylinder |
| `g1-u6-m3` | Make New Shapes | concept | – | u6-m2 | shape-2d | drag-to-bucket, choose-number | join, make |
| `g1-u6-m4` | Halves and Fourths | concept | – | u6-m3 | fraction-shape | choose-number, true-false | half, fourth, equal |
| `g1-u6-m5` | Where Is It? | concept | – | u6-m1 | shape-2d, counter-objects | choose-number, drag-to-bucket | left, right, above, below, next to |

## U7 — Measure, Time and Money

| ID | Title | Kind | ⏱ | Prereq | Visual | Tipe soal | Kosakata baru |
|---|---|---|---|---|---|---|---|
| `g1-u7-m1` | Longer or Shorter | concept | – | u1-m5 | counter-objects | order-items, choose-number | long, short, tall |
| `g1-u7-m2` | Measure with Units | concept | – | u7-m1 | counter-objects | count-tap, choose-number | measure, unit |
| `g1-u7-m3` | Heavy and Light | concept | – | u7-m1 | counter-objects | choose-number, compare-symbol | heavy, light, full, empty |
| `g1-u7-m4` | Tell the Time | application | – | u5-m3 | clock | clock-set, match-pairs | clock, hour, half past, o'clock |
| `g1-u7-m5` | Money | application | – | u5-m5 | money | coin-pick, choose-number | money, buy, cost, change |

Modul `Money` memakai **Rupiah** (Rp500 – Rp20.000) meski bahasa app English — itu uang yang
benar-benar dipegang anak. Bisa diganti kalau kamu mau.

## U8 — Patterns and Data

| ID | Title | Kind | ⏱ | Prereq | Visual | Tipe soal | Kosakata baru |
|---|---|---|---|---|---|---|---|
| `g1-u8-m1` | What Comes Next? | concept | – | u6-m1 | shape-2d, counter-objects | pattern-next | pattern, next, repeat |
| `g1-u8-m2` | Tally Marks | application | – | u5-m3 | tally-chart | count-tap, choose-number | tally, group |
| `g1-u8-m3` | Picture Graph | application | – | u8-m2 | pictogram | choose-number, compare-symbol | graph, most, fewest |

---

## Urutan jalur (path order)

Gating **ketat & linear** (keputusan user), jadi urutan tampil di peta = urutan wajib. Tapi urutan
itu tidak harus sama dengan urutan unit — **unit sengaja diselang-seling** supaya anak tidak
mengerjakan 14 modul aritmetika berturut-turut, dan karena latihan berselang (*interleaving*)
memang lebih baik untuk retensi.

| # | Modul | Blok |
|---|---|---|
| 1–6 | `g1-u1-m1` … `m6` | Numbers to 10 |
| 7–8 | `g1-u6-m1`, `g1-u6-m2` | 🎨 jeda bentuk |
| 9–16 | `g1-u2-m1` … `m8` | Add & subtract within 10 |
| 17 | `g1-u8-m1` | 🎨 jeda pola |
| 18–21 | `g1-u3-m1` … `m4` | Numbers to 20 |
| 22–23 | `g1-u7-m1`, `g1-u7-m2` | 🎨 jeda ukur |
| 24–29 | `g1-u4-m1` … `m6` | Add & subtract within 20 |
| 30–31 | `g1-u6-m3`, `g1-u6-m4` | 🎨 jeda bentuk & pecahan |
| 32–37 | `g1-u5-m1` … `m6` | Numbers to 100 |
| 38–39 | `g1-u6-m5`, `g1-u7-m3` | 🎨 jeda posisi & berat |
| 40–41 | `g1-u7-m4`, `g1-u7-m5` | Waktu & uang |
| 42–43 | `g1-u8-m2`, `g1-u8-m3` | Data → **Grade 1 selesai** |

Setiap blok yang selesai memberi **badge unit** dan satu perayaan besar di peta.

## Ringkasan beban

| Ukuran | Angka |
|---|---|
| Total modul | 43 |
| Modul `fact` (dinilai kecepatan) | 12 |
| Modul `concept` | 24 |
| Modul `application` | 7 |
| Layar Learn yang harus ditulis (±3/modul) | ±129 |
| Kata English baru diperkenalkan | ±45 |
| Perkiraan waktu anak menyelesaikan Grade 1 | ±4–6 bulan @1 sesi/hari |

**Vertical slice Fase 5a = modul #1–16** (U1 + jeda bentuk + U2): 16 modul, sudah mencakup
5 dari 12 modul `fact`, dan cukup untuk dipakai anak ±6–8 minggu.

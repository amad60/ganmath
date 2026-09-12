/**
 * Mencari BENTUK jawaban sebuah aturan bercerita.
 *
 * Soal cerita punya lubang yang tidak dipunyai soal lambang: kalimatnya dan
 * fungsi `answer`-nya ditulis TERPISAH, jadi tidak ada yang memaksa keduanya
 * bicara tentang hitungan yang sama. Oracle `answer-matches-text` tidak menolong —
 * ia hanya bisa membaca ekspresi telanjang ("7 × 8 = ?"), bukan kalimat.
 *
 * Yang diperiksa di sini KONSISTENSI, bukan makna: adakah SATU rumus, atas
 * angka-angka yang benar-benar muncul di kalimat, yang menjelaskan jawabannya di
 * SELURUH kombinasi parameter? Kalau ada, `answer` memang menghitung sesuatu dari
 * soal yang dibaca anak. Kalau tidak ada satu pun, jawabannya melayang lepas dari
 * kalimatnya — dan itu selalu bug.
 *
 * Sengaja TIDAK menebak operasi dari kata kerjanya. Percobaan pertama melakukan
 * itu dan langsung salah menuduh soal yang benar: "A box needs 10 eggs. Budi puts
 * in 3. How many more?" dibacanya sebagai penjumlahan karena ada kata "puts",
 * padahal jawabannya 7 dan itu benar. Penjaga yang meneriaki soal benar akan
 * dimatikan orang, lalu tidak menjaga apa pun.
 *
 * Batasnya jujur: pemeriksa ini TIDAK bisa membedakan "diberi 3 lagi" dari
 * "diberikan 3" — keduanya rumus dua angka yang konsisten. Yang ia tangkap adalah
 * jawaban yang tidak berhubungan dengan angka di kalimatnya sama sekali, atau yang
 * hubungannya putus di sebagian parameter.
 */

/**
 * Contoh yang TERSEBAR di seluruh ruang soal, bukan yang pertama-pertama.
 *
 * `enumerate` mengembalikan hasil kali kartesian dalam urutan tetap, jadi 40 combo
 * pertama sering punya nilai parameter pertama yang SAMA SEMUA. Dengan itu, rumus
 * palsu yang kebetulan cocok — "n2 × 2", di mana 2 sebenarnya parameter yang
 * berubah-ubah — lolos sebagai penjelasan. Pemeriksa yang bilang "aman" karena
 * hanya melihat sudut ruangnya lebih buruk daripada tidak ada pemeriksa.
 */
export function spread<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  const step = items.length / n;
  return Array.from({ length: n }, (_, i) => items[Math.floor(i * step)] as T);
}

/** Angka yang benar-benar terbaca anak, termasuk pembilang/penyebut dan persen. */
export function numbersIn(text: string): number[] {
  const out: number[] = [];
  const re = /(?:-|−)?\d+(?:\.\d+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push(Number(m[0].replace('−', '-')));
  return out;
}

type Base = { label: string; value: number };

/** Nilai-nilai antara yang mungkin jadi dasar jawaban. */
function bases(n: number[]): Base[] {
  const out: Base[] = [];
  const k = Math.min(n.length, 6);
  const ok = (v: number) => Number.isFinite(v);
  const push = (label: string, v: number) => {
    if (ok(v)) out.push({ label, value: v });
  };

  for (let i = 0; i < k; i++) push(`n${i}`, n[i] as number);
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      const a = n[i] as number;
      const b = n[j] as number;
      push(`n${i}+n${j}`, a + b);
      push(`n${i}-n${j}`, a - b);
      push(`n${i}*n${j}`, a * b);
      if (b !== 0) {
        push(`n${i}/n${j}`, a / b);
        push(`floor(n${i}/n${j})`, Math.floor(a / b));
      }
      push(`min(n${i},n${j})`, Math.min(a, b));
      push(`max(n${i},n${j})`, Math.max(a, b));
    }
  }
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      for (let l = 0; l < k; l++) {
        if (i === j || j === l || i === l) continue;
        const a = n[i] as number;
        const b = n[j] as number;
        const c = n[l] as number;
        if (c !== 0) push(`n${i}*n${j}/n${l}`, (a * b) / c);
        // pembagian menurut perbandingan: total × bagian ÷ jumlah bagian
        if (b + c !== 0) push(`n${i}*n${j}/(n${j}+n${l})`, (a * b) / (b + c));
      }
    }
  }
  if (k >= 2) {
    const all = n.slice(0, k);
    push('mean(all)', all.reduce((s, v) => s + v, 0) / all.length);
    push('sum(all)', all.reduce((s, v) => s + v, 0));
  }
  return out;
}

const EPS = 1e-9;
const close = (a: number, b: number) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));

/**
 * Rumus yang menjelaskan seluruh pasangan (kalimat, jawaban), atau null.
 *
 * Tetapannya (`× c`, `+ c`) DITURUNKAN dari kombinasi pertama lalu diuji ke
 * semuanya — itu yang membuat keliling (×2), persen (÷100), satuan (×1000), dan
 * keliling lingkaran (×π) tertangkap tanpa harus didaftar satu per satu.
 */
export function storyShape(samples: { text: string; answer: number }[]): string | null {
  if (samples.length === 0) return null;
  const first = samples[0] as { text: string; answer: number };
  let cands = bases(numbersIn(first.text)).flatMap(({ label, value }) => {
    const out: { label: string; test: (b: number) => number }[] = [];
    if (value !== 0) {
      const c = first.answer / value;
      out.push({ label: c === 1 ? label : `${label} * ${c}`, test: (b) => b * c });
    }
    const d = first.answer - value;
    out.push({ label: d === 0 ? label : `${label} + ${d}`, test: (b) => b + d });
    return out.map((o) => ({ ...o, key: label }));
  });

  for (const s of samples.slice(1)) {
    const bs = new Map(bases(numbersIn(s.text)).map((b) => [b.label, b.value]));
    cands = cands.filter((c) => {
      const v = bs.get(c.key);
      return v != null && close(c.test(v), s.answer);
    });
    if (cands.length === 0) return null;
  }
  // Yang paling pendek = penjelasan paling sederhana.
  return cands.map((c) => c.label).sort((a, b) => a.length - b.length)[0] ?? null;
}

import type { LearnStep, LearnVisual } from '../content/types';
import type { Question } from './types';

export type HintContent = {
  prompt: string;
  visual: LearnVisual;
  /** Langkah aksi ditampilkan sudah selesai (lihat QuestionScreen). */
  doneValue: number;
  /**
   * Langkah `tap-clue`: indeks kalimat bukti yang disorot. `target`-nya indeks,
   * bukan jumlah, jadi tidak boleh dikirim lewat `doneValue`.
   */
  clue?: number;
};

function column(left: number, right: number, op: '+' | '−'): LearnVisual {
  return { kind: 'column-sum', a: left, b: right, op, showTotal: false };
}

/**
 * Berapa soal pertama latihan yang bantuannya terbuka SENDIRI.
 *
 * Latihan dulu dimulai dingin: materi sekali lewat, lalu soal tanpa pendamping, dan
 * Hint dijatah 2 kali. Untuk anak yang belajar sendirian itu membuat latihan terasa
 * seperti tes. Tiga soal pertama sekarang dikerjakan bersama gambarnya (contoh yang
 * dibimbing), lalu bantuannya memudar — anak masih bisa membukanya kapan saja,
 * tanpa jatah. Bantuan yang terbuka sendiri TIDAK dicatat sebagai `hintUsed`:
 * anak tidak memintanya.
 */
export const GUIDED_PRACTICE = 3;

const MINUS = '−';

function signed(n: number): string {
  return n < 0 ? MINUS + String(-n) : String(n);
}

function readSigned(sign: string | undefined, digits: string): number {
  const n = Number(digits);
  return sign === MINUS || sign === '-' ? -n : n;
}

function lineFor(start: number, end: number): LearnVisual {
  const lo = Math.min(start, end, 0) - 1;
  const hi = Math.max(start, end, 0) + 1;
  return {
    kind: 'number-line',
    min: lo,
    max: hi,
    value: start,
    marks: [0],
    step: 1,
    hopTo: end,
  };
}

/**
 * Dua bilangan yang SEDANG ditanyakan, plus operasinya.
 *
 * Diutamakan dari teks soal (`26 + 37 = ?`, `Ana has 26. Budi has 37`) supaya
 * parameter mesin yang tersimpan sebagai puluhan (`a=2, b=3` untuk 20+30) tidak
 * menggambar dua kubus.
 *
 * Hanya kalau jawaban BENAR-BENAR hasil operasi itu. `6 + 6 = 10 + ?` dan
 * `1/4 + 5/8` dulu ikut kebaca sebagai 6+6 dan 4+5.
 */
export function operandsOf(
  q: Question,
): { left: number; right: number; op: '+' | '−' | '×' | '÷' } | null {
  // Jangan menyeberangi `/` (1/4 + 5/8 ≠ 4+5) atau titik desimal (0.11 × 2 ≠ 11 × 2).
  // Minus U+2212 ikut (−6 + 9). Hitungannya harus YANG DITANYAKAN: sesudahnya
  // `= ?`, `?`, titik, atau akhir kalimat. `3 × 2 × ? = 36` dulu terbaca 3 × 2,
  // karena jawabannya kebetulan 6.
  const re =
    /(?<![\d.\/]|[+−\-×÷*]\s?)(−|-)?(\d+)(?![\d.\/])\s*([+−\-×x*÷])\s*(−|-)?(\d+)(?![\d.\/])(?=\s*(?:=\s*\?|\?|\.|$))/g;
  for (const m of q.text.matchAll(re)) {
    const left = readSigned(m[1], m[2]!);
    const right = readSigned(m[4], m[5]!);
    const raw = m[3]!;
    if (raw === '+' && q.answer === left + right) return { left, right, op: '+' };
    if ((raw === '-' || raw === MINUS) && q.answer === left - right) {
      return { left, right, op: '−' };
    }
    if ((raw === '×' || raw === 'x' || raw === '*') && q.answer === left * right) {
      return { left, right, op: '×' };
    }
    if (raw === '÷' && right !== 0 && q.answer === left / right) {
      return { left, right, op: '÷' };
    }
  }

  // Soal cerita tanpa lambang — HANYA aturan `story`. Dulu setiap teks dicoba: dua
  // angka pertama yang kebetulan cocok dengan jawabannya jadi "operasi", dan
  // `1 ? 1` lahir sebagai "Take 1", `Which is more: 2 or 1?` sebagai "2 rows of 1".
  if (!q.story && !q.text.includes('Rp')) return null;
  // Pecahan, desimal, persen, rasio, pangkat: angkanya bukan suku hitungan.
  if (/\/|\d\.\d|%|:|²|√/.test(q.text.replace(/Rp[\d.]+/g, 'Rp'))) return null;
  // Tepat dua angka. "2 cakes cost 4 coins. What do 3 cakes cost?" dulu jadi
  // "2 and 4" — karena jawabannya kebetulan 6.
  const nums = numbersIn(q.text);
  if (nums.length !== 2) return null;
  const left = nums[0]!;
  const right = nums[1]!;
  // "3 eggs in each basket": kata `each` menandai kelompok sama besar. 2 × 2 = 2 + 2,
  // jadi tanpa ini "2 baskets. 2 apples in each" tergambar sebagai ikatan 2 dan 2.
  if (/\beach\b|\bevery\b|\brows? of\b/i.test(q.text)) {
    return q.answer === left * right ? { left, right, op: '×' } : null;
  }
  if (q.answer === left + right) return { left, right, op: '+' };
  if (q.answer === left - right) return { left, right, op: '−' };
  return null;
}

/** Angka di kalimat, dengan `Rp20.000` dibaca 20000. */
function numbersIn(text: string): number[] {
  return [...text.matchAll(/Rp(\d{1,3}(?:\.\d{3})+|\d+)|(−|-)?\d+/g)].map((x) => {
    if (x[1] != null) return Number(x[1].replace(/\./g, ''));
    const raw = x[0]!;
    return raw.startsWith(MINUS) || raw.startsWith('-') ? -Number(raw.slice(1)) : Number(raw);
  });
}

function rupiah(n: number): string {
  return `Rp${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function rowsOf(rows: number, cols: number): string {
  return `${rows} ${rows === 1 ? 'row' : 'rows'} of ${cols}.`;
}

/**
 * Perkalian yang SEDANG ditanyakan, digambar utuh.
 *
 * Gambarnya harus sama dengan kalimatnya. Dulu baris terakhir sengaja disembunyikan
 * (supaya jawabannya tidak terbaca), jadi `3 × 6` tertulis "3 rows of 6" di atas
 * DUA baris — anak yang menghitung titiknya mendapat 12 dan dinilai salah.
 * Jumlah akhirnya tetap tidak ditulis: anak yang menghitung barisnya.
 *
 * Faktor di atas 6 dulu jatuh ke ikatan bilangan (gambar PENJUMLAHAN 7 dan 8).
 */
function timesHint(left: number, right: number, story = false): HintContent | null {
  if (left >= 1 && right >= 1 && left <= 10 && right <= 10) {
    // Baris lebih dari 6 terlalu tinggi untuk panel Hint; diputar, dan sifat
    // tukar sudah diajarkan (Turn Around Facts). Soal cerita tidak punya lambang
    // untuk diputar, jadi cukup barisnya.
    if (left > 6 && right <= 6) {
      return {
        prompt: story ? rowsOf(right, left) : `Turn it: ${rowsOf(right, left)}`,
        visual: { kind: 'array', rows: right, cols: left },
        doneValue: 0,
      };
    }
    return {
      prompt: rowsOf(left, right),
      visual: { kind: 'array', rows: left, cols: right },
      doneValue: 0,
    };
  }
  if (left < 1 || right < 1) return null;
  // Faktor besar dipecah menurut nilai tempat: 12 × 5 = 10 × 5 dan 2 × 5,
  // seperti 26 + 37 dipecah jadi satuan dan puluhan.
  const big = Math.max(left, right);
  const other = big === left ? right : left;
  const place = 10 ** (String(big).length - 1);
  const head = Math.floor(big / place) * place;
  const rest = big - head;
  if (rest === 0) {
    // 2 × 100: dua lompatan 100.
    if (big === place && other <= 10) {
      return {
        prompt: `${other} ${other === 1 ? 'jump' : 'jumps'} of ${big}.`,
        visual: { kind: 'number-line', min: 0, max: big * Math.max(other, 2), value: null, marks: jumps(big, other) },
        doneValue: 0,
      };
    }
    // 20 × 3: fakta dasarnya, lalu nilai tempatnya.
    const digit = big / place;
    const fact = timesHint(digit, other);
    if (!fact || other > 10) return null;
    return { ...fact, prompt: `Think ${digit} × ${other}. Then times ${place}.` };
  }
  return {
    prompt: `${head} × ${other} and ${rest} × ${other}.`,
    visual: { kind: 'number-bond', whole: null, parts: [head * other, rest * other], ask: 'whole' },
    doneValue: 0,
  };
}

/**
 * Pembagian: berbagi rata ("between 3", "÷ 3") = 3 baris, cari isi satu baris;
 * mengelompokkan ("bags of 2") = baris berisi 2, cari banyak barisnya.
 */
function divideHint(total: number, by: number, grouping: boolean): HintContent | null {
  if (by <= 0 || total % by !== 0) return null;
  const each = total / by;
  if (grouping) {
    if (each > 10 || by > 12) return null;
    return {
      prompt: `Make rows of ${by}. How many rows?`,
      visual: { kind: 'array', rows: each, cols: by },
      doneValue: 0,
    };
  }
  if (by > 10 || each > 12) return null;
  return {
    prompt: `${total} in ${by} equal rows. How many in one row?`,
    visual: { kind: 'array', rows: by, cols: each },
    doneValue: 0,
  };
}

const GROUPING = /\b(?:groups?|bags?|boxes?|rows?|packs?|teams?|plates?) of \d|How many \d+s\b/i;
const SHARING = /÷|\bshare|\bbetween\b|\bequal(?:ly)?\b|\bon \d+ plates\b/i;

/**
 * Bagi bersisa: benda disusun per baris berisi `by` — satu baris = satu putaran
 * membagi, atau satu kantong. Baris penuh = bagian masing-masing, baris terakhir = sisa.
 * Dulu semua soal memakai contoh 13 ÷ 4 yang digambar 12 titik — sisanya tidak ada.
 */
function fromRemainder(q: Question): HintContent | null {
  if (!GROUPING.test(q.text) && !SHARING.test(q.text)) return null;
  if (/\/|\d\.\d|%|:|÷/.test(q.text)) return null;
  const nums = numbersIn(q.text);
  if (nums.length !== 2) return null;
  const total = Math.max(nums[0]!, nums[1]!);
  const by = Math.min(nums[0]!, nums[1]!);
  // Lebih dari 10 kolom tidak muat selebar HP.
  if (by <= 1 || by > 10 || total % by === 0 || total > 60) return null;
  const leftOver = /left|over|remain/i.test(q.text);
  if (q.answer !== (leftOver ? total % by : Math.floor(total / by))) return null;
  return {
    prompt: leftOver ? `Rows of ${by}. Look at the last row.` : `Rows of ${by}. Count the full rows.`,
    visual: { kind: 'counter-objects', count: total, columns: by },
    doneValue: 0,
  };
}

/** `2/3 of 12` dan "12 books. 2/3 are red." — 12 dalam 3 baris, ambil 2 baris. */
function fromFractionOf(q: Question): HintContent | null {
  const m =
    q.text.match(/(\d+)\/(\d+) of (\d+)/) ??
    (() => {
      const story = q.text.match(/(\d+)\b[^/]*?(\d+)\/(\d+) (?:of them|are|is)/);
      return story ? [story[0], story[2], story[3], story[1]] : null;
    })();
  if (!m) return null;
  const top = intOf(m[1]!);
  const bottom = intOf(m[2]!);
  const whole = intOf(m[3]!);
  if (bottom <= 0 || whole % bottom !== 0 || q.answer !== (whole / bottom) * top) return null;
  const each = whole / bottom;
  if (bottom > 10 || each > 12) return null;
  return {
    prompt: `${whole} in ${bottom} equal rows. Take ${top} ${top === 1 ? 'row' : 'rows'}.`,
    visual: { kind: 'array', rows: bottom, cols: each, highlightRow: 0 },
    doneValue: 0,
  };
}

/** "A garden is 5 metres by 3 metres. What is the perimeter?" / "3 cm by 2 cm. Area?" */
function fromRectangle(q: Question): HintContent | null {
  const m = q.text.match(/(\d+) ?(cm|m|metres?)? by (\d+) ?(cm|m|metres?)?/);
  if (!m) return null;
  const w = intOf(m[1]!);
  const h = intOf(m[3]!);
  const unit = m[2] ?? m[4];
  const short = unit == null ? undefined : unit.startsWith('metre') ? 'm' : unit;
  if (/perimeter/i.test(q.text) && q.answer === 2 * (w + h)) {
    return {
      prompt: `${w} + ${h} + ${w} + ${h}.`,
      visual: { kind: 'rect', w, h, ...(short ? { unit: short } : {}) },
      doneValue: 0,
    };
  }
  if (/area/i.test(q.text) && q.answer === w * h && w <= 12 && h <= 10) {
    return {
      prompt: `${rowsOf(h, w).slice(0, -1)} squares.`,
      visual: { kind: 'array', rows: h, cols: w, square: true, still: true },
      doneValue: 0,
    };
  }
  return null;
}

/** `12 ÷ 3`, "Share 12 between 3", "12 eggs in boxes of 4", "How many 2s make 8?". */
function fromDivision(q: Question): HintContent | null {
  const ops = operandsOf(q);
  if (ops?.op === '÷') return divideHint(ops.left, ops.right, false);
  const grouping = GROUPING.test(q.text);
  if (!grouping && !SHARING.test(q.text)) return null;
  if (/\/|\d\.\d|%|:|²|√|\?\s*=|÷ \?|\bn\b/.test(q.text)) return null;
  const nums = numbersIn(q.text);
  if (nums.length !== 2) return null;
  const total = Math.max(nums[0]!, nums[1]!);
  const by = Math.min(nums[0]!, nums[1]!);
  if (by <= 0 || q.answer !== total / by) return null;
  return divideHint(total, by, grouping);
}

function digitAt(n: number, place: number): number {
  return Math.floor(n / place) % 10;
}

/** Kolom pertama yang menyimpan, bukan cuma satuan: 110 + 90 menyimpan di puluhan. */
function addPrompt(left: number, right: number): string {
  if (digitAt(left, 1) + digitAt(right, 1) >= 10) {
    return `Ones first. ${digitAt(left, 1)} + ${digitAt(right, 1)}.`;
  }
  if (digitAt(left, 10) + digitAt(right, 10) >= 10) {
    return `Add the ones. Then tens: ${digitAt(left, 10)} + ${digitAt(right, 10)}.`;
  }
  return Math.max(left, right) >= 100
    ? 'Add the ones, then tens, then hundreds.'
    : 'Add the ones, then the tens.';
}

/** 300 − 11 harus membuka satu ratusan dulu: puluhannya kosong. */
function subtractPrompt(left: number, right: number): string {
  const openTen = digitAt(left, 1) < digitAt(right, 1);
  if (openTen && digitAt(left, 10) === 0 && left >= 100) {
    return 'Open one hundred. Then open one ten.';
  }
  if (openTen) return `Open one ten. Then take ${right}.`;
  if (left >= 100 && digitAt(left, 10) < digitAt(right, 10)) {
    return 'Take the ones. Then open one hundred.';
  }
  return left >= 100 ? 'Take the ones, then tens, then hundreds.' : 'Take the ones, then the tens.';
}

/** Soal belanja: uangnya sendiri, bukan ikatan "20 groups of 0". */
function moneyHint(left: number, right: number, op: '+' | '−' | '×'): HintContent | null {
  if (op === '×') {
    const count = Math.min(left, right);
    const price = Math.max(left, right);
    if (count < 1 || count > 6) return null;
    return {
      prompt: `${count} × ${rupiah(price)}.`,
      visual: { kind: 'money', items: Array.from({ length: count }, () => price) },
      doneValue: 0,
    };
  }
  if (op === '+') {
    return {
      prompt: `${rupiah(left)} and ${rupiah(right)}.`,
      visual: { kind: 'money', items: [left, right] },
      doneValue: 0,
    };
  }
  return {
    prompt: `Start with ${rupiah(left)}. Take ${rupiah(right)}.`,
    visual: { kind: 'money', items: [left] },
    doneValue: 0,
  };
}

function fromArithmetic(q: Question): HintContent | null {
  const ops = operandsOf(q);
  if (!ops || ops.op === '÷') return null;
  const { left, right, op } = ops;

  if (q.text.includes('Rp')) {
    const money = moneyHint(left, right, op);
    if (money) return money;
  }

  if (op === '+') {
    if (left < 0 || right < 0 || left + right < 0) {
      return {
        prompt: `Start at ${signed(left)}. Jump ${signed(right)}.`,
        visual: lineFor(left, left + right),
        doneValue: 0,
      };
    }
    if (left <= 10 && right <= 10 && left + right <= 20) {
      return {
        prompt: `${left} and ${right}.`,
        visual: { kind: 'number-bond', whole: null, parts: [left, right], ask: 'whole' },
        doneValue: 0,
      };
    }
    if (left < 1000 && right < 1000) {
      return {
        prompt: addPrompt(left, right),
        visual: column(left, right, '+'),
        doneValue: 0,
      };
    }
    return {
      prompt: `Add ${left} and ${right}.`,
      visual: { kind: 'number-bond', whole: null, parts: [left, right], ask: 'whole' },
      doneValue: 0,
    };
  }

  if (op === '−') {
    if (left < 0 || right < 0 || left - right < 0) {
      return {
        prompt: `Start at ${signed(left)}. Take ${signed(right)}.`,
        visual: lineFor(left, left - right),
        doneValue: 0,
      };
    }
    if (left <= 20 && right <= 10) {
      return {
        prompt: `Start with ${left}. Take ${right}.`,
        visual: { kind: 'ten-frame', value: left, capacity: left > 10 ? 20 : 10 },
        doneValue: 0,
      };
    }
    if (left < 1000 && right < 1000) {
      return {
        prompt: subtractPrompt(left, right),
        visual: column(left, right, '−'),
        doneValue: 0,
      };
    }
    return {
      prompt: `Take ${right} from ${left}.`,
      visual: { kind: 'number-bond', whole: left, parts: [right, null], ask: 'part1' },
      doneValue: 0,
    };
  }

  return timesHint(left, right, q.story === true);
}

const PLACE: Record<string, number> = {
  ones: 1,
  tens: 10,
  hundreds: 100,
  thousands: 1000,
  'ten thousands': 10000,
  'hundred thousands': 100000,
};

const PLACE_NAME =
  'hundred thousands|ten thousands|thousands|hundreds|tens|ones';

function intOf(raw: string): number {
  const n = Number(raw);
  return Number.isInteger(n) ? n : NaN;
}

function compareVisual(a: number, b: number): LearnVisual {
  if (
    a >= 0 &&
    b >= 0 &&
    a <= 20 &&
    b <= 20 &&
    Number.isInteger(a) &&
    Number.isInteger(b)
  ) {
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    return {
      kind: 'ten-frame',
      value: hi,
      capacity: hi > 10 ? 20 : 10,
      ...(a === b ? {} : { split: lo }),
    };
  }
  if (a < 0 || b < 0) {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    return {
      kind: 'number-line',
      min: Math.min(lo, 0) - 1,
      max: Math.max(hi, 0) + 1,
      value: a,
      marks: [b, 0],
      step: 1,
    };
  }
  return { kind: 'bars', values: [a, b], showValues: true };
}

function moreThan(_a: number, _b: number): string {
  return 'Look at both.';
}

/** `8 ? 10` dan `Which is more: 5 or 3?` — kedua angka soal ini, bukan contoh 6 > 4. */
function fromCompare(q: Question): HintContent | null {
  const pair = q.text.match(
    new RegExp(`^(${MINUS}|-)?(\\d+) \\? (${MINUS}|-)?(\\d+)$`),
  );
  if (pair) {
    const a = readSigned(pair[1], pair[2]!);
    const b = readSigned(pair[3], pair[4]!);
    if (q.answer !== Math.sign(a - b)) return null;
    return { prompt: moreThan(a, b), visual: compareVisual(a, b), doneValue: 0 };
  }

  const which = q.text.match(
    new RegExp(
      `^Which is (more|bigger|less|smaller): (${MINUS}|-)?(\\d+) or (${MINUS}|-)?(\\d+)\\?$`,
    ),
  );
  if (!which) return null;
  const a = readSigned(which[2], which[3]!);
  const b = readSigned(which[4], which[5]!);
  const wantLess = which[1] === 'less' || which[1] === 'smaller';
  const picked = wantLess ? Math.min(a, b) : Math.max(a, b);
  if (q.answer !== picked) return null;
  return { prompt: moreThan(a, b), visual: compareVisual(a, b), doneValue: 0 };
}

const ROUND_UNIT: Record<string, number> = {
  ten: 10,
  hundred: 100,
  thousand: 1000,
  whole: 1,
};

/** `Round 47 to the nearest ten.` — garis 40–50 dengan 47 di atasnya. */
function fromRound(q: Question): HintContent | null {
  const m = q.text.match(/^Round (\d+(?:\.\d+)?) to the nearest (ten|hundred|thousand|whole)\.$/);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = ROUND_UNIT[m[2]!]!;
  if (!Number.isFinite(n) || unit <= 0) return null;
  const rounded = Math.round(n / unit) * unit;
  if (q.answer !== rounded) return null;
  const down = Math.floor(n / unit) * unit;
  return {
    prompt: `Halfway is ${down + unit / 2}.`,
    visual: {
      kind: 'number-line',
      min: down,
      max: down + unit,
      value: n,
      marks: [down + unit / 2],
    },
    doneValue: 0,
  };
}

function showAmount(n: number): LearnVisual {
  if (Number.isInteger(n) && n >= 0 && n < 1000) {
    return {
      kind: 'base10',
      hundreds: Math.floor(n / 100),
      tens: Math.floor((n % 100) / 10),
      ones: n % 10,
    };
  }
  const top = n <= 0 ? 10 : Math.max(n, 10);
  return { kind: 'number-line', min: 0, max: top, value: Math.max(n, 0) };
}

function jumps(unit: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => unit * (i + 1));
}

/** `8 thousands = ?` dan `? tens = 400`. */
function fromPlace(q: Question): HintContent | null {
  const named = q.text.match(new RegExp(`^(\\d+) (${PLACE_NAME}) = \\?$`));
  if (named) {
    const count = intOf(named[1]!);
    const unit = PLACE[named[2]!]!;
    if (q.answer !== count * unit) return null;
    return {
      prompt: `${count} ${count === 1 ? 'group' : 'groups'} of ${unit}.`,
      visual: {
        kind: 'number-line',
        min: 0,
        max: Math.max(unit * 2, count * unit),
        value: null,
        marks: count <= 10 ? jumps(unit, count) : [unit],
      },
      doneValue: 0,
    };
  }

  const missing = q.text.match(new RegExp(`^\\? (${PLACE_NAME}) = (\\d+)$`));
  if (missing) {
    const unit = PLACE[missing[1]!]!;
    const total = intOf(missing[2]!);
    if (unit === 0 || total % unit !== 0 || q.answer !== total / unit) return null;
    const count = total / unit;
    return {
      prompt: `How many ${missing[1]} in ${total}?`,
      // Di atas 999 blok puluhan tidak muat; garisnya diberi lompatan sebesar satuannya.
      visual:
        total < 1000 || count > 20
          ? showAmount(total)
          : { kind: 'number-line', min: 0, max: total, value: null, marks: jumps(unit, count) },
      doneValue: 0,
    };
  }

  const two = q.text.match(
    /^(\d+) (thousands|hundred thousands) and (\d+) (hundreds|ten thousands) = \?$/,
  );
  if (two) {
    const left = intOf(two[1]!) * PLACE[two[2]!]!;
    const right = intOf(two[3]!) * PLACE[two[4]!]!;
    if (q.answer !== left + right) return null;
    return {
      prompt: `${left} and ${right}.`,
      visual: { kind: 'number-bond', whole: null, parts: [left, right], ask: 'whole' },
      doneValue: 0,
    };
  }
  return null;
}

/** `2/5 = ?/10` — pecahan soal ini, bukan contoh "potong jadi tiga". */
function fromFraction(q: Question): HintContent | null {
  const m = q.text.match(/^(\d+)\/(\d+) = \?\/(\d+)$/);
  if (!m) return null;
  const top = intOf(m[1]!);
  const bottom = intOf(m[2]!);
  const next = intOf(m[3]!);
  if (bottom <= 0 || next % bottom !== 0) return null;
  const k = next / bottom;
  if (q.answer !== top * k || next > 16) return null;
  return {
    prompt: `Multiply top and bottom by ${k}.`,
    visual: { kind: 'fraction', parts: bottom, shaded: top, shape: 'square' },
    doneValue: 0,
  };
}

/** `4 × ? = 8` — hasilnya 2, bukan gambar pecahan modul. */
function fromFactor(q: Question): HintContent | null {
  const m = q.text.match(/^(\d+) × \? = (\d+)$/);
  if (!m) return null;
  const left = intOf(m[1]!);
  const product = intOf(m[2]!);
  if (left <= 0 || product % left !== 0 || q.answer !== product / left) return null;
  return {
    prompt: `${left} times what?`,
    visual: { kind: 'number-bond', whole: product, parts: [left, null], ask: 'part1' },
    doneValue: 0,
  };
}

/** "What comes after 21?", "Ten more than 15 = ?", "Hundred less than 300 = ?". */
function fromNeighbor(q: Question): HintContent | null {
  const next = q.text.match(/^What comes (after|before) (\d+)\?$/);
  if (next) {
    const n = intOf(next[2]!);
    const end = next[1] === 'after' ? n + 1 : n - 1;
    if (q.answer !== end || end < 0) return null;
    return {
      prompt: next[1] === 'after' ? `Start at ${n}. One more.` : `Start at ${n}. One less.`,
      visual: {
        kind: 'number-line',
        min: Math.max(0, n - 3),
        max: n + 3,
        value: n,
        step: 1,
        hopTo: end,
      },
      doneValue: 0,
    };
  }
  const ten = q.text.match(/^(Ten|Hundred) (more|less) than (\d+) = \?$/);
  if (!ten) return null;
  const n = intOf(ten[3]!);
  const unit = ten[1] === 'Ten' ? 10 : 100;
  const more = ten[2] === 'more';
  if (q.answer !== (more ? n + unit : n - unit) || n >= 1000) return null;
  const name = unit === 10 ? 'ten' : 'hundred';
  const keep = unit === 10 ? 'Same ones.' : 'Same tens and ones.';
  return {
    prompt: `${more ? 'Add' : 'Take'} one ${name}. ${keep}`,
    visual: showAmount(n),
    doneValue: 0,
  };
}

/** "Put 410 on the line." — garis soal itu, dengan dua tetangga bulatnya. */
function fromLinePlace(q: Question): HintContent | null {
  const m = q.text.match(/^Put (\d+) on the line\.$/);
  if (!m || !q.range) return null;
  const n = intOf(m[1]!);
  const [min, max] = q.range;
  if (q.answer !== n || n < min || n > max) return null;
  // Satuan bulat yang dikenal anak (1, 10, 100, …), bukan rentang/10: garis 40–80
  // dulu memberi "45 is between 44 and 48".
  let unit = 1;
  while ((max - min) / (unit * 10) >= 2) unit *= 10;
  const lower = min + Math.floor((n - min) / unit) * unit;
  if (lower === n || unit === 1) {
    return {
      prompt: unit === 1 ? `Count on from ${min}.` : `Count by ${unit}s from ${min}.`,
      visual: { kind: 'number-line', min, max, value: null },
      doneValue: 0,
    };
  }
  return {
    prompt: `${n} is between ${lower} and ${lower + unit}.`,
    visual: { kind: 'number-line', min, max, value: null, marks: [lower, lower + unit] },
    doneValue: 0,
  };
}

/** "Double 7 = ?", "Budi has the same", "Two plates. 4 on each." */
function fromDouble(q: Question): HintContent | null {
  const sym = q.text.match(/^Double (\d+) = \?$/);
  const story =
    q.story && /\bthe same\b|\btwice\b|\bTwo\b|\bdouble\b/i.test(q.text) ? numbersIn(q.text) : [];
  const n = sym ? intOf(sym[1]!) : story.length === 1 ? story[0]! : NaN;
  if (!Number.isInteger(n) || q.answer !== n * 2) return null;
  if (/\beach\b/i.test(q.text) && n <= 10) return timesHint(2, n);
  if (n <= 10) {
    return {
      prompt: `${n} and ${n}.`,
      visual: { kind: 'number-bond', whole: null, parts: [n, n], ask: 'whole' },
      doneValue: 0,
    };
  }
  return { prompt: addPrompt(n, n), visual: column(n, n, '+'), doneValue: 0 };
}

/** `7² = ?` adalah 7 × 7. */
function fromSquare(q: Question): HintContent | null {
  const m = q.text.match(/^(\d+)² = \?$/);
  if (!m) return null;
  const n = intOf(m[1]!);
  if (q.answer !== n * n) return null;
  const built = timesHint(n, n);
  return built ? { ...built, prompt: `${n}² means ${n} × ${n}. ${built.prompt}` } : null;
}

function fromCount(q: Question): HintContent | null {
  // Hanya kalau `n` memang BANYAKNYA yang ditanyakan. `Double 2`, `2 m = ? cm`, dan
  // `Find 10% of 11` dulu jadi "Count one by one" di atas 2 atau 11 titik.
  // Soal yang sudah punya gambar (uang, jam) tidak diganti ten-frame asing.
  if (q.params.n == null || q.visual || q.type === 'choose-text') return null;
  const n = q.params.n;
  if (q.answer !== n) return null;
  if (n < 0 || n > 20) return null;
  return {
    prompt: 'Count one by one.',
    visual: { kind: 'ten-frame', value: n, capacity: n > 10 ? 20 : 10 },
    doneValue: 0,
  };
}

function fromStep(step: LearnStep): HintContent {
  return {
    prompt: step.prompt,
    visual: step.visual,
    doneValue: step.action === 'watch' || step.action === 'tap-clue' ? 0 : (step.target ?? 0),
    ...(step.action === 'tap-clue' && step.target != null ? { clue: step.target } : {}),
  };
}

function learnStep(learn: LearnStep[] | undefined, chosen?: number): LearnStep | null {
  const steps = learn ?? [];
  if (steps.length === 0) return null;
  if (chosen != null && steps[chosen]) return steps[chosen]!;
  const pictorial = steps.filter((l) => l.stage === 'pictorial');
  return pictorial.at(-1) ?? steps.at(-1) ?? null;
}

/**
 * Bantuan untuk soal INI.
 *
 * Urutan:
 *  1. Gambar dari angkanya sendiri: 26+37, 8 ? 10, Round 47, 8 thousands,
 *     2/5 = ?/10. Bukan contoh Learn 6 > 4 atau 47+38=85.
 *  2. Langkah Learn yang dipilih aturan (`QuestionRule.hint`) — modul bergagasan
 *     banyak, mis. bangun / pecahan.
 *  3. Ten-frame dari `n` hanya kalau `n` adalah banyaknya, dan soalnya tidak
 *     sudah bergambar.
 *  4. Langkah pictorial terakhir, sebagai jaring pengaman.
 */
export function hintFor(learn: LearnStep[] | undefined, question: Question): HintContent | null {
  // Science bukan hitungan. Mesin angka akan membaca "air" atau indeks pilihan
  // sebagai operasi, lalu menampilkan ten-frame yang bukan soalnya.
  if (question.skill.startsWith('sci-')) {
    if (question.hint != null) {
      const chosen = learnStep(learn, question.hint);
      if (chosen) return fromStep(chosen);
    }
    // Adegan "ubah satu hal" (concrete), BUKAN adegan tebak (predict): adegan tebak
    // memutar hasil yang benar, dan sebagian soal latihan menanyakan skenario yang
    // sama persis — Hint-nya akan menjadi kunci jawaban. Adegan concrete menunjukkan
    // sebab-akibatnya tanpa menjawab soal apa pun.
    const explored = learn?.find(
      (s) => s.visual.kind === 'science-scene' && s.visual.mode !== 'predict',
    );
    if (explored) return fromStep(explored);
    const pictured = learnStep(learn, undefined);
    return pictured ? fromStep(pictured) : null;
  }
  // Perbandingan lebih dulu: `20 ? 20` bukan 20 − 20.
  const built =
    fromCompare(question) ??
    fromDivision(question) ??
    fromRemainder(question) ??
    fromFractionOf(question) ??
    fromRectangle(question) ??
    fromArithmetic(question) ??
    fromDouble(question) ??
    fromSquare(question) ??
    fromNeighbor(question) ??
    fromLinePlace(question) ??
    fromRound(question) ??
    fromPlace(question) ??
    fromFraction(question) ??
    fromFactor(question);
  if (built) return built;
  if (question.hint != null) {
    const chosen = learnStep(learn, question.hint);
    if (chosen) return fromStep(chosen);
  }
  const counted = fromCount(question);
  if (counted) return counted;
  const fallback = learnStep(learn, undefined);
  return fallback ? fromStep(fallback) : null;
}

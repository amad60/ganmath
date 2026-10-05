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
): { left: number; right: number; op: '+' | '−' | '×' } | null {
  // Jangan menyeberangi `/` (1/4 + 5/8 ≠ 4+5). Minus U+2212 ikut (−6 + 9).
  const re = /(?<!\/)(−|-)?(\d+)\s*([+−\-×x*])\s*(−|-)?(\d+)(?!\/)/g;
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
  }

  // Soal cerita tanpa lambang. Pecahan punya `/` — jangan merangkai pembilangnya.
  if (q.text.includes('/')) return null;
  const nums = [...q.text.matchAll(/(−|-)?\d+/g)].map((x) =>
    x[0]!.startsWith(MINUS) || x[0]!.startsWith('-') ? -Number(x[0]!.slice(1)) : Number(x[0]),
  );
  if (nums.length >= 2) {
    const left = nums[0]!;
    const right = nums[1]!;
    if (q.answer === left + right) return { left, right, op: '+' };
    if (q.answer === left - right) return { left, right, op: '−' };
    if (q.answer === left * right) return { left, right, op: '×' };
  }
  return null;
}

function fromArithmetic(q: Question): HintContent | null {
  const ops = operandsOf(q);
  if (!ops) return null;
  const { left, right, op } = ops;

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
      const regroup = (left % 10) + (right % 10) >= 10;
      return {
        prompt: regroup
          ? `Ones first. ${left % 10} + ${right % 10}.`
          : 'Add the ones, then the tens.',
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
      const needOpen = left % 10 < right % 10;
      return {
        prompt: needOpen ? `Open one ten. Then take ${right}.` : 'Take the ones, then the tens.',
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

  // ×
  if (left >= 1 && right >= 1 && left <= 6 && right <= 10) {
    return {
      prompt: `${left} rows of ${right}.`,
      visual: { kind: 'array', rows: left, cols: right },
      doneValue: 0,
    };
  }
  return {
    prompt: `${left} groups of ${right}.`,
    visual: { kind: 'number-bond', whole: null, parts: [left, right], ask: 'whole' },
    doneValue: 0,
  };
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

/** `8 thousands = ?` dan `? tens = 400`. */
function fromPlace(q: Question): HintContent | null {
  const named = q.text.match(new RegExp(`^(\\d+) (${PLACE_NAME}) = \\?$`));
  if (named) {
    const count = intOf(named[1]!);
    const unit = PLACE[named[2]!]!;
    if (q.answer !== count * unit) return null;
    return {
      prompt: `${count} groups of ${unit}.`,
      visual: { kind: 'number-line', min: 0, max: Math.max(unit * 2, count * unit), value: null, marks: [unit] },
      doneValue: 0,
    };
  }

  const missing = q.text.match(new RegExp(`^\\? (${PLACE_NAME}) = (\\d+)$`));
  if (missing) {
    const unit = PLACE[missing[1]!]!;
    const total = intOf(missing[2]!);
    if (unit === 0 || total % unit !== 0 || q.answer !== total / unit) return null;
    return {
      prompt: `How many ${missing[1]} in ${total}?`,
      visual: showAmount(total),
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

function fromCount(q: Question): HintContent | null {
  // Hanya kalau `n` memang BANYAKNYA yang dilihat — bukan satu suku dari 6+7.
  // Soal yang sudah punya gambar (uang, jam) tidak diganti ten-frame asing.
  if (q.params.n == null || q.visual) return null;
  const n = q.params.n;
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
  const built =
    fromArithmetic(question) ??
    fromCompare(question) ??
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

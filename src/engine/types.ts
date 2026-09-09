/**
 * Tipe inti GanMath. Dipakai bersama oleh engine, store, dan konten.
 * ATURAN: file ini (dan seluruh src/engine) tidak boleh mengimpor React.
 */

export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type ModuleKind = 'concept' | 'fact' | 'application';

export type ModuleStatus =
  | 'available'
  | 'learning'
  | 'practiced'
  | 'mastered'
  | 'needs_review'
  | 'retained';
// 'locked' sengaja tidak ada: itu keadaan turunan (lihat unlock.ts).

export type QType =
  | 'count-tap'
  | 'choose-number'
  | 'choose-text'
  | 'keypad'
  | 'tenframe-fill'
  | 'number-bond'
  | 'number-line-drop'
  | 'drag-to-bucket'
  | 'match-pairs'
  | 'order-items'
  | 'compare-symbol'
  | 'missing-number'
  | 'true-false'
  | 'build-number'
  | 'clock-set'
  | 'coin-pick'
  | 'pattern-next'
  | 'bar-model'
  | 'grid-array';

export type VisualId =
  | 'ten-frame'
  | 'number-bond'
  | 'number-line'
  | 'base10-blocks'
  | 'bar-model'
  | 'array-grid'
  | 'fraction-shape'
  | 'clock'
  | 'money'
  | 'shape-2d'
  | 'rectangle'
  | 'shape-3d'
  | 'shape-net'
  | 'tally-chart'
  | 'pictogram'
  | 'bar-chart'
  | 'angle-arc'
  | 'circle'
  | 'coordinate-grid'
  | 'counter-objects';

export type DistractorKind = 'near' | 'digit-swap' | 'random';

export type ShapeName = 'circle' | 'triangle' | 'square' | 'rectangle' | 'pentagon' | 'hexagon';

/**
 * Bangun ruang yang bisa digambar app ini. Aturannya (nama, jumlah sisi, volume,
 * jaring-jaring) ada di `src/components/manipulatives/solids.ts` — satu tempat,
 * dipakai bersama data modul dan gambar.
 */
export type SolidName =
  | 'cube'
  | 'rectangular-prism'
  | 'triangular-prism'
  | 'square-pyramid'
  | 'cylinder';

/**
 * Gambar yang MERUPAKAN bagian dari soal (bukan bantuan).
 *
 * Bedanya penting: ten-frame yang muncul setelah menekan Hint adalah bantuan dan
 * disembunyikan saat ujian; sedangkan bangun datar yang harus dinamai anak adalah
 * soal itu sendiri, jadi selalu tampil.
 */
export type QuestionVisual =
  | { kind: 'ten-frame'; value: number; capacity?: 10 | 20; split?: number }
  | { kind: 'base10'; hundreds?: number; tens: number; ones: number }
  | { kind: 'shape2d'; name: ShapeName; showCorners?: boolean }
  | { kind: 'bars'; lengths: number[]; labels?: string[] }
  | { kind: 'fraction'; parts: number; shaded: number; shape?: 'circle' | 'square'; unequal?: boolean }
  | { kind: 'clock'; hour: number; minute: number }
  | { kind: 'money'; items: number[] }
  | { kind: 'tally'; count: number }
  | { kind: 'rect'; w: number; h: number; unit?: string; showCorners?: boolean }
  | { kind: 'array'; rows: number; cols: number; highlightRow?: number }
  | { kind: 'pictogram'; rows: { label: string; icon: string; count: number }[] }
  | {
      kind: 'number-line';
      min: number;
      max: number;
      value?: number | null;
      marks?: number[];
      /** Menimpa langkah otomatis. Isi hanya untuk langkah pecahan/desimal. */
      step?: number;
    }
  | {
      kind: 'angle';
      degrees: number;
      rotate?: number;
      showValue?: boolean;
      showName?: boolean;
      showScale?: boolean;
    }
  | ({ kind: 'solid' } & SolidVisual)
  | ({ kind: 'net' } & NetVisual)
  | ({ kind: 'circle' } & CircleVisual)
  | ({ kind: 'coordinate-grid' } & CoordinateVisual);

/**
 * Balok yang tersusun dari kubus satuan. Dipakai sama persis di Learn dan di soal,
 * jadi bentuknya ditulis sekali di sini.
 */
export type SolidVisual = {
  /** Panjang, lebar (kedalaman), tinggi dalam SATUAN kubus. 1–8. */
  l: number;
  w: number;
  h: number;
  /** Gambar tiap kubus satuan supaya bisa dihitung. Matikan untuk balok berlabel ukuran. */
  cubes?: boolean;
  /** Tulis ukuran di rusuknya. */
  showDimensions?: boolean;
  /** Tulis volumenya. Dimatikan saat volumenya yang ditanyakan. */
  showVolume?: boolean;
  /** Tulis namanya, mis. "rectangular prism". */
  showName?: boolean;
  /** Sorot satu lapis (0 = lapis paling bawah) — jembatan luas alas → volume. */
  highlightLayer?: number;
  /** Satuan panjang di label, mis. "cm". Kosong = "units". */
  unit?: string;
};

/**
 * Lingkaran dengan jari-jari / diameter bertanda. Aturannya (π, keliling, luas) ada di
 * `src/components/manipulatives/circles.ts` — satu tempat, dipakai bersama data modul
 * dan gambar, supaya angka di soal tidak pernah beda dari angka di gambar.
 */
export type CircleVisual = {
  /** Jari-jari dalam SATUAN. Isi ini ATAU `d`. */
  r?: number;
  /** Diameter dalam satuan. Dipakai kalau `r` kosong. */
  d?: number;
  /** Ruas yang digambar di dalam lingkaran. Default `radius`. */
  mark?: 'radius' | 'diameter' | 'both' | 'none';
  /** Tulis panjang ruasnya. Matikan saat panjang itu yang ditanyakan. */
  showValue?: boolean;
  /** Titik pusat. Default: ikut kalau ada ruas yang digambar. */
  showCenter?: boolean;
  /** Tulis kelilingnya. Dimatikan saat kelilingnya yang ditanyakan. */
  showCircumference?: boolean;
  /** Tulis luasnya. Dimatikan saat luasnya yang ditanyakan. */
  showArea?: boolean;
  /** Satuan panjang di label, mis. "cm". Kosong = "units". */
  unit?: string;
};

/** Jaring-jaring: bentangan sebuah bangun ruang. */
export type NetVisual = {
  solid: SolidName;
  /** Susunan jaring; bangun yang sama punya beberapa bentangan yang sah. */
  layout?: number;
  /** Ukuran balok, hanya untuk `rectangular-prism`. */
  l?: number;
  w?: number;
  h?: number;
  /** Tulis nama bangun hasil lipatannya. Dimatikan saat itu yang ditanyakan. */
  showName?: boolean;
  /** Beri nomor tiap sisi — dipakai saat mengajarkan "a cube has 6 faces". */
  numberFaces?: boolean;
};

/**
 * Bidang koordinat. Aturannya (menulis pasangan koordinat, kuadran, jarak sejajar
 * sumbu, sudut keempat persegi panjang) ada di
 * `src/components/manipulatives/coordinates.ts` — satu tempat, dipakai bersama data
 * modul dan gambar, supaya "(3, -2)" di soal tidak pernah beda dari yang di gambar.
 *
 * Gambarnya READ-ONLY: anak membaca titik yang sudah diplot, belum memplot sendiri.
 */
export type CoordinateVisual = {
  /** Titik yang digambar; `label` = nama titik di buku, mis. "A". */
  points?: { x: number; y: number; label?: string }[];
  /** `1` = hanya kuadran I (modul pengenalan), `4` = keempatnya. Default 4. */
  quadrants?: 1 | 4;
  /** Nilai terbesar di sumbu. Kosong = diturunkan dari titiknya. */
  range?: number;
  /** Sambungkan titik jadi bangun. 2 titik = ruas garis, 3+ = bangun tertutup. */
  shape?: boolean;
  /** Tulis pasangan koordinat di sebelah titik. Dimatikan saat itu yang ditanyakan. */
  showCoords?: boolean;
  /** Garis bantu putus-putus dari titik ke kedua sumbu — cara membaca koordinat. */
  guides?: boolean;
  /** Tulis "x" dan "y" di ujung sumbu. Default ikut tampil. */
  showAxisNames?: boolean;
  /** Tandai titik asal dan namai "origin". */
  showOrigin?: boolean;
};

/** Aturan pembuat soal. Soal dibuat dari aturan, bukan daftar tetap (anti-hafal). */
export type QuestionRule = {
  type: QType;
  skill: string;
  /** Rentang inklusif tiap parameter, mis. { a: [1, 9], b: [1, 9] }. */
  params: Record<string, [number, number]>;
  /** Menghitung jawaban benar dari parameter yang terpilih. */
  answer: (p: Record<string, number>) => number;
  /** Teks soal, mis. ({a,b}) => `${a} + ${b} = ?`. */
  text: (p: Record<string, number>) => string;
  /** Buang kombinasi yang tidak diinginkan (soal sepele, di luar cakupan). */
  exclude?: (p: Record<string, number>) => boolean;
  distractors?: DistractorKind;
  /**
   * Skala pengecoh `near`. Pengecoh dibuat pada jarak ±1, ±2, ±3 KALI nilai ini.
   *
   * Default 1 benar untuk soal satuan, tapi salah total untuk soal yang jawabannya
   * selalu kelipatan: "Round 270 to the nearest hundred" dengan pilihan 298/302
   * bisa dieliminasi tanpa berpikir. Isi 100 (atau 1000) di sana supaya pengecohnya
   * ratusan tetangga, bukan angka mustahil. Dijaga aturan lint `distractor-scale`.
   */
  distractorUnit?: number;
  /** Domain garis bilangan untuk soal `number-line-drop`. */
  range?: [number, number];
  /**
   * Menimpa langkah otomatis garis bilangan (lihat `stepFor`).
   *
   * Dikosongkan untuk hampir semua modul: langkahnya diturunkan dari lebar rentang,
   * jadi 150+ modul tidak perlu menuliskannya dan tidak bisa lupa menuliskannya.
   * Diisi hanya kalau materinya butuh langkah yang bukan bilangan bulat (pecahan,
   * desimal). Jawaban WAJIB kelipatan langkah efektif — dijaga lint `number-line-step`.
   */
  step?: number;
  /** Label pilihan untuk `choose-text`; jawabannya adalah INDEKS label yang benar. */
  options?: (p: Record<string, number>) => string[];
  /** Gambar yang merupakan bagian dari soal — selalu tampil, termasuk saat ujian. */
  visual?: (p: Record<string, number>) => QuestionVisual;
  /** Pengecoh yang mencerminkan miskonsepsi khas modul ini. Wajib untuk modul `fact`. */
  misconception?: (p: Record<string, number>) => number | null;
};

export type Question = {
  id: string;
  type: QType;
  skill: string;
  text: string;
  answer: number;
  choices?: number[];
  range?: [number, number];
  /** Langkah garis bilangan kalau modulnya menimpa langkah otomatis. */
  step?: number;
  /** Label untuk `choose-text` — layar merender options[choice], bukan angkanya. */
  options?: string[];
  visual?: QuestionVisual;
  /**
   * Lebar maksimum yang boleh diketik anak untuk soal input angka.
   *
   * Diturunkan dari jawaban TERBESAR yang mungkin dihasilkan aturannya, bukan dari
   * jawaban soal yang sedang tampil: kalau per soal, panjang input jadi bocoran —
   * anak tahu jawabannya tiga digit sebelum menghitung apa pun.
   */
  maxDigits: number;
  /**
   * Keypad menampilkan tombol titik desimal / minus untuk soal ini.
   *
   * Sama seperti `maxDigits`, diturunkan dari ATURANNYA — dari semua jawaban yang
   * mungkin dihasilkan rule itu, bukan dari jawaban soal yang sedang tampil.
   * Kalau per soal, munculnya tombol minus langsung memberi tahu anak bahwa
   * jawaban soal ini negatif: tombolnya menjawab soalnya.
   */
  allowDecimal: boolean;
  allowNegative: boolean;
  params: Record<string, number>;
};

export type ModuleDef = {
  id: string;
  unitId: string;
  grade: Grade;
  title: string;
  icon: string;
  prereq: string[];
  skills: string[];
  kind: ModuleKind;
  fluencyTracked: boolean;
  speedTargetMs?: number;
  questionTypes: QType[];
  visuals: VisualId[];
  vocab: string[];
  rules: QuestionRule[];
  masteryOverride?: { accuracy?: number; sessions?: number };
};

export type SessionKind = 'practice' | 'quiz' | 'review' | 'master' | 'speed' | 'testout';

/**
 * Ambang tes-lewat sengaja LEBIH TINGGI daripada ambang lulus biasa. Melewati modul
 * tanpa mempelajarinya hanya boleh kalau anak benar-benar sudah bisa — kalau tidak,
 * dia akan tersandung di modul yang bergantung padanya.
 */
export const TESTOUT_ACCURACY = 0.9;

export type QuestionResult = {
  questionId: string;
  type: QType;
  skill: string;
  correct: boolean;
  /** Soal muncul → input pertama disentuh. Metrik utama kecepatan. */
  thinkMs: number;
  /** Soal muncul → jawaban terkirim. */
  totalMs: number;
  /** Soal ulangan dalam sesi yang sama — TIDAK dihitung dalam akurasi. */
  retried: boolean;
  hintUsed: boolean;
};

export type SessionResult = {
  sessionId: string;
  moduleId: string;
  kind: SessionKind;
  date: string; // YYYY-MM-DD waktu lokal
  questions: QuestionResult[];
};

export type Attempt = {
  date: string;
  kind: SessionKind;
  accuracy: number;
  medianThinkMs: number;
  medianTotalMs: number;
  passed: boolean;
};

export type ModuleState = {
  status: ModuleStatus;
  stars: 0 | 1 | 2 | 3;
  learnCompletedAt?: string;
  masteredAt?: string;
  reviewStage: 0 | 1 | 2 | 3 | 4;
  consecutiveFails: number;
  attempts: Attempt[];
  totals: { sessions: number; questions: number; correct: number };
};

export type Thresholds = {
  accuracy: number;
  sessions: number;
  sameDayAllowed: boolean;
  speedMs: number;
};

/** Ambang per grade — sumber: CLAUDE.md §6. Berlaku pada thinkMs, bukan totalMs. */
export const GRADE_THRESHOLDS: Record<Grade, Thresholds> = {
  1: { accuracy: 0.8, sessions: 2, sameDayAllowed: true, speedMs: 8000 },
  2: { accuracy: 0.85, sessions: 2, sameDayAllowed: false, speedMs: 7000 },
  3: { accuracy: 0.85, sessions: 2, sameDayAllowed: false, speedMs: 6000 },
  4: { accuracy: 0.9, sessions: 2, sameDayAllowed: false, speedMs: 5000 },
  5: { accuracy: 0.9, sessions: 2, sameDayAllowed: false, speedMs: 5000 },
  6: { accuracy: 0.9, sessions: 3, sameDayAllowed: false, speedMs: 4000 },
};

/**
 * Batas atas lebar input angka di keypad.
 *
 * Lebar sebenarnya diturunkan per aturan soal (lihat `answerCaps`); konstanta ini
 * hanya pagar terakhir supaya aturan konten yang salah tulis tidak pernah meminta
 * anak mengetik dua puluh digit. Enam digit menampung seluruh bilangan yang ditulis
 * anak sampai Grade 6 (999.999) dan masih muat di kotak jawaban selebar layar 390px.
 * Yang dihitung hanya DIGIT: tanda minus dan titik desimal punya tombolnya sendiri
 * dan tidak memakan jatah, jadi `−12.75` memakai 4 dari 6.
 * Dijaga aturan lint `input-width`.
 */
export const MAX_ANSWER_DIGITS = 6;

/** Soal yang lebih lama dari ini dianggap anak teralih: dibuang dari hitungan kecepatan. */
export const SPEED_OUTLIER_MS = 30_000;

/** Ambang "otomatis" untuk bintang ke-3. Riset: 3 detik = batas ingat vs hitung ulang. */
export const AUTOMATIC_THINK_MS = 3_000;

export function emptyModuleState(): ModuleState {
  return {
    status: 'available',
    stars: 0,
    reviewStage: 0,
    consecutiveFails: 0,
    attempts: [],
    totals: { sessions: 0, questions: 0, correct: 0 },
  };
}

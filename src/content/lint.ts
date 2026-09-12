import { validateRegistry, type Registry } from '../engine/unlock';
import { answerCaps, enumerate, generateSet, uniqueChoices } from '../engine/generator';
import { mulberry32 } from '../engine/rng';
import { MAX_ANSWER_DIGITS, type QType } from '../engine/types';
// Matematika penempatan yang dipakai komponen garis bilangan itu sendiri — linter
// harus memakai angka yang PERSIS sama, kalau tidak dia hanya memeriksa tebakannya.
import { stepFor } from '../components/manipulatives/scale';
// Jumlah sisi/sudut diambil dari komponen yang menggambarnya, bukan disalin —
// salinan akan berbeda diam-diam begitu ada bangun baru.
import { SHAPE_SIDES } from '../components/manipulatives/Shape2D';
import type { ContentModule, LearnStep, LearnVisual } from './types';
import { spread, storyShape } from './storyShape';

export type LintProblem = { moduleId: string; rule: string; detail: string };

export const MAX_PROMPT_WORDS = 8;

/**
 * Batas panjang KALIMAT SOAL CERITA, per grade.
 *
 * Teks soal biasa tidak dibatasi siapa pun ("7 × 8 = ?" tidak perlu dijaga), tapi
 * soal cerita memindahkan beban ke MEMBACA. Kalau kalimatnya terlalu panjang untuk
 * umurnya, yang diukur app ini bukan lagi matematika melainkan kelancaran membaca
 * — dan penguasaan di sini ikut diukur dari kecepatan, jadi anak yang paham tapi
 * membaca pelan akan tercatat belum menguasai.
 *
 * Angkanya naik seiring grade dengan alasan yang sama seperti angkanya naik:
 * kalimat 25 kata pantas untuk anak kelas 6, dan tidak pantas untuk kelas 1.
 */
export const MAX_STORY_WORDS: Record<number, number> = {
  1: 12,
  2: 14,
  3: 18,
  4: 20,
  5: 22,
  6: 25,
};

/**
 * Kosakata sehari-hari yang boleh dipakai soal cerita tanpa dideklarasikan.
 *
 * Terpisah dari `BASE_VOCAB` dan sengaja dijaga PENDEK. Daftar ini adalah
 * satu-satunya hal yang menahan soal cerita berubah jadi karangan bebas: tiap kata
 * baru di sini adalah kata yang harus bisa dibaca anak kelas 1, jadi menambahnya
 * adalah keputusan, bukan formalitas.
 */
export const STORY_VOCAB = new Set(
  `apple apples book books pencil pencils pen pens candy candies cookie cookies
   marble marbles sticker stickers toy toys ball balls flower flowers bird birds
   fish cat cats dog dogs egg eggs cake cakes bread sweet sweets shell shells
   stone stones card cards block blocks seat seats bag bags basket baskets
   plate plates cup cups jar jars shelf shelves table tables
   mom dad friend friends class teacher shop school park home garden
   buys buy bought gets got gives gave eats ate finds found loses lost
   picks picked puts shares shared brings brought needs need costs cost
   pays paid wants sits sit stand walk run reads reading
   her his their its him she he they them
   altogether total rest still already just after before
   were was will be are there here own second third
   day days week weeks morning night
   red blue green yellow
   money coin coins rupiah rp price
   car cars bus train bike far
   ana budi siti rudi dewi`
    .split(/\s+/)
    .filter(Boolean),
);

/**
 * Manipulatif yang benar-benar bisa MENERIMA tiap aksi di layar Learn.
 *
 * Layar Learn mengunci tombol Next sampai anak mencapai `target`. Kalau aksinya
 * diminta pada manipulatif yang tidak punya jalan masuk (`onValue`), nilainya
 * tidak pernah naik dan anak terjebak di layar itu selamanya — tanpa pesan error,
 * tanpa jalan mundur selain keluar dari modul. Sudah terjadi dua kali di g1-u6
 * ("Tap the three corners" di atas gambar bangun yang tidak bisa disentuh).
 */
export const ACTION_VISUALS: Record<Exclude<LearnStep['action'], 'watch'>, LearnVisual['kind'][]> =
  {
    'tap-count': ['counter-objects', 'shape2d'],
    'tap-fill': ['ten-frame'],
    'drop-on-line': ['number-line'],
  };

/**
 * Alasan sebuah langkah Learn tidak bisa diselesaikan anak, atau null kalau bisa.
 * Selain manipulatif yang salah, target yang lebih besar daripada apa yang digambar
 * juga membuat layar buntu: 5 sudut diminta pada segitiga tidak akan pernah tercapai.
 */
export function learnStepBlocked(step: LearnStep): string | null {
  if (step.action === 'watch') return null;
  const v = step.visual;
  const allowed = ACTION_VISUALS[step.action];
  if (!allowed.includes(v.kind)) {
    return `aksi "${step.action}" tidak bisa dilakukan di visual "${v.kind}"`;
  }
  const target = step.target;
  if (target == null) return null;

  if (v.kind === 'shape2d') {
    if (!v.tap) return 'bangun tidak menyatakan bagian yang bisa disentuh (`tap`)';
    // Sudut dan sisi jumlahnya sama di semua bangun yang digambar app ini.
    const parts = SHAPE_SIDES[v.name];
    if (v.tap === 'corners' && !v.showCorners) {
      return 'menghitung sudut tapi sudutnya tidak digambar (`showCorners`)';
    }
    if (target !== parts) {
      return `minta ${target} ${v.tap} tapi ${v.name} punya ${parts}`;
    }
  }
  if (v.kind === 'counter-objects' && target > v.count) {
    return `minta ${target} tap tapi hanya ada ${v.count} objek`;
  }
  if (v.kind === 'ten-frame' && target > (v.capacity ?? 10)) {
    return `minta ${target} tapi frame hanya memuat ${v.capacity ?? 10}`;
  }
  return null;
}

/**
 * Tipe soal yang benar-benar bisa dirender layar soal hari ini.
 * Menulis konten dengan tipe di luar daftar ini menghasilkan layar rusak yang
 * baru ketahuan saat anak memakainya — jadi dilarang di sini, bukan di code review.
 */
export const RENDERABLE_TYPES: QType[] = [
  'choose-number',
  'choose-text',
  'count-tap',
  'keypad',
  'missing-number',
  'compare-symbol',
  'number-line-drop',
];

/**
 * Tipe soal yang dijawab dengan mengetik di keypad, bukan menekan tombol pilihan.
 * Hanya tipe inilah yang dibatasi lebar input — sisanya dijawab dengan tap.
 */
export const TYPED_TYPES: QType[] = ['keypad', 'missing-number'];

/**
 * Kosakata dasar yang boleh dipakai tanpa diperkenalkan. Sisanya harus dideklarasikan
 * di `vocab` modul itu atau modul sebelumnya di path order — inilah yang menjaga
 * janji "English sederhana untuk pembaca pemula" tetap ditepati saat konten bertambah.
 */
export const BASE_VOCAB = new Set(
  `a an the is are it we you this that these those and or not of to on in at
   how many what which put tap drag fill make take away add left right stop start
   count number numbers box boxes line dot dots one two three four five six seven
   eight nine ten at once fast see say comes grow to the right can as more less same
   than it as we write jumps not five four here now
   each every them by full all has with next row again
   from into then only first small almost adding change
   across counting faster going jump keep us where show tell picture
   become between no up goes gives so but like
   around big do end know step together without your
   beats enough find for good have land over read they things use`
    .split(/\s+/)
    .filter(Boolean),
);

/**
 * Nilai pecahan yang DIMAKSUD sebuah label jawaban, atau null kalau labelnya bukan
 * nama pecahan ("yes", "there are no parts").
 */
const FRACTION_WORDS: Record<string, number> = {
  whole: 1,
  half: 1 / 2,
  third: 1 / 3,
  fourth: 1 / 4,
  quarter: 1 / 4,
  fifth: 1 / 5,
  sixth: 1 / 6,
  seventh: 1 / 7,
  eighth: 1 / 8,
  tenth: 1 / 10,
};
const COUNT_WORDS: Record<string, number> = {
  one: 1, a: 1, an: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9,
};

/**
 * Menghitung sendiri soal yang teksnya memang perhitungan utuh ("7 × 8 = ?"),
 * atau null kalau teksnya bukan itu. Sengaja KETAT: lebih baik melewatkan soal
 * daripada salah menuduh soal yang sebenarnya benar.
 */
export function evalExpression(text: string): number | null {
  const t = text
    .replace(/\s+/g, ' ')
    .replace(/[−–—]/g, '-')
    .replace(/[×✕]/g, '*')
    .replace(/[÷]/g, '/')
    .trim();
  const m = t.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)\s*(?:=\s*)?\??$/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  switch (m[2]) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? null : a / b;
    default:
      return null;
  }
}

/** Kata yang bentuk TUNGGALNYA sudah berakhiran -s, jadi "1 bus" itu benar. */
const SINGULAR_S = new Set(['bus', 'glass', 'class', 'dress', 'is', 'was', 'cms', 'this']);

export function fractionValue(label: string): number | null {
  const t = label.trim().toLowerCase();
  const numeric = t.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (numeric) return Number(numeric[1]) / Number(numeric[2]);
  const w = t.split(/\s+/);
  if (w.length === 1) {
    const single = FRACTION_WORDS[(w[0] ?? '').replace(/s$/, '')];
    return single ?? null;
  }
  if (w.length === 2) {
    const n = COUNT_WORDS[w[0] ?? ''];
    const unit = FRACTION_WORDS[(w[1] ?? '').replace(/s$/, '')];
    if (n != null && unit != null) return n * unit;
  }
  return null;
}

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lintContent(modules: ContentModule[], registry: Registry): LintProblem[] {
  const problems: LintProblem[] = [];
  const add = (moduleId: string, rule: string, detail: string) =>
    problems.push({ moduleId, rule, detail });

  for (const p of validateRegistry(registry)) {
    add(p.moduleId, 'registry', p.problem);
  }

  const known = new Set(BASE_VOCAB);

  for (const id of registry.pathOrder) {
    const m = modules.find((x) => x.id === id);
    if (!m) continue;
    for (const w of m.vocab) known.add(w.toLowerCase());

    // 1. CPA lengkap untuk modul concept & fact
    if (m.kind !== 'application') {
      const stages = new Set(m.learn.map((l) => l.stage));
      for (const stage of ['concrete', 'pictorial', 'abstract'] as const) {
        if (!stages.has(stage)) add(m.id, 'cpa', `tahap ${stage} tidak ada`);
      }
      if (m.learn[0]?.stage !== 'concrete') {
        add(m.id, 'cpa', 'materi tidak dimulai dari tahap concrete');
      }
    }

    // 2. Panjang instruksi
    for (const step of m.learn) {
      for (const [field, text] of [
        ['prompt', step.prompt],
        ['hint', step.hint ?? ''],
      ] as const) {
        if (!text) continue;
        const n = words(text).length;
        if (n > MAX_PROMPT_WORDS) {
          add(m.id, 'prompt-length', `${field} ${n} kata (maks ${MAX_PROMPT_WORDS}): "${text}"`);
        }
        for (const w of words(text)) {
          // Bentuk jamak dianggap sudah dikenal kalau bentuk tunggalnya sudah
          // diperkenalkan — kalau tidak, setiap modul harus mendeklarasikan
          // "triangle" dan "triangles" secara terpisah tanpa manfaat apa pun.
          const isKnown = known.has(w) || (w.endsWith('s') && known.has(w.slice(0, -1)));
          if (!isKnown && !/^\d+$/.test(w)) {
            add(m.id, 'vocab', `kata "${w}" belum diperkenalkan — tambahkan ke vocab modul`);
          }
        }
      }
    }

    // 3. Aksi yang butuh target harus punya target — DAN harus bisa dikerjakan.
    for (const step of m.learn) {
      if (step.action !== 'watch' && step.target == null) {
        add(m.id, 'learn-target', `langkah "${step.prompt}" minta aksi tapi tidak punya target`);
      }
      const blocked = learnStepBlocked(step);
      if (blocked) add(m.id, 'learn-action', `langkah "${step.prompt}": ${blocked}`);
    }

    // 4. Tipe soal
    if (m.questionTypes.length < 2) add(m.id, 'question-types', 'butuh minimal 2 tipe soal');
    for (const t of m.questionTypes) {
      if (!RENDERABLE_TYPES.includes(t)) {
        add(m.id, 'renderable', `tipe soal "${t}" belum bisa dirender layar soal`);
      }
      if (!m.rules.some((r) => r.type === t)) {
        add(m.id, 'question-types', `tidak ada QuestionRule untuk tipe "${t}"`);
      }
    }
    for (const r of m.rules) {
      if (!m.questionTypes.includes(r.type)) {
        add(m.id, 'question-types', `rule bertipe "${r.type}" tidak terdaftar di questionTypes`);
      }
    }

    // 4b. Soal cerita: beban BACA-nya dijaga, teks soal lain tidak.
    //
    //     Ini satu-satunya tempat teks `rules[].text()` diperiksa sama sekali.
    //     Sengaja hanya untuk aturan bertanda `story`: 635 teks soal yang sudah ada
    //     adalah lambang dan potongan pendek yang tidak butuh — dan tidak akan lolos —
    //     pemeriksaan kosakata prosa.
    const maxStory = MAX_STORY_WORDS[m.grade] ?? MAX_STORY_WORDS[6] ?? 25;
    for (const r of m.rules) {
      if (!r.story) continue;
      // Diperiksa pada teks yang BENAR-BENAR dirender, bukan pada templatnya:
      // parameter ikut jadi kata, dan kombinasi terpanjanglah yang dibaca anak.
      let worst = '';
      let worstN = 0;
      for (const combo of enumerate(r).slice(0, 200)) {
        const text = r.text(combo);
        const n = words(text).length;
        if (n > worstN) {
          worstN = n;
          worst = text;
        }
        for (const w of words(text)) {
          const isKnown =
            known.has(w) ||
            STORY_VOCAB.has(w) ||
            (w.endsWith('s') && (known.has(w.slice(0, -1)) || STORY_VOCAB.has(w.slice(0, -1))));
          if (!isKnown && !/^\d+$/.test(w)) {
            add(
              m.id,
              'story-vocab',
              `kata "${w}" di soal cerita belum diperkenalkan — tambahkan ke vocab modul atau STORY_VOCAB`,
            );
          }
        }
      }
      if (worstN > maxStory) {
        add(
          m.id,
          'story-length',
          `soal cerita ${worstN} kata (maks ${maxStory} di grade ${m.grade}): "${worst}"`,
        );
      }
    }

    //     Tata bahasa juga dijaga, bukan cuma panjang dan kosakata. Satu kalimat
    //     berparameter harus benar untuk SEMUA nilainya, termasuk 1 — kalau tidak,
    //     lahir "Ana has 1 apples" dan yang membacanya justru anak kelas 1 yang
    //     sedang belajar membaca. Angka yang salah ketahuan dari jawabannya; tata
    //     bahasa yang salah tidak ketahuan siapa pun. Pakai `pl()` dari ./plural.
    for (const r of m.rules) {
      if (!r.story) continue;
      for (const combo of enumerate(r).slice(0, 300)) {
        const text = r.text(combo);
        // `(?<!, )`: dalam daftar ("4, 6, 2, 1 eggs") angka terakhir tidak
        // membuat bendanya tunggal — yang jamak adalah daftarnya.
        // `(?:[a-z]+ )?`: satu kata sifat boleh menyela. Tanpa itu "1 blue cards"
        // lolos, dan memang lolos sekali.
        const hit = text.match(/(?<!, )\b1 (?:[a-z]+ )?([a-z]+s)\b/);
        // Kata yang memang berakhiran -s dalam bentuk tunggal.
        if (hit && !SINGULAR_S.has(hit[1] as string)) {
          add(m.id, 'story-grammar', `"${text}" — 1 dengan bentuk jamak`);
        }
        // "1 are red" — kata kerjanya juga harus ikut tunggal.
        if (/(?<!, )\b1 (?:[a-z]+ )?(?:are|were|have)\b/.test(text)) {
          add(m.id, 'story-grammar', `"${text}" — 1 dengan kata kerja jamak`);
        }
      }
    }

    //     Terakhir: jawabannya harus BERHUBUNGAN dengan angka di kalimatnya.
    //
    //     Kalimat dan fungsi `answer` ditulis terpisah, jadi tidak ada yang memaksa
    //     keduanya bicara tentang hitungan yang sama — lubang yang tidak dipunyai
    //     soal lambang, karena di sana teksnya ADALAH hitungannya. Lihat
    //     `storyShape` untuk cara kerjanya dan untuk batas jujurnya.
    for (const [ri, r] of m.rules.entries()) {
      if (!r.story) continue;
      const samples = spread(enumerate(r), 60).map((c) => ({
        text: r.text(c),
        answer: r.answer(c),
      }));
      if (storyShape(samples) == null) {
        add(
          m.id,
          'story-answer-shape',
          `rule#${ri}: tidak ada satu rumus pun atas angka di kalimat yang menjelaskan jawabannya — "${samples[0]?.text}"`,
        );
      }
    }

    // 4c. Soal cerita itu PENERAPAN, jadi tidak boleh jadi satu-satunya isi modul:
    //     anak tetap butuh latihan lambangnya juga, dan kuis memang tanpa cerita.
    if (m.rules.some((r) => r.story) && !m.rules.some((r) => !r.story)) {
      add(m.id, 'story-mix', 'semua aturan bercerita — modul butuh aturan hitung biasa juga');
    }

    // 4d. Label jawaban pecahan harus cocok dengan GAMBARNYA.
    //
    //     Ini lahir dari bug yang sampai ke tangan anak: g1-u6-m4 menunjukkan pizza
    //     4 bagian dengan 2 diarsir, anak menjawab "half" (benar), dinyatakan SALAH,
    //     lalu diberi tahu jawabannya "three fourths". Penyebabnya cabang yang lupa
    //     satu kasus — jenis kesalahan yang tidak bisa dilihat dengan membaca kode,
    //     tapi langsung terlihat kalau nilai labelnya dibandingkan dengan gambarnya.
    //
    //     Bug yang MENGAJARKAN matematika salah lebih buruk daripada bug yang
    //     membuat app jatuh: app jatuh terlihat, ini dipercaya.
    for (const [ri, r] of m.rules.entries()) {
      if (r.type !== 'choose-text' || !r.visual || !r.options) continue;
      for (const combo of enumerate(r).slice(0, 300)) {
        const v = r.visual(combo) as { kind?: string; parts?: number; shaded?: number; unequal?: boolean };
        // `unequal` = soalnya bukan "berapa yang diarsir" melainkan "bagiannya sama
        // besar atau tidak", jadi nilai pecahannya memang tidak berlaku.
        if (v?.kind !== 'fraction' || v.parts == null || v.shaded == null || v.unequal) continue;
        const labels = r.options(combo);
        const shown = v.shaded / v.parts;
        const picked = fractionValue(labels[r.answer(combo) as number] ?? '');
        if (picked == null) continue; // label bukan nama pecahan — soal jenis lain
        if (Math.abs(picked - shown) > 1e-9) {
          add(
            m.id,
            'fraction-answer',
            `rule#${ri}: gambar ${v.shaded}/${v.parts} tapi jawabannya "${labels[r.answer(combo) as number]}" (${JSON.stringify(combo)})`,
          );
        }
        // Dua pilihan yang sama-sama benar membuat anak yang benar tetap salah.
        //
        // Diperiksa pada tombol yang BENAR-BENAR dirender: `uniqueChoices` sudah
        // membuang label kembar sebelum sampai ke layar, jadi memeriksa daftar
        // mentahnya akan melaporkan tiga modul yang sebenarnya tidak apa-apa.
        // Yang lolos dari `uniqueChoices` justru yang berbahaya: dua tulisan
        // BERBEDA yang nilainya sama ("2/4" dan "1/2").
        const shownLabels = uniqueChoices(labels, r.answer(combo) as number).map((i) => labels[i] ?? '');
        const alsoRight = shownLabels.filter(
          (l) =>
            l !== labels[r.answer(combo) as number] &&
            Math.abs((fractionValue(l) ?? NaN) - shown) <= 1e-9,
        );
        if (alsoRight.length > 0) {
          add(
            m.id,
            'fraction-answer',
            `rule#${ri}: "${alsoRight.join('", "')}" juga benar untuk ${v.shaded}/${v.parts} — pilihannya ambigu`,
          );
        }
      }
    }

    // 4e. Soal dan jawabannya harus setuju.
    //
    //     `answer()` adalah satu-satunya sumber kebenaran saat menilai, jadi kalau
    //     ia meleset dari soal yang tertulis, tidak ada yang protes — anaknya yang
    //     dinyatakan salah. Di sini soalnya DIBACA ULANG dan dihitung sendiri, jadi
    //     ada dua sumber yang harus cocok, bukan satu yang harus dipercaya.
    //
    //     Hanya berlaku untuk soal yang teksnya memang sebuah perhitungan utuh
    //     ("7 × 8 = ?"); soal bergambar dan soal cerita dilewati karena teksnya
    //     bukan seluruh pertanyaannya.
    for (const [ri, r] of m.rules.entries()) {
      if (r.type === 'choose-text' || r.type === 'compare-symbol') continue;
      for (const combo of enumerate(r).slice(0, 300)) {
        const text = r.text(combo);
        const want = evalExpression(text);
        if (want == null) continue;
        const got = r.answer(combo);
        if (Math.abs(want - got) > 1e-9) {
          add(m.id, 'answer-matches-text', `rule#${ri}: soal "${text}" = ${want}, dinilai benar = ${got}`);
        }
      }
    }

    // 5. Modul fakta wajib punya pengecoh miskonsepsi — supaya jawaban salah bisa dibaca
    //    sebagai diagnosis, bukan sekadar angka.
    if (m.kind === 'fact') {
      const choose = m.rules.filter((r) => r.type === 'choose-number');
      if (choose.length > 0 && !choose.some((r) => r.misconception)) {
        add(m.id, 'misconception', 'modul fakta tanpa pengecoh miskonsepsi');
      }
    }

    // 6. Skala pengecoh cocok dengan skala jawaban.
    //    Kalau semua jawaban satu aturan kelipatan seratus, pengecoh berjarak 1
    //    (298, 302) bisa dicoret anak tanpa berpikir — soalnya jadi lebih mudah
    //    daripada yang dimaksud. Ini kesalahan yang sudah terjadi tiga kali
    //    (uang, ribuan, pembulatan), jadi sekarang dijaga di sini.
    for (const r of m.rules) {
      if (r.type !== 'choose-number' && r.type !== 'missing-number') continue;
      let g = 0;
      for (const c of enumerate(r)) {
        const a = r.answer(c);
        if (!Number.isFinite(a) || a === 0) continue;
        g = gcd(g, Math.abs(a));
        if (g === 1) break;
      }
      const unit = r.distractorUnit ?? 1;
      if (g >= 10 && unit < g) {
        add(
          m.id,
          'distractor-scale',
          `jawaban selalu kelipatan ${g} tapi distractorUnit ${unit} — setel distractorUnit: ${g}`,
        );
      }
    }

    // 7. Jawaban soal ketik harus benar-benar bisa diketik anak.
    //    Keypad menyediakan titik desimal dan minus, tapi HANYA kalau aturannya
    //    memang membutuhkannya (diturunkan per rule, lihat `answerCaps`) — jadi
    //    desimal dan negatif tidak lagi ditolak di sini. Yang masih ditolak adalah
    //    yang benar-benar tidak bisa dituliskan: lebih lebar dari keypad (termasuk
    //    pecahan tak berujung seperti 1/3, yang jadi belasan digit), atau bukan
    //    angka desimal sama sekali (∞, NaN, 1e+21). Aturan seperti itu menghasilkan
    //    soal buntu yang baru ketahuan saat anak menyerah di depannya — sudah
    //    terjadi sekali (keypad terkunci 3 digit sementara g3-u1-m2 berjawaban 9990).
    for (const r of m.rules) {
      if (!TYPED_TYPES.includes(r.type)) continue;
      const caps = answerCaps(r);
      if (caps.untypable != null) {
        add(
          m.id,
          'input-width',
          `rule "${r.type}" (${r.skill}) berjawaban ${caps.untypable} — tidak bisa dituliskan di keypad`,
        );
      }
      if (caps.digits > MAX_ANSWER_DIGITS) {
        add(
          m.id,
          'input-width',
          `rule "${r.type}" (${r.skill}) berjawaban ${caps.digits} digit — keypad hanya menampung ` +
            `${MAX_ANSWER_DIGITS} (tanda minus dan titik desimal tidak ikut dihitung)`,
        );
      }
    }

    // 8. Garis bilangan: setiap angka yang diminta harus benar-benar bisa disentuh.
    //    Penanda melompat per langkah efektif (otomatis dari lebar rentang, atau `step`
    //    dari data modul), jadi jawaban yang bukan kelipatan langkah itu MUSTAHIL
    //    disentuh anak — soal buntu yang tidak kelihatan sampai anak menyerah di
    //    depannya. Ini sudah terjadi sekali (g3-u1-m5, garis 0–10.000 berjawaban
    //    kelipatan 1000 sementara langkahnya 1), jadi sekarang dijaga di sini.
    for (const step of m.learn) {
      if (step.visual.kind !== 'number-line' || step.action !== 'drop-on-line') continue;
      const { min, max } = step.visual;
      const target = step.target;
      if (target == null) continue;
      const s = step.visual.step != null && step.visual.step > 0 ? step.visual.step : stepFor(min, max);
      const jumps = (target - min) / s;
      if (target < min || target > max || Math.abs(jumps - Math.round(jumps)) > 1e-9) {
        add(
          m.id,
          'number-line-step',
          `langkah "${step.prompt}" minta ${target} tapi garis [${min}, ${max}] melompat ${s} — ` +
            `penanda tidak bisa mendarat tepat di sana`,
        );
      }
    }

    for (const r of m.rules) {
      if (r.type !== 'number-line-drop') continue;
      if (!r.range) {
        add(m.id, 'number-line-step', `rule "${r.skill}" number-line-drop tanpa range`);
        continue;
      }
      const [lo, hi] = r.range;
      if (!(hi > lo)) {
        add(m.id, 'number-line-step', `rule "${r.skill}" punya range kosong [${lo}, ${hi}]`);
        continue;
      }
      const step = r.step != null && r.step > 0 ? r.step : stepFor(lo, hi);
      for (const c of enumerate(r)) {
        const a = r.answer(c);
        if (!Number.isFinite(a) || a < lo || a > hi) {
          add(
            m.id,
            'number-line-step',
            `rule "${r.skill}" berjawaban ${a} — di luar garis [${lo}, ${hi}]`,
          );
          break;
        }
        const jumps = (a - lo) / step;
        if (Math.abs(jumps - Math.round(jumps)) > 1e-9) {
          add(
            m.id,
            'number-line-step',
            `rule "${r.skill}" berjawaban ${a}, bukan kelipatan langkah ${step} dari ${lo} — ` +
              `penanda tidak bisa mendarat di sana; persempit range atau isi step`,
          );
          break;
        }
      }
    }

    // 10. Pilihan kata: tidak boleh ada dua tombol bertulisan sama, dan setelah
    //     kembarannya dibuang harus masih tersisa minimal 3 tombol.
    //
    //     Ini diperiksa untuk SELURUH kombinasi parameter, bukan cuma soal yang
    //     kebetulan tergenerate: pengecohnya dirakit dari angka soal, jadi
    //     tabrakan hanya muncul pada nilai tertentu (jam pukul :30, pecahan
    //     berpembilang satu, uang dengan dua angka yang sama). Generator membuang
    //     kembarannya supaya soalnya tetap adil; yang dijaga di sini adalah
    //     akibatnya — pilihan yang menyusut jadi tinggal dua, yaitu 50% benar
    //     hanya dengan menebak.
    for (const r of m.rules) {
      if (r.type !== 'choose-text' || !r.options) continue;
      for (const c of enumerate(r)) {
        const labels = r.options(c);
        const answer = r.answer(c);
        if (labels[answer] == null) {
          add(m.id, 'choices', `rule "${r.skill}" berjawaban indeks ${answer}, di luar ${labels.length} pilihan`);
          break;
        }
        const kept = uniqueChoices(labels, answer);
        if (kept.length < 3) {
          const dup = labels.filter((l, i) => labels.indexOf(l) !== i);
          add(
            m.id,
            'choices',
            `rule "${r.skill}" menyisakan ${kept.length} pilihan setelah membuang tulisan kembar ` +
              `(${dup.join(', ')}) — butuh ≥3 supaya tidak bisa ditebak`,
          );
          break;
        }
      }
    }

    // 9. Aturan soal benar-benar bisa menghasilkan soal yang sah
    try {
      const { questions } = generateSet(m, 12, mulberry32(1), { requireCoverage: true });
      if (questions.length < 8) {
        add(m.id, 'generator', `hanya bisa membuat ${questions.length} soal unik (butuh ≥8)`);
      }
      for (const q of questions) {
        if (!Number.isFinite(q.answer)) add(m.id, 'generator', `jawaban tidak sah: ${q.text}`);
        if (q.type === 'choose-text' && (q.options ?? []).length < 3) {
          // Dua pilihan = 50% benar hanya dengan menebak; tidak cukup untuk menilai.
          add(m.id, 'generator', `choose-text butuh minimal 3 pilihan: ${q.text}`);
        }
        // Jawaban negatif sah untuk soal KETIK (keypad punya tombol minusnya).
        // Untuk soal pilihan tidak: pengecoh dibangun di sekitar jawaban dan
        // dipagari ≥0, jadi tombolnya akan berisi angka yang tidak masuk akal.
        if (
          q.type !== 'compare-symbol' &&
          !TYPED_TYPES.includes(q.type) &&
          q.answer < 0
        ) {
          add(m.id, 'generator', `jawaban negatif di Grade ${m.grade}: ${q.text}`);
        }
        if (q.choices && !q.choices.includes(q.answer)) {
          add(m.id, 'generator', `pilihan tidak memuat jawaban benar: ${q.text}`);
        }
      }
    } catch (e) {
      add(m.id, 'generator', `generator melempar error: ${(e as Error).message}`);
    }
  }

  return problems;
}

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

export type LintProblem = { moduleId: string; rule: string; detail: string };

export const MAX_PROMPT_WORDS = 8;

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

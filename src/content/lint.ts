import { validateRegistry, type Registry } from '../engine/unlock';
import { enumerate, generateSet } from '../engine/generator';
import { mulberry32 } from '../engine/rng';
import type { QType } from '../engine/types';
import type { ContentModule } from './types';

export type LintProblem = { moduleId: string; rule: string; detail: string };

export const MAX_PROMPT_WORDS = 8;

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
   become between no up goes gives
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

    // 3. Aksi yang butuh target harus punya target
    for (const step of m.learn) {
      if (step.action !== 'watch' && step.target == null) {
        add(m.id, 'learn-target', `langkah "${step.prompt}" minta aksi tapi tidak punya target`);
      }
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

    // 7. Aturan soal benar-benar bisa menghasilkan soal yang sah
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
        if (q.type !== 'compare-symbol' && q.answer < 0) {
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

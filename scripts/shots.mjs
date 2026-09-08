/**
 * Ambil screenshot layar-layar utama dengan Chrome yang sudah terpasang di mesin ini
 * (puppeteer-core, tanpa mengunduh browser).
 *
 * Alasan skrip ini ada: ronde perbaikan pertama gagal menangkap masalah tampilan
 * karena app tidak pernah dilihat. Sekarang setiap ronde bisa diperiksa dengan mata.
 *
 *   npm run shots            # 393x873, tema terang
 *   npm run shots -- --dark  # tema gelap
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.SHOT_BASE ?? 'http://localhost:4173';
const OUT = process.env.SHOT_DIR ?? 'shots';
const DARK = process.argv.includes('--dark');
/** --from=<moduleId>: anggap semua modul sebelumnya sudah dikuasai, supaya layar
 *  soal modul mana pun bisa diperiksa tanpa memainkan seluruh jalur. */
const FROM = process.argv.find((a) => a.startsWith('--from='))?.split('=')[1] ?? null;

mkdirSync(OUT, { recursive: true });

const seeded = {
  state: {
    data: {
      schemaVersion: 1,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-08T00:00:00.000Z',
      profile: { name: 'Sun', avatar: 'cat' },
      xp: 240,
      level: 3,
      badges: ['first-step', 'module-master', 'perfect-round'],
      streak: { current: 4, best: 7, lastActiveDate: '2026-09-08', freezes: 2, freezesWeek: null },
      modules: {
        'g1-u1-m1': {
          status: 'mastered',
          stars: 2,
          reviewStage: 1,
          consecutiveFails: 0,
          masteredAt: '2026-09-05',
          learnCompletedAt: '2026-09-04',
          attempts: [
            { date: '2026-09-04', kind: 'practice', accuracy: 0.8, medianThinkMs: 3200, medianTotalMs: 4100, passed: true },
            { date: '2026-09-05', kind: 'quiz', accuracy: 1, medianThinkMs: 2400, medianTotalMs: 3100, passed: true },
          ],
          totals: { sessions: 2, questions: 20, correct: 18 },
        },
        'g1-u1-m2': {
          status: 'learning',
          stars: 0,
          reviewStage: 0,
          consecutiveFails: 1,
          learnCompletedAt: '2026-09-06',
          attempts: [
            { date: '2026-09-06', kind: 'quiz', accuracy: 0.6, medianThinkMs: 5200, medianTotalMs: 6400, passed: false },
          ],
          totals: { sessions: 1, questions: 10, correct: 6 },
        },
      },
      settings: {
        sound: true,
        reducedMotion: null,
        theme: 'system',
        masteryAccuracyOverride: null,
        dailyReminder: false,
      },
    },
  },
  version: 1,
};

if (FROM) {
  const { pathOrder } = await import('../src/content/pathOrder.json', { with: { type: 'json' } })
    .then((m) => m.default)
    .catch(() => ({ pathOrder: [] }));
  for (const id of pathOrder) {
    if (id === FROM) break;
    seeded.state.data.modules[id] = {
      status: 'mastered',
      stars: 2,
      reviewStage: 1,
      consecutiveFails: 0,
      masteredAt: '2026-09-05',
      learnCompletedAt: '2026-09-04',
      attempts: [],
      totals: { sessions: 2, questions: 20, correct: 19 },
    };
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=2', '--hide-scrollbars'],
});

async function newPage({ seed }) {
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 873, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: DARK ? 'dark' : 'light' },
  ]);
  await page.evaluateOnNewDocument(
    (data, dark) => {
      localStorage.clear();
      if (data) localStorage.setItem('ganmath.v1.progress', JSON.stringify(data));
      localStorage.setItem('ganmath.meta', JSON.stringify({ everUsed: true, installPromptShown: true, lastBackupAt: null }));
      if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    },
    seed ? seeded : null,
    DARK,
  );
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  return page;
}

const suffix = DARK ? '-dark' : '';
const shot = async (page, name) => {
  await new Promise((r) => setTimeout(r, 350));
  const path = join(OUT, `${name}${suffix}.png`);
  await page.screenshot({ path, fullPage: false });
  console.log('✓', path);
};

const clickText = async (page, text) => {
  // Cocokkan sebagian teks ATAU pola: label CTA utama berubah mengikuti langkah
  // (Learn / Practice / Mastery Check), jadi mencocokkan "Start" saja rapuh.
  const el = await page.evaluateHandle((t) => {
    const nodes = [...document.querySelectorAll('button')];
    const re = new RegExp(t, 'i');
    return nodes.find((n) => re.test(n.textContent ?? '')) ?? null;
  }, text);
  const node = el.asElement();
  if (!node) throw new Error(`tombol "${text}" tidak ada`);
  await node.click();
  await new Promise((r) => setTimeout(r, 400));
};

if (FROM) {
  // Mode pemeriksaan satu modul: langsung ke layar soalnya.
  const page = await newPage({ seed: true });
  await clickText(page, 'already know this');
  await new Promise((r) => setTimeout(r, 600));
  await shot(page, `module-${FROM}`);
  await page.close();
  await browser.close();
  process.exit(0);
}

try {
  // 1. Onboarding (tanpa data)
  let page = await newPage({ seed: false });
  await shot(page, '01-onboarding');
  await page.close();

  // 2. Peta (dengan progress)
  page = await newPage({ seed: true });
  await shot(page, '02-map');

  // 3. Layar Learn
  await clickText(page, 'Learn|Practice|Mastery|Start');
  await shot(page, '03-learn');

  // 4. Soal latihan
  for (let i = 0; i < 8; i++) {
    const done = await page.evaluate(() => !!document.querySelector('[role="slider"], [aria-live]') || !!document.querySelector('main p'));
    void done;
    try {
      await page.evaluate(() => {
        const objects = [...document.querySelectorAll('button[aria-label^="Object"], button[aria-label^="Cell"]')];
        objects.slice(0, 10).forEach((b) => b.click());
      });
      await clickText(page, 'Next');
    } catch {
      break;
    }
  }
  await shot(page, '04-question');

  // 5. Umpan balik jawaban salah
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter((b) => /^\d+$/.test(b.textContent?.trim() ?? ''));
    if (btns.length > 1) btns[btns.length - 1].click();
  });
  await new Promise((r) => setTimeout(r, 250));
  await shot(page, '05-answer-feedback');
  await page.close();

  // 6. My Progress
  page = await newPage({ seed: true });
  await page.evaluate(() => document.querySelector('button[aria-label="My badges"]')?.click());
  await new Promise((r) => setTimeout(r, 400));
  await shot(page, '06-progress');
  await page.close();

  // 7. Parent Area (lewat gerbang perkalian)
  page = await newPage({ seed: true });
  await page.evaluate(() => document.querySelector('button[aria-label="Parent area"]')?.click());
  await new Promise((r) => setTimeout(r, 400));
  await shot(page, '07-parent-gate');
  const answer = await page.evaluate(() => {
    const text = [...document.querySelectorAll('p')].map((p) => p.textContent ?? '').find((t) => /×/.test(t));
    if (!text) return null;
    const [a, b] = text.replace('= ?', '').split('×').map((x) => Number(x.trim()));
    return a * b;
  });
  if (answer) {
    for (const d of String(answer)) {
      await page.evaluate((dd) => document.querySelector(`button[aria-label="${dd}"]`)?.click(), d);
      await new Promise((r) => setTimeout(r, 80));
    }
    await page.evaluate(() => document.querySelector('button[aria-label="Check"]')?.click());
    await new Promise((r) => setTimeout(r, 500));
    await shot(page, '08-parent');
  }
  await page.close();
} finally {
  await browser.close();
}

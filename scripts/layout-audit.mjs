/**
 * Audit tata letak di Chrome sungguhan, layar 393x873 (Poco F3 / iPhone 17, CLAUDE.md §10).
 *
 * Alasan skrip ini ada: `shots.mjs` memotret beberapa layar untuk dilihat mata, tapi
 * tidak ada yang memeriksa 240 modul satu per satu. Bug "layar buntu" di g1-u6-m1
 * (anak diminta menyentuh sudut segitiga yang tidak bisa disentuh) baru ketahuan
 * setelah dilaporkan dari pemakaian. Skrip ini menelusuri SETIAP modul: masuk Learn,
 * kerjakan tiap langkah sampai Next terbuka, lalu masuk soal latihan.
 *
 * Yang diukur per layar: scroll horizontal, elemen yang keluar layar, isi yang butuh
 * digulung, sasaran tap di bawah 44px, dan langkah yang tidak bisa diselesaikan.
 *
 *   npm run preview                      # di terminal lain
 *   npm run audit:layout                 # seluruh 240 modul → /tmp/layout.jsonl
 *   OFFSET=40 LIMIT=20 npm run audit:layout
 *   ONLY=g1-u6-m1,g6-u5-m4 npm run audit:layout
 *
 * CATATAN: jalankan di FOREGROUND. macOS menurunkan prioritas proses latar sehingga
 * Chrome headless ikut di-throttle — audit yang sama bisa jadi 10x lebih lambat.
 */
import puppeteer from 'puppeteer-core';
import { appendFileSync, writeFileSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE ?? 'http://localhost:4173';
const OUT = process.env.OUT ?? '/tmp/layout.jsonl';
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
writeFileSync(OUT, '');

const { pathOrder } = (await import('../src/content/pathOrder.json', { with: { type: 'json' } })).default;
const OFFSET = Number(process.env.OFFSET ?? 0);
const LIMIT = Number(process.env.LIMIT ?? pathOrder.length);
const targets = ONLY ?? pathOrder.slice(OFFSET, OFFSET + LIMIT);

const seedFor = (target) => {
  const modules = {};
  for (const id of pathOrder) {
    if (id === target) break;
    modules[id] = { status: 'mastered', stars: 2, reviewStage: 4, consecutiveFails: 0, masteredAt: '2026-09-09', learnCompletedAt: '2026-09-09', attempts: [], totals: { sessions: 2, questions: 20, correct: 19 } };
  }
  return { state: { data: { schemaVersion: 1, createdAt: '2026-09-01T00:00:00.000Z', updatedAt: '2026-09-08T00:00:00.000Z', profile: { name: 'Sun', avatar: 'cat', grade: Number(target.match(/^g(\d+)-/)[1]) }, xp: 240, level: 3, badges: [], streak: { current: 4, best: 7, lastActiveDate: '2026-09-08', freezes: 2, freezesWeek: null }, modules, settings: { sound: false, reducedMotion: true, theme: 'system', masteryAccuracyOverride: null, dailyReminder: false } } }, version: 1 };
};

const MEASURE = () => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const bad = [];
  const name = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}`;
  for (const el of document.querySelectorAll('main *, header *, main, header')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) bad.push({ kind: 'keluar-layar', el: name(el), text: (el.textContent ?? '').slice(0, 40), left: Math.round(r.left), right: Math.round(r.right) });
  }
  const small = [];
  for (const el of document.querySelectorAll('button, [role="button"], [role="slider"]')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.width < 44 || r.height < 44) small.push({ el: name(el), text: (el.textContent ?? '').slice(0, 20), w: Math.round(r.width), h: Math.round(r.height) });
  }
  const main = document.querySelector('main');
  return {
    scrollX: document.documentElement.scrollWidth > vw + 1,
    pageTallerThanScreen: document.documentElement.scrollHeight > vh + 1,
    mainNeedsScroll: main ? main.scrollHeight > main.clientHeight + 1 : false,
    offscreen: bad,
    smallTargets: small,
    prompt: (document.querySelector('main p')?.textContent ?? '').slice(0, 60),
  };
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--force-device-scale-factor=2', '--hide-scrollbars'] });
let page;
/** Halaman bersih per modul, tapi TANPA service worker: precache 890KB per halaman
 *  membuat audit 240 modul berjam-jam, dan yang diaudit di sini tata letak, bukan PWA. */
const freshPage = async () => {
  const p = await browser.newPage();
  await p.setViewport({ width: 393, height: 873, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const client = await p.createCDPSession();
  await client.send('Network.setBypassServiceWorker', { bypass: true });
  return p;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clickText = async (re) => {
  const h = await page.evaluateHandle((t) => [...document.querySelectorAll('button')].filter((n) => new RegExp(t, 'i').test(n.textContent ?? '') && !n.disabled).pop() ?? null, re);
  const el = h.asElement();
  if (!el) return false;
  await el.click();
  await wait(220);
  return true;
};

let n = 0;
for (const id of targets) {
  n++;
  const rec = { id, screens: [], error: null };
  try {
    page = await freshPage();
    await page.evaluateOnNewDocument((data) => {
      localStorage.clear();
      localStorage.setItem('ganmath.v1.progress', JSON.stringify(data));
      localStorage.setItem('ganmath.meta', JSON.stringify({ everUsed: true, installPromptShown: true, lastBackupAt: null }));
    }, seedFor(id));
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await wait(300);
    rec.screens.push({ screen: 'map', ...(await page.evaluate(MEASURE)) });
    if (!(await clickText('Learn|Start|Practice|Mastery|Review'))) throw new Error('CTA tidak ada di peta');

    for (let step = 0; step < 6; step++) {
      // buka kunci Next: sentuh apa pun yang bisa disentuh di manipulatif
      await page.evaluate(() => {
        const next = [...document.querySelectorAll('button')].find((b) => /next|start/i.test(b.textContent ?? ''));
        const controls = [...document.querySelectorAll('[data-part="tap-target"], button[aria-label^="Object"], button[aria-label^="Cell"]')];
        for (const c of controls) { if (next && !next.disabled) break; c.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
      });
      // Garis bilangan digeser, bukan ditekan: sisir posisi sepanjang garis
      // sampai penandanya mendarat di angka yang diminta.
      const slider = await page.$('[role="slider"]');
      if (slider) {
        const box = await slider.boundingBox();
        for (let k = 0; k <= 40 && box; k++) {
          await page.mouse.click(box.x + (box.width * k) / 40, box.y + box.height / 2);
          const ok = await page.evaluate(() => {
            const n = [...document.querySelectorAll('button')].find((b) => /next|start/i.test(b.textContent ?? ''));
            return !!n && !n.disabled;
          });
          if (ok) break;
        }
      }
      await wait(160);
      const m2 = await page.evaluate(MEASURE);
      const blocked = await page.evaluate(() => {
        const n = [...document.querySelectorAll('button')].find((b) => /next|start/i.test(b.textContent ?? ''));
        return !n || n.disabled;
      });
      rec.screens.push({ screen: `learn-${step}`, ...m2, stuck: blocked || undefined });
      if (blocked) break;
      const moved = await clickText('^Next$|^Start$|Let');
      if (!moved) break;
    }

    for (let q = 0; q < 4; q++) {
      const state = await page.evaluate(() => ({
        hasChoices: [...document.querySelectorAll('button')].some((b) => b.dataset.feedback === 'idle' && /^[^]{1,20}$/.test(b.textContent ?? '')),
        keypad: !!document.querySelector('button[aria-label="Check"]'),
        finished: !!document.querySelector('[data-screen="result"]') || /great|nice|keep going|you got/i.test(document.body.textContent ?? ''),
      }));
      rec.screens.push({ screen: `q-${q}`, ...(await page.evaluate(MEASURE)) });
      if (state.finished) break;
      const answered = await page.evaluate(() => {
        const choice = [...document.querySelectorAll('button')].filter((b) => b.getAttribute('data-feedback') != null && !/hint|next|check/i.test(b.textContent ?? ''));
        if (choice.length) { choice[0].click(); return true; }
        const d = document.querySelector('button[aria-label="1"]');
        const check = document.querySelector('button[aria-label="Check"]');
        if (d && check) { d.click(); check.click(); return true; }
        return false;
      });
      if (!answered) break;
      await wait(820);
    }
  } catch (e) {
    rec.error = String(e.message ?? e);
  }
  try { await page?.close(); } catch { /* sudah tertutup */ }
  appendFileSync(OUT, JSON.stringify(rec) + '\n');
  if (n % 10 === 0) console.log(`${n}/${targets.length}`);
}
await browser.close();
console.log('selesai', n);

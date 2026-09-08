/**
 * Membuat ikon PWA dari maskot, memakai Chrome yang sudah terpasang.
 *
 * Ikon sebelumnya cuma tanda plus putih di atas indigo — benar secara teknis, tapi
 * tidak ada hubungannya dengan app yang dilihat anak. Ikon di home screen adalah hal
 * PERTAMA yang dia lihat setiap hari; itu harus wajah Gan.
 *
 *   npm run icons
 */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Gan versi 'happy' — sama dengan yang dipakai di onboarding. */
const FOX = `
  <path d="M22 46 L30 14 L52 34 Z" fill="#E8763A"/>
  <path d="M98 46 L90 14 L68 34 Z" fill="#E8763A"/>
  <path d="M28 42 L33 24 L45 35 Z" fill="#F7C9AE"/>
  <path d="M92 42 L87 24 L75 35 Z" fill="#F7C9AE"/>
  <ellipse cx="60" cy="62" rx="40" ry="36" fill="#F08A4B"/>
  <ellipse cx="60" cy="76" rx="26" ry="20" fill="#FFF3E6"/>
  <ellipse cx="26" cy="70" rx="9" ry="7" fill="#F7C9AE" opacity="0.75"/>
  <ellipse cx="94" cy="70" rx="9" ry="7" fill="#F7C9AE" opacity="0.75"/>
  <path d="M38 64 q7 -8 14 0" stroke="#2B2118" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M68 64 q7 -8 14 0" stroke="#2B2118" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="74" rx="5" ry="4" fill="#2B2118"/>
  <path d="M52 84 q8 7 16 0" stroke="#2B2118" stroke-width="3.5" fill="none" stroke-linecap="round"/>
`;

/**
 * @param {{size:number, foxScale:number, rounded:boolean}} opts
 */
function page({ size, foxScale, rounded }) {
  const radius = rounded ? size * 0.22 : 0;
  const fox = size * foxScale;
  const offset = (size - fox) / 2;
  return `<!doctype html><html><body style="margin:0;background:transparent">
  <div style="width:${size}px;height:${size}px;border-radius:${radius}px;overflow:hidden;
              background:linear-gradient(160deg,#5B6BE0 0%,#4C5BD4 55%,#3F4CBE 100%);
              position:relative">
    <!-- lingkaran krem di belakang maskot: memberi kontras supaya wajahnya tetap
         terbaca saat ikon dikecilkan jadi 40px di home screen -->
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
                width:${fox * 0.96}px;height:${fox * 0.96}px;border-radius:50%;
                background:#FFF6EC;opacity:.16"></div>
    <svg viewBox="0 0 120 120" width="${fox}" height="${fox}"
         style="position:absolute;left:${offset}px;top:${offset}px">${FOX}</svg>
  </div></body></html>`;
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });

const targets = [
  { file: 'public/icon-192.png', size: 192, foxScale: 0.78, rounded: true },
  { file: 'public/icon-512.png', size: 512, foxScale: 0.78, rounded: true },
  // Maskable: Android boleh memotong sampai lingkaran, jadi maskotnya dikecilkan
  // ke dalam zona aman dan latarnya penuh tanpa sudut membulat.
  { file: 'public/icon-maskable-512.png', size: 512, foxScale: 0.56, rounded: false },
  { file: 'public/apple-touch-icon.png', size: 180, foxScale: 0.78, rounded: false },
];

for (const t of targets) {
  const p = await browser.newPage();
  await p.setViewport({ width: t.size, height: t.size, deviceScaleFactor: 1 });
  await p.setContent(page(t), { waitUntil: 'load' });
  await p.screenshot({ path: t.file, omitBackground: true });
  await p.close();
  console.log('✓', t.file, `${t.size}px`);
}

await browser.close();

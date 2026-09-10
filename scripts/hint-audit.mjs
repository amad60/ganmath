/**
 * Audit tata letak layar soal SETELAH tombol Hint ditekan.
 *
 * `layout-audit.mjs` sengaja MEMBUANG tombol hint waktu memilih apa yang diklik
 * (ia mencari tombol jawaban), jadi seluruh blok bantuan tidak pernah terukur oleh
 * siapa pun. Ketika Hint diubah untuk memanggil ulang materi Learn — manipulatif
 * yang bisa setinggi 300px lebih — blok itu langsung mendorong dirinya ke bawah
 * lipatan di sebagian modul: anak menekan Hint, layarnya tidak berubah, dan dari
 * tempat duduknya tombol itu tetap terasa rusak. Skrip inilah yang menemukannya
 * (g6-u4-m3: gambar berakhir di 638px, area gulung habis di 473px).
 *
 *   npm run preview                        # di terminal lain
 *   npm run audit:hint                     # sampel bawaan
 *   ONLY=g6-u4-m3,g1-u1-m1 npm run audit:hint
 *
 * Yang dilaporkan: apakah gambar bantuan benar-benar berada di dalam area yang
 * terlihat, bukan sekadar ada di DOM.
 */
import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE='http://localhost:4173';
const { pathOrder } = (await import('../src/content/pathOrder.json', { with:{type:'json'} })).default;
const targets = (process.env.ONLY ?? 'g1-u2-m2,g1-u1-m1,g3-u3-m3,g5-u4-m1,g6-u1-m4,g4-u2-m3,g2-u2-m4,g6-u4-m3').split(',');
const seedFor = t => { const modules={}; for (const id of pathOrder){ if(id===t) break; modules[id]={status:'mastered',stars:2,reviewStage:4,consecutiveFails:0,masteredAt:'2026-09-09',learnCompletedAt:'2026-09-09',attempts:[],totals:{sessions:2,questions:20,correct:19}};}
 modules[t]={status:'learning',stars:0,reviewStage:0,consecutiveFails:0,learnCompletedAt:'2026-09-09',attempts:[],totals:{sessions:0,questions:0,correct:0}};
 return {state:{data:{schemaVersion:1,createdAt:'2026-09-01T00:00:00.000Z',updatedAt:'2026-09-08T00:00:00.000Z',profile:{name:'Sun',avatar:'cat',grade:Number(t.match(/^g(\d+)-/)[1])},xp:240,level:3,badges:[],streak:{current:4,best:7,lastActiveDate:'2026-09-08',freezes:2,freezesWeek:null},modules,settings:{sound:false,reducedMotion:true,theme:'system',masteryAccuracyOverride:null,dailyReminder:false}}},version:1};};
const MEASURE=()=>{const vw=innerWidth,vh=innerHeight,bad=[];const nm=e=>`${e.tagName.toLowerCase()}${typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):''}`;
 for(const e of document.querySelectorAll('main *, main')){const r=e.getBoundingClientRect(); if(!r.width&&!r.height)continue; if(r.right>vw+1||r.left<-1) bad.push({el:nm(e),right:Math.round(r.right),left:Math.round(r.left),text:(e.textContent??'').slice(0,30)});}
 const m=document.querySelector('main');
 // Apakah tombol jawaban terdorong keluar layar?
 const keys=[...document.querySelectorAll('button')].filter(b=>/^\d$|Check|Yes/.test(b.textContent??''));
 const lowest=keys.length?Math.max(...keys.map(b=>b.getBoundingClientRect().bottom)):0;
 const svgs=[...document.querySelectorAll('main svg')];
 const last=svgs.length?svgs[svgs.length-1].getBoundingClientRect():null;
 const mr=m?m.getBoundingClientRect():null;
 return {scrollX:document.documentElement.scrollWidth>vw+1, mainNeedsScroll:m?m.scrollHeight>m.clientHeight+1:false, offscreen:bad, jawabanTerpotong: lowest>vh+1, vh,
   hintBottom: last?Math.round(last.bottom):null, hintTop:last?Math.round(last.top):null,
   mainBottom: mr?Math.round(mr.bottom):null, mainTop: mr?Math.round(mr.top):null,
   hintTerlihat: last&&mr? (last.bottom <= mr.bottom+1 && last.top >= mr.top-1) : null};};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--hide-scrollbars']});
for(const id of targets){
 const p=await browser.newPage();
 await p.setViewport({width:393,height:873,deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 const c=await p.createCDPSession(); await c.send('Network.setBypassServiceWorker',{bypass:true});
 await p.evaluateOnNewDocument(d=>{localStorage.clear();localStorage.setItem('ganmath.v1.progress',JSON.stringify(d));localStorage.setItem('ganmath.meta',JSON.stringify({everUsed:true,installPromptShown:true,lastBackupAt:null}));},seedFor(id));
 await p.goto(BASE,{waitUntil:'domcontentloaded'}); await wait(400);
 const click=async re=>{const h=await p.evaluateHandle(t=>[...document.querySelectorAll('button')].filter(n=>new RegExp(t,'i').test(n.textContent??'')&&!n.disabled).pop()??null,re);const el=h.asElement(); if(!el)return false; await el.click(); await wait(300); return true;};
 const ok = await click('Practice|Learn|Start');
 const before = await p.evaluate(MEASURE);
 const pressed = await click('Hint');
 await wait(500);
 const after = await p.evaluate(MEASURE);
 const flag = a => [a.scrollX?'SCROLL-X':'', a.mainNeedsScroll?'perlu-digulung':'', a.jawabanTerpotong?'JAWABAN-TERPOTONG':'', a.offscreen.length?`keluar-layar:${a.offscreen.length}`:''].filter(Boolean).join(' ') || 'bersih';
 console.log(`${id.padEnd(11)} | ${flag(after).padEnd(16)} | terlihat=${after.hintTerlihat===true?'YA ':'TIDAK'} | gambar ${after.hintTop}..${after.hintBottom} | main ${after.mainTop}..${after.mainBottom}`);
 if (after.offscreen.length) console.log('   ', JSON.stringify(after.offscreen.slice(0,2)));
 await p.close();
}
await browser.close();

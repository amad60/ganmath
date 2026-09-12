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
 * Yang dilaporkan: apakah bantuan benar-benar berada di dalam area yang terlihat
 * (bukan sekadar ada di DOM), DAN apakah bantuan itu bisa ditutup lagi.
 *
 * Ukurannya dulu "svg terakhir di dalam main" — tebakan, dan tebakan yang salah:
 * sebagian bantuan sama sekali tidak berisi svg, sehingga yang terukur justru
 * gambar SOAL atau maskotnya, dan laporannya jadi berisik tanpa ada yang rusak.
 * Sekarang yang diukur elemen bantuannya sendiri lewat #hint-panel.
 *
 * Kolom `tutup` adalah yang menangkap bug terlapor: dulu tombolnya dimatikan
 * begitu ditekan, jadi bantuan setinggi 300px lebih menempel di layar sampai
 * soalnya berganti dan anak tidak punya jalan keluar sama sekali.
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
 // Bantuannya sendiri, bukan tebakan "svg terakhir": isi #hint-panel kosong
 // selama bantuan tertutup, jadi elemen inilah satu-satunya jawaban jujur atas
 // "apakah bantuan sedang tampil".
 const panel=document.getElementById('hint-panel')?.firstElementChild??null;
 // Yang wajib tetap terlihat adalah KALIMAT soalnya (anak terakhir di blok soal),
 // bukan ilustrasinya — sisi atas gambar boleh terpotong, pertanyaannya tidak.
 const soal=document.querySelector('#question-block > :last-child');
 const close=[...document.querySelectorAll('button')].find(b=>b.getAttribute('aria-label')==='Hide hint')??null;
 const toggle=document.querySelector('button[aria-controls="hint-panel"]');
 const r=e=>e?e.getBoundingClientRect():null;
 const pr=r(panel), mr=r(m), cr=r(close);
 const inside=x=>x&&mr? (x.bottom<=mr.bottom+1 && x.top>=mr.top-1) : null;
 return {scrollX:document.documentElement.scrollWidth>vw+1, mainNeedsScroll:m?m.scrollHeight>m.clientHeight+1:false, offscreen:bad, jawabanTerpotong: lowest>vh+1, vh,
   adaBantuan: panel!=null, hintTop:pr?Math.round(pr.top):null, hintBottom:pr?Math.round(pr.bottom):null,
   mainBottom: mr?Math.round(mr.bottom):null, mainTop: mr?Math.round(mr.top):null,
   hintTerlihat: inside(pr),
   // Soal yang tergulung habis dari layar: anak melihat bantuannya tapi lupa
   // pertanyaannya. Boleh terjadi HANYA kalau bantuannya memang tidak muat.
   soalTerlihat: inside(r(soal)),
   // Muat BERDUA, bukan bantuannya saja: yang menentukan apakah soal boleh tetap
   // terlihat adalah tinggi bantuan + tinggi kalimat soal, bukan salah satunya.
   muatBerdua: pr&&soal ? pr.height+soal.getBoundingClientRect().height<=m.clientHeight : null,
   // Jalan keluar harus TERJANGKAU, bukan sekadar ada: silang yang terdorong ke
   // atas batas gulung sama saja dengan tidak ada silang.
   silangTerjangkau: inside(cr),
   togglePadam: toggle?toggle.disabled:null, toggleTeks:(toggle?.textContent??'').trim()};};
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
 await click('Practice|Learn|Start');
 const pressed = await click('Hint');
 await wait(500);
 const after = await p.evaluate(MEASURE);

 // Ditutup lewat silang di dalam bantuannya, lalu dipastikan bantuan BENAR-BENAR
 // hilang dan tombolnya hidup lagi — bisa dibuka ulang kalau anak berubah pikiran.
 let closed = null, reopened = null;
 if (after.adaBantuan) {
   await p.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Hide hint'); b?.click();});
   await wait(300);
   const shut = await p.evaluate(MEASURE);
   closed = shut.adaBantuan===false && shut.togglePadam===false;
   await click('Hint'); await wait(300);
   reopened = (await p.evaluate(MEASURE)).adaBantuan===true;
 }

 const flag = a => [a.scrollX?'SCROLL-X':'', a.jawabanTerpotong?'JAWABAN-TERPOTONG':'', a.offscreen.length?`keluar-layar:${a.offscreen.length}`:''].filter(Boolean).join(' ') || 'bersih';
 const ya = v => v===true?'YA   ':v===false?'TIDAK':'  -  ';
 // Soal boleh hilang dari pandangan hanya kalau bantuannya tidak muat — di situ
 // memang harus dipilih salah satu, dan yang dipilih adalah bantuannya.
 const soalOk = after.soalTerlihat===true || after.muatBerdua===false;
 console.log(`${id.padEnd(11)} | ${flag(after).padEnd(16)} | ada=${ya(pressed?after.adaBantuan:null)} terlihat=${ya(after.hintTerlihat)} soal=${ya(soalOk)} silang=${ya(after.silangTerjangkau)} tutup=${ya(closed)} buka-lagi=${ya(reopened)} | bantuan ${after.hintTop}..${after.hintBottom} | main ${after.mainTop}..${after.mainBottom}`);
 if (after.offscreen.length) console.log('   ', JSON.stringify(after.offscreen.slice(0,2)));
 await p.close();
}
await browser.close();

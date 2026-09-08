/**
 * Regenerasi src/content/pathOrder.json dari sumber kebenaran (src/content/index.ts).
 *
 * File JSON itu hanya dipakai skrip screenshot, tapi kalau ia melenceng dari registry
 * mode `--from=` akan menyeed modul yang salah — jadi ada test yang menjaganya
 * (src/content/pathOrder.test.ts) dan skrip ini yang memperbaruinya.
 *
 *   npm run pathorder
 */
import { createServer } from 'vite';
import { writeFileSync } from 'node:fs';

// Lewat Vite supaya impor TypeScript tanpa ekstensi terselesaikan sama persis
// seperti di app — tidak ada resolver kedua yang bisa melenceng.
const server = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
const { pathOrder } = await server.ssrLoadModule('/src/content/index.ts');
await server.close();
writeFileSync('src/content/pathOrder.json', JSON.stringify({ pathOrder }, null, 2) + '\n');
console.log('✓ pathOrder.json —', pathOrder.length, 'modul');

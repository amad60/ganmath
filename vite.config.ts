import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
import { execSync } from 'node:child_process';

/**
 * Identitas build yang DILIHAT orang tua di Settings ("Version 3460ee6 · 5 Oct").
 * Tanpa ini "sudah versi terbaru?" tidak bisa dijawab — tidak ada yang bisa
 * dibandingkan dengan commit yang baru di-push. Netlify memberi `COMMIT_REF`;
 * di mesin lokal diambil dari git, dan kalau git pun tidak ada, 'dev'.
 */
function buildSha(): string {
  if (process.env.COMMIT_REF) return process.env.COMMIT_REF.slice(0, 7);
  try {
    return execSync('git rev-parse --short=7 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
}

export default defineConfig({
  define: {
    __APP_BUILD__: JSON.stringify({ sha: buildSha(), time: new Date().toISOString() }),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt', // JANGAN pernah reload otomatis di tengah sesi anak
      // Service worker sengaja MATI saat pengembangan: cache basi bikin debugging menyesatkan.
      devOptions: { enabled: false },
      includeAssets: ['apple-touch-icon.png'],
      workbox: {
        // Seluruh app + font + konten di-precache: harus 100% jalan offline
        // setelah kunjungan pertama.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'GanMath',
        short_name: 'GanMath',
        description: 'Learn math, one small step at a time.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F7F6F2',
        theme_color: '#4C5BD4',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
  },
  test: {
    // Sebagian test butuh DOM sungguhan: bug umpan balik jawaban lolos justru karena
    // dulu tidak ada satu pun test yang merender komponen.
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['src/test-setup.ts'],
  },
});

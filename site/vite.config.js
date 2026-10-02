import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: { outDir: 'dist', emptyOutDir: true },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'smartmotion: GAi GAi with me',
        short_name: 'smartmotion',
        description: 'A casual stroll into generative AI for educators. The talk and the audience quiz in one scrolling story.',
        lang: 'en-GB',
        // Attendees are the ones who install; the presenter is one shortcut away.
        start_url: '/play',
        scope: '/',
        display: 'standalone',
        background_color: '#F6F5F2',
        theme_color: '#F6F5F2',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Play the quiz', url: '/play' },
          { name: 'Start of the talk', url: '/' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Browsers fetch other font subsets on demand; only Latin needs to be offline.
        globIgnores: ['**/*-{cyrillic,cyrillic-ext,greek,greek-ext,vietnamese}-*.woff2'],
        navigateFallback: '/index.html',
        // Firebase reserved URLs must always reach the network.
        navigateFallbackDenylist: [/^\/__\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
})

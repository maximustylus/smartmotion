import { defineConfig, minimal2023Preset, createAppleSplashScreens } from '@vite-pwa/assets-generator/config'

// App icons come from the full-bleed dark tile; iOS and Android apply
// their own corner shapes. The maskable variant keeps the M inside the
// safe zone on a black field. Splash screens are black with the mark.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { sizes: [512], padding: 0.35, resizeOptions: { background: '#000000' } },
    apple: { sizes: [180], padding: 0, resizeOptions: { background: '#000000' } },
    appleSplashScreens: createAppleSplashScreens(
      {
        padding: 0.6,
        resizeOptions: { background: '#000000', fit: 'contain' },
        darkResizeOptions: { background: '#000000', fit: 'contain' },
        linkMediaOptions: { log: true, addMediaScreen: true, basePath: '/', xhtml: false },
        png: { compressionLevel: 9, quality: 70 },
        name: (landscape, size, dark) => `apple-splash-${landscape ? 'landscape' : 'portrait'}-${dark ? 'dark-' : ''}${size.width}x${size.height}.png`,
      },
      ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17', 'iPhone Air', 'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16', 'iPhone 16e', 'iPhone 15 Pro Max', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone XR', 'iPhone 8'],
    ),
  },
  images: ['public/icon-square.svg'],
})

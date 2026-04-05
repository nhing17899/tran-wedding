import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
  plugins: [
    ViteImageOptimizer({
      jpg:  { quality: 80 },
      jpeg: { quality: 80 },
      png:  { quality: 80 },   // sharp uses 0-100 integer for PNG
      webp: { quality: 82 },
    }),
  ],
});

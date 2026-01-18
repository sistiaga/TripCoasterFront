import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "The above dynamic import cannot be analyzed by Vite" warnings from exifr
        if (
          warning.code === 'SOURCEMAP_ERROR' ||
          (warning.message && warning.message.includes('dynamic import cannot be analyzed'))
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    include: ['exifr']
  }
});

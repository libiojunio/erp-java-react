import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'fix-rolldown-jsx-warning',
      enforce: 'post',
      configResolved(config) {
        // Remove a chave 'jsx' incompatível injetada pelo @vitejs/plugin-react sob rollupOptions no Rolldown (Vite 8)
        if (config.optimizeDeps?.rollupOptions) {
          delete (config.optimizeDeps.rollupOptions as Record<string, unknown>).jsx;
        }
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

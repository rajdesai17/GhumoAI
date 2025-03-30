import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  optimizeDeps: {
    include: ['axios'],
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  assetsInclude: ['**/*.png'],
  resolve: {
    alias: {
      // Add any aliases if needed
    },
  },
});

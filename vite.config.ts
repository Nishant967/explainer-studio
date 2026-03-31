import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@remotion': path.resolve(__dirname, 'remotion'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite configuration
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // If you have aliases in your src
    },
  },
  base: './', // Relative base path for assets
});

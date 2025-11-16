import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    minify: 'esbuild', // Faster than terser
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd-vendor';
            }
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'redux-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('react-icons')) {
              return 'icons-vendor';
            }
            if (id.includes('date-fns') || id.includes('react-timeago')) {
              return 'date-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            // Avatar packages - exclude from manual chunking to allow dynamic import code splitting
            if (id.includes('@dicebear')) {
              return undefined; // Vite will handle code splitting via dynamic imports
            }
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  base: './', // Relative base path for assets
});

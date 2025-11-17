import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const VENDOR_CHUNK_MAPPINGS: Array<{ patterns: string[]; chunkName: string }> = [
  { patterns: ['react', 'react-dom', 'scheduler'], chunkName: 'react-vendor' },
  { patterns: ['antd', '@ant-design'], chunkName: 'antd-vendor' },
  { patterns: ['redux', '@reduxjs'], chunkName: 'redux-vendor' },
  { patterns: ['react-router'], chunkName: 'router-vendor' },
  { patterns: ['react-icons'], chunkName: 'icons-vendor' },
  { patterns: ['date-fns', 'react-timeago'], chunkName: 'date-vendor' },
  { patterns: ['framer-motion'], chunkName: 'animation-vendor' },
  { patterns: ['axios'], chunkName: 'http-vendor' },
];

const getVendorChunkName = (id: string): string => {
  for (const { patterns, chunkName } of VENDOR_CHUNK_MAPPINGS) {
    if (patterns.some((pattern) => id.includes(pattern))) {
      return chunkName;
    }
  }
  return 'vendor';
};

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
          if (!id.includes('node_modules')) {
            return undefined;
          }

          // Avatar packages - exclude from manual chunking to allow dynamic import code splitting
          if (id.includes('@dicebear')) {
            return undefined; // Vite will handle code splitting via dynamic imports
          }

          return getVendorChunkName(id);
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  base: './', // Relative base path for assets
});

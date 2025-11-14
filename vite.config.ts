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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            // Ant Design
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd-vendor';
            }
            // Redux
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'redux-vendor';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            // Icons
            if (id.includes('react-icons')) {
              return 'icons-vendor';
            }
            // Date utilities
            if (id.includes('date-fns') || id.includes('react-timeago')) {
              return 'date-vendor';
            }
            // Animation
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            // Avatar generation
            if (id.includes('@dicebear')) {
              return 'avatar-vendor';
            }
            // HTTP client
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
  base: './', // Relative base path for assets
});

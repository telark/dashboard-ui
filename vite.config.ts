import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { Plugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

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

const performancePlugin = (): Plugin => ({
  name: 'performance-hints',
  apply: 'build',
  transformIndexHtml(html) {
    return html.replace(
      '</head>',
      `  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
</head>`,
    );
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
      performancePlugin(),
      isAnalyze &&
        visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    define: {
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'development'),
      __DEV__: env.NODE_ENV !== 'production',
      __IN_CLUSTER__: JSON.stringify(mode === 'cluster'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      minify: 'esbuild',
      cssCodeSplit: false,
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      reportCompressedSize: false,
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@dicebear')) return undefined;
              return getVendorChunkName(id);
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'antd',
        '@ant-design/icons',
        '@reduxjs/toolkit',
        'react-redux',
      ],
      exclude: ['@dicebear/core'],
    },
    base: mode === 'cluster' ? '/' : './',
    server: {
      open: '/',
      hmr: true,
    },
    esbuild: {
      drop: env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
  };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { Plugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

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
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env': '{}',
      process: '{"env":{"NODE_ENV":"production"}}',
      __DEV__: JSON.stringify(false),
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
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('@dicebear')) return undefined;
            if (id.includes('redux') || id.includes('@reduxjs')) return 'redux-vendor';
            if (id.includes('react-router')) return 'router-vendor';
            if (id.includes('date-fns') || id.includes('react-timeago')) return 'date-vendor';
            if (id.includes('framer-motion')) return 'animation-vendor';
            if (id.includes('axios')) return 'http-vendor';
            return 'vendor';
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
      drop: mode === 'cluster' || mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
  };
});

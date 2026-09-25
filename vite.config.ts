import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

const { version: appVersion } = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, 'package.json'), 'utf-8'),
) as { version: string };

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

export default defineConfig(async ({ mode }) => {
  const isAnalyze = mode === 'analyze';
  const isProd = mode === 'cluster' || mode === 'production';
  const { visualizer } = isAnalyze
    ? await import('rollup-plugin-visualizer')
    : { visualizer: null };

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
      performancePlugin(),
      isAnalyze &&
        visualizer &&
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
      __APP_VERSION__: JSON.stringify(appVersion),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },
    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      reportCompressedSize: false,
      rolldownOptions: {
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: (id: string) => {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('@dicebear')) return undefined;
            if (id.includes('redux') || id.includes('@reduxjs')) return 'redux-vendor';
            if (id.includes('react-router')) return 'router-vendor';
            if (id.includes('date-fns') || id.includes('react-timeago')) return 'date-vendor';
            if (id.includes('framer-motion')) return 'animation-vendor';
            if (id.includes('axios')) return 'http-vendor';
            return 'vendor';
          },
          ...(isProd && {
            minify: {
              compress: {
                dropConsole: true,
                dropDebugger: true,
              },
            },
          }),
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
        '@ant-design/plots',
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
  };
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { Plugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

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
        babel: {
          plugins:
            env.NODE_ENV === 'production'
              ? [
                  [
                    'babel-plugin-transform-react-remove-prop-types',
                    { mode: 'remove', removeImport: true },
                  ],
                ]
              : [],
        },
      }),
      performancePlugin(),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
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
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.NODE_ENV === 'production',
          drop_debugger: true,
          pure_funcs:
            env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
          passes: 2,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
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
            if (!id.includes('node_modules')) {
              if (id.includes('/features/auth/')) return 'features-auth';
              if (id.includes('/features/resources/')) return 'features-resources';
              if (id.includes('/features/access-and-permissions/')) return 'features-access';
              if (id.includes('/features/insights/')) return 'features-insights';
              return undefined;
            }

            if (id.includes('@dicebear')) {
              return undefined;
            }

            return getVendorChunkName(id);
          },
          experimentalMinChunkSize: 10000,
        },
        treeshake: {
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
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
    base: './',
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

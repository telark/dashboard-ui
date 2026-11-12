// ESLint v10 Flat Config (ESM)
import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import vitestPlugin from '@vitest/eslint-plugin';
import reactPkg from 'react/package.json' with { type: 'json' };

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: false,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      // 'detect' calls context.getFilename(), which ESLint 10 removed; back to 'detect' once
      // eslint-plugin-react supports ESLint 10 (then drop the package.json override too).
      react: { version: reactPkg.version },
    },
    rules: {
      ...tsPlugin.configs.recommended?.rules,
      ...reactPlugin.configs.recommended?.rules,
      ...reactHooksPlugin.configs.recommended?.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'error',
      'prettier/prettier': 'warn',
    },
  },
  {
    // Colors live only in DEFAULT_COLORS (src/constants/shared/colors.ts).
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['src/constants/shared/colors.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#[0-9a-fA-F]{3,8}\\b|\\brgba?\\(|\\bhsla?\\(/]',
          message:
            'Use a DEFAULT_COLORS token (src/constants/shared/colors.ts) instead of a color literal.',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b|\\brgba?\\(|\\bhsla?\\(/]',
          message:
            'Use a DEFAULT_COLORS token (src/constants/shared/colors.ts) instead of a color literal.',
        },
      ],
    },
  },
  {
    files: ['src/logging/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Only the test files: DOM access an antd widget forces lives in the src/test helpers.
    files: ['src/**/*.test.{ts,tsx}'],
    plugins: {
      'testing-library': testingLibraryPlugin,
      'jest-dom': jestDomPlugin,
      vitest: vitestPlugin,
    },
    rules: {
      ...testingLibraryPlugin.configs['flat/react'].rules,
      ...jestDomPlugin.configs['flat/recommended'].rules,
      ...vitestPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['k6/**/*.js'],
    languageOptions: {
      globals: {
        __ENV: 'readonly',
        __ITER: 'readonly',
        __VU: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];

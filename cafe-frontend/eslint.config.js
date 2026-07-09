// Import ESLint recommended rules
import js from '@eslint/js';
// Import browser global variables (window, document, etc.)
import globals from 'globals';
// React plugin
import react from 'eslint-plugin-react';
// React Hooks plugin
import reactHooks from 'eslint-plugin-react-hooks';
// React Refresh plugin (for Vite Fast Refresh)
import reactRefresh from 'eslint-plugin-react-refresh';
// TypeScript ESLint parser and utilities
import tseslint from 'typescript-eslint';

// Export the configuration array (flat config)
export default tseslint.config(
  // 1. Ignore patterns: don't lint build outputs, node_modules, or config files
  { ignores: ['dist', 'node_modules', '*.config.js', '*.config.ts'] },

  // 2. Main configuration for TypeScript/React files
  {
    // Extend recommended rule sets
    extends: [
      js.configs.recommended,                     // Core JavaScript rules
      ...tseslint.configs.recommended,            // TypeScript recommended rules
      react.configs.flat.recommended,             // React recommended rules
    ],

    // Apply this to all .ts and .tsx files
    files: ['**/*.{ts,tsx}'],

    // Language and parser options
    languageOptions: {
      ecmaVersion: 2020,                         // Latest ECMAScript features
      globals: globals.browser,                  // Allow browser APIs
      parserOptions: {
        project: './tsconfig.json',              // Use our tsconfig for type‑aware linting
      },
    },

    // React settings: auto-detect the React version
    settings: {
      react: { version: 'detect' },
    },

    // Register plugins
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    // Custom rules (override defaults)
    rules: {
      // Enable recommended React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Ensure components are compatible with Vite's Fast Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // Allow exporting constant values
      ],

      // With React 17+, you don't need to import React in every file
      'react/react-in-jsx-scope': 'off',

      // Warn about unused variables, but ignore those starting with underscore
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'dev-dist', 'node_modules', 'functions/node_modules', 'coverage'] },

  // Frontend (Vite + React, ESM)
  {
    files: ['src/**/*.{js,jsx}', '*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Katta mavjud kod bazasi — ishlatilmagan o'zgaruvchilar warning,
      // komponent nomlari (bosh harf) va _prefiksli argumentlar istisno
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'react-refresh/only-export-components': 'off',
      // react-hooks v7 kompilyator qoidalari — mavjud kodda keng tarqalgan
      // (useEffect ichida keyinroq e'lon qilingan fetchData chaqiruvi kabi),
      // runtime'da xavfsiz. Bosqichma-bosqich tozalash uchun warning.
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },

  // Testlar (vitest, node muhiti ham kerak bo'lishi mumkin)
  {
    files: ['src/__tests__/**/*.{js,jsx}', 'vitest.config.js', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // Cloud Functions (Node, CommonJS)
  {
    files: ['functions/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Firestore rules-unit-testing (Node, ESM, emulator talab qiladi)
  {
    files: ['tests/**/*.js', 'vitest.rules.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];

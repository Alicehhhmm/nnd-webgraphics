import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'

export default defineConfig([
  globalIgnores([
    'dist',
    'cache',
    'node_modules',
    'package-lock.json',
    'pnpm-lock.yaml',
    'coverage',
    'public',
    '**/*.vitepress/cache**',
    '**/node_modules/**',
    '**/dist/**',
    '**/framework-threejs/**',
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    plugins: {
      prettier: prettier,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])

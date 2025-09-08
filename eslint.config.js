import globals from 'globals'
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['coverage/**'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        process: 'readonly',
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-unused-vars': 'warn',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/eol-last': 'error',
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/brace-style': ['error', 'stroustrup'],
    },
  },
])

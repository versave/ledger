import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'data', 'node_modules', 'design_handoff_personal_finance_ledger'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Server code runs in Node.
  {
    files: ['server/**/*.ts', 'vite.config.ts'],
    languageOptions: { globals: globals.node },
  },

  // Client code runs in the browser and uses React hooks.
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Turn off formatting rules — Prettier owns formatting.
  prettier,

  // Our rules come AFTER prettier so they win (prettier defensively disables `curly`).
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      // Require braces on all control statements — bans single-line `if (x) doThing()`.
      curly: ['error', 'all'],
      eqeqeq: ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': 'error',
      // Auto-remove unused imports on --fix; flag unused vars (allow _-prefixed).
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
)

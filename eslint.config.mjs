import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
  ]),

  // WebCraft production rules
  {
    rules: {
      // No unused variables
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // No console.logs in production
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Consistent imports
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Enforce explicit return types on functions
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Prefer const
      'prefer-const': 'error',

      // No var
      'no-var': 'error',

      // Enforce strict equality
      eqeqeq: ['error', 'always'],
    },
  },
]);

export default eslintConfig;

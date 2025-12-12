import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import boundaries from 'eslint-plugin-boundaries';

/**
 * FSD Layers configuration for eslint-plugin-boundaries
 * Enforces proper import direction: app → screens → widgets → features → entities → shared
 */
const FSD_LAYERS = ['app', 'screens', 'widgets', 'features', 'entities', 'shared'];

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  ...nextTs,

  // FSD Architecture rules
  {
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'screens', pattern: 'src/screens/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
      'boundaries/ignore': ['**/*.test.*', '**/*.spec.*'],
    },
    rules: {
      // Enforce FSD layer import rules
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // app can import from all layers
            { from: 'app', allow: FSD_LAYERS },
            // screens can import from widgets, features, entities, shared
            { from: 'screens', allow: ['widgets', 'features', 'entities', 'shared'] },
            // widgets can import from features, entities, shared
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            // features can import from features (cross-feature), entities, shared
            // Cross-feature imports allowed for auth/session dependencies
            { from: 'features', allow: ['features', 'entities', 'shared'] },
            // entities can import from shared only
            { from: 'entities', allow: ['shared'] },
            // shared cannot import from other layers
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
      // Prevent direct imports from internal module files (use public API)
      'boundaries/no-private': [
        'warn',
        {
          allowUncles: true,
        },
      ],
    },
  },

  // General code quality rules
  {
    rules: {
      // Prefer type imports for better tree-shaking
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // Prevent unused imports
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;

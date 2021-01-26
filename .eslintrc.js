const baseConfig = require('lyne-helper-eslint-config');

baseConfig.parser = '@typescript-eslint/parser';

baseConfig.parserOptions = {
  ecmaFeatures: {
    jsx: true
  },
  ecmaVersion: 6,
  // project: './tsconfig.json',
  sourceType: 'module'
};

baseConfig.globals = {
  CustomEvent: 'readonly',
  console: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly'
};

baseConfig.overrides = [
  {
    extends: ['plugin:@typescript-eslint/recommended'],
    files: [
      '*.ts',
      '*.tsx'
    ],
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/ban-types': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/indent': [
        'error',
        2
      ],
      '@typescript-eslint/member-delimiter-style': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          custom: {
            match: true,
            regex: '^I[a-z]'
          },
          format: ['PascalCase'],
          selector: 'interface'
        },
        {
          format: ['camelCase'],
          selector: 'default'
        },
        {
          format: [
            'camelCase',
            'UPPER_CASE'
          ],
          selector: 'variable'
        },
        {
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          selector: 'parameter'
        },
        {
          format: ['camelCase'],
          leadingUnderscore: 'require',
          modifiers: ['private'],
          selector: 'memberLike'
        },
        {
          format: ['PascalCase'],
          selector: 'typeLike'
        }
      ],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-parameter-properties': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: 'h'
        }
      ],
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/semi': ['error'],
      '@typescript-eslint/type-annotation-spacing': 'error',
      'camelcase': 'off'
    }
  },
  {
    files: [
      '*.yaml',
      '*.yml'
    ],
    plugins: ['yaml']
  },
  {
    env: {
      'jest/globals': true
    },
    extends: ['plugin:jest/recommended'],
    files: [
      '*e2e.ts',
      '*spec.ts'
    ],
    plugins: ['jest']
  },
  {
    extends: ['plugin:jsx-a11y/recommended'],
    files: [
      '*.tsx',
      '*.jsx'
    ],
    plugins: ['jsx-a11y']
  }
];

module.exports = baseConfig;

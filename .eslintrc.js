module.exports = {
  env: {
    jest: true,
    browser: true,
  },
  extends: [
    'airbnb-typescript',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'consistent-return': 'off',
    'default-case': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prettier/prettier': 'error',
    'react/no-multi-comp': 'off',
    'react/prop-types': 'off',
    'no-await-in-loop': 'warn',
    'no-continue': 'off',
    'no-nested-ternary': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'react/jsx-fragments': ['error', 'element'],
    'react/jsx-props-no-spreading': 'off'
  },
};

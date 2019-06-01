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
    'default-case': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'no-plusplus': 'off',
  },
};

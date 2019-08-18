module.exports = {
  displayName: '@byteclaw/visage-core',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/dist/**',
    '!**/*.flow.js',
    '!**/node_modules/**',
    '!**/flow-typed/**',
    '!**/__tests__/**',
    '!**/__fixtures__/**',
  ],
  moduleNameMapper: {
    '^@byteclaw/([a-z-A-Z-_]+)$': '<rootDir>/../$1/src',
  },
  rootDir: __dirname,
  testMatch: [
    '**/src/**/__tests__/**/*.test.ts',
    '**/src/**/__tests__/**/*.test.tsx',
  ],
};

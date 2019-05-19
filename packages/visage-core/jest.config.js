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
  rootDir: __dirname,
  setupFilesAfterEnv: ['react-testing-library/cleanup-after-each'],
  testMatch: [
    '**/src/**/__tests__/**/*.test.ts',
    '**/src/**/__tests__/**/*.test.tsx',
  ],
};

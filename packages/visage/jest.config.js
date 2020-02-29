module.exports = {
  displayName: '@byteclaw/visage',
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
    '^@byteclaw/(visage-[a-z-A-Z-_]+)$': '<rootDir>/../$1/src',
  },
  rootDir: __dirname,
  setupFilesAfterEnv: ['<rootDir>/../../jest/setupTests.ts'],
  snapshotSerializers: ['jest-emotion'],
  testMatch: [
    '**/src/**/__tests__/**/*.test.ts',
    '**/src/**/__tests__/**/*.test.tsx',
  ],
};

module.exports = {
  displayName: '@byteclaw/visage-core',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!**/dist/**',
    '!**/node_modules/**',
    '!**/__benchmarks__/**',
    '!**/__tests__/**',
    '!**/__fixtures__/**',
  ],
  moduleNameMapper: {
    '^@byteclaw/(visage-[a-z-A-Z-_]+)$': '<rootDir>/../$1/src',
  },
  rootDir: __dirname,
  testMatch: [
    '**/src/**/__tests__/**/*.test.ts',
    '**/src/**/__tests__/**/*.test.tsx',
  ],
};

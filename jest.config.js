module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: [
    'index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 10000
};
module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'node', 'mjs'],
    testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/tests/**/*.test.mjs'],
    transformIgnorePatterns: [
      '/node_modules/(?!puppeteer)/'
    ],
    setupFilesAfterEnv: ['./jest.setup.js'],
  };
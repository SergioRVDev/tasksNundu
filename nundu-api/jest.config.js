module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'index.js',
    'middleware/**/*.js',
    '!**/node_modules/**',
  ],
  transformIgnorePatterns: [
    'node_modules/uuid'
  ],
}

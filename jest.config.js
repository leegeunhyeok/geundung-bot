module.exports = {
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testMatch: [
    '<rootDir>/**/*.test.js'
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/']
};

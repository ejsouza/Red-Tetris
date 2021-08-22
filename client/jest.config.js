module.exports = {
  setupFilesAfterEnv: ['<rootDir>jest.setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>.next',
    '<rootDir>/node_modules',
    '<rootDir>/coverage',
    '<rootDir>/dist',
  ],
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/src',
    '<rootDir>/pages',
  ],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@pages/(.*)': '<rootDir>/pages/$1',
    '@styles/(.*)': '<rootDir>/styles/$1',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts, tsx}',
    '<rootDir>/pages/**/*.tsx',
    '!<rootDir>/node_modules/',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ['lcov', 'clover', 'text-summary'],
};

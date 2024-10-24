export default {
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    testMatch: ['**/tests/**/*.test.js'],
    transformIgnorePatterns: [],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};
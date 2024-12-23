module.exports = {
    verbose: true,
    transform: {
        '^.+\\.(ts|tsx)$': '@swc/jest',
    },
    setupFilesAfterEnv: ['./tests/jest.setup.ts'],
    testMatch: [
        '**/?(*.)+(spec|test).ts',
        '**/__tests__/**/*.ts',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: './coverage',
};
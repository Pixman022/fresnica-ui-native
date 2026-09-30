module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    moduleNameMapper: {
        '^react-native$': '<rootDir>/test/react-native-mock.ts',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(jest-runner|@react-native|react-native|@react-native-community|@testing-library/react-native)/)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testMatch: ['<rootDir>/test/**/*.test.tsx'],
};
